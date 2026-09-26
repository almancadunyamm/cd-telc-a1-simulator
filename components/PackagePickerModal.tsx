"use client";

import { useEffect, useState } from "react";
import { getPricedProduct } from "@/lib/billing/pricing";

// Öğrenci panelinden açılan paket seçim ekranı.
// "digital": Dijital Simülasyon sayfasındaki Başlangıç / Gelişim / Zirve kartları
// "live":    Canlı Akademi sayfasındaki Tek Seviye / Hızlandırılmış / Tam Hazırlık kartları
// Öğrenci paketi seçince onSelect(slug) çağrılır; panel mevcut PayTR ödeme
// penceresini açar. Fiyatlar tek fiyat kaynağı olan PRICING_CATALOG'dan gelir.

type Level = "A1" | "A2" | "B1";
type DoubleLevel = "A1+A2" | "A2+B1";

function formatPrice(slug: string) {
  const product = getPricedProduct(slug);
  if (!product) return "";
  if (product.amountKurus === 0) return "Ücretsiz";
  return `₺${(product.amountKurus / 100).toLocaleString("tr-TR")}`;
}

function LevelToggle<T extends string>({
  options,
  value,
  onChange,
  dark,
}: {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  dark?: boolean;
}) {
  return (
    <div className="mt-5 flex gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`flex-1 rounded-full px-3 py-2.5 text-sm font-black transition ${
            value === option
              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
              : dark
              ? "bg-white/10 text-white hover:bg-white/20"
              : "bg-orange-50 text-orange-600 hover:bg-orange-100"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function PlanCard({
  label,
  name,
  price,
  subtitle,
  features,
  highlight,
  toggle,
  cta,
  onSelect,
  disabled,
}: {
  label: string;
  name: string;
  price: string;
  subtitle?: string;
  features: string[];
  highlight?: boolean;
  toggle?: React.ReactNode;
  cta: string;
  onSelect?: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-[32px] border p-6 shadow-xl ${
        highlight
          ? "border-orange-300 bg-slate-950 text-white ring-4 ring-orange-100"
          : "border-slate-200 bg-white text-slate-950"
      }`}
    >
      {highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-orange-500 px-4 py-1 text-xs font-black text-white shadow-lg">
          En Çok Tercih Edilen
        </span>
      )}

      <p
        className={`text-xs font-black uppercase tracking-[0.2em] ${
          highlight ? "text-yellow-300" : "text-orange-600"
        }`}
      >
        {label}
      </p>
      <h3 className="mt-3 text-2xl font-black">{name}</h3>
      <p className={`mt-3 text-4xl font-black ${highlight ? "text-white" : "text-orange-500"}`}>
        {price}
      </p>
      {subtitle && (
        <p
          className={`mt-3 rounded-2xl px-4 py-3 text-sm font-bold ${
            highlight ? "bg-white/10 text-white" : "bg-orange-50 text-slate-800"
          }`}
        >
          {subtitle}
        </p>
      )}

      {toggle}

      <ul className="mt-5 flex-1 space-y-2.5 text-sm font-semibold">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className={highlight ? "text-orange-400" : "text-orange-500"}>✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onSelect}
        disabled={disabled}
        className={`mt-6 w-full rounded-full px-6 py-3.5 text-sm font-black transition ${
          disabled
            ? "cursor-default bg-slate-200 text-slate-500"
            : highlight
            ? "bg-orange-500 text-white hover:bg-orange-400"
            : "bg-slate-950 text-white hover:bg-slate-800"
        }`}
      >
        {cta}
      </button>
    </div>
  );
}

export default function PackagePickerModal({
  mode,
  defaultLevel,
  currentDigitalPackage,
  onSelect,
  onClose,
}: {
  mode: "digital" | "live";
  defaultLevel: Level;
  currentDigitalPackage?: "starter" | "practice" | "master";
  onSelect: (slug: string) => void;
  onClose: () => void;
}) {
  const [practiceLevel, setPracticeLevel] = useState<Level>(defaultLevel);
  const [masterLevel, setMasterLevel] = useState<Level>(defaultLevel);
  const [singleLevel, setSingleLevel] = useState<Level>(defaultLevel);
  const [doubleLevel, setDoubleLevel] = useState<DoubleLevel>(
    defaultLevel === "A1" ? "A1+A2" : "A2+B1"
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const levels: Level[] = ["A1", "A2", "B1"];
  const doubleSlug = doubleLevel === "A1+A2" ? "live-a1-a2" : "live-a2-b1";

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-black/50 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={mode === "digital" ? "Dijital paket seç" : "Canlı kurs paketi seç"}
      onClick={onClose}
    >
      <div
        className="mx-auto w-full max-w-6xl rounded-[36px] bg-gradient-to-br from-orange-50 via-white to-yellow-50 p-5 shadow-2xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">
              {mode === "digital" ? "Dijital Paketler" : "Canlı Akademi"}
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
              {mode === "digital"
                ? "Sana uygun dijital paketi seç"
                : "Sana uygun canlı kurs paketini seç"}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Paketini ve seviyeni seç; kredi kartıyla güvenli ödeme ekranı açılır.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-lg font-black text-slate-600 shadow hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {mode === "digital" ? (
            <>
              <PlanCard
                label={`${defaultLevel} Başlangıç`}
                name="Başlangıç"
                price="Ücretsiz"
                subtitle={`${defaultLevel} dijital başlangıç ücretsiz`}
                features={[
                  "Tema bazlı ilerleme",
                  "18 video ders erişimi",
                  "Ustalık Testleri",
                  "Kelime Arenası",
                  "Temel TELC hazırlık alanı",
                  "3 ay erişim",
                ]}
                cta={currentDigitalPackage === "starter" ? "Mevcut Paketin" : "Başlangıç"}
                disabled
              />
              <PlanCard
                label={`${practiceLevel} Gelişim`}
                name="Gelişim"
                price={formatPrice(`${practiceLevel.toLowerCase()}-practice`)}
                subtitle="Video ders + deneme sistemi"
                highlight
                toggle={
                  <LevelToggle options={levels} value={practiceLevel} onChange={setPracticeLevel} dark />
                }
                features={[
                  "2 adet Goethe ve TELC uyumlu dijital deneme",
                  "Tema bazlı ilerleme",
                  "Bütün konuları içeren video dersler",
                  "Ustalık Testleri",
                  "Kelime Arenası",
                  "6 ay erişim",
                ]}
                cta="Paketi Seç"
                onSelect={() => onSelect(`${practiceLevel.toLowerCase()}-practice`)}
              />
              <PlanCard
                label={`${masterLevel} Zirve`}
                name="Zirve"
                price={formatPrice(`${masterLevel.toLowerCase()}-master`)}
                subtitle="Tam dijital hazırlık"
                toggle={<LevelToggle options={levels} value={masterLevel} onChange={setMasterLevel} />}
                features={[
                  "10 TELC dijital deneme",
                  "Tüm video ders arşivi",
                  "Ustalık Testleri",
                  "Kelime Arenası",
                  "Zirve materyal sistemi",
                  "12 ay erişim",
                ]}
                cta="Paketi Seç"
                onSelect={() => onSelect(`${masterLevel.toLowerCase()}-master`)}
              />
            </>
          ) : (
            <>
              <PlanCard
                label={singleLevel}
                name="Tek Seviye"
                price={formatPrice(`live-${singleLevel.toLowerCase()}`)}
                toggle={<LevelToggle options={levels} value={singleLevel} onChange={setSingleLevel} />}
                features={[
                  `Toplam 56 ders kapsamlı ${singleLevel} eğitimi`,
                  "20 ders öğretmen rehberliğinde sınav hazırlığı",
                  "Tüm ders kayıtlarına erişim",
                  "Dijital öğrenci paneli (Çalışma sayfaları, ustalık testleri, kelime oyunu)",
                  "Konuşma kulübü ve konuşma pratiği",
                  "Ödev takibi ve öğretmen geri bildirimi",
                  "Orijinal sınavla birebir aynı dijital denemeler",
                ]}
                cta="Paketi Seç"
                onSelect={() => onSelect(`live-${singleLevel.toLowerCase()}`)}
              />
              <PlanCard
                label={doubleLevel}
                name="Hızlandırılmış"
                price={formatPrice(doubleSlug)}
                highlight
                toggle={
                  <LevelToggle
                    options={["A1+A2", "A2+B1"] as DoubleLevel[]}
                    value={doubleLevel}
                    onChange={setDoubleLevel}
                    dark
                  />
                }
                features={[
                  "72 canlı Zoom dersi (2 seviye)",
                  "40 ders öğretmen rehberliğinde sınav hazırlığı",
                  "Toplam 112 ders kapsamlı eğitim",
                  "Tüm ders kayıtlarına sınırsız erişim",
                  "Dijital öğrenci paneli (PDF, ustalık testleri, kelime oyunu)",
                  "Konuşma kulübü ve konuşma pratiği",
                  "Ödev takibi ve öğretmen geri bildirimi",
                ]}
                cta="Paketi Seç"
                onSelect={() => onSelect(doubleSlug)}
              />
              <PlanCard
                label="A1 + A2 + B1"
                name="Tam Hazırlık"
                price={formatPrice("live-a1-a2-b1")}
                features={[
                  "108 canlı Zoom dersi (3 seviye)",
                  "60 ders öğretmen rehberliğinde sınav hazırlığı",
                  "Toplam 168 ders kapsamlı eğitim",
                  "Tüm ders kayıtlarına sınırsız erişim",
                  "Dijital öğrenci paneli (PDF, ustalık testleri, kelime oyunu)",
                  "Konuşma kulübü ve konuşma pratiği",
                  "Ödev takibi ve öğretmen geri bildirimi",
                ]}
                cta="Paketi Seç"
                onSelect={() => onSelect("live-a1-a2-b1")}
              />
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Kredi kartıyla güvenli ödeme · Ödeme onaylandıktan sonra paketin panelinde otomatik açılır
        </p>
      </div>
    </div>
  );
}
