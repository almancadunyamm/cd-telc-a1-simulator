"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Audio Timestamps (saniye cinsinden) ─────────────────────────────────────
const AUDIO_SRC = "/audio/goethe-a1-hoeren.mp4";

const TIMESTAMPS = {
  teil1: 30,
  q1: 120, q2: 185, q3: 240, q4: 322, q5: 374, q6: 429,
  teil2: 497,
  q7: 546, q8: 592, q9: 632, q10: 674,
  teil3: 712,
  q11: 733, q12: 799, q13: 845, q14: 904, q15: 954,
  end: 1011,
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase =
  | "intro"
  | "hoeren-intro"
  | "hoeren"
  | "lesen-intro"
  | "lesen-teil1"
  | "lesen-teil2"
  | "lesen-teil3"
  | "schreiben-intro"
  | "schreiben-teil1"
  | "schreiben-teil2"
  | "result";

type Answers = Record<string, string>;

// ─── Exam Data (embedded) ─────────────────────────────────────────────────────

const LESEN_TEIL1_TEXTS = [
  {
    id: "textA",
    label: "Text A",
    sender: "E-Mail von Karin",
    content: `Hallo Li,

danke für deine Mail. Dein Zug kommt hier in Hannover um 12.36 Uhr an. Ich bin ab 12.15 Uhr im Hauptbahnhof und warte auf dich vor der Auskunft.

Du kannst mich den ganzen Vormittag auf meinem Handy (++49 173 62 205 59) erreichen.

Deine
Karin`,
    questions: [
      { id: "lt1-1", statement: "Lis Zug kommt nach halb eins an.", correct: "richtig" },
      { id: "lt1-2", statement: "Karin wartet den ganzen Vormittag vor der Auskunft.", correct: "falsch" },
    ],
  },
  {
    id: "textB",
    label: "Text B",
    sender: "Brief von Ralf",
    content: `Liebe Carmen,

am kommenden Sonntag habe ich Geburtstag. Ich möchte gerne mit dir feiern und lade dich herzlich zu meiner Party am Samstagabend ein. Wir fangen um 21 Uhr an. Ist das okay für dich?

Es werden viele Leute da sein, die du auch kennst. Kannst du vielleicht einen Salat mitbringen? Und vergiss bitte nicht einen Pullover oder eine Jacke! Wir wollen nämlich draußen im Garten feiern.

Ich freue mich sehr auf dich!

Bis zum Wochenende
Ralf`,
    questions: [
      { id: "lt1-3", statement: "Ralf hatte am letzten Wochenende Geburtstag.", correct: "falsch" },
      { id: "lt1-4", statement: "Ralf hat nur zwei oder drei Leute eingeladen.", correct: "falsch" },
      { id: "lt1-5", statement: "Die Party findet draußen statt.", correct: "richtig" },
    ],
  },
];

const LESEN_TEIL2_ITEMS = [
  {
    id: "lt2-6", number: 6,
    situation: "Sie möchten mit dem Schiff auf dem Rhein fahren.",
    optionA: { label: "www.schiff-ruedesheim.de", content: "Hotel Pension Schiff\nEinzel- und Doppelzimmer mit Dusche / WC\nRestaurant mit Rhein-Terrasse\nPreise  ueber uns  Buchung" },
    optionB: { label: "www.bingen-ruedesheimer.de", content: "Bingen-Ruedesheimer Rheinschiffe\ntaeglich von Ruedesheim nach Koblenz\nalle Abfahrtszeiten und Preise\nhier" },
    correct: "b",
  },
  {
    id: "lt2-7", number: 7,
    situation: "Sie moechten Deutsch in Deutschland lernen.",
    optionA: { label: "www.sprachenfuchs.de", content: "Sprachinstitut Fuchs\nDresden, Prager Str. 4\nDeutsch, Englisch, Franzoesisch, Russisch\nDie Schule  Die Kurse  Die Preise  Kontakt" },
    optionB: { label: "www.eviva.com", content: "Eviva-Idiomas\nSprachkurse fuer Deutsche\nSpanisch auf Mallorca\nEnglisch auf Malta\nUnsere Preise  Unser Unterricht  Buchungen" },
    correct: "a",
  },
  {
    id: "lt2-8", number: 8,
    situation: "Sie moechten ein Zugticket im Internet kaufen.",
    optionA: { label: "www.DER.com", content: "Deutsches Reisebuero\nTicketbestellungen und Reservierungen\nfuer Fluege weltweit, Deutsche Bahn, Eurobus, 24-Stunden-Service\nE-Mail  Ticketbestellung" },
    optionB: { label: "www.RED.com", content: "Reisedienst GmbH\nTicketservice fuer Theater, Konzerte,\nBusreisen in Deutschland und nach Polen, Tschechien und Ungarn\nKonzertservice  Theater  Busreisen" },
    correct: "a",
  },
  {
    id: "lt2-9", number: 9,
    situation: "Sie moechten Informationen ueber den Bodensee.",
    optionA: { label: "www.bodensee.de", content: "Touristeninformation\nBodensee\nUrlaubsorte  Hotelservice\nFerienwohnungen  Rundreisen" },
    optionB: { label: "www.rottenmeier.de", content: "Hans Rottenmeier\nFerienwohnungen am Bodensee\nHaeuser  Preise  Kontakt" },
    correct: "a",
  },
  {
    id: "lt2-10", number: 10,
    situation: "Sie sind in Wiesbaden und moechten mit dem Zug am Mittag in Hamburg sein.",
    optionA: { label: "Verbindung A", content: "Hamburg nach Wiesbaden\n17.02.  Abfahrt 12:18 Uhr  Ankunft 16:52\nDauer: 4:34  Umsteigen: 1  ICE, S" },
    optionB: { label: "Verbindung B", content: "Wiesbaden nach Hamburg\n17.02.  Abfahrt 08:09 Uhr  Ankunft 12:40\nDauer: 4:31  Umsteigen: 1  S, ICE" },
    correct: "b",
  },
];

const LESEN_TEIL3_ITEMS = [
  { id: "lt3-11", number: 11, context: "In der Sprachschule", sign: "In der 10-Uhr-Pause\nbekommen Sie an der\nRezeption ein\nFrühstückspaket:\nBelegte Brötchen und Getränke für 2 Euro.", statement: "In der Sprachschule können Sie etwas zu essen kaufen.", correct: "richtig" },
  { id: "lt3-12", number: 12, context: "An der Post", sign: "Öffnungszeiten:\nmontags – freitags\n8.00 – 12.00 und 13.00 – 18.00\nsamstags\n8.00 – 12.00", statement: "Es ist Samstagnachmittag. Sie können auf der Post Briefmarken kaufen.", correct: "falsch" },
  { id: "lt3-13", number: 13, context: "Am Bahnhof", sign: "Auf dem gesamten\nBahnhof ist das\nRauchen verboten.", statement: "Sie können hier Zigaretten rauchen.", correct: "falsch" },
  { id: "lt3-14", number: 14, context: "Eingang Restaurant", sign: "Heute im Bavaria:\nBayerischer Abend\nBrezeln, Weißwürste, Sauerkraut\nVolksmusik, ab 20 Uhr Tanz", statement: "Heute Abend können Sie in diesem Restaurant tanzen.", correct: "richtig" },
  { id: "lt3-15", number: 15, context: "An der Haltestelle", sign: "In der Neujahrsnacht\nBusverkehr bis 23.00 Uhr\nund\nvon 1.00 Uhr bis 5.00 Uhr\nalle 30 Minuten", statement: "Von 23 Uhr bis 1 Uhr fährt kein Bus.", correct: "richtig" },
];

const SCHREIBEN_TEIL1_FIELDS = [
  { id: "s1-1", number: 1, label: "Anzahl der Personen", correct: "4", type: "text" as const },
  { id: "s1-2", number: 2, label: "Davon Kinder", correct: "2", type: "text" as const },
  { id: "s1-3", number: 3, label: "Urlaubsort", correct: "Seeheim", type: "text" as const },
  { id: "s1-4", number: 4, label: "Zahlungsweise", correct: "Bar", type: "checkbox" as const, options: ["Bar", "Kreditkarte"] },
  { id: "s1-5", number: 5, label: "Reisetermin", correct: "Sonntag", type: "text" as const },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useTimer(seconds: number, running: boolean) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return { left, display: `${mm}:${ss}`, percent: (left / seconds) * 100 };
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold tracking-wide ${color}`}>
      {children}
    </span>
  );
}

function SectionHeader({ section, teil, duration }: { section: string; teil?: string; duration?: string }) {
  return (
    <div className="mb-6 border-b-2 border-slate-900 pb-4">
      <div className="flex items-baseline gap-3">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">{section}</h2>
        {teil && <span className="text-xl font-bold text-slate-500">{teil}</span>}
      </div>
      {duration && <p className="mt-1 text-sm font-semibold text-slate-400 uppercase tracking-widest">{duration}</p>}
    </div>
  );
}

function RFButton({ value, selected, onClick }: { value: "richtig" | "falsch"; selected: boolean; onClick: () => void }) {
  const isRichtig = value === "richtig";
  return (
    <button
      onClick={onClick}
      className={`min-w-[88px] rounded border-2 px-4 py-2 text-sm font-bold transition-all ${
        selected
          ? isRichtig
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-rose-500 bg-rose-500 text-white"
          : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
      }`}
    >
      {isRichtig ? "Richtig" : "Falsch"}
    </button>
  );
}

function ABCButton({ label, id, selected, onClick }: { label: string; id: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg border-2 p-3 text-left text-sm transition-all ${
        selected
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-slate-200 bg-white text-slate-800 hover:border-blue-300"
      }`}
    >
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black uppercase ${selected ? "border-white text-white" : "border-slate-400 text-slate-500"}`}>
        {id}
      </span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

// ─── Timer Bar ────────────────────────────────────────────────────────────────

function TimerBar({ phase, timerRunning }: { phase: Phase; timerRunning: boolean }) {
  const durations: Partial<Record<Phase, number>> = {
    "hoeren": 1011,
    "lesen-teil1": 500,
    "lesen-teil2": 500,
    "lesen-teil3": 500,
    "schreiben-teil1": 600,
    "schreiben-teil2": 600,
  };
  const dur = durations[phase] ?? 600;
  const { display, percent } = useTimer(dur, timerRunning);
  const urgent = percent < 20;

  if (!durations[phase]) return null;

  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between text-xs font-bold">
        <span className="text-slate-500 uppercase tracking-wider">Verbleibende Zeit</span>
        <span className={urgent ? "text-rose-600 animate-pulse" : "text-slate-700"}>{display}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ${urgent ? "bg-rose-500" : "bg-blue-500"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

// ─── Progress Steps ───────────────────────────────────────────────────────────

const PHASES_ORDER: Phase[] = [
  "hoeren",
  "lesen-teil1", "lesen-teil2", "lesen-teil3",
  "schreiben-teil1", "schreiben-teil2",
];

function ProgressBar({ current }: { current: Phase }) {
  const steps = [
    { label: "Hören", phase: "hoeren" as Phase },
    { label: "Lesen T1", phase: "lesen-teil1" as Phase },
    { label: "Lesen T2", phase: "lesen-teil2" as Phase },
    { label: "Lesen T3", phase: "lesen-teil3" as Phase },
    { label: "Schreiben T1", phase: "schreiben-teil1" as Phase },
    { label: "Schreiben T2", phase: "schreiben-teil2" as Phase },
  ];
  const currentIdx = PHASES_ORDER.indexOf(current);

  return (
    <div className="mb-8 flex items-center gap-1 overflow-x-auto pb-1">
      {steps.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={s.phase} className="flex items-center gap-1 shrink-0">
            <div className={`rounded px-2 py-1 text-xs font-bold whitespace-nowrap ${active ? "bg-blue-600 text-white" : done ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
              {done ? "✓ " : ""}{s.label}
            </div>
            {i < steps.length - 1 && <div className="w-3 h-px bg-slate-300 shrink-0" />}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GoetheA1Simulator() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Answers>({});
  const [schreibenText, setSchreibenText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [reviewMode, setReviewMode] = useState(false);
  const timerRunning = PHASES_ORDER.includes(phase) && !reviewMode;

  // Ses timeupdate: Hören bitince otomatik Lesen'e geç
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (phase !== "hoeren") {
      audio.pause();
      return;
    }

    const handleTimeUpdate = () => {
      if (audio.currentTime >= TIMESTAMPS.end) {
        audio.pause();
        setPhase("lesen-intro");
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
  }, [phase]);

  const setAnswer = useCallback((id: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [id]: val }));
  }, []);

  // ── Score Calculation ──────────────────────────────────────────────────────

  const lesenTeil1Questions = LESEN_TEIL1_TEXTS.flatMap((t) => t.questions);
  const lesenTeil3Questions = LESEN_TEIL3_ITEMS;
  const lesenTeil2Questions = LESEN_TEIL2_ITEMS;

  const scoreOf = (items: { id: string; correct: string }[]) =>
    items.filter((q) => answers[q.id] === q.correct).length;

  const lt1Score = scoreOf(lesenTeil1Questions);
  const lt2Score = scoreOf(lesenTeil2Questions);
  const lt3Score = scoreOf(lesenTeil3Questions);
  const lesenTotal = lt1Score + lt2Score + lt3Score;

  const s1Score = SCHREIBEN_TEIL1_FIELDS.filter((f) => {
    const ans = answers[f.id];
    if (!ans) return false;
    return ans.toLowerCase().includes(f.correct.toLowerCase());
  }).length;

  // ── Navigation ─────────────────────────────────────────────────────────────

  const goNext = () => {
    const map: Partial<Record<Phase, Phase>> = {
      intro: "hoeren-intro",
      "hoeren-intro": "hoeren",
      "lesen-intro": "lesen-teil1",
      "lesen-teil1": "lesen-teil2",
      "lesen-teil2": "lesen-teil3",
      "lesen-teil3": "schreiben-intro",
      "schreiben-intro": "schreiben-teil1",
      "schreiben-teil1": "schreiben-teil2",
      "schreiben-teil2": "result",
    };
    if (map[phase]) setPhase(map[phase]!);
  };

  // ── Render Sections ────────────────────────────────────────────────────────

  const renderIntro = () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-lg text-center">
        <div className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-black uppercase tracking-widest text-blue-700">
          Dijital Simülatör
        </div>
        <h1 className="mb-2 text-4xl font-black leading-tight text-slate-900">
          Goethe-Zertifikat A1
        </h1>
        <h2 className="mb-1 text-2xl font-bold text-slate-600">Start Deutsch 1</h2>
        <p className="mb-8 text-sm text-slate-400">Modellsatz</p>

        <div className="mb-8 grid grid-cols-3 gap-3 text-center">
          {[
            { label: "Hören", time: "~20 Min.", count: "15 Aufgaben", color: "bg-emerald-50 border-emerald-200" },
            { label: "Lesen", time: "~25 Min.", count: "15 Aufgaben", color: "bg-blue-50 border-blue-200" },
            { label: "Schreiben", time: "~20 Min.", count: "2 Teile", color: "bg-violet-50 border-violet-200" },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl border-2 p-4 ${s.color}`}>
              <div className="text-lg font-black text-slate-800">{s.label}</div>
              <div className="text-xs font-semibold text-slate-500">{s.time}</div>
              <div className="mt-1 text-xs text-slate-400">{s.count}</div>
            </div>
          ))}
        </div>

        <button
          onClick={goNext}
          className="w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-black text-white shadow-lg hover:bg-blue-700 transition-colors"
        >
          Prüfung beginnen →
        </button>
      </div>
    </div>
  );

  const renderHoerenIntro = () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-lg">
        <SectionHeader section="Hören" duration="circa 20 Minuten" />
        <div className="rounded-xl border-2 border-slate-200 bg-white p-6 text-center">
          <div className="mb-6 text-6xl">🎧</div>
          <p className="mb-4 text-slate-700 leading-relaxed">
            Dieser Test hat <strong>drei Teile</strong>. Sie hören kurze Gespräche und Ansagen.
            Zu jedem Text gibt es eine Aufgabe.
          </p>
          <p className="mb-4 text-slate-700">
            <strong>Lesen</strong> Sie zuerst die Aufgabe, <strong>hören</strong> Sie dann den Text dazu.
          </p>
          <p className="mb-6 text-slate-700">
            Kreuzen Sie die richtige Lösung an.
          </p>
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700 mb-6">
            <strong>🎧 Gerçek ses dosyası mevcut.</strong> Sınav başladığında ses otomatik oynatılır. Ses açık olduğundan emin olun.
          </div>
        </div>
        <button
          onClick={() => {
            goNext();
            if (audioRef.current && !reviewMode) {
              setTimeout(() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = TIMESTAMPS.teil1;
                  audioRef.current.play().catch(() => {});
                }
              }, 50);
            }
          }}
          className="mt-6 w-full rounded-xl bg-blue-600 py-4 text-lg font-black text-white hover:bg-blue-700 transition-colors"
        >
          🎧 Hören beginnen →
        </button>
      </div>
    </div>
  );

  const QUESTION_TIMESTAMPS: Record<string, number> = {
    "h1-1": TIMESTAMPS.q1, "h1-2": TIMESTAMPS.q2, "h1-3": TIMESTAMPS.q3,
    "h1-4": TIMESTAMPS.q4, "h1-5": TIMESTAMPS.q5, "h1-6": TIMESTAMPS.q6,
    "h2-7": TIMESTAMPS.q7, "h2-8": TIMESTAMPS.q8, "h2-9": TIMESTAMPS.q9, "h2-10": TIMESTAMPS.q10,
    "h3-11": TIMESTAMPS.q11, "h3-12": TIMESTAMPS.q12, "h3-13": TIMESTAMPS.q13,
    "h3-14": TIMESTAMPS.q14, "h3-15": TIMESTAMPS.q15,
  };

  const jumpToQuestion = (questionId: string) => {
    const extra: Record<string, number> = {
      "beispiel-t1": TIMESTAMPS.teil1,
      "beispiel-t2": TIMESTAMPS.teil2,
      "beispiel-t3": TIMESTAMPS.teil3,
    };
    const ts = QUESTION_TIMESTAMPS[questionId] ?? extra[questionId];
    if (ts !== undefined && audioRef.current) {
      audioRef.current.currentTime = ts;
      audioRef.current.play().catch(() => {});
    }
  };

  // Beispiel soruları
  const BEISPIEL_TEIL1 = {
    id: "beispiel-1",
    number: 0,
    question: "Welche Zimmernummer hat Herr Schneider?",
    options: [{ id: "a", label: "Zimmer 2." }, { id: "b", label: "Zimmer 245." }, { id: "c", label: "Zimmer 254." }],
    correct: "c",
    audioTranscript: "Frau: Wo finde ich Herrn Schneider? Mann: Zimmer 254. Das ist im zweiten Stock.",
  };
  const BEISPIEL_TEIL2 = {
    id: "beispiel-2",
    number: 0,
    statement: "Die Reisende soll zur Information in Halle C kommen.",
    correct: "richtig",
    audioTranscript: "Frau Katrin Gundlach wird zum Informationsschalter in der Ankunftshalle C gebeten.",
  };
  const BEISPIEL_TEIL3 = {
    id: "beispiel-3",
    number: 0,
    question: "Beispiel: Nummer ist 11833?",
    options: [{ id: "a", label: "Richtig." }, { id: "b", label: "Falsch." }],
    correct: "a",
    audioTranscript: "Telefonansagedienst: Bitte rufen Sie die Auskunft an unter 11 8 33.",
  };

  const renderHoerenTeil = (
    tName: string,
    tNum: number,
    instructions: string,
    items: { id: string; number: number; question?: string; statement?: string; options?: { id: string; label: string }[]; audioTranscript: string; correct?: string }[],
    type: "abc" | "rf",
    beispiel?: { id: string; number: number; question?: string; statement?: string; options?: { id: string; label: string }[]; correct: string; audioTranscript: string }
  ) => (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <ProgressBar current={phase} />
        <TimerBar phase={phase} timerRunning={timerRunning} />

        {reviewMode && (
          <div className="mb-4 rounded-xl bg-amber-50 border border-amber-300 px-4 py-2 text-sm font-bold text-amber-700">
            📚 İnceleme Modu — Cevaplarınız kaydedilmeyecek
          </div>
        )}

        <SectionHeader section="Hören" teil={tName} />

        <div className="mb-6 rounded-xl bg-slate-100 p-4 text-sm text-slate-600">
          {instructions}
        </div>

        {/* Beispiel */}
        {beispiel && (
          <div className="mb-6 rounded-xl border-2 border-amber-200 bg-amber-50 p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded bg-amber-400 px-2 py-0.5 text-xs font-black text-white">BEISPIEL</span>
              <span className="font-bold text-slate-900">{beispiel.question || beispiel.statement}</span>
            </div>
            {reviewMode && (
              <div className="mb-3 flex items-center gap-2">
                <button
                  onClick={() => { if (audioRef.current) { audioRef.current.currentTime = TIMESTAMPS.teil1; audioRef.current.play().catch(() => {}); }}}
                  className="flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-xs font-bold text-white hover:bg-emerald-700"
                >▶ Sesi Oynat</button>
                <details className="flex-1">
                  <summary className="cursor-pointer text-xs font-bold text-slate-400 hover:text-slate-600">📄 Metni Gör</summary>
                  <p className="mt-1 text-xs italic text-slate-600">{beispiel.audioTranscript}</p>
                </details>
              </div>
            )}
            {beispiel.options && (
              <div className="space-y-2">
                {beispiel.options.map((opt) => (
                  <div
                    key={opt.id}
                    className={`flex items-center gap-3 rounded-lg border-2 p-3 text-sm ${
                      opt.id === beispiel.correct
                        ? "border-emerald-400 bg-emerald-50 text-emerald-800 font-semibold"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 text-xs font-bold">{opt.id}</span>
                    {opt.label}
                    {opt.id === beispiel.correct && <span className="ml-auto text-emerald-600 font-black">✓</span>}
                  </div>
                ))}
              </div>
            )}
            {!beispiel.options && (
              <div className="flex gap-2 mt-2">
                {["richtig", "falsch"].map((v) => (
                  <div key={v} className={`rounded border-2 px-4 py-2 text-sm font-bold ${v === beispiel.correct ? "border-emerald-400 bg-emerald-100 text-emerald-800" : "border-slate-200 bg-white text-slate-500"}`}>
                    {v === "richtig" ? "Richtig" : "Falsch"} {v === beispiel.correct ? "✓" : ""}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="space-y-6">
          {items.map((item) => {
            const userAnswer = answers[item.id];
            const isCorrect = reviewMode && item.correct && userAnswer === item.correct;
            const isWrong = reviewMode && item.correct && userAnswer && userAnswer !== item.correct;
            return (
              <div key={item.id} className={`rounded-xl border-2 bg-white p-5 ${
                isCorrect ? "border-emerald-400" : isWrong ? "border-rose-400" : "border-slate-200"
              }`}>
                <div className="mb-3 flex items-center gap-2">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black text-white ${
                    isCorrect ? "bg-emerald-500" : isWrong ? "bg-rose-500" : "bg-slate-900"
                  }`}>
                    {item.number}
                  </span>
                  <span className="font-bold text-slate-900">{item.question || item.statement}</span>
                  {isCorrect && <span className="ml-auto text-emerald-600 font-bold text-sm">✓ Doğru</span>}
                  {isWrong && <span className="ml-auto text-rose-600 font-bold text-sm">✗ Yanlış</span>}
                </div>

                {/* İnceleme modunda: ses ve metin */}
                {reviewMode && (
                  <div className="mb-3 flex items-center gap-2">
                    <button
                      onClick={() => jumpToQuestion(item.id)}
                      className="flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-xs font-bold text-white hover:bg-emerald-700"
                    >▶ Sesi Oynat</button>
                    <details className="flex-1">
                      <summary className="cursor-pointer text-xs font-bold text-slate-400 hover:text-slate-600">📄 Metni Gör</summary>
                      <p className="mt-1 text-xs italic text-slate-600">{item.audioTranscript}</p>
                    </details>
                  </div>
                )}

                {type === "abc" && item.options && (
                  <div className="space-y-2">
                    {item.options.map((opt) => {
                      const isSelected = userAnswer === opt.id;
                      const isRightOpt = reviewMode && item.correct === opt.id;
                      const isWrongOpt = reviewMode && isSelected && !isRightOpt;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => !reviewMode && setAnswer(item.id, opt.id)}
                          disabled={reviewMode}
                          className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left text-sm transition-all ${
                            isRightOpt ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold" :
                            isWrongOpt ? "border-rose-400 bg-rose-50 text-rose-700" :
                            isSelected ? "border-blue-600 bg-blue-600 text-white" :
                            "border-slate-200 bg-white text-slate-800 hover:border-blue-300"
                          }`}
                        >
                          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black uppercase ${
                            isRightOpt ? "border-emerald-600 text-emerald-700" :
                            isWrongOpt ? "border-rose-400 text-rose-600" :
                            isSelected ? "border-white text-white" : "border-slate-400 text-slate-500"
                          }`}>{opt.id}</span>
                          <span className="font-medium">{opt.label}</span>
                          {isRightOpt && <span className="ml-auto">✓</span>}
                          {isWrongOpt && <span className="ml-auto">✗</span>}
                        </button>
                      );
                    })}
                  </div>
                )}

                {type === "rf" && (
                  <div className="flex gap-3">
                    {(["richtig", "falsch"] as const).map((v) => {
                      const isSelected = userAnswer === v;
                      const isRight = reviewMode && item.correct === v;
                      const isWrongSel = reviewMode && isSelected && item.correct !== v;
                      return (
                        <button
                          key={v}
                          onClick={() => !reviewMode && setAnswer(item.id, v)}
                          disabled={reviewMode}
                          className={`min-w-[88px] rounded border-2 px-4 py-2 text-sm font-bold transition-all ${
                            isRight ? "border-emerald-500 bg-emerald-100 text-emerald-800" :
                            isWrongSel ? "border-rose-400 bg-rose-100 text-rose-700" :
                            isSelected ? "border-blue-600 bg-blue-600 text-white" :
                            "border-slate-300 bg-white text-slate-700 hover:border-slate-500"
                          }`}
                        >
                          {v === "richtig" ? "Richtig" : "Falsch"}
                          {isRight && " ✓"}{isWrongSel && " ✗"}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {reviewMode && (
          <div className="mt-8 flex justify-end">
            <button onClick={() => setPhase("result")} className="rounded-xl bg-slate-600 px-8 py-3 font-black text-white hover:bg-slate-700 transition-colors">
              ← Sonuca Dön
            </button>
          </div>
        )}
        {!reviewMode && (
          <div className="mt-8 rounded-xl bg-blue-50 border border-blue-200 p-4 text-center text-sm text-blue-600 font-semibold">
            🎧 Ses tamamlandığında bir sonraki bölüm otomatik başlar.
          </div>
        )}
      </div>
    </div>
  );

  const renderHoeren = () => (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <ProgressBar current={phase} />
        <TimerBar phase={phase} timerRunning={timerRunning} />

        {reviewMode && (
          <div className="mb-4 rounded-xl bg-amber-50 border border-amber-300 px-4 py-2 text-sm font-bold text-amber-700">
            📚 İnceleme Modu — Cevaplarınız kaydedilmeyecek
          </div>
        )}

        {!reviewMode && (
          <div className="mb-4 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-600 font-semibold">
            🎧 Ses çalıyor — Hören bölümü bitince Lesen otomatik başlar.
          </div>
        )}

        <SectionHeader section="Hören" duration="circa 20 Minuten" />

        {/* ── Teil 1 ── */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-lg bg-slate-900 px-3 py-1 text-sm font-black text-white">Teil 1</span>
            <span className="text-sm text-slate-500">Was ist richtig? Kreuzen Sie an: a, b oder c. Sie hören jeden Text zweimal.</span>
          </div>
          {/* Beispiel */}
          <div className="mb-4 rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded bg-amber-400 px-2 py-0.5 text-xs font-black text-white">BEISPIEL</span>
              <span className="font-bold text-slate-900">{BEISPIEL_TEIL1.question}</span>
            </div>
            {reviewMode && (
              <div className="mb-2 flex items-center gap-2">
                <button onClick={() => jumpToQuestion("beispiel-t1")} className="flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-xs font-bold text-white hover:bg-emerald-700">▶ Sesi Oynat</button>
                <details className="flex-1"><summary className="cursor-pointer text-xs font-bold text-slate-400">📄 Metni Gör</summary><p className="mt-1 text-xs italic text-slate-600">{BEISPIEL_TEIL1.audioTranscript}</p></details>
              </div>
            )}
            <div className="space-y-2">
              {BEISPIEL_TEIL1.options.map((opt) => (
                <div key={opt.id} className={`flex items-center gap-3 rounded-lg border-2 p-3 text-sm ${opt.id === BEISPIEL_TEIL1.correct ? "border-emerald-400 bg-emerald-50 text-emerald-800 font-semibold" : "border-slate-200 bg-white text-slate-700"}`}>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 text-xs font-bold">{opt.id}</span>
                  {opt.label}
                  {opt.id === BEISPIEL_TEIL1.correct && <span className="ml-auto text-emerald-600 font-black">✓</span>}
                </div>
              ))}
            </div>
          </div>
          {/* Sorular */}
          <div className="space-y-4">
            {HOEREN_TEIL1_QUESTIONS.map((item) => {
              const userAnswer = answers[item.id];
              const isCorrect = reviewMode && userAnswer === item.options.find(o => o.id === "c")?.id; // placeholder
              return (
                <div key={item.id} className={`rounded-xl border-2 bg-white p-5 ${reviewMode && userAnswer ? "border-slate-300" : "border-slate-200"}`}>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-black text-white">{item.number}</span>
                    <span className="font-bold text-slate-900">{item.question}</span>
                  </div>
                  {reviewMode && (
                    <div className="mb-3 flex items-center gap-2">
                      <button onClick={() => jumpToQuestion(item.id)} className="flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-xs font-bold text-white hover:bg-emerald-700">▶ Sesi Oynat</button>
                      <details className="flex-1"><summary className="cursor-pointer text-xs font-bold text-slate-400">📄 Metni Gör</summary><p className="mt-1 text-xs italic text-slate-600">{item.audioTranscript}</p></details>
                    </div>
                  )}
                  <div className="space-y-2">
                    {item.options.map((opt) => (
                      <ABCButton key={opt.id} id={opt.id} label={opt.label} selected={userAnswer === opt.id} onClick={() => !reviewMode && setAnswer(item.id, opt.id)} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Teil 2 ── */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-lg bg-slate-900 px-3 py-1 text-sm font-black text-white">Teil 2</span>
            <span className="text-sm text-slate-500">Kreuzen Sie an: Richtig oder Falsch. Sie hören jeden Text einmal.</span>
          </div>
          {/* Beispiel */}
          <div className="mb-4 rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded bg-amber-400 px-2 py-0.5 text-xs font-black text-white">BEISPIEL</span>
              <span className="font-bold text-slate-900">{BEISPIEL_TEIL2.statement}</span>
            </div>
            {reviewMode && (
              <div className="mb-2 flex items-center gap-2">
                <button onClick={() => { if (audioRef.current) { audioRef.current.currentTime = TIMESTAMPS.teil2; audioRef.current.play().catch(() => {}); }}} className="flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-xs font-bold text-white hover:bg-emerald-700">▶ Sesi Oynat</button>
                <details className="flex-1"><summary className="cursor-pointer text-xs font-bold text-slate-400">📄 Metni Gör</summary><p className="mt-1 text-xs italic text-slate-600">{BEISPIEL_TEIL2.audioTranscript}</p></details>
              </div>
            )}
            <div className="flex gap-2 mt-2">
              {(["richtig", "falsch"] as const).map((v) => (
                <div key={v} className={`rounded border-2 px-4 py-2 text-sm font-bold ${v === BEISPIEL_TEIL2.correct ? "border-emerald-400 bg-emerald-100 text-emerald-800" : "border-slate-200 bg-white text-slate-500"}`}>
                  {v === "richtig" ? "Richtig" : "Falsch"} {v === BEISPIEL_TEIL2.correct ? "✓" : ""}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {HOEREN_TEIL2_QUESTIONS.map((item) => {
              const userAnswer = answers[item.id];
              return (
                <div key={item.id} className="rounded-xl border-2 border-slate-200 bg-white p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-black text-white">{item.number}</span>
                    <span className="font-bold text-slate-900">{item.statement}</span>
                  </div>
                  {reviewMode && (
                    <div className="mb-3 flex items-center gap-2">
                      <button onClick={() => jumpToQuestion(item.id)} className="flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-xs font-bold text-white hover:bg-emerald-700">▶ Sesi Oynat</button>
                      <details className="flex-1"><summary className="cursor-pointer text-xs font-bold text-slate-400">📄 Metni Gör</summary><p className="mt-1 text-xs italic text-slate-600">{item.audioTranscript}</p></details>
                    </div>
                  )}
                  <div className="flex gap-3">
                    {(["richtig", "falsch"] as const).map((v) => (
                      <RFButton key={v} value={v} selected={userAnswer === v} onClick={() => !reviewMode && setAnswer(item.id, v)} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Teil 3 ── */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-lg bg-slate-900 px-3 py-1 text-sm font-black text-white">Teil 3</span>
            <span className="text-sm text-slate-500">Was ist richtig? Kreuzen Sie an: a, b oder c. Sie hören jeden Text zweimal.</span>
          </div>
          {/* Beispiel */}
          <div className="mb-4 rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded bg-amber-400 px-2 py-0.5 text-xs font-black text-white">BEISPIEL</span>
              <span className="font-bold text-slate-900">{BEISPIEL_TEIL3.question}</span>
            </div>
            {reviewMode && (
              <div className="mb-2 flex items-center gap-2">
                <button onClick={() => { if (audioRef.current) { audioRef.current.currentTime = TIMESTAMPS.teil3; audioRef.current.play().catch(() => {}); }}} className="flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-xs font-bold text-white hover:bg-emerald-700">▶ Sesi Oynat</button>
                <details className="flex-1"><summary className="cursor-pointer text-xs font-bold text-slate-400">📄 Metni Gör</summary><p className="mt-1 text-xs italic text-slate-600">{BEISPIEL_TEIL3.audioTranscript}</p></details>
              </div>
            )}
            <div className="space-y-2">
              {BEISPIEL_TEIL3.options.map((opt) => (
                <div key={opt.id} className={`flex items-center gap-3 rounded-lg border-2 p-3 text-sm ${opt.id === BEISPIEL_TEIL3.correct ? "border-emerald-400 bg-emerald-50 text-emerald-800 font-semibold" : "border-slate-200 bg-white text-slate-700"}`}>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 text-xs font-bold">{opt.id}</span>
                  {opt.label}
                  {opt.id === BEISPIEL_TEIL3.correct && <span className="ml-auto text-emerald-600 font-black">✓</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {HOEREN_TEIL3_QUESTIONS.map((item) => {
              const userAnswer = answers[item.id];
              return (
                <div key={item.id} className="rounded-xl border-2 border-slate-200 bg-white p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-black text-white">{item.number}</span>
                    <span className="font-bold text-slate-900">{item.question}</span>
                  </div>
                  {reviewMode && (
                    <div className="mb-3 flex items-center gap-2">
                      <button onClick={() => jumpToQuestion(item.id)} className="flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-xs font-bold text-white hover:bg-emerald-700">▶ Sesi Oynat</button>
                      <details className="flex-1"><summary className="cursor-pointer text-xs font-bold text-slate-400">📄 Metni Gör</summary><p className="mt-1 text-xs italic text-slate-600">{item.audioTranscript}</p></details>
                    </div>
                  )}
                  <div className="space-y-2">
                    {item.options.map((opt) => (
                      <ABCButton key={opt.id} id={opt.id} label={opt.label} selected={userAnswer === opt.id} onClick={() => !reviewMode && setAnswer(item.id, opt.id)} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {reviewMode && (
          <div className="mt-6 flex justify-end">
            <button onClick={() => setPhase("result")} className="rounded-xl bg-slate-600 px-8 py-3 font-black text-white hover:bg-slate-700 transition-colors">
              ← Sonuca Dön
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderLesenIntro = () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-lg">
        <SectionHeader section="Lesen" duration="circa 25 Minuten" />
        <div className="rounded-xl border-2 border-slate-200 bg-white p-6">
          <p className="mb-4 text-slate-700 leading-relaxed">
            Dieser Test hat <strong>drei Teile</strong>. Sie lesen kurze Briefe, Anzeigen etc.
            Zu jedem Text gibt es Aufgaben.
          </p>
          <p className="text-slate-700">Kreuzen Sie die richtige Lösung an.</p>
        </div>
        <button onClick={goNext} className="mt-6 w-full rounded-xl bg-blue-600 py-4 text-lg font-black text-white hover:bg-blue-700 transition-colors">
          Lesen beginnen →
        </button>
      </div>
    </div>
  );

  const renderLesenTeil1 = () => (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <ProgressBar current={phase} />
        <TimerBar phase={phase} timerRunning={timerRunning} />
        <SectionHeader section="Lesen" teil="Teil 1" />
        <div className="mb-6 rounded-xl bg-slate-100 p-4 text-sm text-slate-600">
          Lesen Sie die beiden Texte und die Aufgaben 1 bis 5. Kreuzen Sie an: <strong>Richtig</strong> oder <strong>Falsch</strong>.
        </div>

        {LESEN_TEIL1_TEXTS.map((text) => (
          <div key={text.id} className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <Badge color="bg-slate-900 text-white">{text.label}</Badge>
              <span className="text-sm text-slate-500">{text.sender}</span>
            </div>

            <div className="mb-5 rounded-xl border-2 border-slate-200 bg-white p-5">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-800">{text.content}</pre>
            </div>

            <div className="space-y-3">
              {text.questions.map((q) => (
                <div key={q.id} className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4">
                  <span className="text-sm text-slate-800 flex-1">{q.statement}</span>
                  <div className="flex gap-2 shrink-0">
                    <RFButton value="richtig" selected={answers[q.id] === "richtig"} onClick={() => setAnswer(q.id, "richtig")} />
                    <RFButton value="falsch" selected={answers[q.id] === "falsch"} onClick={() => setAnswer(q.id, "falsch")} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-6 flex justify-end">
          <button onClick={goNext} className="rounded-xl bg-blue-600 px-8 py-3 font-black text-white hover:bg-blue-700 transition-colors">
            Weiter → Teil 2
          </button>
        </div>
      </div>
    </div>
  );

  const renderLesenTeil2 = () => (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <ProgressBar current={phase} />
        <TimerBar phase={phase} timerRunning={timerRunning} />
        <SectionHeader section="Lesen" teil="Teil 2" />
        <div className="mb-6 rounded-xl bg-slate-100 p-4 text-sm text-slate-600">
          Lesen Sie die Texte und die Aufgaben 6 bis 10. Wo finden Sie Informationen? Kreuzen Sie an: <strong>a</strong> oder <strong>b</strong>.
        </div>

        <div className="space-y-8">
          {LESEN_TEIL2_ITEMS.map((item) => (
            <div key={item.id} className="rounded-xl border-2 border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-black text-white">
                  {item.number}
                </span>
                <p className="font-bold text-slate-900">{item.situation}</p>
              </div>

              <div className="mb-4 grid gap-3 md:grid-cols-2">
                {[
                  { key: "a" as const, opt: item.optionA },
                  { key: "b" as const, opt: item.optionB },
                ].map(({ key, opt }) => (
                  <button
                    key={key}
                    onClick={() => setAnswer(item.id, key)}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${
                      answers[item.id] === key
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 bg-slate-50 hover:border-blue-300"
                    }`}
                  >
                    <div className={`mb-2 text-xs font-black uppercase tracking-wider ${answers[item.id] === key ? "text-blue-100" : "text-blue-600"}`}>
                      {key.toUpperCase()} — {opt.label}
                    </div>
                    <pre className={`whitespace-pre-wrap font-sans text-xs leading-5 ${answers[item.id] === key ? "text-white" : "text-slate-600"}`}>
                      {opt.content}
                    </pre>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={goNext} className="rounded-xl bg-blue-600 px-8 py-3 font-black text-white hover:bg-blue-700 transition-colors">
            Weiter → Teil 3
          </button>
        </div>
      </div>
    </div>
  );

  const renderLesenTeil3 = () => (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <ProgressBar current={phase} />
        <TimerBar phase={phase} timerRunning={timerRunning} />
        <SectionHeader section="Lesen" teil="Teil 3" />
        <div className="mb-6 rounded-xl bg-slate-100 p-4 text-sm text-slate-600">
          Lesen Sie die Texte und die Aufgaben 11 bis 15. Kreuzen Sie an: <strong>Richtig</strong> oder <strong>Falsch</strong>.
        </div>

        <div className="space-y-6">
          {LESEN_TEIL3_ITEMS.map((item) => (
            <div key={item.id} className="rounded-xl border-2 border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-black text-white">
                  {item.number}
                </span>
                <span className="text-sm font-semibold text-slate-500 italic">{item.context}</span>
              </div>

              <div className="mb-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center">
                <pre className="whitespace-pre-wrap font-sans text-sm font-semibold leading-7 text-slate-800">
                  {item.sign}
                </pre>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-800 flex-1">{item.statement}</span>
                <div className="flex gap-2 shrink-0">
                  <RFButton value="richtig" selected={answers[item.id] === "richtig"} onClick={() => setAnswer(item.id, "richtig")} />
                  <RFButton value="falsch" selected={answers[item.id] === "falsch"} onClick={() => setAnswer(item.id, "falsch")} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={goNext} className="rounded-xl bg-blue-600 px-8 py-3 font-black text-white hover:bg-blue-700 transition-colors">
            Weiter → Schreiben
          </button>
        </div>
      </div>
    </div>
  );

  const renderSchreibenIntro = () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-lg">
        <SectionHeader section="Schreiben" duration="circa 20 Minuten" />
        <div className="rounded-xl border-2 border-slate-200 bg-white p-6">
          <p className="mb-4 text-slate-700">Dieser Test hat <strong>zwei Teile</strong>.</p>
          <p className="mb-2 text-slate-700">Sie füllen ein Formular aus und schreiben einen kurzen Text.</p>
          <p className="mt-4 text-sm text-slate-500">Wörterbücher sind nicht erlaubt.</p>
        </div>
        <button onClick={goNext} className="mt-6 w-full rounded-xl bg-blue-600 py-4 text-lg font-black text-white hover:bg-blue-700 transition-colors">
          Schreiben beginnen →
        </button>
      </div>
    </div>
  );

  const renderSchreibenTeil1 = () => (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <ProgressBar current={phase} />
        <TimerBar phase={phase} timerRunning={timerRunning} />
        <SectionHeader section="Schreiben" teil="Teil 1" />

        <div className="mb-6 rounded-xl bg-slate-100 p-4 text-sm text-slate-700 leading-relaxed">
          Ihre Freundin, Eva Kadavy, macht mit ihrem Mann und ihren beiden Söhnen (8 und 11 Jahre alt) Urlaub in Seeheim. Im Reisebüro bucht sie für den nächsten Sonntag eine Busfahrt um den Bodensee. Frau Kadavy hat keine Kreditkarte.
          <br /><br />
          In dem Formular fehlen fünf Informationen. Helfen Sie Ihrer Freundin und schreiben Sie die <strong>fünf fehlenden Informationen</strong> in das Formular.
        </div>

        <div className="rounded-xl border-2 border-slate-300 bg-white overflow-hidden">
          <div className="bg-slate-900 py-4 text-center text-white">
            <p className="text-xs uppercase tracking-widest text-slate-400">BODENSEE-RUNDFAHRT</p>
            <p className="text-xl font-black">Anmeldung</p>
          </div>

          <div className="p-6 space-y-0 divide-y divide-slate-100">
            {/* Prefilled */}
            {[
              { label: "Familienname, Vorname", value: "Kadavy, Eva", tag: "(0)" },
              { label: "Urlaubsadresse", value: "Hotel Schönblick", tag: "" },
              { label: "Straße, Hausnummer", value: "Burgstraße 34", tag: "" },
              { label: "PLZ", value: "78014", tag: "" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3 py-3">
                <span className="w-48 shrink-0 text-sm text-slate-500">{f.label}:</span>
                <span className="flex-1 rounded bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">{f.value}</span>
                {f.tag && <span className="text-xs text-slate-400">{f.tag}</span>}
              </div>
            ))}

            {/* Empty fields */}
            {SCHREIBEN_TEIL1_FIELDS.map((f) => (
              <div key={f.id} className="py-3">
                <div className="flex items-center gap-3">
                  <span className="w-48 shrink-0 text-sm text-slate-500">{f.label}:</span>
                  <div className="flex-1">
                    {f.type === "text" ? (
                      <input
                        type="text"
                        value={answers[f.id] || ""}
                        onChange={(e) => setAnswer(f.id, e.target.value)}
                        className="w-full rounded border-2 border-blue-300 px-3 py-1.5 text-sm focus:border-blue-600 focus:outline-none"
                        placeholder="Schreiben Sie hier..."
                      />
                    ) : (
                      <div className="flex gap-4">
                        {f.options?.map((opt) => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={answers[f.id] === opt}
                              onChange={() => setAnswer(f.id, answers[f.id] === opt ? "" : opt)}
                              className="h-4 w-4 rounded border-slate-300"
                            />
                            <span className="text-sm text-slate-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">({f.number})</span>
                </div>
              </div>
            ))}

            {/* Signature */}
            <div className="flex items-center gap-3 py-3">
              <span className="w-48 shrink-0 text-sm text-slate-500">Unterschrift:</span>
              <span className="flex-1 font-cursive text-lg italic text-slate-600">Eva Kadavy</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={goNext} className="rounded-xl bg-blue-600 px-8 py-3 font-black text-white hover:bg-blue-700 transition-colors">
            Weiter → Teil 2
          </button>
        </div>
      </div>
    </div>
  );

  const renderSchreibenTeil2 = () => (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <ProgressBar current={phase} />
        <TimerBar phase={phase} timerRunning={timerRunning} />
        <SectionHeader section="Schreiben" teil="Teil 2" />

        <div className="mb-6 rounded-xl bg-slate-100 p-5">
          <p className="mb-4 text-sm text-slate-700">
            Sie möchten im August Dresden besuchen. Schreiben Sie an die Touristeninformation:
          </p>
          <ul className="space-y-2">
            {["Warum schreiben Sie?", "Bitten Sie: Informationen über Filme, Museen usw. (Kulturprogramm).", "Fragen Sie: Hoteladressen?"].map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-3 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700">
          <strong>Hinweis:</strong> Schreiben Sie zu jedem Punkt ein bis zwei Sätze (<em>circa 30 Wörter</em>). Schreiben Sie auch eine Anrede und einen Gruß.
        </div>

        <div className="rounded-xl border-2 border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Ihr Text</span>
              <span className={`text-xs font-bold ${wordCount > 20 && wordCount < 50 ? "text-emerald-600" : "text-slate-400"}`}>
                {wordCount} Wörter {wordCount >= 25 && wordCount <= 40 ? "✓" : "(Ziel: ~30)"}
              </span>
            </div>
          </div>
          <textarea
            className="w-full p-4 text-sm leading-8 text-slate-800 focus:outline-none resize-none bg-white"
            rows={12}
            value={schreibenText}
            onChange={(e) => {
              setSchreibenText(e.target.value);
              setWordCount(e.target.value.trim().split(/\s+/).filter(Boolean).length);
            }}
            placeholder="Schreiben Sie Ihren Text hier (ca. 30 Wörter) ..."
            style={{
              backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e2e8f0 31px, #e2e8f0 32px)",
              backgroundAttachment: "local",
              lineHeight: "32px",
              paddingTop: "8px",
            }}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={goNext}
            className="rounded-xl bg-emerald-600 px-8 py-3 font-black text-white hover:bg-emerald-700 transition-colors"
          >
            Prüfung abschließen ✓
          </button>
        </div>
      </div>
    </div>
  );

  const renderResult = () => {
    const maxLesen = 15;
    const lesenPct = Math.round((lesenTotal / maxLesen) * 100);
    const s1Pct = Math.round((s1Score / 5) * 100);
    const hasSchreiben2 = schreibenText.trim().length > 10;

    const passed = lesenTotal >= 10 && s1Score >= 3;

    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 text-center">
            <div className="text-5xl mb-3">{passed ? "🎉" : "📋"}</div>
            <h1 className="text-3xl font-black text-slate-900">Ergebnis</h1>
            <p className="text-slate-500">Goethe-Zertifikat A1 – Start Deutsch 1</p>
          </div>

          <div className="space-y-4">
            {/* Lesen */}
            <div className="rounded-xl border-2 border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-black text-slate-900">Lesen</h3>
                <Badge color={lesenPct >= 60 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}>
                  {lesenTotal} / {maxLesen} — {lesenPct}%
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Teil 1 (5 Aufgaben)</span>
                  <span className="font-bold">{lt1Score} / 5</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Teil 2 (5 Aufgaben)</span>
                  <span className="font-bold">{lt2Score} / 5</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Teil 3 (5 Aufgaben)</span>
                  <span className="font-bold">{lt3Score} / 5</span>
                </div>
              </div>
              <div className="mt-3 h-3 rounded-full bg-slate-100">
                <div className={`h-3 rounded-full transition-all ${lesenPct >= 60 ? "bg-emerald-500" : "bg-rose-500"}`} style={{ width: `${lesenPct}%` }} />
              </div>
            </div>

            {/* Schreiben */}
            <div className="rounded-xl border-2 border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-black text-slate-900">Schreiben</h3>
                <Badge color={s1Score >= 3 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}>
                  Teil 1: {s1Score} / 5
                </Badge>
              </div>
              <p className="text-sm text-slate-500 mb-2">
                Teil 2 (Freitext): Manuell bewertet — {hasSchreiben2 ? `${wordCount} Wörter geschrieben` : "Nicht bearbeitet"}
              </p>
              {hasSchreiben2 && (
                <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700 italic">
                  {schreibenText}
                </div>
              )}
            </div>

            {/* Hören */}
            <div className="rounded-xl border-2 border-slate-200 bg-white p-5">
              <h3 className="mb-2 font-black text-slate-900">Hören</h3>
              <p className="text-sm text-slate-500">
                Ses dosyaları olmadan değerlendirilemez. Transkript üzerinden yapılan cevaplar kayıt edilmiştir.
              </p>
            </div>

            {/* Yorum */}
            <div className={`rounded-xl border-2 p-5 ${passed ? "border-emerald-300 bg-emerald-50" : "border-amber-300 bg-amber-50"}`}>
              <h3 className={`mb-2 font-black ${passed ? "text-emerald-800" : "text-amber-800"}`}>
                {passed ? "Gut gemacht! 🌟" : "Weiter üben! 💪"}
              </h3>
              <p className={`text-sm ${passed ? "text-emerald-700" : "text-amber-700"}`}>
                {passed
                  ? "Sie haben in den automatisch bewerteten Teilen gut abgeschnitten. Wiederholen Sie die Übung für bessere Resultate."
                  : "Üben Sie weiter! Besonders die schwächeren Bereiche sollten Sie noch einmal wiederholen."}
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => { setPhase("intro"); setAnswers({}); setSchreibenText(""); setWordCount(0); setReviewMode(false); }}
              className="flex-1 rounded-xl border-2 border-slate-300 py-3 font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Neu beginnen
            </button>
            <button
              onClick={() => { setReviewMode(true); setPhase("hoeren"); }}
              className="flex-1 rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700 transition-colors"
            >
              🎧 Hören İncele
            </button>
            <button
              onClick={() => { setReviewMode(false); setPhase("lesen-intro"); setAnswers({}); }}
              className="flex-1 rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 transition-colors"
            >
              Nur Lesen
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── Phase Router ───────────────────────────────────────────────────────────

  const HOEREN_TEIL1_QUESTIONS = [
    { id: "h1-1", number: 1, question: "Was kostet der Pullover?", options: [{ id: "a", label: "Dreißig Euro." }, { id: "b", label: "Fünfundneunzig Euro." }, { id: "c", label: "Neunzehn Euro fünfundneunzig Cent." }], audioTranscript: "Kunde: Entschuldigung, was kostet dieser Pullover? Da steht 30 Prozent billiger. Verkäuferin: Neunzehnfünfundneunzig. Kunde: 19,95 Euro? Verkäuferin: Ja, Euro natürlich." },
    { id: "h1-2", number: 2, question: "Wie spät ist es?", options: [{ id: "a", label: "15 Uhr." }, { id: "b", label: "Gleich 5 Uhr." }, { id: "c", label: "Halb 5 Uhr." }], audioTranscript: "Passant: Wie spät ist es bitte? Passantin: Jetzt ist es gleich 5 Uhr. Passant: Was, schon 5. Vielen Dank." },
    { id: "h1-3", number: 3, question: "Was isst die Frau im Restaurant?", options: [{ id: "a", label: "Pommes." }, { id: "b", label: "Fisch." }, { id: "c", label: "Wurst." }], audioTranscript: "Kellner: Was wünschen Sie? Gast: Ich esse kein Fleisch. Gibt es etwas ohne Fleisch? Kellner: Fisch oder Pommes. Gast: Dann wohl die Pommes." },
    { id: "h1-4", number: 4, question: "In welche Klasse geht Frau Hegers Sohn?", options: [{ id: "a", label: "In die neunte Klasse." }, { id: "b", label: "In die dritte Klasse." }, { id: "c", label: "In die vierte Klasse." }], audioTranscript: "Kollege: Wie alt ist Ihr Sohn? Kollegin: Neun Jahre, seit gestern. Kollege: Geht er schon zur Schule? Kollegin: Ja, schon in die dritte Klasse." },
    { id: "h1-5", number: 5, question: "Wie kommt die Frau in den 2. Stock?", options: [{ id: "a", label: "Mit dem Aufzug." }, { id: "b", label: "Auf der Treppe um die Ecke." }, { id: "c", label: "Mit der Rolltreppe." }], audioTranscript: "Kundin: Wie komme ich in den zweiten Stock? Die Rolltreppe ist kaputt. Verkäufer: Gehen Sie rechts um die Ecke und nehmen den Aufzug." },
    { id: "h1-6", number: 6, question: "Wohin fährt Herr Albers?", options: [{ id: "a", label: "In Urlaub ans Meer." }, { id: "b", label: "Zur Arbeit." }, { id: "c", label: "Zur Familie." }], audioTranscript: "Kollegin: Wohin fahren Sie denn? Kollege: Zu meinen Verwandten nach Polen. Kollegin: Na dann, schöne Zeit." },
  ];

  const HOEREN_TEIL2_QUESTIONS = [
    { id: "h2-7", number: 7, statement: "Die Kunden sollen die Weihnachtsfeier besuchen.", audioTranscript: "Liebe Kunden, zu Weihnachten bieten wir Ihnen Superpreise an. Besuchen Sie uns im 3. Stock. Frohe Weihnachten." },
    { id: "h2-8", number: 8, statement: "Die Fahrgäste sollen sich im Restaurant treffen.", audioTranscript: "Liebe Fahrgäste. An der nächsten Raststätte halten wir für eine Stunde. Wir treffen uns um halb eins am Bus, aber bitte pünktlich sein." },
    { id: "h2-9", number: 9, statement: "Die Fahrgäste sollen im Zug bleiben.", audioTranscript: "Liebe Fahrgäste! Das ist ein außerplanmäßiger Halt. Bitte hier nicht aussteigen. In ein paar Minuten erreichen wir Bahnhof Bonn." },
    { id: "h2-10", number: 10, statement: "Der Herr soll sofort zum Schalter kommen.", audioTranscript: "Herr Stefan Janda, gebucht nach Warschau, wird zum Schalter F7 gebeten. Der Flug wird in ein paar Minuten geschlossen." },
  ];

  const HOEREN_TEIL3_QUESTIONS = [
    { id: "h3-11", number: 11, question: "Die Nummer ist:", options: [{ id: "a", label: "11833." }, { id: "b", label: "11883." }, { id: "c", label: "12833." }], audioTranscript: "Die Rufnummer des Teilnehmers hat sich geändert. Bitte rufen Sie die Telefon-Auskunft an unter 11 8 33." },
    { id: "h3-12", number: 12, question: "Wo genau treffen sich die Männer?", options: [{ id: "a", label: "Am Zug." }, { id: "b", label: "Am Bahnhof." }, { id: "c", label: "An der Information." }], audioTranscript: "Hallo Jan, hier ist Boris. Ich bin noch im Zug. Du holst mich vom Bahnhof ab? Ich warte an der Information auf dich." },
    { id: "h3-13", number: 13, question: "Wie lange will der Mann noch warten?", options: [{ id: "a", label: "20 Minuten." }, { id: "b", label: "2 Minuten." }, { id: "c", label: "10 Minuten." }], audioTranscript: "Ich bin jetzt am Bahnhof. Ich warte schon über 20 Minuten auf dich. Zehn Minuten Zeit hast du noch, dann nehme ich ein Taxi." },
    { id: "h3-14", number: 14, question: "An welchem Tag will die Frau kommen?", options: [{ id: "a", label: "Am Montag." }, { id: "b", label: "Am Sonntag." }, { id: "c", label: "Am Samstag." }], audioTranscript: "Guten Tag, hier Rogalla. Wir können am Samstag leider nicht kommen. Am Sonntag haben wir aber Zeit. Rufen Sie uns zurück." },
    { id: "h3-15", number: 15, question: "Was ist kaputt?", options: [{ id: "a", label: "Der Fernseher." }, { id: "b", label: "Der Computer." }, { id: "c", label: "Das Handy." }], audioTranscript: "Hallo Alex. Kannst du kurz rüber kommen? Mein Computer hat einen Fehler. Ich kann nichts drucken." },
  ];

  return (
    <>
      {/* Global audio element — tüm Hören boyunca aktif */}
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" className="hidden" />
      {(() => {
        switch (phase) {
          case "intro": return renderIntro();
          case "hoeren-intro": return renderHoerenIntro();
          case "hoeren": return renderHoeren();
          case "lesen-intro": return renderLesenIntro();
          case "lesen-teil1": return renderLesenTeil1();
          case "lesen-teil2": return renderLesenTeil2();
          case "lesen-teil3": return renderLesenTeil3();
          case "schreiben-intro": return renderSchreibenIntro();
          case "schreiben-teil1": return renderSchreibenTeil1();
          case "schreiben-teil2": return renderSchreibenTeil2();
          case "result": return renderResult();
          default: return null;
        }
      })()}
    </>
  );
}