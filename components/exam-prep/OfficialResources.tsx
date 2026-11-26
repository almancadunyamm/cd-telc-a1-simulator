// Resmî ücretsiz deneme sınavları kutusu. Hem öğrenci panelinde (client) hem herkese açık sayfalarda (server) kullanılır.
import { OFFICIAL_RESOURCES, type ExamKey, type Level } from "./exams-config";

const BADGE: Record<ExamKey, string> = {
  telc: "bg-red-100 text-red-700",
  goethe: "bg-emerald-100 text-emerald-700",
  osd: "bg-rose-100 text-rose-700",
};
const NAME: Record<ExamKey, string> = { telc: "telc", goethe: "Goethe", osd: "ÖSD" };

export default function OfficialResources({ level, only }: { level: Level; only?: ExamKey }) {
  const items = OFFICIAL_RESOURCES[level].filter((r) => !only || r.exam === only);
  if (items.length === 0) return null;
  return (
    <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50/70 p-5">
      <h2 className="text-lg font-black text-slate-900">📚 Resmî ücretsiz deneme sınavları ({level})</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">
        Sınav kurumlarının kendi yayınladığı ücretsiz Modellsatz / Übungstest'ler. Özellikle <b>Hören</b> (dinleme) bölümü için ses
        dosyalarıyla birlikte gerçek sınav provası yapabilirsin. Linkler kurumların resmî sitelerinde yeni sekmede açılır.
      </p>
      <div className={`mt-4 grid gap-3 ${items.length > 1 ? "md:grid-cols-3" : ""}`}>
        {items.map((r) => (
          <div key={r.title} className="flex min-w-0 flex-col rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
            <span className={`w-fit rounded-full px-2.5 py-0.5 text-[11px] font-black ${BADGE[r.exam]}`}>{NAME[r.exam]}</span>
            <p className="mt-2 break-words font-black leading-snug text-slate-900">{r.title}</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">{r.desc}</p>
            <div className="mt-auto flex flex-wrap gap-2 pt-3">
              {r.links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-700"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-slate-500">
        Bu materyallerin tüm hakları ilgili sınav kurumlarına (telc gGmbH, Goethe-Institut, ÖSD) aittir. Almanca Okulum yalnızca resmî kaynaklara yönlendirir.
      </p>
    </section>
  );
}
