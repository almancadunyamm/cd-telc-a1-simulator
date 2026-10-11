"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { TRIAL_LEAD_STORAGE_KEY } from "@/lib/trial";

export type TrialLead = { id: string | null; name: string; phone: string; createdAt: number };

function normalizePhone(raw: string) {
  const trimmed = raw.trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  return plus + trimmed.replace(/\D/g, "");
}

function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  // 05xx xxx xx xx (11), 5xx xxx xx xx (10), 90 / yurt dışı numaraları (12–15)
  return digits.length >= 10 && digits.length <= 15;
}

function detectSource() {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm = params.get("utm_source") || params.get("kaynak");
    if (utm) return utm.slice(0, 60);
    const ref = document.referrer || "";
    if (ref.includes("instagram")) return "instagram";
    if (ref.includes("facebook")) return "facebook";
    if (ref && !ref.includes(window.location.host)) return new URL(ref).host.slice(0, 60);
  } catch {}
  return "site";
}

export default function TrialLeadForm({ onDone }: { onDone: (lead: TrialLead) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const cleanName = name.trim().replace(/\s+/g, " ");
    const cleanPhone = normalizePhone(phone);

    if (cleanName.length < 2) return setError("Lütfen adınızı ve soyadınızı yazın.");
    if (!isValidPhone(cleanPhone)) return setError("Lütfen geçerli bir telefon numarası yazın (örn. 0532 123 45 67).");
    if (!consent) return setError("Devam etmek için iletişim onayını işaretleyin.");

    setSaving(true);

    let leadId: string | null = null;
    try {
      const { data, error: insertError } = await supabase
        .from("trial_leads")
        .insert({ name: cleanName, phone: cleanPhone, source: detectSource() })
        .select("id")
        .single();
      if (insertError) throw insertError;
      leadId = data?.id ?? null;
    } catch (err) {
      // Kayıt düşmese bile ziyaretçiyi bekletmeyelim; deneme paneli açılır.
      console.warn("[deneme-dersi] başvuru kaydedilemedi", err);
    }

    const lead: TrialLead = { id: leadId, name: cleanName, phone: cleanPhone, createdAt: Date.now() };
    try {
      localStorage.setItem(TRIAL_LEAD_STORAGE_KEY, JSON.stringify(lead));
    } catch {}

    setSaving(false);
    onDone(lead);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 px-4 py-8 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between">
          <a href="/">
            <img src="/images/logo.png" alt="Almanca Okulum" className="h-14 w-auto object-contain" />
          </a>
          <a
            href="/login"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Öğrenci Girişi
          </a>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <section>
            <p className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-yellow-800">
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
              Ücretsiz Deneme Dersi
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              Canlı Almanca kursumuzu
              <span className="block text-orange-500">kayıt olmadan dene.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Öğretmenimizin örnek dersini izle, öğrenci panelini gez, Kelime Arenası&apos;nda oyna ve
              ilk temaların çalışma sayfalarını indir. Beğenirsen kaydını hemen online tamamlayabilirsin.
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["🎬", "Örnek canlı ders kaydı"],
                ["🎮", "Kelime Arenası · ilk 3 tema"],
                ["📄", "İlk 3 temanın çalışma sayfaları"],
                ["🧭", "Tüm öğrenci panelini keşfet"],
              ].map(([icon, text]) => (
                <li
                  key={text}
                  className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-white/80 px-4 py-3 text-sm font-bold text-slate-700 shadow-sm"
                >
                  <span className="text-xl">{icon}</span>
                  {text}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <h2 className="text-2xl font-black">Deneme dersine başla</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sadece adını ve telefonunu yaz, deneme paneli hemen açılsın.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <label htmlFor="trial-name" className="mb-2 block text-sm font-bold text-slate-700">
                  Ad Soyad
                </label>
                <input
                  id="trial-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="Adınız ve soyadınız"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div>
                <label htmlFor="trial-phone" className="mb-2 block text-sm font-bold text-slate-700">
                  Telefon
                </label>
                <input
                  id="trial-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0532 123 45 67"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <label className="flex items-start gap-3 text-xs leading-5 text-slate-600">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-orange-500"
                />
                <span>
                  Almanca Okulum&apos;un kurs bilgilendirmesi için benimle telefon / WhatsApp üzerinden
                  iletişime geçmesini kabul ediyorum.{" "}
                  <a href="/kvkk" target="_blank" className="font-bold text-orange-600 underline">
                    KVKK Aydınlatma Metni
                  </a>
                </span>
              </label>

              {error && (
                <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-2xl bg-orange-500 px-5 py-4 text-base font-black text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-400 disabled:opacity-60"
              >
                {saving ? "Panel hazırlanıyor..." : "🎓 Ücretsiz Deneme Dersine Başla"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
