import { supabase } from "@/lib/supabase";
import { getSpeakingStepCount, SPEAKING_TASKS_PER_STEP } from "@/app/data/speaking_patterns";

// ── Konuşma Kulübü otomatik partner eşleştirme ──────────────────────────
// Sunucu tarafı zamanlayıcı olmadığı için eşleştirme öğrencinin tarayıcısında yapılır:
//  • öğrenci partner talebi gönderdiğinde,
//  • partner talebi bekleyen öğrenci panele her girdiğinde.
// Bekleyen taleplerden aynı seviyede, aynı temada ve cinsiyet tercihleri uyan
// biri bulunursa iki öğrenci hemen eşleştirilir (admin Eşleştirme Merkezi ile aynı kayıtlar).
//
// Aynı anda iki öğrencinin aynı kişiyi kapmaması için talepler koşullu güncellemeyle
// "kilitlenir": durum = 'bekliyor' olan satır 'eslesti' yapılır; satır değişmezse
// başka biri daha önce almış demektir ve sıradaki adaya geçilir.
//
// Arkadaş modu: öğrenci "Sınıf arkadaşımla eşleş" seçip arkadaşının ad soyadını, e-postasını
// ve WhatsApp numarasını yazar. Bu talepler rol = 'arkadas' ile kaydedilir ve otomatik
// eşleştirmeye girmez (bkz. lookupSpeakingFriend).

/** Rastgele eşleştirmeye girmeyen, belirli bir arkadaşı bekleyen talep. */
export const SPEAKING_FRIEND_ROLE = "arkadas";

/**
 * WhatsApp numarasını wa.me biçimine çevirir (yalnızca rakam, ülke koduyla).
 * "0532 123 45 67", "+90 532...", "5321234567" → "905321234567". Geçersizse "".
 */
export function normalizeWhatsappNumber(raw: string): string {
  let d = String(raw || "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = "90" + d.slice(1); // 0532... (Türkiye)
  if (d.length === 10 && d.startsWith("5")) d = "90" + d; // 532... (Türkiye)
  if (d.startsWith("90")) return d.length === 12 ? d : "";
  return d.length >= 10 && d.length <= 15 ? d : ""; // yurt dışı numara (ülke koduyla)
}

type SpeakingRequest = {
  id: string;
  user_email: string;
  user_name?: string | null;
  level?: string | null;
  cinsiyet?: string | null;
  cinsiyet_tercihi?: string | null;
  rol?: string | null;
  telefon?: string | null;
  durum?: string | null;
  created_at?: string;
};

type SpeakingProgressRow = {
  id: string;
  username: string;
  level: string;
  current_tema: number;
  current_gorev: number;
  partner_email?: string | null;
};

export type AutoMatchResult =
  | { matched: false }
  | { matched: true; partnerEmail: string; partnerName: string; level: string };

const norm = (v: unknown) => String(v || "").trim().toLowerCase();

/** İki talep sahibi birbirinin cinsiyet tercihine uyuyor mu? */
export function isGenderCompatible(a: SpeakingRequest, b: SpeakingRequest): boolean {
  const fits = (pref?: string | null, otherGender?: string | null) => {
    const p = norm(pref);
    if (!p || p === "fark_etmez") return true;
    return norm(otherGender) === p; // tercih var ama karşı tarafın cinsiyeti bilinmiyorsa eşleşmez
  };
  return fits(a.cinsiyet_tercihi, b.cinsiyet) && fits(b.cinsiyet_tercihi, a.cinsiyet);
}

function isFinished(p: SpeakingProgressRow) {
  const max = getSpeakingStepCount(p.level || "A1");
  return p.current_tema > max || (p.current_tema >= max && p.current_gorev > SPEAKING_TASKS_PER_STEP);
}

async function claimRequest(id: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("speaking_requests")
    .update({ durum: "eslesti" })
    .eq("id", id)
    .eq("durum", "bekliyor")
    .select("id");
  return !error && Array.isArray(data) && data.length > 0;
}

async function releaseRequest(id: string) {
  await supabase.from("speaking_requests").update({ durum: "bekliyor" }).eq("id", id);
}

/**
 * Kullanıcının bu seviyedeki bekleyen partner talebi için uygun partner arar ve bulursa eşleştirir.
 * Talebi yoksa, zaten partneri varsa ya da uygun aday yoksa { matched: false } döner.
 */
export async function tryAutoMatchSpeakingPartner(
  usernameRaw: string,
  level: string
): Promise<AutoMatchResult> {
  const username = norm(usernameRaw);
  if (!username) return { matched: false };

  try {
    // 1) Benim bekleyen talebim
    const { data: myReqs } = await supabase
      .from("speaking_requests")
      .select("*")
      .eq("level", level)
      .eq("durum", "bekliyor")
      .order("created_at", { ascending: false });
    const mine = (myReqs || []).find((r: SpeakingRequest) => norm(r.user_email) === username) as
      | SpeakingRequest
      | undefined;
    if (!mine) return { matched: false };
    // Arkadaşını bekleyen talep rastgele eşleştirilmez.
    if (mine.rol === SPEAKING_FRIEND_ROLE) return { matched: false };

    // 2) Benim ilerlemem — partnerim varsa eşleştirme yapılmaz
    const { data: myProgRows } = await supabase
      .from("speaking_progress")
      .select("*")
      .eq("level", level);
    const progressByUser = new Map<string, SpeakingProgressRow>();
    (myProgRows || []).forEach((p: SpeakingProgressRow) => progressByUser.set(norm(p.username), p));
    const myProg = progressByUser.get(username);
    if (!myProg || myProg.partner_email || isFinished(myProg)) return { matched: false };

    // 3) Adaylar: aynı seviyede bekleyen, partneri olmayan, aynı temadaki, cinsiyet tercihi uyan
    const seen = new Set<string>([username]);
    const candidates = ((myReqs || []) as SpeakingRequest[])
      .slice()
      .sort((a, b) => String(a.created_at || "").localeCompare(String(b.created_at || "")))
      .filter((r) => {
        const u = norm(r.user_email);
        if (seen.has(u)) return false; // kendim ve aynı kişinin ikinci talebi
        seen.add(u);
        if (r.rol === SPEAKING_FRIEND_ROLE) return false; // arkadaşını bekliyor
        const prog = progressByUser.get(u);
        if (!prog || prog.partner_email || isFinished(prog)) return false;
        if (prog.current_tema !== myProg.current_tema) return false;
        return isGenderCompatible(mine, r);
      })
      // önce aynı görevde olanlar, sonra en eski talep
      .sort((a, b) => {
        const ga = progressByUser.get(norm(a.user_email))!.current_gorev === myProg.current_gorev ? 0 : 1;
        const gb = progressByUser.get(norm(b.user_email))!.current_gorev === myProg.current_gorev ? 0 : 1;
        return ga - gb;
      });

    for (const cand of candidates) {
      if (!(await claimRequest(cand.id))) continue; // başka biri aldı
      if (!(await claimRequest(mine.id))) {
        // benim talebim bu arada başka biri tarafından eşleştirildi
        await releaseRequest(cand.id);
        return { matched: false };
      }

      const partnerProg = progressByUser.get(norm(cand.user_email))!;
      // Kayıtlarda kullanılan kullanıcı adlarını olduğu gibi yaz (büyük/küçük harf korunur).
      const partnerEmail = partnerProg.username;
      const myEmail = myProg.username;
      const today = new Date().toISOString().slice(0, 10);
      // Bildirimler aynı tema+görevde eşleştiği için iki taraf ortak görevden başlar.
      const ortakGorev = Math.min(myProg.current_gorev || 1, partnerProg.current_gorev || 1);

      await supabase
        .from("speaking_progress")
        .update({ partner_email: partnerEmail, esleme_tarihi: today, current_gorev: ortakGorev })
        .eq("id", myProg.id);
      await supabase
        .from("speaking_progress")
        .update({ partner_email: myEmail, esleme_tarihi: today, current_gorev: ortakGorev })
        .eq("id", partnerProg.id);

      await supabase.from("speaking_matches").insert({
        konusan_email: partnerEmail,
        dinleyen_email: myEmail,
        tema_id: myProg.current_tema || 1,
        level,
        durum: "bekliyor",
      });

      // İki kişinin bu seviyedeki diğer bekleyen talepleri de kapanır.
      await supabase
        .from("speaking_requests")
        .update({ durum: "eslesti" })
        .eq("level", level)
        .eq("durum", "bekliyor")
        .in("user_email", [mine.user_email, cand.user_email]);

      return {
        matched: true,
        partnerEmail,
        partnerName: cand.user_name || partnerEmail,
        level,
      };
    }
  } catch (err) {
    console.warn("Konuşma Kulübü otomatik eşleştirme yapılamadı:", err);
  }
  return { matched: false };
}

// ── Arkadaşla eşleşme ───────────────────────────────────────────────────
// Öğrenci arkadaşının ad soyadını, e-posta adresini ve WhatsApp numarasını yazar.
// Bunlardan BİRİ sistemdeki bir öğrenciyle eşleşirse o öğrenci bulunur:
//  • e-posta → öğrenci hesabı (users.email = panel kullanıcı adı)
//  • WhatsApp numarası → Konuşma Kulübü talebindeki numara (users'ta telefon tutulmuyor)
//  • ad soyad → öğrenci hesabındaki ad (yalnızca tek öğrenciye uyuyorsa kullanılır)
// Öncelik: e-posta > telefon > ad soyad. Farklı bilgiler farklı öğrencileri gösteriyorsa uyarılır.

export type SpeakingFriendInput = { phone?: string; email?: string; name?: string };

export type FriendLookupResult =
  | { ok: true; friendEmail: string; friendName: string; matchedBy: "email" | "phone" | "name" }
  | {
      ok: false;
      reason:
        | "invalid_input"
        | "own_number"
        | "own_email"
        | "not_found"
        | "ambiguous_name"
        | "conflict"
        | "not_started_level"
        | "friend_has_partner"
        | "already_partners"
        | "friend_finished"
        | "me_not_ready"
        | "different_step";
      friendName?: string;
      friendTema?: number;
      myTema?: number;
    };

/** Ad soyad karşılaştırması için: küçük harf, Türkçe harfler sadeleştirilmiş, tek boşluk. */
export function normalizePersonName(raw: string): string {
  return String(raw || "")
    .toLocaleLowerCase("tr")
    .replace(/[ıİ]/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[âà]/g, "a")
    .replace(/[îì]/g, "i")
    .replace(/[ûù]/g, "u")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Arkadaşı ad soyad / e-posta / WhatsApp numarasından bulur ve bu seviyede eşleşmeye uygun mu kontrol eder.
 * Hiçbir şey yazmaz.
 */
export async function lookupSpeakingFriend(
  usernameRaw: string,
  level: string,
  friend: SpeakingFriendInput,
  myPhoneRaw: string
): Promise<FriendLookupResult> {
  const username = norm(usernameRaw);
  const email = norm(friend.email);
  const phone = normalizeWhatsappNumber(friend.phone || "");
  const name = normalizePersonName(friend.name || "");
  if (!email && !phone && !name) return { ok: false, reason: "invalid_input" };
  if (email && email === username) return { ok: false, reason: "own_email" };
  if (phone && phone === normalizeWhatsappNumber(myPhoneRaw)) return { ok: false, reason: "own_number" };

  // 1) E-posta → öğrenci hesabı
  let byEmail: { email: string; name: string } | null = null;
  if (email) {
    const { data } = await supabase.from("users").select("email, name").ilike("email", email).limit(1);
    if (data && data.length > 0) byEmail = { email: norm(data[0].email), name: data[0].name || data[0].email };
  }

  // 2) Telefon → Konuşma Kulübü talepleri
  let byPhone: { email: string; name: string } | null = null;
  if (phone) {
    const { data: reqRows } = await supabase
      .from("speaking_requests")
      .select("user_email, user_name, telefon, created_at")
      .order("created_at", { ascending: false });
    const hit = ((reqRows || []) as SpeakingRequest[]).find(
      (r) => normalizeWhatsappNumber(String(r.telefon || "")) === phone && norm(r.user_email) !== username
    );
    if (hit) byPhone = { email: norm(hit.user_email), name: hit.user_name || hit.user_email };
  }

  // 3) Ad soyad → öğrenci hesapları (yalnızca tek eşleşme kabul edilir)
  let byName: { email: string; name: string } | null = null;
  let nameAmbiguous = false;
  if (name && name.includes(" ")) {
    const { data: users } = await supabase.from("users").select("email, name").eq("role", "student");
    const hits = ((users || []) as { email: string; name: string }[]).filter(
      (u) => normalizePersonName(u.name) === name && norm(u.email) !== username
    );
    if (hits.length === 1) byName = { email: norm(hits[0].email), name: hits[0].name };
    else if (hits.length > 1) nameAmbiguous = true;
  }

  const found = [byEmail, byPhone, byName].filter(Boolean) as { email: string; name: string }[];
  if (found.length === 0) return { ok: false, reason: nameAmbiguous ? "ambiguous_name" : "not_found" };
  const distinct = Array.from(new Set(found.map((f) => f.email)));
  if (distinct.length > 1) return { ok: false, reason: "conflict" };
  const friendEmail = distinct[0];
  if (friendEmail === username) return { ok: false, reason: "own_email" };
  const friendName = (byEmail || byPhone || byName)!.name;
  const matchedBy: "email" | "phone" | "name" = byEmail ? "email" : byPhone ? "phone" : "name";

  const { data: progRows } = await supabase.from("speaking_progress").select("*").eq("level", level);
  const byUser = new Map<string, SpeakingProgressRow>();
  ((progRows || []) as SpeakingProgressRow[]).forEach((p) => byUser.set(norm(p.username), p));
  const myProg = byUser.get(username);
  const friendProg = byUser.get(friendEmail);

  if (!myProg || myProg.partner_email || isFinished(myProg)) {
    if (myProg && norm(myProg.partner_email) === friendEmail) return { ok: false, reason: "already_partners", friendName };
    return { ok: false, reason: "me_not_ready", friendName };
  }
  if (!friendProg) return { ok: false, reason: "not_started_level", friendName };
  if (norm(friendProg.partner_email) === username) return { ok: false, reason: "already_partners", friendName };
  if (friendProg.partner_email) return { ok: false, reason: "friend_has_partner", friendName };
  if (isFinished(friendProg)) return { ok: false, reason: "friend_finished", friendName };
  if (friendProg.current_tema !== myProg.current_tema) {
    return { ok: false, reason: "different_step", friendName, friendTema: friendProg.current_tema, myTema: myProg.current_tema };
  }
  return { ok: true, friendEmail: friendProg.username, friendName, matchedBy };
}

/**
 * Arkadaş uygunsa iki öğrenciyi hemen eşleştirir. Arkadaşın ilerleme kaydı yalnızca
 * hâlâ partnersizse güncellenir (aynı anda başka biriyle eşleştiyse geri alınır).
 */
export async function matchSpeakingFriend(
  usernameRaw: string,
  level: string,
  friend: SpeakingFriendInput,
  myPhoneRaw: string
): Promise<FriendLookupResult> {
  try {
    const check = await lookupSpeakingFriend(usernameRaw, level, friend, myPhoneRaw);
    if (!check.ok) return check;

    const username = norm(usernameRaw);
    const { data: progRows } = await supabase
      .from("speaking_progress")
      .select("*")
      .eq("level", level)
      .in("username", Array.from(new Set([usernameRaw, username, check.friendEmail])));
    const rows = (progRows || []) as SpeakingProgressRow[];
    const myProg = rows.find((p) => norm(p.username) === username)!;
    const friendProg = rows.find((p) => norm(p.username) === norm(check.friendEmail))!;
    const today = new Date().toISOString().slice(0, 10);
    const ortakGorev = Math.min(myProg.current_gorev || 1, friendProg.current_gorev || 1);

    // Önce arkadaşı kilitle: yalnızca hâlâ partnersizse güncellenir.
    const { data: lockedFriend } = await supabase
      .from("speaking_progress")
      .update({ partner_email: myProg.username, esleme_tarihi: today, current_gorev: ortakGorev })
      .eq("id", friendProg.id)
      .is("partner_email", null)
      .select("id");
    if (!lockedFriend || lockedFriend.length === 0) {
      return { ok: false, reason: "friend_has_partner", friendName: check.friendName };
    }
    const { data: lockedMe } = await supabase
      .from("speaking_progress")
      .update({ partner_email: friendProg.username, esleme_tarihi: today, current_gorev: ortakGorev })
      .eq("id", myProg.id)
      .is("partner_email", null)
      .select("id");
    if (!lockedMe || lockedMe.length === 0) {
      // Bu arada ben başka biriyle eşleştim: arkadaşın kaydını eski hâline döndür.
      await supabase
        .from("speaking_progress")
        .update({ partner_email: null, current_gorev: friendProg.current_gorev })
        .eq("id", friendProg.id);
      return { ok: false, reason: "me_not_ready", friendName: check.friendName };
    }

    await supabase.from("speaking_matches").insert({
      konusan_email: friendProg.username,
      dinleyen_email: myProg.username,
      tema_id: myProg.current_tema || 1,
      level,
      durum: "bekliyor",
    });
    await supabase
      .from("speaking_requests")
      .update({ durum: "eslesti" })
      .eq("level", level)
      .eq("durum", "bekliyor")
      .in("user_email", Array.from(new Set([usernameRaw, myProg.username, friendProg.username])));

    return check;
  } catch (err) {
    console.warn("Arkadaşla eşleşme yapılamadı:", err);
    return { ok: false, reason: "me_not_ready" };
  }
}
