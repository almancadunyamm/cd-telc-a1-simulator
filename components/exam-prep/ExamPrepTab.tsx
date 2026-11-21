"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  TELC_A2_LESEN_INSTRUCTIONS,
  TELC_A2_TEIL1_SETS,
  TELC_A2_TEIL2_SETS,
  TELC_A2_TEIL3_SETS,
  type TelcA2Teil1Set,
  type TelcA2Teil2Set,
  type TelcA2Teil3Set,
} from "@/app/data/exam-prep/telc_a2_lesen";
import {
  GOETHE_A2_LESEN_INSTRUCTIONS,
  GOETHE_A2_TEIL1_SETS,
  GOETHE_A2_TEIL2_SETS,
  GOETHE_A2_TEIL3_SETS,
  GOETHE_A2_TEIL4_SETS,
  type McTextSet,
} from "@/app/data/exam-prep/goethe_a2_lesen";
import {
  OSD_A2_LESEN_INSTRUCTIONS,
  OSD_A2_AUFGABE1_SETS,
  OSD_A2_AUFGABE2_SETS,
  type OsdHeadlineSet,
} from "@/app/data/exam-prep/osd_a2_lesen";
import {
  TELC_B1_INSTRUCTIONS,
  TELC_B1_TEIL1_SETS,
  TELC_B1_TEIL2_SETS,
  TELC_B1_TEIL3_SETS,
  TELC_B1_SB1_SETS,
  TELC_B1_SB2_SETS,
  type ClozeMcSet,
  type ClozeBankSet,
} from "@/app/data/exam-prep/telc_b1_lesen";

type Level = "A1" | "A2" | "B1";
type ExamKey = "telc" | "goethe" | "osd";

// Görev türleri:
//  board → bilgi panosu + a/b/c (telc Teil 1, Goethe Teil 2)
//  rf    → metin + richtig/falsch (telc Teil 2)
//  match → ilanlar + harf / X (telc Teil 3, Goethe Teil 4)
//  mc    → makale veya e-posta + a/b/c (Goethe Teil 1 ve 3, ÖSD Aufgabe 2)
//  headlines → başlık eşleştirme (ÖSD Aufgabe 1, telc B1 Lesen Teil 1)
//  clozeMc   → mektupta boşluk + a/b/c (telc B1 Sprachbausteine 1)
//  clozeBank → metinde boşluk + kelime bankası (telc B1 Sprachbausteine 2)
type TeilConfig =
  | { kind: "board"; sets: TelcA2Teil1Set[] }
  | { kind: "rf"; sets: TelcA2Teil2Set[] }
  | { kind: "match"; sets: TelcA2Teil3Set[] }
  | { kind: "mc"; sets: McTextSet[] }
  | { kind: "headlines"; sets: OsdHeadlineSet[] }
  | { kind: "clozeMc"; sets: ClozeMcSet[] }
  | { kind: "clozeBank"; sets: ClozeBankSet[] };

type Teil = TeilConfig & {
  no: number;
  title: string;
  desc: string;
  tips: string[];
  instructions: { de: string[]; tr: string };
  upperKeys?: boolean; // seçenek harflerini A/B/C olarak göster (ÖSD)
  points?: string; // sınavdaki puan bilgisi
};

type ExamConfig = {
  key: ExamKey;
  name: string;
  full: string;
  ready: boolean;
  color: string;
  accent: string;
  partLabel: string; // "Teil" veya "Aufgabe"
  summary?: string; // sınav kartında bölüm özeti
  header: string;
  intro: string;
  progressSlug: string;
  teile: Teil[];
};

type Props = {
  level: Level;
  onLevelChange: (level: Level) => void;
  accessLevels: string[];
  accessExpired: boolean;
  username?: string | null;
};


const BOARD_TIPS = [
  "Önce görevi oku ve anahtar kelimenin altını çiz (ör. Geldbörse verloren → Fundbüro).",
  "Panoda aynı kelime olmayabilir; eş anlamlısını ara: Ladekabel → Zubehör, Pass → Bürgerbüro.",
  "Aradığın yer a ve b'deki seçeneklerde değilse cevap c (anderes Stockwerk / andere Halle …).",
  "Tuzak: Konu tanıdık gelen yer her zaman doğru değildir (ceketi satın almıyorsan Mode değil, Fundbüro!).",
];

const MATCH_TIPS = [
  "Her durumda kişinin tam olarak ne istediğini bul: ne? ne zaman? kim için?",
  "Her ilan yalnızca bir kez kullanılır; örnekteki ilan tekrar seçilemez.",
  "Konu tutsa bile bir detay uymuyorsa (yaş, gün, yer, grup büyüklüğü) ilan doğru değildir → büyük ihtimalle X.",
  "Emin olduğun eşleşmelerden başla, en sona kalan durum için X'i düşün.",
];

const MC_TIPS = [
  "Önce soruları oku; soruların sırası metindeki sırayla aynıdır.",
  "Metinde aynı kelimeleri değil, aynı anlamı ara (seltener krank = weniger oft krank).",
  "Yanlış seçenekler çoğu zaman metinde geçen kelimeleri kullanır ama anlamı değiştirir. Dikkat: früher ↔ jetzt, nur ↔ alle, nie ↔ manchmal.",
  "Kim söylüyor? Bir kişinin görüşünü başka bir kişiyle karıştırma.",
];

const EXAMS_A2: ExamConfig[] = [
  {
    key: "telc",
    name: "telc",
    full: "telc Deutsch A2",
    ready: true,
    color: "from-sky-600 to-blue-700",
    accent: "bg-slate-800",
    partLabel: "Teil",
    header: "telc Deutsch A2 · 50 Minuten Lesen und Schreiben",
    intro:
      "Sınavda Lesen ve Schreiben birlikte 50 dakikadır. Lesen üç bölümden oluşur, her bölümde 5 görev vardır. Aşağıdaki alıştırmalar gerçek sınavla aynı yapıda hazırlandı.",
    progressSlug: "telc-a2-lesen",
    teile: [
      {
        no: 1,
        kind: "board",
        sets: TELC_A2_TEIL1_SETS,
        title: "Lesen, Teil 1",
        desc: "Bilgi panosu / kat rehberi · 5 görev · a, b veya c",
        tips: BOARD_TIPS,
        instructions: TELC_A2_LESEN_INSTRUCTIONS.teil1,
      },
      {
        no: 2,
        kind: "rf",
        sets: TELC_A2_TEIL2_SETS,
        title: "Lesen, Teil 2",
        desc: "Gazete haberi · 5 cümle · richtig (+) / falsch (–)",
        tips: [
          "Önce 5 cümleyi oku, sonra metinde ilgili yeri bul. Cümlelerin sırası metindeki sırayla aynıdır.",
          "Sayılara, zamanlara ve kişilere dikkat: kim? ne zaman? kaç?",
          "nicht, kein, nie, nur, alle, beide gibi küçük kelimeler cevabı değiştirir.",
          "Metinde planlanan bir şey (will, möchte, im nächsten Jahr) henüz olmamıştır.",
        ],
        instructions: TELC_A2_LESEN_INSTRUCTIONS.teil2,
      },
      {
        no: 3,
        kind: "match",
        sets: TELC_A2_TEIL3_SETS,
        title: "Lesen, Teil 3",
        desc: "8 ilan (a–h) · 5 durum · bir durum için ilan yok → X",
        tips: MATCH_TIPS,
        instructions: TELC_A2_LESEN_INSTRUCTIONS.teil3,
      },
    ],
  },
  {
    key: "goethe",
    name: "Goethe",
    full: "Goethe-Zertifikat A2",
    ready: true,
    color: "from-emerald-600 to-teal-700",
    accent: "bg-emerald-800",
    partLabel: "Teil",
    header: "Goethe-Zertifikat A2 · Lesen · 30 Minuten",
    intro:
      "Goethe A2 sınavında Lesen bölümü 30 dakikadır ve dört bölümden oluşur: gazete makalesi, bilgi panosu, e-posta ve ilanlar. Her bölümde 5 görev vardır, toplam 20 puan. Aşağıdaki alıştırmalar gerçek sınavla aynı yapıda hazırlandı.",
    progressSlug: "goethe-a2-lesen",
    teile: [
      {
        no: 1,
        kind: "mc",
        sets: GOETHE_A2_TEIL1_SETS,
        title: "Lesen, Teil 1",
        desc: "Gazete makalesi · 5 görev · a, b veya c",
        tips: MC_TIPS,
        instructions: GOETHE_A2_LESEN_INSTRUCTIONS.teil1,
      },
      {
        no: 2,
        kind: "board",
        sets: GOETHE_A2_TEIL2_SETS,
        title: "Lesen, Teil 2",
        desc: "Bilgi panosu / program · Wohin gehen Sie? · a, b veya c",
        tips: BOARD_TIPS,
        instructions: GOETHE_A2_LESEN_INSTRUCTIONS.teil2,
      },
      {
        no: 3,
        kind: "mc",
        sets: GOETHE_A2_TEIL3_SETS,
        title: "Lesen, Teil 3",
        desc: "E-posta · 5 görev · a, b veya c",
        tips: MC_TIPS,
        instructions: GOETHE_A2_LESEN_INSTRUCTIONS.teil3,
      },
      {
        no: 4,
        kind: "match",
        sets: GOETHE_A2_TEIL4_SETS,
        title: "Lesen, Teil 4",
        desc: "6 ilan (a–f) · 5 kişi · bir kişi için ilan yok → X",
        tips: MATCH_TIPS,
        instructions: GOETHE_A2_LESEN_INSTRUCTIONS.teil4,
      },
    ],
  },
  {
    key: "osd",
    name: "ÖSD",
    full: "ÖSD Zertifikat A2",
    ready: true,
    color: "from-rose-600 to-red-700",
    accent: "bg-rose-800",
    partLabel: "Aufgabe",
    header: "ÖSD Zertifikat A2 · Lesen · insgesamt 30 Minuten",
    intro:
      "ÖSD A2 sınavında Lesen bölümü toplam 30 dakikadır ve iki Aufgabe'den oluşur: Aufgabe 1'de 10 başlıktan 5 kısa metne uygun olanı seçersin (15 puan), Aufgabe 2'de bir gazete metni ve 5 çoktan seçmeli soru vardır (10 puan). Aşağıdaki alıştırmalar gerçek sınavla aynı yapıda hazırlandı.",
    progressSlug: "osd-a2-lesen",
    teile: [
      {
        no: 1,
        kind: "headlines",
        sets: OSD_A2_AUFGABE1_SETS,
        title: "Lesen, Aufgabe 1",
        desc: "10 başlık (A–K) · 5 kısa metin · uygun başlığı seç",
        tips: [
          "Başlıklar ikişer ikişer aynı konudadır (ör. iki tane eczane, iki tane bisiklet başlığı). Konuyu bulmak yetmez, metnin tam olarak ne anlattığına bak.",
          "Metnin ilk iki cümlesi genellikle asıl konuyu söyler.",
          "Metinde geçmeyen bilgi içeren başlık (zam, indirim, yeni açılış…) yanlıştır.",
          "Önce emin olduğun eşleştirmeleri yap; 5 başlık hiç kullanılmayacak.",
        ],
        instructions: OSD_A2_LESEN_INSTRUCTIONS.aufgabe1,
      },
      {
        no: 2,
        kind: "mc",
        sets: OSD_A2_AUFGABE2_SETS,
        title: "Lesen, Aufgabe 2",
        desc: "Gazete metni · 5 görev · A, B oder C",
        tips: MC_TIPS,
        instructions: OSD_A2_LESEN_INSTRUCTIONS.aufgabe2,
        upperKeys: true,
      },
    ],
  },
];

const EXAMS_B1: ExamConfig[] = [
  {
    key: "telc",
    name: "telc",
    full: "telc Deutsch B1 · Zertifikat Deutsch",
    ready: true,
    color: "from-sky-600 to-blue-700",
    accent: "bg-slate-800",
    partLabel: "Teil",
    summary: "Leseverstehen 1–3 · Sprachbausteine 1–2",
    header: "telc Deutsch B1 · 90 Minuten Leseverstehen und Sprachbausteine",
    intro:
      "telc Deutsch B1 (Zertifikat Deutsch) sınavında Leseverstehen ve Sprachbausteine birlikte 90 dakikadır ve yazılı sınavın 105 puanını oluşturur (Lesen 75 + Sprachbausteine 30). Yazılı sınavı geçmek için toplam 225 puanın %60'ı (135 puan) gerekir. Önerilen süre: Lesen Teil 1 ~15 dk, Teil 2 ~20 dk, Teil 3 ~20 dk, Sprachbausteine 1 ve 2 ~15'er dk. Zertifikat Deutsch für Jugendliche ve telc Deutsch B1+ Beruf da aynı yapıdadır.",
    progressSlug: "telc-b1-lesen",
    teile: [
      {
        no: 1,
        kind: "headlines",
        sets: TELC_B1_TEIL1_SETS,
        title: "Leseverstehen, Teil 1",
        desc: "Globalverstehen · 10 başlık (a–j) · 5 metin",
        points: "25 Punkte (her doğru 5 puan)",
        tips: [
          "Önce 5 metni hızlıca oku ve her metnin konusunu tek kelimeyle not al (ör. „Bibliothek“, „Umfrage“).",
          "Başlıklar ikişer ikişer aynı konudadır. Fark genellikle tek bir kelimededir: „immer mehr“ ↔ „immer weniger“, „billiger“ ↔ „teurer“, „Buchtipp“ ↔ „Studie“.",
          "Metinde geçmeyen bir iddia içeren başlık (zam, yasak, yeni açılış…) yanlıştır — kelimeler tanıdık gelse bile.",
          "Her başlık bir kez kullanılır; 5 başlık boşta kalır. Emin olduğun metinlerden başla.",
        ],
        instructions: TELC_B1_INSTRUCTIONS.teil1,
      },
      {
        no: 2,
        kind: "mc",
        sets: TELC_B1_TEIL2_SETS,
        title: "Leseverstehen, Teil 2",
        desc: "Detailverstehen · uzun metin · 5 görev (6–10) · a, b, c",
        points: "25 Punkte (her doğru 5 puan)",
        tips: [
          "Önce görevleri oku; görevlerin sırası metindeki paragrafların sırasıyla aynıdır.",
          "Yanlış seçenekler metindeki kelimeleri kullanır ama anlamı değiştirir: önce ↔ sonra, hepsi ↔ bazıları, istemek ↔ yapmak.",
          "„zuerst“, „inzwischen“, „früher“, „heute“, „in Zukunft“ gibi zaman ifadelerine dikkat et.",
          "Seçenek metindekinden daha kesin bir şey söylüyorsa (immer, nie, alle) genellikle yanlıştır.",
        ],
        instructions: TELC_B1_INSTRUCTIONS.teil2,
      },
      {
        no: 3,
        kind: "match",
        sets: TELC_B1_TEIL3_SETS,
        title: "Leseverstehen, Teil 3",
        desc: "Selektives Verstehen · 10 durum (11–20) · 12 ilan (a–l) · x",
        points: "25 Punkte (her doğru 2,5 puan)",
        tips: [
          "Her durumda kişinin tam ihtiyacının altını çiz: kim için? ne zaman? nerede? ne kadar?",
          "12 ilandan genellikle 8'i kullanılır; 1–3 durumun cevabı x'tir.",
          "Konu tutan ama bir detayı uymayan ilan (yaz/kış, sabah/akşam, yeni/ikinci el, çırak/deneyimli) tipik tuzaktır → x.",
          "Önce emin olduklarını işaretle; kullanılmış ilanlar soluklaşır, kalan durumlara bu sayede daha hızlı bakarsın.",
        ],
        instructions: TELC_B1_INSTRUCTIONS.teil3,
      },
      {
        no: 4,
        kind: "clozeMc",
        sets: TELC_B1_SB1_SETS,
        title: "Sprachbausteine, Teil 1",
        desc: "Grammatik · mektup / e-posta · 10 boşluk (21–30) · a, b, c",
        points: "15 Punkte (her doğru 1,5 puan)",
        tips: [
          "Boşluktan sonra fiil nerede? Fiil sondaysa yan cümle bağlacı (weil, dass, ob, obwohl), fiil 2. sıradaysa denn / aber / und.",
          "Edattan sonra hâl: mit / bei / von / zu → Dativ; für / ohne / um → Akkusativ; in / an / auf → nerede? Dativ, nereye? Akkusativ.",
          "Sıfat ekleri için önce ismin artikelini ve hâlini bul: ein schönes Picknick, einen guten Service.",
          "Kalıplara dikkat: sich freuen auf / über, sich interessieren für, sich beschweren über, Mit freundlichen Grüßen.",
        ],
        instructions: TELC_B1_INSTRUCTIONS.sb1,
      },
      {
        no: 5,
        kind: "clozeBank",
        sets: TELC_B1_SB2_SETS,
        title: "Sprachbausteine, Teil 2",
        desc: "Lexik · metin · 10 boşluk (31–40) · 15 kelime (a–o)",
        points: "15 Punkte (her doğru 1,5 puan)",
        tips: [
          "Önce 15 kelimeyi türlerine ayır: bağlaçlar (denn, weil, deshalb…), edatlar, fiiller, sıfatlar.",
          "Boşluğun önü ve arkası hangi türü istiyor? „sich interessieren ___“ → edat, „Wir wären Ihnen sehr ___“ → sıfat.",
          "Fiil boşluğun hemen ardındaysa deshalb / außerdem / trotzdem; fiil sondaysa weil / dass / ob; fiil 2. sıradaysa denn.",
          "Her kelime bir kez kullanılır; 5 kelime boşta kalır. Emin olduğun boşluklardan başla.",
        ],
        instructions: TELC_B1_INSTRUCTIONS.sb2,
      },
    ],
  },
  {
    key: "goethe",
    name: "Goethe",
    full: "Goethe-Zertifikat B1",
    ready: false,
    color: "from-emerald-600 to-teal-700",
    accent: "bg-emerald-800",
    partLabel: "Teil",
    header: "Goethe-Zertifikat B1 · Lesen",
    intro: "",
    progressSlug: "goethe-b1-lesen",
    teile: [],
  },
  {
    key: "osd",
    name: "ÖSD",
    full: "ÖSD Zertifikat B1",
    ready: false,
    color: "from-rose-600 to-red-700",
    accent: "bg-rose-800",
    partLabel: "Aufgabe",
    header: "ÖSD Zertifikat B1 · Lesen",
    intro: "",
    progressSlug: "osd-b1-lesen",
    teile: [],
  },
];

const EXAMS_BY_LEVEL: Record<Level, ExamConfig[]> = { A1: [], A2: EXAMS_A2, B1: EXAMS_B1 };
const ALL_EXAMS: ExamConfig[] = [...EXAMS_A2, ...EXAMS_B1];
// Sınav Hazırlık içeriği hazır olan seviyeler (en az bir sınavı hazır olanlar).
const READY_LEVELS: Level[] = (["A1", "A2", "B1"] as Level[]).filter((lvl) => EXAMS_BY_LEVEL[lvl].some((e) => e.ready));

type Progress = Record<string, number>; // setId → en iyi skor (0–5)

function setItemCount(set: unknown): number {
  const s = set as { tasks?: unknown[]; gaps?: unknown[] };
  return (s.tasks || s.gaps || []).length;
}

function progressKey(username: string | null | undefined, slug: string) {
  return `examprep:${username || "guest"}:${slug}`;
}

function loadProgress(username: string | null | undefined): Progress {
  const all: Progress = {};
  for (const exam of ALL_EXAMS) {
    try {
      const raw = window.localStorage.getItem(progressKey(username, exam.progressSlug));
      if (raw) Object.assign(all, JSON.parse(raw) as Progress);
    } catch {
      /* depolama kullanılamıyorsa sessizce geç */
    }
  }
  return all;
}

function saveProgress(username: string | null | undefined, exam: ExamConfig, progress: Progress) {
  try {
    const own: Progress = {};
    for (const teil of exam.teile) {
      for (const s of teil.sets) if (progress[s.id] !== undefined) own[s.id] = progress[s.id];
    }
    window.localStorage.setItem(progressKey(username, exam.progressSlug), JSON.stringify(own));
  } catch {
    /* depolama kullanılamıyorsa sessizce geç */
  }
}

export default function ExamPrepTab({ level, onLevelChange, accessLevels, accessExpired, username }: Props) {
  const [examKey, setExamKey] = useState<ExamKey | null>(null);
  const [teilIndex, setTeilIndex] = useState<number | null>(null);
  const [setIndex, setSetIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState<Progress>({});

  useEffect(() => {
    setProgress(loadProgress(username));
  }, [username]);

  useEffect(() => {
    setExamKey(null);
    setTeilIndex(null);
    setSetIndex(null);
  }, [level]);

  const levelExams = EXAMS_BY_LEVEL[level];
  const exam = levelExams.find((e) => e.key === examKey) || null;
  const teil = exam && teilIndex !== null ? exam.teile[teilIndex] : null;

  const recordScore = (setId: string, score: number) => {
    if (!exam) return;
    setProgress((prev) => {
      const next = { ...prev, [setId]: Math.max(prev[setId] ?? 0, score) };
      saveProgress(username, exam, next);
      return next;
    });
  };

  const levelReady = READY_LEVELS.includes(level);
  const hasAccess = accessLevels.includes(level) && !accessExpired;

  const examStats = (e: ExamConfig) => {
    const sets = e.teile.flatMap((t) => t.sets as { id: string }[]);
    return { total: sets.length, done: sets.filter((s) => progress[s.id] !== undefined).length };
  };

  // ── Breadcrumb ──
  const crumbs: { label: string; onClick?: () => void }[] = [
    { label: "Sınav Hazırlık", onClick: () => { setExamKey(null); setTeilIndex(null); setSetIndex(null); } },
  ];
  if (exam) crumbs.push({ label: exam.full, onClick: () => { setTeilIndex(null); setSetIndex(null); } });
  if (teil) crumbs.push({ label: teil.title, onClick: () => setSetIndex(null) });
  if (teil && setIndex !== null) crumbs.push({ label: `Alıştırma ${setIndex + 1}` });

  return (
    <section className="mb-8 rounded-3xl bg-white p-4 shadow-lg sm:p-6">
      {/* Başlık + seviye seçimi */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-blue-600">Sınav Hazırlık</p>
          <h2 className="mt-2 text-2xl font-black text-slate-900">{level} sınav formatı çalışmaları</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Gireceğin sınavı seç; gerçek sınavdaki Lesen bölümüyle birebir aynı formatta alıştırmalar çöz. Amaç: sınav
            günü soru tiplerini ezbere tanıman.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {(["A1", "A2", "B1"] as const).map((lvl) => {
            const ready = READY_LEVELS.includes(lvl);
            const access = accessLevels.includes(lvl);
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => onLevelChange(lvl)}
                className={`rounded-full px-4 py-2 text-sm font-black transition ${
                  level === lvl
                    ? "bg-blue-600 text-white shadow-lg"
                    : access
                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {!ready ? "⏳" : access ? "✓" : "🔒"} {lvl}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3">
        <span className="text-xl leading-6">💻</span>
        <p className="text-sm leading-6 text-slate-700">
          <b>Gerçek sınav deneyimi için bu çalışmaları bilgisayardan (laptop / masaüstü) yapmanı tavsiye ederiz.</b>{" "}
          Dijital sınavda da soruları bilgisayarda çözeceksin; bilgisayarda metin ve sorular sınavdaki gibi yan yana
          görünür.<span className="lg:hidden"> Telefonda ilanlar ve metinler soruların altında kalır, bu yüzden biraz kaydırman gerekir.</span>
        </p>
      </div>

      {!levelReady ? (
        <div className="mt-6 rounded-3xl border border-blue-200 bg-blue-50 p-6 text-center">
          <p className="text-4xl">⏳</p>
          <p className="mt-3 text-xs font-black uppercase tracking-widest text-blue-700">Hazırlık aşamasında</p>
          <h3 className="mt-2 text-xl font-black text-slate-900">{level} sınav hazırlık çalışmaları hazırlanıyor</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {level} seviyesi için telc, Goethe ve ÖSD formatında Lesen çalışmaları çok yakında burada olacak. Şimdilik A2
            çalışmalarına göz atabilirsin.
          </p>
          <button
            type="button"
            onClick={() => onLevelChange("A2")}
            className="mt-4 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow hover:bg-blue-700"
          >
            A2 Sınav Hazırlığa Git
          </button>
        </div>
      ) : !hasAccess ? (
        <div className="mt-6 rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-xl text-white shadow-md">🔒</div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-amber-700">
                {accessExpired ? "Erişim süren doldu" : "Seviye kilitli"}
              </p>
              <h3 className="mt-1 text-lg font-black text-slate-900">{level} sınav hazırlık çalışmaları seni bekliyor</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {accessExpired
                  ? "Erişim süren dolduğu için bu bölüm kilitlendi. Paketini yenileyerek çalışmalara devam edebilirsin."
                  : `Bu bölüm ${level} paketi veya ${level} canlı kursu olan öğrencilere açıktır. ${level} seviyesine geçtiğinde telc, Goethe ve ÖSD formatındaki çalışmalar burada açılır.`}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Breadcrumb */}
          <nav className="mt-6 flex flex-wrap items-center gap-1 text-xs font-bold text-slate-500">
            {crumbs.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="px-1 text-slate-300">›</span>}
                {c.onClick && i < crumbs.length - 1 ? (
                  <button type="button" onClick={c.onClick} className="rounded px-1 hover:bg-slate-100 hover:text-blue-600">
                    {c.label}
                  </button>
                ) : (
                  <span className="px-1 text-slate-800">{c.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* 1) Sınav seçimi */}
          {!exam && (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {levelExams.map((e) => {
                const stats = examStats(e);
                return (
                  <button
                    key={e.key}
                    type="button"
                    disabled={!e.ready}
                    onClick={() => setExamKey(e.key)}
                    className={`group overflow-hidden rounded-3xl border text-left shadow-sm transition ${
                      e.ready ? "border-slate-200 hover:-translate-y-0.5 hover:shadow-lg" : "cursor-not-allowed border-slate-200 opacity-70"
                    }`}
                  >
                    <div className={`bg-gradient-to-r ${e.color} px-5 py-4 text-white`}>
                      <p className="text-xs font-black uppercase tracking-widest opacity-80">Sınav</p>
                      <p className="text-2xl font-black">{e.name}</p>
                    </div>
                    <div className="p-5">
                      <p className="font-black text-slate-900">{e.full}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {e.ready ? e.summary || e.teile.map((t) => `${e.partLabel} ${t.no}`).join(" · ") : "Lesen"}
                      </p>
                      {e.ready ? (
                        <p className="mt-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                          {stats.done}/{stats.total} alıştırma çözüldü
                        </p>
                      ) : (
                        <p className="mt-3 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                          ⏳ Hazırlanıyor
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* 2) Teil seçimi */}
          {exam && !teil && (
            <div className="mt-4">
              <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                <b>{exam.full} · Lesen:</b> {exam.intro}
              </div>
              <div className={`mt-4 grid gap-4 ${exam.teile.length === 5 ? "sm:grid-cols-2 lg:grid-cols-3" : exam.teile.length === 4 ? "sm:grid-cols-2 xl:grid-cols-4" : exam.teile.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
                {exam.teile.map((t, i) => {
                  const done = (t.sets as { id: string }[]).filter((s) => progress[s.id] !== undefined).length;
                  return (
                    <button
                      key={t.no}
                      type="button"
                      onClick={() => setTeilIndex(i)}
                      className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
                    >
                      <p className="text-xs font-black uppercase tracking-widest text-blue-600">{exam.name} {level}</p>
                      <p lang="de" className="mt-1 break-words text-lg font-black leading-snug text-slate-900 [hyphens:auto]">{t.title}</p>
                      <p className="mt-2 text-sm text-slate-600">{t.desc}</p>
                      {t.points && <p className="mt-1 text-xs font-bold text-slate-400">Sınavda: {t.points}</p>}
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${(done / t.sets.length) * 100}%` }} />
                      </div>
                      <p className="mt-2 text-xs font-bold text-slate-500">
                        {done}/{t.sets.length} alıştırma
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3) Alıştırma listesi */}
          {exam && teil && setIndex === null && (
            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
              <div className="grid content-start gap-3 sm:grid-cols-2">
                {(teil.sets as { id: string; title: string }[]).map((s, i) => {
                  const best = progress[s.id];
                  const max = setItemCount(s);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSetIndex(i)}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
                    >
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Alıştırma {i + 1}</p>
                        <p className="mt-1 font-black text-slate-900">{s.title}</p>
                      </div>
                      {best !== undefined ? (
                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${
                            best === max ? "bg-emerald-100 text-emerald-700" : best >= max * 0.6 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {best}/{max}
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-600">Başla</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <TipsBox teil={teil} />
            </div>
          )}

          {/* 4) Alıştırma */}
          {exam && teil && setIndex !== null && (
            <PracticeShell
              key={`${exam.key}-${teil.no}-${setIndex}`}
              exam={exam}
              teil={teil}
              setIndex={setIndex}
              onBack={() => setSetIndex(null)}
              onNext={() => setSetIndex((i) => (i === null ? 0 : (i + 1) % teil.sets.length))}
              onScore={recordScore}
            />
          )}
        </>
      )}
    </section>
  );
}

function TipsBox({ teil }: { teil: Teil }) {
  return (
    <aside className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
      <p className="text-xs font-black uppercase tracking-widest text-amber-700">💡 Strateji · {teil.title}</p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
        {teil.tips.map((t) => (
          <li key={t} className="flex gap-2">
            <span className="text-amber-500">•</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

// ───────────────────────── Alıştırma çerçevesi ─────────────────────────

type ShellProps = {
  exam: ExamConfig;
  teil: Teil;
  setIndex: number;
  onBack: () => void;
  onNext: () => void;
  onScore: (setId: string, score: number) => void;
};

function PracticeShell({ exam, teil, setIndex, onBack, onNext, onScore }: ShellProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [showTr, setShowTr] = useState(false);

  const data = teil.sets[setIndex] as { id: string; title: string; tasks?: { id: number; answer: string }[]; gaps?: { id: number; answer: string }[] };
  const tasks = data.tasks || data.gaps || [];
  const max = tasks.length;
  const total = teil.sets.length;
  const allAnswered = tasks.every((t) => answers[t.id]);
  const score = useMemo(() => tasks.filter((t) => answers[t.id] === t.answer).length, [answers, tasks]);

  const setAnswer = (id: number, value: string) => {
    if (checked) return;
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheck = () => {
    setChecked(true);
    onScore(data.id, score);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRetry = () => {
    setAnswers({});
    setChecked(false);
  };

  const sourceWord =
    teil.kind === "board" ? "bilgi panosu" : teil.kind === "match" ? "ilanlar" : teil.kind === "headlines" ? "başlıklar" : teil.kind === "clozeMc" || teil.kind === "clozeBank" ? "seçenekler" : teil.kind === "mc" && (teil.sets[setIndex] as McTextSet).text.kind === "email" ? "e-posta" : "metin";

  return (
    <div className="mt-4">
      {/* Sınav kâğıdı başlığı */}
      <div className="overflow-hidden rounded-3xl border border-slate-300 shadow-sm">
        <div className={`flex flex-wrap items-center justify-between gap-2 ${exam.accent} px-5 py-3 text-white`}>
          <p className="text-sm font-black tracking-wide">{exam.header}</p>
          <p className="text-xs font-bold opacity-80">
            Alıştırma {setIndex + 1}/{total} · {data.title}
          </p>
        </div>
        <div className="bg-white px-5 py-4">
          <p className="text-lg font-black text-slate-900">{teil.title}</p>
          {teil.instructions.de.map((line) => (
            <p key={line} className="text-[15px] font-semibold text-slate-800">
              {line}
            </p>
          ))}
          <button type="button" onClick={() => setShowTr((v) => !v)} className="mt-2 text-xs font-bold text-blue-600 hover:underline">
            {showTr ? "Türkçe açıklamayı gizle" : "🇹🇷 Türkçe açıklama"}
          </button>
          {showTr && <p className="mt-1 rounded-xl bg-blue-50 px-3 py-2 text-sm text-slate-700">{teil.instructions.tr}</p>}
        </div>
      </div>

      <p className="mt-3 rounded-xl bg-indigo-50 px-3 py-2 text-xs leading-5 text-indigo-800 lg:hidden">
        💻 Telefondasın: {sourceWord} soruların altında. Gerçek sınav deneyimi için bilgisayardan çalışmanı tavsiye ederiz.
      </p>

      {checked && (
        <div
          className={`mt-4 rounded-3xl border p-5 ${
            score === max ? "border-emerald-200 bg-emerald-50" : score >= max * 0.6 ? "border-amber-200 bg-amber-50" : "border-rose-200 bg-rose-50"
          }`}
        >
          <p className="text-2xl font-black text-slate-900">
            {score}/{max} doğru {score === max ? "🎉" : score >= max * 0.6 ? "👍" : "💪"}
          </p>
          {teil.points && <p className="mt-1 text-xs font-bold text-slate-500">Sınavda bu bölüm: {teil.points}</p>}
          <p className="mt-1 text-sm text-slate-700">
            {score === max
              ? "Mükemmel! Bu formatı çok iyi tanıyorsun. Sıradaki alıştırmaya geç."
              : score >= max * 0.6
              ? "İyi gidiyorsun. Yanlış cevapların açıklamalarını oku, sonra aynı alıştırmayı tekrar çöz."
              : "Açıklamaları dikkatle oku ve stratejileri tekrar gözden geçir. Tekrar çözdükçe hızlanacaksın."}
          </p>
        </div>
      )}

      <div className="mt-4">
        {teil.kind === "board" && <BoardView set={teil.sets[setIndex]} answers={answers} checked={checked} onAnswer={setAnswer} />}
        {teil.kind === "rf" && <RfView set={teil.sets[setIndex]} answers={answers} checked={checked} onAnswer={setAnswer} />}
        {teil.kind === "match" && <MatchView set={teil.sets[setIndex]} answers={answers} checked={checked} onAnswer={setAnswer} />}
        {teil.kind === "mc" && <McView set={teil.sets[setIndex]} answers={answers} checked={checked} onAnswer={setAnswer} upper={teil.upperKeys} />}
        {teil.kind === "headlines" && <HeadlinesView set={teil.sets[setIndex]} answers={answers} checked={checked} onAnswer={setAnswer} />}
        {teil.kind === "clozeMc" && <ClozeMcView set={teil.sets[setIndex]} answers={answers} checked={checked} onAnswer={setAnswer} />}
        {teil.kind === "clozeBank" && <ClozeBankView set={teil.sets[setIndex]} answers={answers} checked={checked} onAnswer={setAnswer} />}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={onBack} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-50">
          ← Alıştırmalar
        </button>
        {!checked ? (
          <button
            type="button"
            onClick={handleCheck}
            disabled={!allAnswered}
            className={`rounded-2xl px-6 py-3 text-sm font-black text-white shadow ${
              allAnswered ? "bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-slate-300"
            }`}
          >
            {allAnswered ? "Cevapları Kontrol Et" : `Tüm görevleri cevapla (${Object.keys(answers).length}/${max})`}
          </button>
        ) : (
          <>
            <button type="button" onClick={handleRetry} className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-black text-blue-700 hover:bg-blue-100">
              ↺ Tekrar Çöz
            </button>
            <button type="button" onClick={onNext} className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow hover:bg-blue-700">
              Sonraki Alıştırma →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ───────────────────────── Ortak parçalar ─────────────────────────

function Feedback({ correct, explanation, rightLabel }: { correct: boolean; explanation: string; rightLabel: string }) {
  return (
    <p className={`mt-2 rounded-xl px-3 py-2 text-xs leading-5 ${correct ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
      <b>{correct ? "✓ Doğru." : `✗ Doğru cevap: ${rightLabel}.`}</b> {explanation}
    </p>
  );
}

function choiceClass(selected: boolean, checked: boolean, isRight: boolean) {
  if (checked) {
    if (isRight) return "border-emerald-500 bg-emerald-50 text-emerald-800";
    if (selected) return "border-rose-400 bg-rose-50 text-rose-700 line-through";
    return "border-slate-200 bg-white text-slate-400";
  }
  return selected ? "border-blue-600 bg-blue-600 text-white shadow" : "border-slate-300 bg-white text-slate-700 hover:border-blue-400";
}

type ViewProps<T> = {
  set: T;
  answers: Record<number, string>;
  checked: boolean;
  onAnswer: (id: number, value: string) => void;
};

type AbcTask = { id: number; options: { key: string; text: string }[]; answer: string; explanation: string };

// a / b / c seçenekli tek görev (board ve mc görünümleri ortak kullanır)
function AbcTaskCard({
  task,
  label,
  isExample,
  selected,
  checked,
  onAnswer,
  upper,
}: {
  task: AbcTask;
  label: string;
  isExample: boolean;
  selected?: string;
  checked: boolean;
  onAnswer: (id: number, value: string) => void;
  upper?: boolean;
}) {
  const k = (key: string) => (upper ? key.toUpperCase() : key);
  return (
    <div className={`rounded-2xl border p-4 ${isExample ? "border-dashed border-slate-300 bg-slate-50" : "border-slate-200 bg-white"}`}>
      {isExample && <p className="mb-1 text-xs font-black uppercase tracking-widest text-slate-500">Beispiel</p>}
      <p className="font-semibold text-slate-900">
        <span className="mr-2 font-black text-slate-500">{task.id}</span>
        {label}
      </p>
      <div className="mt-3 space-y-2">
        {task.options.map((o) => (
          <button
            key={o.key}
            type="button"
            disabled={isExample || checked}
            onClick={() => onAnswer(task.id, o.key)}
            className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition ${
              isExample
                ? o.key === task.answer
                  ? "border-slate-500 bg-slate-200 text-slate-800"
                  : "border-slate-200 bg-white text-slate-500"
                : choiceClass(selected === o.key, checked, o.key === task.answer)
            }`}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-current text-xs font-black">
              {(isExample && o.key === task.answer) || (!isExample && selected === o.key) ? "✕" : k(o.key)}
            </span>
            {o.text}
          </button>
        ))}
      </div>
      {!isExample && checked && (
        <Feedback
          correct={selected === task.answer}
          explanation={task.explanation}
          rightLabel={`${k(task.answer)} (${task.options.find((o) => o.key === task.answer)?.text})`}
        />
      )}
    </div>
  );
}

// ───────────────────────── Bilgi panosu (board) ─────────────────────────

function BoardView({ set, answers, checked, onAnswer }: ViewProps<TelcA2Teil1Set>) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-3">
        <AbcTaskCard task={set.example} label={set.example.situation} isExample checked={checked} onAnswer={onAnswer} />
        {set.tasks.map((t) => (
          <AbcTaskCard key={t.id} task={t} label={t.situation} isExample={false} selected={answers[t.id]} checked={checked} onAnswer={onAnswer} />
        ))}
      </div>
      <div>
        <div className="sticky top-4 overflow-hidden rounded-3xl border-2 border-slate-800 bg-white shadow">
          <div className="bg-slate-800 px-5 py-3 text-center text-lg font-black text-white">{set.board.title}</div>
          <div className="divide-y divide-slate-200">
            {set.board.floors.map((f) => (
              <div key={f.label} className="grid grid-cols-[110px_1fr] gap-3 px-4 py-3 text-sm">
                <span className="font-black text-slate-900">{f.label}:</span>
                <span className="leading-6 text-slate-700">{f.items}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── Metin + a/b/c (mc) ─────────────────────────

function McView({ set, answers, checked, onAnswer, upper }: ViewProps<McTextSet> & { upper?: boolean }) {
  const { text } = set;
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-3">
        {set.example && <AbcTaskCard task={set.example} label={set.example.stem} isExample checked={checked} onAnswer={onAnswer} upper={upper} />}
        {set.tasks.map((t) => (
          <AbcTaskCard key={t.id} task={t} label={t.stem} isExample={false} selected={answers[t.id]} checked={checked} onAnswer={onAnswer} upper={upper} />
        ))}
      </div>
      <div>
        {text.kind === "article" ? (
          <article className="sticky top-4 rounded-3xl border border-slate-300 bg-[#fdfcf8] p-5 shadow">
            <h3 className="text-center font-serif text-2xl font-black text-slate-900">{text.headline}</h3>
            {text.subline && <p className="mt-1 border-b-2 border-slate-800 pb-3 text-center font-serif text-sm font-bold text-slate-600">{text.subline}</p>}
            <div className="mt-3 font-serif text-[15px] leading-7 text-slate-800">
              {text.paragraphs.map((p, i) => (
                <p key={i} className="mb-3">
                  {p}
                </p>
              ))}
            </div>
          </article>
        ) : (
          <div className="sticky top-4 overflow-hidden rounded-3xl border border-slate-300 bg-white shadow">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-4 py-2 text-xs font-bold text-slate-500">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ml-2">E-Mail</span>
            </div>
            <div className="p-5 text-[15px] leading-7 text-slate-800">
              {text.greeting && <p className="mb-3">{text.greeting}</p>}
              {text.paragraphs.map((p, i) => (
                <p key={i} className="mb-3">
                  {p}
                </p>
              ))}
              {text.closing?.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ───────────────────────── Metin + richtig/falsch (rf) ─────────────────────────

function RfView({ set, answers, checked, onAnswer }: ViewProps<TelcA2Teil2Set>) {
  const renderTask = (task: TelcA2Teil2Set["example"], isExample = false) => {
    const selected = isExample ? task.answer : answers[task.id];
    return (
      <div key={task.id} className={`rounded-2xl border p-4 ${isExample ? "border-dashed border-slate-300 bg-slate-50" : "border-slate-200 bg-white"}`}>
        {isExample && <p className="mb-1 text-xs font-black uppercase tracking-widest text-slate-500">Beispiel</p>}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-slate-900">
            <span className="mr-2 font-black text-slate-500">{task.id}</span>
            {task.statement}
          </p>
          <div className="flex shrink-0 gap-2">
            {(["richtig", "falsch"] as const).map((v) => (
              <button
                key={v}
                type="button"
                disabled={isExample || checked}
                onClick={() => onAnswer(task.id, v)}
                className={`flex w-20 flex-col items-center rounded-xl border px-2 py-1.5 text-xs font-bold transition ${
                  isExample
                    ? v === task.answer
                      ? "border-slate-500 bg-slate-200 text-slate-800"
                      : "border-slate-200 bg-white text-slate-400"
                    : choiceClass(selected === v, checked, v === task.answer)
                }`}
              >
                <span className="text-lg font-black leading-5">{v === "richtig" ? "+" : "–"}</span>
                {v}
              </button>
            ))}
          </div>
        </div>
        {!isExample && checked && (
          <Feedback correct={answers[task.id] === task.answer} explanation={task.explanation} rightLabel={task.answer === "richtig" ? "richtig (+)" : "falsch (–)"} />
        )}
      </div>
    );
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-3">
        {renderTask(set.example, true)}
        {set.tasks.map((t) => renderTask(t))}
      </div>
      <div>
        <article className="sticky top-4 rounded-3xl border border-slate-300 bg-[#fdfcf8] p-5 shadow">
          <h3 className="border-b-2 border-slate-800 pb-2 font-serif text-2xl font-black text-slate-900">{set.article.headline}</h3>
          <div className="mt-3 gap-5 font-serif text-[15px] leading-7 text-slate-800 sm:columns-2">
            {set.article.paragraphs.map((p, i) => (
              <p key={i} className="mb-3 break-inside-avoid-column">
                {p}
              </p>
            ))}
          </div>
          {set.article.source && <p className="mt-2 text-right text-xs italic text-slate-500">{set.article.source}</p>}
        </article>
      </div>
    </div>
  );
}

// ───────────────────────── İlanlar (match) ─────────────────────────

function MatchView({ set, answers, checked, onAnswer }: ViewProps<TelcA2Teil3Set>) {
  const letters = [...set.ads.map((a) => a.key), "x"];
  const usedBy = (letter: string) => Object.entries(answers).find(([, v]) => v === letter && letter !== "x")?.[0];

  const renderTask = (task: NonNullable<TelcA2Teil3Set["example"]>, isExample = false) => {
    const selected = isExample ? task.answer : answers[task.id];
    return (
      <div key={task.id} className={`rounded-2xl border p-4 ${isExample ? "border-dashed border-slate-300 bg-slate-50" : "border-slate-200 bg-white"}`}>
        {isExample && <p className="mb-1 text-xs font-black uppercase tracking-widest text-slate-500">Beispiel</p>}
        <p className="font-semibold text-slate-900">
          <span className="mr-2 font-black text-slate-500">{task.id}</span>
          {task.situation}
        </p>
        {isExample ? (
          <p className="mt-2 text-sm font-bold text-slate-700">Lösung: Anzeige {task.answer}</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {letters.map((l) => {
              const takenBy = usedBy(l);
              const takenElsewhere = !checked && takenBy !== undefined && Number(takenBy) !== task.id;
              const exampleLetter = !!set.example && l === set.example.answer;
              return (
                <button
                  key={l}
                  type="button"
                  disabled={checked || exampleLetter}
                  onClick={() => onAnswer(task.id, l)}
                  title={exampleLetter ? "Bu ilan örnekte kullanıldı" : takenElsewhere ? `Görev ${takenBy} için seçildi` : undefined}
                  className={`h-9 w-9 rounded-lg border text-sm font-black transition ${choiceClass(selected === l, checked, l === task.answer)} ${
                    exampleLetter ? "cursor-not-allowed opacity-30" : takenElsewhere ? "opacity-40" : ""
                  }`}
                >
                  {l === "x" ? "X" : l}
                </button>
              );
            })}
          </div>
        )}
        {!isExample && checked && (
          <Feedback
            correct={answers[task.id] === task.answer}
            explanation={task.explanation}
            rightLabel={task.answer === "x" ? "X (uygun ilan yok)" : `Anzeige ${task.answer}`}
          />
        )}
      </div>
    );
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
      <div className="space-y-3">
        {set.example && renderTask(set.example, true)}
        {set.tasks.map((t) => renderTask(t))}
        <p className="text-xs text-slate-500">Soluk harfler: örnekte veya başka bir görevde kullanılmış ilanlar. Her ilan yalnızca bir kez kullanılır.</p>
      </div>
      <div className="grid content-start gap-3 sm:grid-cols-2">
        {set.ads.map((ad) => (
          <div key={ad.key} className="relative rounded-2xl border-2 border-slate-300 bg-white p-4 pt-5 shadow-sm">
            <span className="absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-md bg-slate-800 text-sm font-black text-white">
              {ad.key}
            </span>
            <p className="font-black text-slate-900">{ad.title}</p>
            <div className="mt-1 space-y-0.5 text-sm leading-5 text-slate-700">
              {ad.lines.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────── Başlık eşleştirme (headlines) ─────────────────────────

function HeadlinesView({ set, answers, checked, onAnswer }: ViewProps<OsdHeadlineSet>) {
  const usedLetters = new Set(Object.values(answers));
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      <div className="space-y-3">
        {set.tasks.map((t) => {
          const selected = answers[t.id];
          return (
            <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-800 text-sm font-black text-white">{t.id}</span>
                <span className="text-sm font-bold text-slate-600">Überschrift:</span>
                <span
                  className={`min-w-[2.5rem] rounded-md border-b-2 px-2 text-center text-lg font-black ${
                    checked
                      ? selected === t.answer
                        ? "border-emerald-500 text-emerald-700"
                        : "border-rose-400 text-rose-600 line-through"
                      : selected
                      ? "border-blue-600 text-blue-700"
                      : "border-slate-300 text-slate-300"
                  }`}
                >
                  {selected || "?"}
                </span>
              </div>
              <p className="mt-3 font-serif text-[15px] leading-7 text-slate-800">{t.text}</p>
              {t.source && <p className="mt-1 text-right text-xs italic text-slate-500">[{t.source}]</p>}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {set.headlines.map((h) => (
                  <button
                    key={h.key}
                    type="button"
                    disabled={checked}
                    onClick={() => onAnswer(t.id, h.key)}
                    title={h.text}
                    className={`h-9 w-9 rounded-lg border text-sm font-black transition ${choiceClass(selected === h.key, checked, h.key === t.answer)} ${
                      !checked && selected !== h.key && usedLetters.has(h.key) ? "opacity-40" : ""
                    }`}
                  >
                    {h.key}
                  </button>
                ))}
              </div>
              {checked && (
                <Feedback
                  correct={selected === t.answer}
                  explanation={t.explanation}
                  rightLabel={`${t.answer} („${set.headlines.find((h) => h.key === t.answer)?.text}“)`}
                />
              )}
            </div>
          );
        })}
      </div>
      <div>
        <div className="sticky top-4 overflow-hidden rounded-3xl border-2 border-slate-800 bg-white shadow">
          <div className="bg-slate-800 px-5 py-3 text-center text-lg font-black text-white">Überschriften</div>
          <div className="divide-y divide-slate-200">
            {set.headlines.map((h) => {
              const usedFor = Object.entries(answers)
                .filter(([, v]) => v === h.key)
                .map(([id]) => id);
              return (
                <div key={h.key} className={`flex items-center gap-3 px-4 py-2.5 ${usedFor.length && !checked ? "bg-blue-50" : ""}`}>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 border-slate-800 text-sm font-black text-slate-900">{h.key}</span>
                  <span className="flex-1 text-sm font-semibold text-slate-800">{h.text}</span>
                  {usedFor.length > 0 && !checked && <span className="text-xs font-bold text-blue-600">→ {usedFor.join(", ")}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── Boşluklu metin yardımcıları ─────────────────────────

function renderWithGaps(text: string, renderGap: (id: number) => React.ReactNode) {
  const parts = text.split(/\[\[(\d+)\]\]/);
  return parts.map((part, i) => (i % 2 === 1 ? <React.Fragment key={i}>{renderGap(Number(part))}</React.Fragment> : <React.Fragment key={i}>{part}</React.Fragment>));
}

function GapChip({ id, label, state, active, onClick }: { id: number; label?: string; state: "empty" | "filled" | "right" | "wrong"; active?: boolean; onClick?: () => void }) {
  const cls =
    state === "right"
      ? "border-emerald-500 bg-emerald-50 text-emerald-800"
      : state === "wrong"
      ? "border-rose-400 bg-rose-50 text-rose-700"
      : state === "filled"
      ? "border-blue-500 bg-blue-50 text-blue-800"
      : "border-slate-300 bg-slate-100 text-slate-500";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mx-0.5 inline-flex items-baseline gap-1 rounded-md border px-1.5 py-0 align-baseline font-sans text-sm font-bold ${cls} ${active ? "ring-2 ring-blue-400" : ""}`}
    >
      <span className="text-[10px] font-black opacity-70">{id}</span>
      <span className="min-w-[3.5rem] text-left">{label || "………"}</span>
    </button>
  );
}

// ───────────────────────── Sprachbausteine 1 (clozeMc) ─────────────────────────

function ClozeMcView({ set, answers, checked, onAnswer }: ViewProps<ClozeMcSet>) {
  const gapState = (id: number, answer: string) =>
    checked ? (answers[id] === answer ? "right" : "wrong") : answers[id] ? "filled" : "empty";
  const scrollTo = (id: number) => {
    if (typeof document !== "undefined") document.getElementById(`gap-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div>
        <div className="sticky top-4 rounded-3xl border border-slate-300 bg-white p-5 shadow">
          <div className="space-y-3 text-[15px] leading-8 text-slate-800">
            {set.paragraphs.map((p, i) => (
              <p key={i}>
                {renderWithGaps(p, (id) => {
                  const gap = set.gaps.find((g) => g.id === id);
                  const sel = answers[id];
                  const label = sel ? gap?.options.find((x) => x.key === sel)?.text : undefined;
                  return <GapChip id={id} label={label} state={gap ? gapState(id, gap.answer) : "empty"} onClick={() => scrollTo(id)} />;
                })}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {set.gaps.map((g) => {
          const selected = answers[g.id];
          return (
            <div key={g.id} id={`gap-${g.id}`} className="rounded-2xl border border-slate-200 bg-white p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-7 text-sm font-black text-slate-500">{g.id}</span>
                {g.options.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    disabled={checked}
                    onClick={() => onAnswer(g.id, opt.key)}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-semibold transition ${choiceClass(selected === opt.key, checked, opt.key === g.answer)}`}
                  >
                    <span className="text-xs font-black opacity-70">{opt.key}</span>
                    {opt.text}
                  </button>
                ))}
              </div>
              {checked && (
                <Feedback
                  correct={selected === g.answer}
                  explanation={g.explanation}
                  rightLabel={`${g.answer} (${g.options.find((x) => x.key === g.answer)?.text})`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ───────────────────────── Sprachbausteine 2 (clozeBank) ─────────────────────────

function ClozeBankView({ set, answers, checked, onAnswer }: ViewProps<ClozeBankSet>) {
  const [activeGap, setActiveGap] = useState<number | null>(set.gaps[0]?.id ?? null);
  const wordText = (key?: string) => set.words.find((w) => w.key === key)?.text;
  const usedBy = (key: string) => Object.entries(answers).find(([, v]) => v === key)?.[0];

  const pickWord = (key: string) => {
    if (checked || activeGap === null) return;
    onAnswer(activeGap, key);
    // bir sonraki boş boşluğa geç
    const next = set.gaps.find((g) => g.id !== activeGap && !answers[g.id]);
    setActiveGap(next ? next.id : activeGap);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div className="rounded-3xl border border-slate-300 bg-white p-5 shadow">
        <div className="space-y-3 text-[15px] leading-8 text-slate-800">
          {set.paragraphs.map((p, i) => (
            <p key={i}>
              {renderWithGaps(p, (id) => {
                const gap = set.gaps.find((g) => g.id === id);
                const sel = answers[id];
                const state = checked ? (gap && sel === gap.answer ? "right" : "wrong") : sel ? "filled" : "empty";
                return <GapChip id={id} label={sel ? `${sel}) ${wordText(sel)}` : undefined} state={state} active={!checked && activeGap === id} onClick={() => setActiveGap(id)} />;
              })}
            </p>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="sticky top-4 space-y-4">
          <div className="overflow-hidden rounded-3xl border-2 border-slate-800 bg-white shadow">
            <div className="flex items-center justify-between bg-slate-800 px-4 py-2.5 text-white">
              <span className="text-sm font-black">Wörter a–o</span>
              {!checked && <span className="text-xs font-bold opacity-80">{activeGap ? `Boşluk ${activeGap} seçili` : "Önce bir boşluk seç"}</span>}
            </div>
            <div className="grid grid-cols-2 gap-1.5 p-3 sm:grid-cols-3">
              {set.words.map((w) => {
                const by = usedBy(w.key);
                return (
                  <button
                    key={w.key}
                    type="button"
                    disabled={checked}
                    onClick={() => pickWord(w.key)}
                    className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-left text-xs font-bold transition ${
                      by ? "border-blue-200 bg-blue-50 text-blue-400" : "border-slate-300 bg-white text-slate-800 hover:border-blue-400"
                    }`}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-current text-[10px]">{w.key}</span>
                    <span className="truncate">{w.text}</span>
                    {by && <span className="ml-auto text-[10px]">→{by}</span>}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="text-xs leading-5 text-slate-500">Metinde bir boşluğa tıkla, sonra kelimeyi seç. Kullanılan kelimeler soluklaşır; her kelime bir kez kullanılır.</p>
          {checked && (
            <div className="space-y-2">
              {set.gaps.map((g) => (
                <div key={g.id} className="rounded-xl border border-slate-200 bg-white p-2">
                  <p className="text-xs font-black text-slate-600">
                    {g.id}: {answers[g.id] ? `${answers[g.id]}) ${wordText(answers[g.id])}` : "—"}
                  </p>
                  <Feedback correct={answers[g.id] === g.answer} explanation={g.explanation} rightLabel={`${g.answer}) ${wordText(g.answer)}`} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
