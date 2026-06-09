"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────
// TİPLER
// ─────────────────────────────────────────────
type Section = "intro" | "hoeren" | "lesen" | "schreiben" | "results";
type HoerenTeil = 1 | 2 | 3;

interface HoerenTeil1Question {
  id: number;
  question: string;
  options: { a: string; b: string; c: string };
  correct: "a" | "b" | "c";
  isBeispiel?: boolean;
}

interface HoerenTeil2Question {
  id: number;
  statement: string;
  correct: "richtig" | "falsch";
  isBeispiel?: boolean;
}

interface HoerenTeil3Question {
  id: number;
  question: string;
  options: { a: string; b: string; c: string };
  correct: "a" | "b" | "c";
}

interface LesenTeil1Question {
  id: number;
  statement: string;
  correct: "richtig" | "falsch";
  isBeispiel?: boolean;
}

interface LesenTeil2Question {
  id: number;
  scenario: string;
  optionA: { url: string; lines: string[] };
  optionB: { url: string; lines: string[] };
  correct: "a" | "b";
  isBeispiel?: boolean;
}

interface LesenTeil3Question {
  id: number;
  location: string;
  sign: string[];
  statement: string;
  correct: "richtig" | "falsch";
  isBeispiel?: boolean;
}

interface SchreibenTeil1Field {
  id: number;
  label: string;
  value: string;
  userAnswer: string;
  isBeispiel?: boolean;
  fieldType?: "text" | "checkbox";
  checkboxOptions?: string[];
}

// ─────────────────────────────────────────────
// SORU VERİLERİ
// ─────────────────────────────────────────────

const hoerenTeil1: HoerenTeil1Question[] = [
  {
    id: 0,
    question: "Welche Zimmernummer hat Herr Schneider?",
    options: { a: "54", b: "245", c: "254" },
    correct: "c",
    isBeispiel: true,
  },
  {
    id: 1,
    question: "Was kostet der Pullover?",
    options: { a: "€ 30,00", b: "€ 95,00", c: "€ 19,95" },
    correct: "c",
  },
  {
    id: 2,
    question: "Wie spät ist es?",
    options: { a: "15.00 Uhr", b: "Gleich 17.00 Uhr", c: "16.30 Uhr" },
    correct: "b",
  },
  {
    id: 3,
    question: "Was isst die Frau im Restaurant?",
    options: { a: "Pommes", b: "Fisch", c: "Wurst" },
    correct: "a",
  },
  {
    id: 4,
    question: "In welche Klasse geht Frau Hegers Sohn?",
    options: {
      a: "In die neunte Klasse",
      b: "In die dritte Klasse",
      c: "In die vierte Klasse",
    },
    correct: "b",
  },
  {
    id: 5,
    question: "Wie kommt die Frau in den 2. Stock?",
    options: {
      a: "Mit dem Aufzug",
      b: "Auf der Treppe um die Ecke",
      c: "Mit der Rolltreppe",
    },
    correct: "a",
  },
  {
    id: 6,
    question: "Wohin fährt Herr Albers?",
    options: {
      a: "In Urlaub ans Meer",
      b: "Zur Arbeit",
      c: "Zur Familie",
    },
    correct: "c",
  },
];

const hoerenTeil2: HoerenTeil2Question[] = [
  {
    id: 0,
    statement: "Die Reisende soll zur Information in Halle C kommen.",
    correct: "falsch",
    isBeispiel: true,
  },
  {
    id: 7,
    statement: "Die Kunden sollen die Weihnachtsfeier besuchen.",
    correct: "falsch",
  },
  {
    id: 8,
    statement: "Die Fahrgäste sollen sich im Restaurant treffen.",
    correct: "falsch",
  },
  {
    id: 9,
    statement: "Die Fahrgäste sollen im Zug bleiben.",
    correct: "richtig",
  },
  {
    id: 10,
    statement: "Der Herr soll sofort zum Schalter kommen.",
    correct: "richtig",
  },
];

const hoerenTeil3: HoerenTeil3Question[] = [
  {
    id: 11,
    question: "Die Nummer ist:",
    options: { a: "11833", b: "11883", c: "12833" },
    correct: "a",
  },
  {
    id: 12,
    question: "Wo genau treffen sich die Männer?",
    options: {
      a: "Am Zug",
      b: "Am Bahnhof",
      c: "An der Information",
    },
    correct: "c",
  },
  {
    id: 13,
    question: "Wie lange will der Mann noch warten?",
    options: { a: "20 Minuten", b: "2 Minuten", c: "10 Minuten" },
    correct: "c",
  },
  {
    id: 14,
    question: "An welchem Tag will die Frau kommen?",
    options: { a: "Am Montag", b: "Am Sonntag", c: "Am Samstag" },
    correct: "b",
  },
  {
    id: 15,
    question: "Was ist kaputt?",
    options: { a: "Der Fernseher", b: "Der Computer", c: "Das Handy" },
    correct: "b",
  },
];

// Hören transcriptleri (inceleme modu için)
const hoerenTranscripts: Record<number, string> = {
  1: `Kunde: Entschuldigung, was kostet dieser Pullover jetzt? Da steht 30 Prozent billiger.
Verkäuferin: Einen Moment bitte … neunzehnfünfundneunzig.
Kunde: 19,95 Euro?
Verkäuferin: Ja, Euro natürlich.
Kunde: Hm, … ok, den nehme ich.`,
  2: `Passant: Entschuldigen Sie bitte.
Passantin: Ja bitte.
Passant: Haben Sie eine Uhr? … Wie spät ist es bitte?
Passantin: Ja – jetzt ist es gleich 5 Uhr.
Passant: Was, schon 5. Vielen Dank, Wiedersehen.`,
  3: `Ober: Was wünschen Sie bitte?
Gast: Ich hätte gern die Salatplatte und ein…
Ober: Entschuldigung, die Salatplatte ist leider aus, aber die Bratwurst kann ich Ihnen empfehlen … ganz frisch heute.
Gast: Nein danke… ich esse kein Fleisch. Gibt es etwas ohne Fleisch?
Ober: Ja … nicht mehr viel: Fisch oder … Pommes.
Gast: Fisch … hm … Tja, dann wohl die Pommes.`,
  4: `Kollege: Haben Sie Kinder, Frau Heger?
Kollegin: Ja, einen Sohn.
Kollege: Und wie alt ist er?
Kollegin: Neun Jahre … seit gestern.
Kollege: Ah, dann geht er ja schon zur Schule?
Kollegin: Ja klar, schon in die dritte Klasse.`,
  5: `Kundin: Entschuldigen Sie, wie komme ich denn hier in den zweiten Stock? Die Rolltreppe da vorn ist kaputt.
Verkäuferin: Da gehen Sie hier rechts um die Ecke und nehmen den Aufzug.
Kundin: Um die Ecke rechts. Danke.`,
  6: `Kollegin: Guten Morgen, Herr Albers. So früh schon bei der Arbeit?
Kollege: Ja, ich habe noch viel zu tun. Morgen fahre ich doch für 3 Wochen weg.
Kollegin: Ach ja, das hab' ich vergessen. Wohin fahren Sie denn?
Kollege: Zu meinen Verwandten nach Polen.
Kollegin: Na dann … schöne Zeit.`,
  7: `Liebe Kunden, zu Weihnachten bieten wir Ihnen Superpreise an … z.B. erstklassiger italienischer Weißwein für 12 Euro 78 die Flasche oder exklusiver argentinischer Rotwein für 9 Euro 68. Besuchen Sie uns im 3. Stock. Frohe Weihnachten.`,
  8: `Liebe Fahrgäste. Wir sind kurz vor Würzburg. Sicherlich haben Sie schon Hunger. An der nächsten Raststätte halten wir für eine Stunde. Wir treffen uns wieder um halb eins Uhr am Bus, aber bitte pünktlich sein.`,
  9: `Liebe Fahrgäste! Bitte beachten Sie: Das ist ein außerplanmäßiger Halt. Bitte hier nicht aussteigen. In ein paar Minuten erreichen wir den Bahnhof Bonn – Bad Godesberg.`,
  10: `Herr Stefan Janda gebucht auf dem Flug LH 737 nach Warschau, wird zum Schalter F7 gebeten. Der Flug wird in ein paar Minuten geschlossen. Herr Janda gebucht nach Warschau bitte nach F7.`,
  11: `Telefonansagedienst der deutschen Telekom. Die Rufnummer des Teilnehmers hat sich geändert. Bitte rufen Sie die Telefon-Auskunft an unter 11 8 33.`,
  12: `Hallo Jan, hier ist Boris. Du, ich bin noch im Zug. Du holst mich doch vom Bahnhof ab? Ich warte an der Information auf dich.`,
  13: `Mensch Jan, du Penner, hier noch mal Boris. Ich bin jetzt am Bahnhof. Und du? Wo bist du denn? Ich warte schon über 20 Minuten auf dich. Zehn Minuten Zeit hast du noch … bis 2, dann nehme ich ein Taxi.`,
  14: `Guten Tag, hier Rogalla. Wir können am Samstag leider nicht zu Ihnen kommen. Am Sonntag haben wir aber Zeit. Rufen Sie uns doch bitte zurück, ob Ihnen das passt. Danke.`,
  15: `Hallo Alex. Walter hier. Kannst du schnell mal rüberkommen? Mein Computer hat einen Fehler. Ich kann nichts drucken. Melde dich doch bitte gleich, wenn du nach Hause kommst.`,
};

// Lesen Teil 1 - iki metin + sorular
const lesenTeil1Text1 = `Hallo Li,

danke für deine Mail. Dein Zug kommt hier in Hannover um 12.36 Uhr an. Ich bin ab 12.15 Uhr im Hauptbahnhof und warte auf dich vor der Auskunft.

Du kannst mich den ganzen Vormittag auf meinem Handy (++49 173 62 205 59) erreichen.

Deine Karin`;

const lesenTeil1Text2 = `Liebe Carmen, lieber José,

am kommenden Sonntag habe ich Geburtstag. Ich möchte gerne mit euch feiern und lade euch herzlich zu meiner Party am Samstagabend ein. Wir fangen um 21 Uhr an. Ist das okay für euch? Es werden eine ganze Menge Leute da sein, die ihr auch kennt. Könntet ihr vielleicht einen Salat mitbringen? Und vergesst bitte nicht einen Pullover oder eine Jacke! Wir wollen nämlich draußen im Garten feiern. Ich freue mich sehr auf euch!

Bis zum Wochenende
Ralf`;

const lesenTeil1Questions: LesenTeil1Question[] = [
  {
    id: 0,
    statement: "Lis Zug kommt aus Hannover.",
    correct: "falsch",
    isBeispiel: true,
  },
  {
    id: 1,
    statement: "Lis Zug kommt nach halb eins an.",
    correct: "richtig",
  },
  {
    id: 2,
    statement: "Karin wartet den ganzen Vormittag vor der Auskunft.",
    correct: "falsch",
  },
  {
    id: 3,
    statement: "Ralf hatte am letzten Wochenende Geburtstag.",
    correct: "falsch",
  },
  {
    id: 4,
    statement: "Ralf hat nur zwei oder drei Leute eingeladen.",
    correct: "falsch",
  },
  {
    id: 5,
    statement: "Die Party findet draußen statt.",
    correct: "richtig",
  },
];

const lesenTeil2Questions: LesenTeil2Question[] = [
  {
    id: 0,
    scenario: "Sie wollen wissen: Regnet es in Deutschland?",
    optionA: {
      url: "www.openair.de",
      lines: [
        "Open-Air Konzert am 30.5.",
        "findet bei Regen in der Stadthalle statt.",
        "Es gibt noch Karten zu kaufen!",
      ],
    },
    optionB: {
      url: "www.dwd.de",
      lines: [
        "Deutscher Wetterdienst",
        "Wetter und Klima",
        "– Wetter aktuell",
        "– Warnungen",
        "– Klimadaten",
      ],
    },
    correct: "b",
    isBeispiel: true,
  },
  {
    id: 6,
    scenario: "Sie möchten mit dem Schiff auf dem Rhein fahren. Wo bekommen Sie Informationen?",
    optionA: {
      url: "www.schiff-ruedesheim.de",
      lines: [
        "Hotel – Pension – Schiff",
        "Einzel- und Doppelzimmer mit Dusche/WC",
        "Restaurant mit Rhein-Terrasse",
      ],
    },
    optionB: {
      url: "www.bingen-ruedesheimer.de",
      lines: [
        "Bingen-Rüdesheimer Rheinschiffe",
        "täglich von Rüdesheim nach Koblenz",
        "alle Abfahrtszeiten und Preise hier",
      ],
    },
    correct: "b",
  },
  {
    id: 7,
    scenario: "Sie möchten Deutsch in Deutschland lernen. Wo finden Sie Informationen?",
    optionA: {
      url: "www.sprachenfuchs.de",
      lines: [
        "Sprachinstitut Fuchs – Dresden",
        "Deutsch – Englisch",
        "Französisch – Russisch",
        "> Die Kurse  > Kontakt",
      ],
    },
    optionB: {
      url: "www.eviva.com",
      lines: [
        "Eviva-Idiomas",
        "Sprachkurse für Deutsche",
        "Spanisch auf Mallorca, Englisch auf Malta",
      ],
    },
    correct: "a",
  },
  {
    id: 8,
    scenario: "Sie möchten ein Zugticket im Internet kaufen. Wo können Sie das?",
    optionA: {
      url: "www.DER.com",
      lines: [
        "Deutsches Reisebüro",
        "Ticketbestellungen für Flüge weltweit,",
        "Deutsche Bahn, Eurobus",
        "24-Stunden-Service",
      ],
    },
    optionB: {
      url: "www.RED.com",
      lines: [
        "Reisedienst GmbH",
        "Ticketservice für Theater, Konzerte,",
        "Busreisen in Deutschland und nach",
        "Polen, Tschechien und Ungarn",
      ],
    },
    correct: "a",
  },
  {
    id: 9,
    scenario: "Sie möchten Informationen über den Bodensee. Wo finden Sie das?",
    optionA: {
      url: "www.bodensee.de",
      lines: [
        "Touristeninformation BODENSEE",
        "Urlaubsorte – Hotelservice",
        "Ferienwohnungen – Rundreisen",
      ],
    },
    optionB: {
      url: "www.rottenmeier.de",
      lines: [
        "Hans Rottenmeier",
        "Ferienwohnungen am Bodensee",
        "Häuser – Preise – Kontakte",
      ],
    },
    correct: "a",
  },
  {
    id: 10,
    scenario: "Sie sind in Wiesbaden und möchten mit dem Zug am Mittag in Hamburg sein. Wo finden Sie den richtigen Zug?",
    optionA: {
      url: "www.reiseauskunft.bahn.de (a)",
      lines: [
        "ab Hamburg  17.02.  12:18  →  an Wiesbaden  16:52",
        "Dauer: 4:34 | Umstiege: 1 | ICE, S",
      ],
    },
    optionB: {
      url: "www.reiseauskunft.bahn.de (b)",
      lines: [
        "ab Wiesbaden  17.02.  07:34  →  an Hamburg  12:05",
        "Dauer: 4:31 | Umstiege: 1 | S, ICE",
      ],
    },
    correct: "b",
  },
];

const lesenTeil3Questions: LesenTeil3Question[] = [
  {
    id: 0,
    location: "An der Tür der Sprachschule",
    sign: ["Sprachenzentrum", "Das Sprachenzentrum ist umgezogen.", "Sie finden uns jetzt in der Beethovenstraße 23."],
    statement: "Zum Deutschlernen gehen Sie in die Beethovenstraße 23.",
    correct: "richtig",
    isBeispiel: true,
  },
  {
    id: 11,
    location: "In der Sprachschule",
    sign: [
      "In der 10-Uhr-Pause bekommen Sie an der Rezeption ein Frühstückspaket:",
      "belegte Brötchen und Getränke für 2 Euro.",
    ],
    statement: "In der Sprachschule können Sie etwas zu essen kaufen.",
    correct: "richtig",
  },
  {
    id: 12,
    location: "An der Post",
    sign: [
      "Öffnungszeiten:",
      "montags–freitags: 8.00–12.00 Uhr und 13.00–18.00 Uhr",
      "samstags: 8.00–12.00 Uhr",
    ],
    statement: "Es ist Samstagnachmittag. Sie können auf der Post Briefmarken kaufen.",
    correct: "falsch",
  },
  {
    id: 13,
    location: "Am Bahnhof",
    sign: ["Auf dem gesamten Bahnhof ist das Rauchen verboten."],
    statement: "Sie können hier Zigaretten rauchen.",
    correct: "falsch",
  },
  {
    id: 14,
    location: "Am Eingang des Restaurants",
    sign: [
      "Heute im Bavaria:",
      "Bayerischer Abend",
      "Brezeln, Weißwürste, Sauerkraut",
      "Volksmusik, ab 20 Uhr Tanz",
    ],
    statement: "Heute Abend können Sie in diesem Restaurant tanzen.",
    correct: "richtig",
  },
  {
    id: 15,
    location: "An der Haltestelle",
    sign: [
      "In der Neujahrsnacht",
      "Busverkehr bis 23.00 Uhr",
      "und von 1.00 Uhr bis 5.00 Uhr",
      "alle 30 Minuten",
    ],
    statement: "Von 23 Uhr bis 1 Uhr fährt kein Bus.",
    correct: "richtig",
  },
];

// Schreiben Teil 1 alanları
const schreibenTeil1Fields: SchreibenTeil1Field[] = [
  {
    id: 0,
    label: "Familienname, Vorname:",
    value: "Kadavy, Eva",
    userAnswer: "Kadavy, Eva",
    isBeispiel: true,
  },
  { id: 1, label: "Anzahl der Personen:", value: "4", userAnswer: "" },
  { id: 2, label: "Davon Kinder:", value: "2", userAnswer: "" },
  {
    id: 3,
    label: "PLZ, Urlaubsort:",
    value: "Seeheim",
    userAnswer: "",
  },
  {
    id: 4,
    label: "Zahlungsweise:",
    value: "Bar",
    userAnswer: "",
    fieldType: "checkbox",
    checkboxOptions: ["Bar", "Kreditkarte"],
  },
  {
    id: 5,
    label: "Reisetermin:",
    value: "Sonntag (nächsten Sonntag)",
    userAnswer: "",
  },
];

// ─────────────────────────────────────────────
// ANA COMPONENT
// ─────────────────────────────────────────────

export default function TelcA1Simulator() {
  const [section, setSection] = useState<Section>("intro");
  const [reviewMode, setReviewMode] = useState(false);

  // Hören answers
  const [hT1Answers, setHT1Answers] = useState<Record<number, string>>({});
  const [hT2Answers, setHT2Answers] = useState<Record<number, string>>({});
  const [hT3Answers, setHT3Answers] = useState<Record<number, string>>({});
  const [currentHoerenTeil, setCurrentHoerenTeil] = useState<HoerenTeil>(1);
  const [showTranscript, setShowTranscript] = useState<Record<number, boolean>>({});

  // Lesen answers
  const [lT1Answers, setLT1Answers] = useState<Record<number, string>>({});
  const [lT2Answers, setLT2Answers] = useState<Record<number, string>>({});
  const [lT3Answers, setLT3Answers] = useState<Record<number, string>>({});
  const [currentLesenTeil, setCurrentLesenTeil] = useState<1 | 2 | 3>(1);

  // Schreiben answers
  const [sTeil1Answers, setSTeil1Answers] = useState<Record<number, string>>({});
  const [sTeil2Text, setSTeil2Text] = useState("");
  const [currentSchreibenTeil, setCurrentSchreibenTeil] = useState<1 | 2>(1);

  // Ses oynatıcı
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [hoerenFinished, setHoerenFinished] = useState(false);

  // TELC A1 Hören timestamp'leri (saniye)
  // Yapı: Beispiel → T1: q1-6 (2x) → T2: q7-10 (1x) → T3: q11-15 (2x)
  const HOEREN_TIMESTAMPS: Record<string, number> = {
    beispiel: 4,
    t1_q1: 52,
    t1_q2: 112,
    t1_q3: 167,
    t1_q4: 232,
    t1_q5: 295,
    t1_q6: 358,
    t2_intro: 420,
    t2_beispiel: 435,
    t2_q7: 455,
    t2_q8: 510,
    t2_q9: 568,
    t2_q10: 625,
    t3_intro: 680,
    t3_q11: 720,
    t3_q12: 775,
    t3_q13: 835,
    t3_q14: 893,
    t3_q15: 950,
  };

  useEffect(() => {
    const audio = new Audio("/audio/telc-a1-hoeren.mp3");
    audioRef.current = audio;
    audio.oncanplaythrough = () => { setAudioReady(true); setAudioDuration(audio.duration); };
    audio.onerror = () => setAudioError(true);
    audio.ontimeupdate = () => setAudioTime(audio.currentTime);
    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => { setIsPlaying(false); setHoerenFinished(true); };
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  const playAudio = () => { audioRef.current?.play(); };
const pauseAudio = () => {};
const seekTo = (t: number) => {};
  const formatAudioTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Timer
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer setup per section
  useEffect(() => {
    if (section === "lesen") setTimeLeft(45 * 60);
    if (section === "schreiben") setTimeLeft(20 * 60);
  }, [section]);

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timerRunning, timeLeft]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // Puan hesaplama
  const calcScore = useCallback(() => {
    let correct = 0;
    let total = 0;

    // Hören Teil 1 (q1-6, 1pt each = 6pts)
    hoerenTeil1.filter((q) => !q.isBeispiel).forEach((q) => {
      total++;
      if (hT1Answers[q.id] === q.correct) correct++;
    });
    // Hören Teil 2 (q7-10, 1pt each = 4pts... but max 15 total for Hören)
    hoerenTeil2.filter((q) => !q.isBeispiel).forEach((q) => {
      total++;
      if (hT2Answers[q.id] === q.correct) correct++;
    });
    // Hören Teil 3 (q11-15, 1pt each = 5pts) → total Hören = 15
    hoerenTeil3.forEach((q) => {
      total++;
      if (hT3Answers[q.id] === q.correct) correct++;
    });
    // Lesen Teil 1 (q1-5 = 5pts)
    lesenTeil1Questions.filter((q) => !q.isBeispiel).forEach((q) => {
      total++;
      if (lT1Answers[q.id] === q.correct) correct++;
    });
    // Lesen Teil 2 (q6-10 = 5pts)
    lesenTeil2Questions.filter((q) => !q.isBeispiel).forEach((q) => {
      total++;
      if (lT2Answers[q.id] === q.correct) correct++;
    });
    // Lesen Teil 3 (q11-15 = 5pts) → total Lesen = 15
    lesenTeil3Questions.filter((q) => !q.isBeispiel).forEach((q) => {
      total++;
      if (lT3Answers[q.id] === q.correct) correct++;
    });
    // Schreiben Teil 1 (5 items = 5pts)
    schreibenTeil1Fields.filter((f) => !f.isBeispiel).forEach((f) => {
      total++;
      const ua = (sTeil1Answers[f.id] || "").trim().toLowerCase();
      const correct_val = f.value.toLowerCase();
      if (ua === correct_val || correct_val.includes(ua) && ua.length > 1) correct++;
    });
    // Schreiben Teil 2 → manual scoring, give 0 here
    total += 10; // max 10 for Teil 2, not auto-scored

    return { correct, total };
  }, [hT1Answers, hT2Answers, hT3Answers, lT1Answers, lT2Answers, lT3Answers, sTeil1Answers]);

  // ─── RENDER ───

  // Stil yardımcıları
  const answerBtnBase =
    "px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all duration-150 cursor-pointer text-left";
  const answerBtnNeutral = `${answerBtnBase} border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50`;
  const answerBtnSelected = `${answerBtnBase} border-blue-500 bg-blue-50 text-blue-800`;
  const answerBtnCorrect = `${answerBtnBase} border-green-500 bg-green-50 text-green-800`;
  const answerBtnWrong = `${answerBtnBase} border-red-400 bg-red-50 text-red-700`;

  function getAnswerStyle(
    qid: number,
    option: string,
    selectedAnswer: string | undefined,
    correctAnswer: string
  ) {
    if (!reviewMode) {
      return selectedAnswer === option ? answerBtnSelected : answerBtnNeutral;
    }
    if (option === correctAnswer) return answerBtnCorrect;
    if (selectedAnswer === option && option !== correctAnswer) return answerBtnWrong;
    return answerBtnNeutral;
  }

  function getRFStyle(
    qid: number,
    option: "richtig" | "falsch",
    selectedAnswer: string | undefined,
    correctAnswer: string
  ) {
    if (!reviewMode) {
      return selectedAnswer === option ? answerBtnSelected : answerBtnNeutral;
    }
    if (option === correctAnswer) return answerBtnCorrect;
    if (selectedAnswer === option && option !== correctAnswer) return answerBtnWrong;
    return answerBtnNeutral;
  }

  // ─── INTRO ───
  if (section === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">telc</span>
                <span className="text-white/80 text-sm">Start Deutsch 1</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Übungstest 1</h1>
              <p className="text-white/80 mt-1">Dijital Simülatör · A1 Seviyesi</p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { icon: "🎧", label: "Hören", sub: "~20 dk · 15 puan" },
                  { icon: "📖", label: "Lesen", sub: "~25 dk · 15 puan" },
                  { icon: "✏️", label: "Schreiben", sub: "~20 dk · 15 puan" },
                ].map((item) => (
                  <div key={item.label} className="bg-orange-50 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="font-bold text-gray-800 text-sm">{item.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.sub}</div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-sm text-green-800">
                <strong>🎧 Gerçek Sınav Sesi:</strong> Hören bölümünde TELC&apos;in orijinal ses kaydı çalacak. Sınav boyunca ses otomatik ilerler — tıpkı gerçek sınavdaki gibi.
              </div>

              <button
                onClick={() => {
                  setSection("hoeren");
                  setCurrentHoerenTeil(1);
                }}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 rounded-xl text-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg"
              >
                Sınava Başla →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── HÖREN ───
  if (section === "hoeren") {
    const progressPct = audioDuration > 0 ? (audioTime / audioDuration) * 100 : 0;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Nav */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎧</span>
                <div>
                  <div className="font-bold text-gray-800 text-sm">Hören · Teil {currentHoerenTeil}</div>
                  <div className="text-xs text-gray-500">ca. 20 Minuten</div>
                </div>
              </div>
              <div className="flex gap-2">
                {([1, 2, 3] as HoerenTeil[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setCurrentHoerenTeil(t)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      currentHoerenTeil === t
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Teil {t}
                  </button>
                ))}
              </div>
            </div>
            {/* Ses oynatıcı */}
            {audioError ? (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-xs text-red-700">
                ⚠️ Ses dosyası yüklenemedi. <code className="bg-red-100 px-1 rounded">public/audio/telc-a1-hoeren.mp3</code> kontrol edin.
              </div>
            ) : (
              <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <button
                  onClick={!isPlaying && !hoerenFinished ? playAudio : undefined}
                  disabled={!audioReady}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all shrink-0 ${
                    audioReady
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {!audioReady ? "⏳" : isPlaying ? "⏸" : "▶"}
                </button>
                <div className="flex-1">
                  <div
                    className="w-full h-2 bg-orange-100 rounded-full cursor-pointer relative"
                    onClick={undefined}
                  >
                    <div
                      className="h-2 bg-orange-500 rounded-full transition-all"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
                <div className="text-xs font-mono text-orange-700 shrink-0">
                  {formatAudioTime(audioTime)} / {formatAudioTime(audioDuration)}
                </div>
                {/* Teil atlama butonları */}
                
              </div>
            )}
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Teil 1 */}
          {currentHoerenTeil === 1 && (
            <div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-1">Hören, Teil 1</h2>
                <p className="text-gray-600 text-sm">Kreuzen Sie an: <strong>a</strong>, <strong>b</strong> oder <strong>c</strong>. Sie hören jeden Text zweimal.</p>
              </div>

              {hoerenTeil1.map((q) => (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl border p-6 mb-4 ${
                    q.isBeispiel ? "border-orange-200 bg-orange-50/30" : "border-gray-200"
                  }`}
                >
                  {q.isBeispiel && (
                    <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                      <span>Beispiel</span>
                    </div>
                  )}
                  {!q.isBeispiel && (
                    <div className="text-xs font-bold text-gray-400 mb-2">Aufgabe {q.id}</div>
                  )}

                  <p className="font-semibold text-gray-800 mb-4">{q.question}</p>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {(["a", "b", "c"] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          if (!reviewMode && !q.isBeispiel)
                            setHT1Answers((prev) => ({ ...prev, [q.id]: opt }));
                        }}
                        className={
                          q.isBeispiel
                            ? opt === q.correct
                              ? answerBtnCorrect
                              : answerBtnNeutral
                            : getAnswerStyle(q.id, opt, hT1Answers[q.id], q.correct)
                        }
                      >
                        <span className="text-xs font-bold text-gray-400 mr-1.5">{opt.toUpperCase()}</span>
                        {q.options[opt]}
                      </button>
                    ))}
                  </div>

                  {/* Ses & Transcript butonları */}
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() =>
                        setShowTranscript((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                      }
                      className="text-xs text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1"
                    >
                      📄 {showTranscript[q.id] ? "Metni Gizle" : "Metni Gör"}
                    </button>
                  </div>
                  {showTranscript[q.id] && (
                    <div className="mt-3 bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line font-mono border border-gray-200">
                      {hoerenTranscripts[q.id] || "Transcript mevcut değil."}
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={() => setCurrentHoerenTeil(2)}
                className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 transition-all"
              >
                Teil 2 →
              </button>
            </div>
          )}

          {/* Teil 2 */}
          {currentHoerenTeil === 2 && (
            <div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-1">Hören, Teil 2</h2>
                <p className="text-gray-600 text-sm">Kreuzen Sie an: <strong>Richtig (+)</strong> oder <strong>falsch (–)</strong>? Sie hören jeden Text einmal.</p>
              </div>

              {hoerenTeil2.map((q) => (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl border p-6 mb-4 ${
                    q.isBeispiel ? "border-orange-200 bg-orange-50/30" : "border-gray-200"
                  }`}
                >
                  {q.isBeispiel && (
                    <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                      Beispiel
                    </div>
                  )}
                  {!q.isBeispiel && (
                    <div className="text-xs font-bold text-gray-400 mb-2">Aufgabe {q.id}</div>
                  )}

                  <p className="font-semibold text-gray-800 mb-4">{q.statement}</p>

                  <div className="flex gap-3 mb-4">
                    {(["richtig", "falsch"] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          if (!reviewMode && !q.isBeispiel)
                            setHT2Answers((prev) => ({ ...prev, [q.id]: opt }));
                        }}
                        className={
                          q.isBeispiel
                            ? opt === q.correct
                              ? answerBtnCorrect
                              : answerBtnNeutral
                            : getRFStyle(q.id, opt, hT2Answers[q.id] as any, q.correct)
                        }
                      >
                        {opt === "richtig" ? "✓ Richtig" : "✗ Falsch"}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 items-center">
        
                    <button
                      onClick={() =>
                        setShowTranscript((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                      }
                      className="text-xs text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1"
                    >
                      📄 {showTranscript[q.id] ? "Metni Gizle" : "Metni Gör"}
                    </button>
                  </div>
                  {showTranscript[q.id] && (
                    <div className="mt-3 bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line font-mono border border-gray-200">
                      {hoerenTranscripts[q.id] || "Transcript mevcut değil."}
                    </div>
                  )}
                </div>
              ))}

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentHoerenTeil(1)}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-all"
                >
                  ← Teil 1
                </button>
                <button
                  onClick={() => setCurrentHoerenTeil(3)}
                  className="flex-1 bg-orange-500 text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 transition-all"
                >
                  Teil 3 →
                </button>
              </div>
            </div>
          )}

          {/* Teil 3 */}
          {currentHoerenTeil === 3 && (
            <div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-1">Hören, Teil 3</h2>
                <p className="text-gray-600 text-sm">Kreuzen Sie an: <strong>a</strong>, <strong>b</strong> oder <strong>c</strong>. Sie hören jeden Text zweimal.</p>
              </div>

              {hoerenTeil3.map((q) => (
                <div key={q.id} className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
                  <div className="text-xs font-bold text-gray-400 mb-2">Aufgabe {q.id}</div>
                  <p className="font-semibold text-gray-800 mb-4">{q.question}</p>

                  <div className="flex flex-col gap-2 mb-4">
                    {(["a", "b", "c"] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          if (!reviewMode)
                            setHT3Answers((prev) => ({ ...prev, [q.id]: opt }));
                        }}
                        className={getAnswerStyle(q.id, opt, hT3Answers[q.id], q.correct)}
                      >
                        <span className="text-xs font-bold text-gray-400 mr-2">{opt.toUpperCase()}</span>
                        {q.options[opt]}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 items-center">
            
                    <button
                      onClick={() =>
                        setShowTranscript((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                      }
                      className="text-xs text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1"
                    >
                      📄 {showTranscript[q.id] ? "Metni Gizle" : "Metni Gör"}
                    </button>
                  </div>
                  {showTranscript[q.id] && (
                    <div className="mt-3 bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line font-mono border border-gray-200">
                      {hoerenTranscripts[q.id] || "Transcript mevcut değil."}
                    </div>
                  )}
                </div>
              ))}

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentHoerenTeil(2)}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-all"
                >
                  ← Teil 2
                </button>
                <button
                  onClick={() => {
                    setSection("lesen");
                    setCurrentLesenTeil(1);
                    setTimerRunning(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3.5 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all"
                >
                  Lesen & Schreiben →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── LESEN ───
  if (section === "lesen") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Nav */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📖</span>
              <div>
                <div className="font-bold text-gray-800 text-sm">Lesen · Teil {currentLesenTeil}</div>
                <div className="text-xs text-gray-500">45 Minuten gesamt</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {timerRunning && (
                <div className={`font-mono font-bold text-sm px-3 py-1.5 rounded-lg ${
                  timeLeft < 300 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                }`}>
                  ⏱ {formatTime(timeLeft)}
                </div>
              )}
              <div className="flex gap-2">
                {([1, 2, 3] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setCurrentLesenTeil(t)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      currentLesenTeil === t
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    T{t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Teil 1 */}
          {currentLesenTeil === 1 && (
            <div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-1">Lesen, Teil 1</h2>
                <p className="text-gray-600 text-sm">Sind die Aussagen 1–5 richtig (+) oder falsch (–)? Kreuzen Sie an.</p>
              </div>

              {/* Text 1: E-Mail */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-4">
                <div className="bg-gray-100 px-5 py-2 flex items-center gap-2 border-b border-gray-200">
                  <div className="flex gap-1.5"><span className="w-3 h-3 rounded-full bg-red-400"/><span className="w-3 h-3 rounded-full bg-yellow-400"/><span className="w-3 h-3 rounded-full bg-green-400"/></div>
                  <span className="text-xs text-gray-500 ml-2">E-Mail von Karin</span>
                </div>
                <div className="p-6 text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                  {lesenTeil1Text1}
                </div>
              </div>

              {/* Sorular 1-2 */}
              {lesenTeil1Questions.slice(0, 3).map((q) => (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl border p-5 mb-3 ${
                    q.isBeispiel ? "border-blue-200 bg-blue-50/20" : "border-gray-200"
                  }`}
                >
                  {q.isBeispiel && (
                    <div className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                      Beispiel
                    </div>
                  )}
                  {!q.isBeispiel && <div className="text-xs font-bold text-gray-400 mb-1">Aufgabe {q.id}</div>}
                  <p className="font-medium text-gray-800 mb-3">{q.statement}</p>
                  <div className="flex gap-3">
                    {(["richtig", "falsch"] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          if (!reviewMode && !q.isBeispiel)
                            setLT1Answers((prev) => ({ ...prev, [q.id]: opt }));
                        }}
                        className={
                          q.isBeispiel
                            ? opt === q.correct
                              ? answerBtnCorrect
                              : answerBtnNeutral
                            : getRFStyle(q.id, opt, lT1Answers[q.id] as any, q.correct)
                        }
                      >
                        {opt === "richtig" ? "✓ Richtig" : "✗ Falsch"}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Text 2: Brief */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
                <div className="border border-gray-300 rounded-xl p-5 text-sm text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50">
                  {lesenTeil1Text2}
                </div>
              </div>

              {/* Sorular 3-5 */}
              {lesenTeil1Questions.slice(3).map((q) => (
                <div key={q.id} className="bg-white rounded-2xl border border-gray-200 p-5 mb-3">
                  <div className="text-xs font-bold text-gray-400 mb-1">Aufgabe {q.id}</div>
                  <p className="font-medium text-gray-800 mb-3">{q.statement}</p>
                  <div className="flex gap-3">
                    {(["richtig", "falsch"] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          if (!reviewMode)
                            setLT1Answers((prev) => ({ ...prev, [q.id]: opt }));
                        }}
                        className={getRFStyle(q.id, opt, lT1Answers[q.id] as any, q.correct)}
                      >
                        {opt === "richtig" ? "✓ Richtig" : "✗ Falsch"}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={() => setCurrentLesenTeil(2)}
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all"
              >
                Teil 2 →
              </button>
            </div>
          )}

          {/* Teil 2 */}
          {currentLesenTeil === 2 && (
            <div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-1">Lesen, Teil 2</h2>
                <p className="text-gray-600 text-sm">Lesen Sie die Texte und die Aufgaben 6–10. Welche Anzeige ist interessant für Sie? Kreuzen Sie an: <strong>a</strong> oder <strong>b</strong>?</p>
              </div>

              {lesenTeil2Questions.map((q) => (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl border p-6 mb-4 ${
                    q.isBeispiel ? "border-blue-200 bg-blue-50/20" : "border-gray-200"
                  }`}
                >
                  {q.isBeispiel && (
                    <div className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full mb-3">
                      Beispiel
                    </div>
                  )}
                  {!q.isBeispiel && <div className="text-xs font-bold text-gray-400 mb-2">Aufgabe {q.id}</div>}
                  <p className="font-semibold text-gray-800 mb-4">{q.scenario}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {(["a", "b"] as const).map((opt) => {
                      const website = opt === "a" ? q.optionA : q.optionB;
                      let btnClass = "border-2 rounded-xl p-4 text-left transition-all cursor-pointer ";
                      if (!reviewMode) {
                        const selected = q.isBeispiel ? q.correct : (opt === "a" ? lT2Answers[q.id] === "a" : lT2Answers[q.id] === "b") ? opt : undefined;
                        btnClass += (
                          q.isBeispiel
                            ? opt === q.correct
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 bg-gray-50"
                            : lT2Answers[q.id] === opt
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-gray-50 hover:border-blue-300"
                        );
                      } else {
                        btnClass += (
                          opt === q.correct
                            ? "border-green-500 bg-green-50"
                            : lT2Answers[q.id] === opt
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 bg-gray-50"
                        );
                      }
                      return (
                        <button
                          key={opt}
                          onClick={() => {
                            if (!reviewMode && !q.isBeispiel)
                              setLT2Answers((prev) => ({ ...prev, [q.id]: opt }));
                          }}
                          className={btnClass}
                        >
                          <div className="text-xs font-bold text-blue-600 mb-1.5">{website.url}</div>
                          {website.lines.map((line, i) => (
                            <div key={i} className="text-xs text-gray-700 leading-5">{line}</div>
                          ))}
                          <div className="mt-2 text-xs font-bold text-gray-400">{opt.toUpperCase()}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentLesenTeil(1)}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-all"
                >
                  ← Teil 1
                </button>
                <button
                  onClick={() => setCurrentLesenTeil(3)}
                  className="flex-1 bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all"
                >
                  Teil 3 →
                </button>
              </div>
            </div>
          )}

          {/* Teil 3 */}
          {currentLesenTeil === 3 && (
            <div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-1">Lesen, Teil 3</h2>
                <p className="text-gray-600 text-sm">Lesen Sie die Texte und die Aufgaben 11–15. Kreuzen Sie an: Richtig (+) oder falsch (–)?</p>
              </div>

              {lesenTeil3Questions.map((q) => (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl border p-5 mb-4 ${
                    q.isBeispiel ? "border-blue-200 bg-blue-50/20" : "border-gray-200"
                  }`}
                >
                  {q.isBeispiel && (
                    <div className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                      Beispiel
                    </div>
                  )}
                  {!q.isBeispiel && <div className="text-xs font-bold text-gray-400 mb-2">Aufgabe {q.id}</div>}
                  <div className="text-xs text-gray-500 font-medium mb-2">{q.location}</div>

                  {/* Sign */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 mb-4 bg-gray-50">
                    {q.sign.map((line, i) => (
                      <div key={i} className={`text-sm text-gray-800 ${i === 0 ? "font-bold" : ""} leading-6`}>
                        {line}
                      </div>
                    ))}
                  </div>

                  <p className="font-medium text-gray-800 mb-3">{q.statement}</p>

                  <div className="flex gap-3">
                    {(["richtig", "falsch"] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          if (!reviewMode && !q.isBeispiel)
                            setLT3Answers((prev) => ({ ...prev, [q.id]: opt }));
                        }}
                        className={
                          q.isBeispiel
                            ? opt === q.correct
                              ? answerBtnCorrect
                              : answerBtnNeutral
                            : getRFStyle(q.id, opt, lT3Answers[q.id] as any, q.correct)
                        }
                      >
                        {opt === "richtig" ? "✓ Richtig" : "✗ Falsch"}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentLesenTeil(2)}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-all"
                >
                  ← Teil 2
                </button>
                <button
                  onClick={() => {
                    setSection("schreiben");
                    setCurrentSchreibenTeil(1);
                    setTimeLeft(20 * 60);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  Schreiben →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── SCHREIBEN ───
  if (section === "schreiben") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Nav */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✏️</span>
              <div>
                <div className="font-bold text-gray-800 text-sm">Schreiben · Teil {currentSchreibenTeil}</div>
                <div className="text-xs text-gray-500">~20 Minuten</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {timerRunning && (
                <div className={`font-mono font-bold text-sm px-3 py-1.5 rounded-lg ${
                  timeLeft < 180 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                }`}>
                  ⏱ {formatTime(timeLeft)}
                </div>
              )}
              <div className="flex gap-2">
                {([1, 2] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setCurrentSchreibenTeil(t)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      currentSchreibenTeil === t
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    T{t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Teil 1 */}
          {currentSchreibenTeil === 1 && (
            <div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Schreiben, Teil 1</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Ihre Freundin, Eva Kadavy, macht mit ihrem Mann und ihren beiden Söhnen (8 und 11 Jahre alt) Urlaub in Seeheim. Im Reisebüro bucht sie für den nächsten Sonntag eine Busfahrt um den Bodensee. Frau Kadavy hat keine Kreditkarte. Schreiben Sie die fünf fehlenden Informationen in das Formular.
                </p>
              </div>

              {/* Form */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 text-center">
                  <div className="text-white font-bold text-lg tracking-wide">BODENSEE-RUNDFAHRT</div>
                  <div className="text-white/80 text-sm">Anmeldung</div>
                </div>
                <div className="p-6 space-y-4">
                  {schreibenTeil1Fields.map((field) => (
                    <div key={field.id} className="flex items-start gap-4">
                      <div className="w-52 text-sm text-gray-600 pt-2 shrink-0">{field.label}</div>
                      <div className="flex-1 flex items-center gap-3">
                        {field.isBeispiel ? (
                          <div className="flex-1 border-b-2 border-gray-300 text-sm text-gray-700 pb-1 font-medium">
                            {field.value}
                          </div>
                        ) : field.fieldType === "checkbox" ? (
                          <div className="flex gap-4">
                            {field.checkboxOptions?.map((opt) => (
                              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                <div
                                  onClick={() => {
                                    if (!reviewMode)
                                      setSTeil1Answers((prev) => ({ ...prev, [field.id]: opt }));
                                  }}
                                  className={`w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer transition-all ${
                                    reviewMode
                                      ? opt.toLowerCase() === field.value.toLowerCase()
                                        ? "border-green-500 bg-green-100"
                                        : sTeil1Answers[field.id] === opt
                                        ? "border-red-400 bg-red-50"
                                        : "border-gray-300"
                                      : sTeil1Answers[field.id] === opt
                                      ? "border-indigo-500 bg-indigo-100"
                                      : "border-gray-300 hover:border-indigo-300"
                                  }`}
                                >
                                  {sTeil1Answers[field.id] === opt && <span className="text-xs">✓</span>}
                                </div>
                                <span className="text-sm text-gray-700">{opt}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={sTeil1Answers[field.id] || ""}
                            onChange={(e) => {
                              if (!reviewMode)
                                setSTeil1Answers((prev) => ({ ...prev, [field.id]: e.target.value }));
                            }}
                            placeholder="Ihre Antwort..."
                            className={`flex-1 border-b-2 text-sm pb-1 outline-none transition-all bg-transparent ${
                              reviewMode
                                ? (sTeil1Answers[field.id] || "").trim().toLowerCase().includes(field.value.toLowerCase().split("/")[0].trim())
                                  ? "border-green-500 text-green-700"
                                  : "border-red-400 text-red-600"
                                : "border-gray-300 focus:border-indigo-500 text-gray-800"
                            }`}
                          />
                        )}
                        {reviewMode && !field.isBeispiel && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg whitespace-nowrap">
                            ✓ {field.value}
                          </span>
                        )}
                        {field.isBeispiel && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Beispiel (0)</span>
                        )}
                        {!field.isBeispiel && (
                          <span className="text-xs text-gray-400 font-bold">{field.id}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setCurrentSchreibenTeil(2)}
                className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all"
              >
                Teil 2 →
              </button>
            </div>
          )}

          {/* Teil 2 */}
          {currentSchreibenTeil === 2 && (
            <div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Schreiben, Teil 2</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Schreiben Sie an die Touristeninformation in Dresden:
                </p>
                <ul className="space-y-2 mb-4">
                  {[
                    "Sie kommen im August nach Dresden.",
                    "Bitten Sie um Informationen über Film, Theater, Museen usw. (Kulturprogramm).",
                    "Bitten Sie um Hoteladressen.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-indigo-500 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                  Schreiben Sie zu jedem Punkt ein bis zwei Sätze (circa 30 Wörter). Vergessen Sie nicht den passenden Anfang und Gruß am Schluss.
                </div>
              </div>

              {/* Yazı alanı — çizgili kağıt efekti */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
                <div className="px-6 py-3 bg-indigo-50 border-b border-indigo-100">
                  <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide">An die Touristeninformation Dresden</div>
                </div>
                <div
                  className="relative p-6"
                  style={{
                    backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 31px, #e5e7eb 32px)",
                    backgroundPosition: "0 24px",
                  }}
                >
                  <textarea
                    value={sTeil2Text}
                    onChange={(e) => setSTeil2Text(e.target.value)}
                    placeholder="Sehr geehrte Damen und Herren,&#10;&#10;..."
                    rows={8}
                    className="w-full bg-transparent outline-none text-sm text-gray-800 resize-none leading-8 relative z-10"
                  />
                </div>
                <div className="px-6 py-2 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {sTeil2Text.split(/\s+/).filter(Boolean).length} Wörter
                  </span>
                  <span className={`text-xs font-medium ${
                    sTeil2Text.split(/\s+/).filter(Boolean).length >= 25
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}>
                    Ziel: ~30 Wörter
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentSchreibenTeil(1)}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-all"
                >
                  ← Teil 1
                </button>
                <button
                  onClick={() => {
                    setReviewMode(true);
                    setSection("results");
                    setTimerRunning(false);
                  }}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Sınavı Bitir & Sonuçları Gör →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── RESULTS ───
  if (section === "results") {
    const { correct, total } = calcScore();
    const hoerenCorrect = [
      ...hoerenTeil1.filter((q) => !q.isBeispiel).map((q) => hT1Answers[q.id] === q.correct),
      ...hoerenTeil2.filter((q) => !q.isBeispiel).map((q) => hT2Answers[q.id] === q.correct),
      ...hoerenTeil3.map((q) => hT3Answers[q.id] === q.correct),
    ].filter(Boolean).length;
    const lesenCorrect = [
      ...lesenTeil1Questions.filter((q) => !q.isBeispiel).map((q) => lT1Answers[q.id] === q.correct),
      ...lesenTeil2Questions.filter((q) => !q.isBeispiel).map((q) => lT2Answers[q.id] === q.correct),
      ...lesenTeil3Questions.filter((q) => !q.isBeispiel).map((q) => lT3Answers[q.id] === q.correct),
    ].filter(Boolean).length;
    const schreibenAutoScore = schreibenTeil1Fields
      .filter((f) => !f.isBeispiel)
      .filter((f) => {
        const ua = (sTeil1Answers[f.id] || "").trim().toLowerCase();
        return ua && f.value.toLowerCase().split("/").some((v) => v.trim().includes(ua) || ua.includes(v.trim()));
      }).length;

    const totalAuto = hoerenCorrect + lesenCorrect + schreibenAutoScore;
    const maxAuto = 15 + 15 + 5; // Hören + Lesen + Schreiben Teil 1

    let praedikat = "";
    let praedikatColor = "";
    if (hoerenCorrect + lesenCorrect >= 24) {
      praedikat = "sehr gut";
      praedikatColor = "text-green-600";
    } else if (hoerenCorrect + lesenCorrect >= 20) {
      praedikat = "gut";
      praedikatColor = "text-blue-600";
    } else if (hoerenCorrect + lesenCorrect >= 16) {
      praedikat = "befriedigend";
      praedikatColor = "text-yellow-600";
    } else {
      praedikat = "noch üben";
      praedikatColor = "text-orange-600";
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
        <div className="max-w-2xl mx-auto py-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-center">
              <div className="text-5xl mb-3">🎉</div>
              <h1 className="text-2xl font-bold text-white">Sınav Tamamlandı!</h1>
              <p className="text-white/70 text-sm mt-1">TELC Deutsch A1 · Übungstest 1</p>
            </div>

            <div className="p-8">
              {/* Score grid */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Hören", score: hoerenCorrect, max: 15, icon: "🎧", color: "orange" },
                  { label: "Lesen", score: lesenCorrect, max: 15, icon: "📖", color: "blue" },
                  { label: "Schreiben T1", score: schreibenAutoScore, max: 5, icon: "✏️", color: "indigo" },
                ].map((item) => (
                  <div key={item.label} className={`bg-${item.color}-50 border border-${item.color}-100 rounded-xl p-4 text-center`}>
                    <div className="text-xl mb-1">{item.icon}</div>
                    <div className="text-2xl font-bold text-gray-800">{item.score}<span className="text-sm text-gray-400">/{item.max}</span></div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Toplam */}
              <div className="bg-gray-50 rounded-xl p-5 text-center mb-6">
                <div className="text-sm text-gray-500 mb-1">Otomatik puanlanan toplam</div>
                <div className="text-4xl font-bold text-gray-800">{totalAuto}<span className="text-lg text-gray-400">/{maxAuto}</span></div>
                <div className={`text-lg font-bold mt-2 ${praedikatColor}`}>{praedikat}</div>
                <div className="text-xs text-gray-400 mt-1">Schreiben Teil 2 manuel değerlendirme gerektirir (+10 puan)</div>
              </div>

              {/* Cevap anahtarı */}
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                <div className="bg-gray-50 px-5 py-3 font-bold text-sm text-gray-700">Cevap Anahtarı</div>
                <div className="p-5 grid grid-cols-3 gap-6 text-sm">
                  <div>
                    <div className="font-bold text-orange-600 mb-2">🎧 Hören</div>
                    {[...hoerenTeil1.filter(q=>!q.isBeispiel), ...hoerenTeil2.filter(q=>!q.isBeispiel), ...hoerenTeil3].map((q: any) => {
                      const userAns = q.id <= 6 ? hT1Answers[q.id] : q.id <= 10 ? hT2Answers[q.id] : hT3Answers[q.id];
                      const isCorrect = userAns === q.correct;
                      return (
                        <div key={q.id} className="flex justify-between items-center py-0.5">
                          <span className="text-gray-500">{q.id}.</span>
                          <span className={`font-bold ${isCorrect ? "text-green-600" : "text-red-500"}`}>
                            {isCorrect ? "✓" : "✗"} {q.correct}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    <div className="font-bold text-blue-600 mb-2">📖 Lesen</div>
                    {[...lesenTeil1Questions.filter(q=>!q.isBeispiel), ...lesenTeil2Questions.filter(q=>!q.isBeispiel), ...lesenTeil3Questions.filter(q=>!q.isBeispiel)].map((q: any) => {
                      const userAns = q.id <= 5 ? lT1Answers[q.id] : q.id <= 10 ? lT2Answers[q.id] : lT3Answers[q.id];
                      const isCorrect = userAns === q.correct;
                      return (
                        <div key={q.id} className="flex justify-between items-center py-0.5">
                          <span className="text-gray-500">{q.id}.</span>
                          <span className={`font-bold ${isCorrect ? "text-green-600" : "text-red-500"}`}>
                            {isCorrect ? "✓" : "✗"} {q.correct}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    <div className="font-bold text-indigo-600 mb-2">✏️ Schreiben T1</div>
                    {schreibenTeil1Fields.filter(f=>!f.isBeispiel).map((f) => {
                      const ua = (sTeil1Answers[f.id] || "").trim();
                      const isOk = ua && f.value.toLowerCase().split("/").some((v) => v.trim().includes(ua.toLowerCase()) || ua.toLowerCase().includes(v.trim()));
                      return (
                        <div key={f.id} className="py-0.5">
                          <div className="flex justify-between">
                            <span className="text-gray-500">{f.id}.</span>
                            <span className={`font-bold text-xs ${isOk ? "text-green-600" : "text-red-500"}`}>
                              {isOk ? "✓" : "✗"}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">{f.value}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setReviewMode(true);
                    setSection("hoeren");
                    setCurrentHoerenTeil(1);
                  }}
                  className="flex-1 bg-orange-100 text-orange-700 font-bold py-3 rounded-xl hover:bg-orange-200 transition-all text-sm"
                >
                  🎧 Hören İncele
                </button>
                <button
                  onClick={() => {
                    setReviewMode(true);
                    setSection("lesen");
                    setCurrentLesenTeil(1);
                  }}
                  className="flex-1 bg-blue-100 text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-200 transition-all text-sm"
                >
                  📖 Lesen İncele
                </button>
              </div>
              <button
                onClick={() => {
                  // Reset
                  setHT1Answers({});
                  setHT2Answers({});
                  setHT3Answers({});
                  setLT1Answers({});
                  setLT2Answers({});
                  setLT3Answers({});
                  setSTeil1Answers({});
                  setSTeil2Text("");
                  setReviewMode(false);
                  setSection("intro");
                }}
                className="w-full mt-3 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all text-sm"
              >
                🔄 Tekrar Başla
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}