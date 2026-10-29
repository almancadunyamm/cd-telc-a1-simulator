import { supabase } from "@/lib/supabase";
import { getSpeakingStepCount } from "@/app/data/speaking_patterns";

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

type SpeakingRequest = {
  id: string;
  user_email: string;
  user_name?: string | null;
  level?: string | null;
  cinsiyet?: string | null;
  cinsiyet_tercihi?: string | null;
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
  return p.current_tema > max || (p.current_tema >= max && p.current_gorev > 3);
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
