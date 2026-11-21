// Sınav Hazırlık → telc Deutsch A2 → Lesen
// telc Deutsch A2 Übungstest 1 formatı birebir örnek alınarak hazırlanmış özgün alıştırmalar.
//   Teil 1: Bilgi panosu (kat / oda rehberi) + 5 görev, a / b / c (c = "anderes Stockwerk").
//   Teil 2: Kısa gazete haberi + 5 cümle, richtig (+) / falsch (–).
//   Teil 3: 8 ilan (a–h) + 5 durum; bir durumun ilanı yok → X.
// Her sette ayrıca cevaplı bir "Beispiel 0" vardır (gerçek sınavdaki gibi).

export type TelcA2Teil1Option = { key: "a" | "b" | "c"; text: string };

export type TelcA2Teil1Task = {
  id: number;
  situation: string;
  options: TelcA2Teil1Option[];
  answer: "a" | "b" | "c";
  explanation: string;
};

export type TelcA2Teil1Set = {
  id: string;
  title: string;
  board: { title: string; floors: { label: string; items: string }[] };
  example: TelcA2Teil1Task;
  tasks: TelcA2Teil1Task[];
};

export type TelcA2Teil2Task = {
  id: number;
  statement: string;
  answer: "richtig" | "falsch";
  explanation: string;
};

export type TelcA2Teil2Set = {
  id: string;
  title: string;
  article: { headline: string; paragraphs: string[]; source?: string };
  example: TelcA2Teil2Task;
  tasks: TelcA2Teil2Task[];
};

export type TelcA2Teil3Ad = { key: string; title: string; lines: string[] };

export type TelcA2Teil3Task = {
  id: number;
  situation: string;
  answer: string; // "a"–"h" veya "x"
  explanation: string;
};

export type TelcA2Teil3Set = {
  id: string;
  title: string;
  ads: TelcA2Teil3Ad[];
  example?: TelcA2Teil3Task;
  tasks: TelcA2Teil3Task[];
};

export const TELC_A2_LESEN_INSTRUCTIONS = {
  teil1: {
    de: ["Lesen Sie die Aufgaben 1–5 und die Information.", "Kreuzen Sie an: a, b oder c."],
    tr: "Önce görevleri, sonra bilgi panosunu okuyun. Aradığınız şey seçeneklerdeki katlardan birinde değilse c (anderes Stockwerk) doğrudur.",
  },
  teil2: {
    de: ["Lesen Sie den Text und die Aufgaben 6–10.", "Sind die Aussagen richtig (+) oder falsch (–)?", "Kreuzen Sie an."],
    tr: "Metni okuyun. Cümle metindeki bilgiyle aynıysa richtig (+), farklıysa falsch (–) işaretleyin.",
  },
  teil3: {
    de: [
      "Lesen Sie die Anzeigen a–h und die Aufgaben 11–15.",
      "Welche Anzeige passt zu welcher Situation?",
      "Für eine Aufgabe gibt es keine Lösung. Schreiben Sie hier den Buchstaben X.",
    ],
    tr: "Her duruma uyan ilanı seçin. Her ilan en fazla bir kez kullanılır. Bir durum için uygun ilan yoktur → X.",
  },
};

const opt = (a: string, b: string, c = "anderes Stockwerk"): TelcA2Teil1Option[] => [
  { key: "a", text: a },
  { key: "b", text: b },
  { key: "c", text: c },
];

// ───────────────────────────── TEIL 1 ─────────────────────────────

export const TELC_A2_TEIL1_SETS: TelcA2Teil1Set[] = [
  {
    id: "t1-1",
    title: "Einkaufszentrum City-Center",
    board: {
      title: "Einkaufszentrum City-Center",
      floors: [
        { label: "3. Stock", items: "Restaurants / Café / Kinderspielplatz / Toiletten / Fundbüro / Kundenservice" },
        { label: "2. Stock", items: "Elektro / Handys und Zubehör / Computer / Spielwaren / Bücher / Schreibwaren" },
        { label: "1. Stock", items: "Damenmode / Herrenmode / Schuhe / Sportbekleidung / Taschen / Uhren und Schmuck" },
        { label: "Erdgeschoss", items: "Bäckerei / Apotheke / Blumen / Information / Post und Paketannahme / Geldautomat" },
        { label: "Untergeschoss", items: "Supermarkt / Getränkemarkt / Drogerie / Parkplätze" },
      ],
    },
    example: {
      id: 0,
      situation: "Sie möchten frische Brötchen kaufen.",
      options: opt("Erdgeschoss", "1. Stock"),
      answer: "a",
      explanation: "Bäckerei → Erdgeschoss.",
    },
    tasks: [
      { id: 1, situation: "Sie brauchen ein neues Ladekabel für Ihr Handy.", options: opt("Untergeschoss", "2. Stock"), answer: "b", explanation: "Handys und Zubehör → 2. Stock. Ladekabel bir aksesuardır (Zubehör)." },
      { id: 2, situation: "Ihr Sohn hat gestern im City-Center seine Jacke vergessen.", options: opt("Erdgeschoss", "1. Stock"), answer: "c", explanation: "Kaybolan / unutulan eşyalar → Fundbüro (3. Stock). Seçeneklerde yok → c. Dikkat: Mode 1. Stock'ta ama ceketi satın almıyorsunuz!" },
      { id: 3, situation: "Sie möchten Wasser und Saft für eine Party kaufen.", options: opt("Erdgeschoss", "3. Stock"), answer: "c", explanation: "Getränkemarkt → Untergeschoss. Seçeneklerde yok → c." },
      { id: 4, situation: "Sie möchten Ihrer Mutter einen Blumenstrauß schenken.", options: opt("Erdgeschoss", "1. Stock"), answer: "a", explanation: "Blumen → Erdgeschoss." },
      { id: 5, situation: "Sie suchen neue Laufschuhe für das Fitnessstudio.", options: opt("1. Stock", "2. Stock"), answer: "a", explanation: "Schuhe / Sportbekleidung → 1. Stock." },
    ],
  },
  {
    id: "t1-2",
    title: "Ärztehaus am Marktplatz",
    board: {
      title: "Ärztehaus am Marktplatz",
      floors: [
        { label: "4. Stock", items: "Dipl.-Psych. S. Roth, Psychotherapie / Ernährungsberatung „Gesund essen“" },
        { label: "3. Stock", items: "Dr. M. Becker, Hals-Nasen-Ohren-Arzt / Labor (Blutabnahme Mo–Fr 7–10 Uhr)" },
        { label: "2. Stock", items: "Dr. A. Lang, Augenärztin / Physiotherapie „Fit & Aktiv“ / Massage" },
        { label: "1. Stock", items: "Dr. E. Yılmaz, Kinderarzt / Dr. P. Krause, Zahnarzt" },
        { label: "Erdgeschoss", items: "Marien-Apotheke / Dr. K. Weber, Allgemeinmedizin / Sanitätshaus" },
      ],
    },
    example: {
      id: 0,
      situation: "Ihre Tochter ist fünf Jahre alt und hat Fieber.",
      options: opt("Erdgeschoss", "1. Stock"),
      answer: "b",
      explanation: "Kinderarzt → 1. Stock.",
    },
    tasks: [
      { id: 1, situation: "Sie sehen nicht mehr gut und brauchen vielleicht eine Brille.", options: opt("1. Stock", "2. Stock"), answer: "b", explanation: "Augenärztin → 2. Stock." },
      { id: 2, situation: "Sie haben seit gestern starke Zahnschmerzen.", options: opt("Erdgeschoss", "2. Stock"), answer: "c", explanation: "Zahnarzt → 1. Stock. Seçeneklerde yok → c." },
      { id: 3, situation: "Ihr Hausarzt sagt, Sie sollen Ihr Blut untersuchen lassen.", options: opt("3. Stock", "4. Stock"), answer: "a", explanation: "Labor (Blutabnahme) → 3. Stock." },
      { id: 4, situation: "Sie möchten lernen, wie man gesund isst.", options: opt("2. Stock", "3. Stock"), answer: "c", explanation: "Ernährungsberatung → 4. Stock. Seçeneklerde yok → c." },
      { id: 5, situation: "Sie haben ein Rezept und brauchen ein Medikament.", options: opt("Erdgeschoss", "1. Stock"), answer: "a", explanation: "Apotheke → Erdgeschoss." },
    ],
  },
  {
    id: "t1-3",
    title: "Rathaus Neustadt",
    board: {
      title: "Rathaus Neustadt – Wegweiser",
      floors: [
        { label: "4. Stock", items: "Büro des Bürgermeisters / Sitzungssaal / Kantine" },
        { label: "3. Stock", items: "Kfz-Zulassung (Auto an- und abmelden) / Führerscheinstelle" },
        { label: "2. Stock", items: "Sozialamt / Wohngeld / Kindergeld-Beratung" },
        { label: "1. Stock", items: "Standesamt (Heirat, Geburt) / Fundbüro / Stadtbibliothek" },
        { label: "Erdgeschoss", items: "Bürgerbüro (Anmeldung, Personalausweis, Reisepass) / Information / Kasse" },
      ],
    },
    example: {
      id: 0,
      situation: "Sie sind nach Neustadt umgezogen und müssen sich anmelden.",
      options: opt("Erdgeschoss", "2. Stock"),
      answer: "a",
      explanation: "Anmeldung → Bürgerbüro im Erdgeschoss.",
    },
    tasks: [
      { id: 1, situation: "Sie und Ihr Partner möchten heiraten.", options: opt("Erdgeschoss", "1. Stock"), answer: "b", explanation: "Heirat → Standesamt im 1. Stock." },
      { id: 2, situation: "Sie haben ein gebrauchtes Auto gekauft.", options: opt("2. Stock", "4. Stock"), answer: "c", explanation: "Auto anmelden → Kfz-Zulassung im 3. Stock. Seçeneklerde yok → c." },
      { id: 3, situation: "Sie möchten in der Mittagspause etwas essen.", options: opt("Erdgeschoss", "4. Stock"), answer: "b", explanation: "Kantine → 4. Stock." },
      { id: 4, situation: "Sie fliegen im Sommer in die USA und brauchen einen neuen Pass.", options: opt("1. Stock", "2. Stock"), answer: "c", explanation: "Reisepass → Bürgerbüro im Erdgeschoss. Seçeneklerde yok → c." },
      { id: 5, situation: "Sie verdienen wenig und brauchen Hilfe bei der Miete.", options: opt("2. Stock", "3. Stock"), answer: "a", explanation: "Wohngeld (kira yardımı) → 2. Stock." },
    ],
  },
  {
    id: "t1-4",
    title: "Volkshochschule – Raumplan",
    board: {
      title: "Volkshochschule Mitte – Raumplan",
      floors: [
        { label: "3. Stock", items: "Lehrküche: Kochkurse (italienisch, türkisch, vegetarisch) / Backkurse" },
        { label: "2. Stock", items: "Computerkurse / Bewerbungstraining / Buchhaltung" },
        { label: "1. Stock", items: "Sprachkurse: Deutsch, Englisch, Spanisch, Französisch / Prüfungsbüro" },
        { label: "Erdgeschoss", items: "Anmeldung und Beratung / Sekretariat / Café „Pause“" },
        { label: "Untergeschoss", items: "Gymnastikraum: Yoga, Rückenschule, Tanz / Werkstatt: Malen, Töpfern" },
      ],
    },
    example: {
      id: 0,
      situation: "Sie möchten Englisch lernen.",
      options: opt("Erdgeschoss", "1. Stock"),
      answer: "b",
      explanation: "Sprachkurse → 1. Stock.",
    },
    tasks: [
      { id: 1, situation: "Sie möchten lernen, wie man eine gute Bewerbung schreibt.", options: opt("1. Stock", "2. Stock"), answer: "b", explanation: "Bewerbungstraining → 2. Stock." },
      { id: 2, situation: "Sie haben oft Rückenschmerzen und möchten etwas dagegen tun.", options: opt("Erdgeschoss", "3. Stock"), answer: "c", explanation: "Rückenschule → Untergeschoss. Seçeneklerde yok → c." },
      { id: 3, situation: "Sie möchten sich für einen Kurs anmelden und haben Fragen.", options: opt("Erdgeschoss", "1. Stock"), answer: "a", explanation: "Anmeldung und Beratung → Erdgeschoss." },
      { id: 4, situation: "Ihr Mann möchte italienisch kochen lernen.", options: opt("2. Stock", "Untergeschoss"), answer: "c", explanation: "Kochkurse → Lehrküche im 3. Stock. Seçeneklerde yok → c." },
      { id: 5, situation: "Ihre Freundin möchte in ihrer Freizeit Bilder malen.", options: opt("Untergeschoss", "2. Stock"), answer: "a", explanation: "Werkstatt: Malen → Untergeschoss." },
    ],
  },
  {
    id: "t1-5",
    title: "Hotel Seeblick",
    board: {
      title: "Hotel Seeblick – Hotelinformation",
      floors: [
        { label: "5. Etage", items: "Fitnessraum / Sauna / Dachterrasse mit Bar (ab 17 Uhr)" },
        { label: "2.–4. Etage", items: "Gästezimmer 201–450" },
        { label: "1. Etage", items: "Restaurant „Seeblick“ (Frühstück 7–10 Uhr) / Konferenzräume A und B" },
        { label: "Erdgeschoss", items: "Rezeption / Gepäckraum / Fahrradverleih / Kiosk" },
        { label: "Untergeschoss", items: "Tiefgarage / Waschraum mit Waschmaschinen / Schwimmbad" },
      ],
    },
    example: {
      id: 0,
      situation: "Sie möchten frühstücken.",
      options: opt("Erdgeschoss", "1. Etage", "andere Etage"),
      answer: "b",
      explanation: "Restaurant (Frühstück) → 1. Etage.",
    },
    tasks: [
      { id: 1, situation: "Sie sind mit dem Auto gekommen und suchen einen Parkplatz.", options: opt("Erdgeschoss", "Untergeschoss", "andere Etage"), answer: "b", explanation: "Tiefgarage → Untergeschoss." },
      { id: 2, situation: "Sie haben schon ausgecheckt, Ihr Zug fährt aber erst am Abend. Wohin mit dem Koffer?", options: opt("Erdgeschoss", "2. Etage", "andere Etage"), answer: "a", explanation: "Gepäckraum → Erdgeschoss." },
      { id: 3, situation: "Sie haben am Nachmittag ein Meeting mit Kollegen.", options: opt("1. Etage", "5. Etage", "andere Etage"), answer: "a", explanation: "Konferenzräume → 1. Etage." },
      { id: 4, situation: "Sie möchten schwimmen gehen.", options: opt("Erdgeschoss", "5. Etage", "andere Etage"), answer: "c", explanation: "Schwimmbad → Untergeschoss. Dikkat: 5. Etage'de Sauna var ama yüzme havuzu yok → c." },
      { id: 5, situation: "Sie möchten am Nachmittag eine Radtour machen.", options: opt("Erdgeschoss", "1. Etage", "andere Etage"), answer: "a", explanation: "Fahrradverleih (bisiklet kiralama) → Erdgeschoss." },
    ],
  },
];

// ───────────────────────────── TEIL 2 ─────────────────────────────

export const TELC_A2_TEIL2_SETS: TelcA2Teil2Set[] = [
  {
    id: "t2-1",
    title: "Zwillinge feiern 100. Geburtstag",
    article: {
      headline: "Zwei Schwestern – 200 Jahre",
      paragraphs: [
        "Am Samstag haben Hilde und Gerda Brandt aus Bremen ihren 100. Geburtstag gefeiert. Die Zwillinge wohnen seit fünf Jahren zusammen in einem Seniorenheim. Zur Party sind 40 Gäste gekommen, darunter drei Kinder, sieben Enkel und zwei Urenkel.",
        "„Wir haben uns nie gestritten“, sagt Gerda und lacht. Ihre Schwester ist nicht ganz einverstanden: „Doch, als Kinder jeden Tag! Aber heute sind wir die besten Freundinnen.“",
        "Früher hatten die beiden zusammen ein kleines Modegeschäft in der Bremer Innenstadt. Erst mit 75 Jahren haben sie das Geschäft verkauft. Was ist ihr Geheimnis für ein langes Leben? „Jeden Tag spazieren gehen, viel lachen und abends ein kleines Glas Rotwein“, sagt Hilde. Zum Geburtstag hat sich Gerda etwas Besonderes gewünscht: einen Flug mit einem Heißluftballon. Den macht sie im Juni – ihre Schwester bleibt lieber am Boden.",
      ],
      source: "nach einer Meldung im Weser-Kurier",
    },
    example: { id: 0, statement: "Hilde und Gerda sind Zwillinge.", answer: "richtig", explanation: "„Die Zwillinge …“" },
    tasks: [
      { id: 6, statement: "Die Schwestern leben in einem Seniorenheim.", answer: "richtig", explanation: "„wohnen seit fünf Jahren zusammen in einem Seniorenheim“." },
      { id: 7, statement: "Als Kinder hatten die Schwestern nie Streit.", answer: "falsch", explanation: "Hilde: „Doch, als Kinder jeden Tag!“ – Gerda öyle diyor ama Hilde düzeltiyor." },
      { id: 8, statement: "Die Schwestern haben bis 75 in ihrem Geschäft gearbeitet.", answer: "richtig", explanation: "„Erst mit 75 Jahren haben sie das Geschäft verkauft.“" },
      { id: 9, statement: "Hilde trinkt jeden Abend ein Glas Wein.", answer: "richtig", explanation: "Geheimnis: „abends ein kleines Glas Rotwein“." },
      { id: 10, statement: "Beide Schwestern fliegen im Juni mit einem Ballon.", answer: "falsch", explanation: "Sadece Gerda uçuyor; „ihre Schwester bleibt lieber am Boden“." },
    ],
  },
  {
    id: "t2-2",
    title: "Ehrlicher Finder",
    article: {
      headline: "Taxifahrer bringt 8.000 Euro zur Polizei",
      paragraphs: [
        "Ein ehrlicher Taxifahrer hat in Köln einer Touristin den Urlaub gerettet. Murat K. (42) hat am Montagabend nach seiner letzten Fahrt eine Tasche auf dem Rücksitz gefunden. Darin waren 8.000 Euro, zwei Reisepässe und ein Flugticket nach Kanada.",
        "„Ich habe nicht lange überlegt und bin sofort zur Polizei gefahren“, erzählt Murat. Die Polizei hat die Besitzerin schnell gefunden: Es war eine Frau aus Toronto, die mit ihrer Tochter in Köln Urlaub gemacht hat. Sie wollte mit dem Geld ein Auto für ihren Sohn kaufen, der in Deutschland studiert.",
        "Die Frau war sehr glücklich und wollte Murat 500 Euro Finderlohn geben. Er hat das Geld aber nicht genommen. „Ich habe selbst zwei Kinder. Ich möchte ihnen zeigen, dass man ehrlich sein muss“, sagt er. Jetzt hat ihn die Stadt Köln zu einem Essen mit dem Oberbürgermeister eingeladen.",
      ],
      source: "nach einer Meldung im Kölner Stadt-Anzeiger",
    },
    example: { id: 0, statement: "Murat K. arbeitet als Taxifahrer.", answer: "richtig", explanation: "„Ein ehrlicher Taxifahrer … Murat K.“" },
    tasks: [
      { id: 6, statement: "Murat hat die Tasche am Morgen gefunden.", answer: "falsch", explanation: "„am Montagabend nach seiner letzten Fahrt“ – akşam." },
      { id: 7, statement: "In der Tasche waren auch Ausweisdokumente.", answer: "richtig", explanation: "„zwei Reisepässe“ = kimlik belgeleri." },
      { id: 8, statement: "Die Touristin wollte mit dem Geld ein Auto kaufen.", answer: "richtig", explanation: "„ein Auto für ihren Sohn kaufen“." },
      { id: 9, statement: "Murat hat 500 Euro Finderlohn bekommen.", answer: "falsch", explanation: "„Er hat das Geld aber nicht genommen.“" },
      { id: 10, statement: "Murat ist Vater.", answer: "richtig", explanation: "„Ich habe selbst zwei Kinder.“" },
    ],
  },
  {
    id: "t2-3",
    title: "Mit 71 an die Uni",
    article: {
      headline: "Nie zu alt zum Lernen",
      paragraphs: [
        "Wenn Werner Pohl morgens in den Hörsaal kommt, denken viele Studenten, er ist der Professor. Aber der 71-Jährige ist selbst Student. Seit Oktober studiert er an der Universität Leipzig Geschichte.",
        "„Als junger Mann hatte ich keine Zeit für ein Studium“, erzählt er. „Ich musste schon mit 16 in der Fabrik arbeiten, weil meine Familie wenig Geld hatte.“ 45 Jahre lang war Werner Elektriker. Nach seiner Rente hat er zuerst nur Bücher gelesen. Dann hat seine Enkelin gesagt: „Opa, warum studierst du nicht?“",
        "Am Anfang war es schwer. Werner musste lernen, wie man mit dem Computer arbeitet und im Internet recherchiert. Dabei helfen ihm jetzt junge Studenten aus seinem Kurs. Dafür erzählt Werner ihnen, wie das Leben in der DDR war. „Das ist für uns spannender als jedes Buch“, sagt eine Studentin. Sein Ziel: In drei Jahren will er sein Studium beenden – zusammen mit seiner Enkelin, die Medizin studiert.",
      ],
      source: "nach einem Bericht der Leipziger Volkszeitung",
    },
    example: { id: 0, statement: "Werner Pohl ist Professor an der Universität.", answer: "falsch", explanation: "„Aber der 71-Jährige ist selbst Student.“" },
    tasks: [
      { id: 6, statement: "Werner hat schon als Jugendlicher gearbeitet.", answer: "richtig", explanation: "„Ich musste schon mit 16 in der Fabrik arbeiten“." },
      { id: 7, statement: "Werner war 45 Jahre lang Lehrer.", answer: "falsch", explanation: "45 yıl Elektriker (elektrikçi) olarak çalıştı." },
      { id: 8, statement: "Die Idee für das Studium kam von seiner Enkelin.", answer: "richtig", explanation: "Torunu: „Opa, warum studierst du nicht?“" },
      { id: 9, statement: "Werner konnte von Anfang an gut mit dem Computer arbeiten.", answer: "falsch", explanation: "„Werner musste lernen, wie man mit dem Computer arbeitet“." },
      { id: 10, statement: "Werners Enkelin studiert auch Geschichte.", answer: "falsch", explanation: "Torunu Medizin (tıp) okuyor." },
    ],
  },
  {
    id: "t2-4",
    title: "Kostenlos Bus fahren",
    article: {
      headline: "Kleinstadt testet Gratis-Bus",
      paragraphs: [
        "In Bad Rheinfeld kann man seit dem 1. März kostenlos mit dem Bus fahren. Die Stadt will testen, ob dann weniger Menschen mit dem Auto in die Innenstadt kommen. Der Test dauert ein Jahr.",
        "Die ersten Ergebnisse sind gut: Schon im ersten Monat sind 30 Prozent mehr Menschen Bus gefahren als vorher. Besonders Schüler und ältere Menschen nutzen das neue Angebot. „Früher habe ich für die Monatskarte 48 Euro bezahlt. Das Geld kann ich jetzt sparen“, sagt Rentnerin Ilse Wagner.",
        "Nicht alle sind zufrieden. Manche Busfahrer sagen, die Busse sind am Morgen jetzt oft zu voll. Die Stadt hat deshalb zwei neue Busse gekauft, die ab Mai zwischen 7 und 9 Uhr fahren sollen. Bezahlt wird der Gratis-Bus mit Geld aus der Parkgebühr: Wer in der Innenstadt parkt, muss jetzt 3 Euro pro Stunde bezahlen – ein Euro mehr als früher.",
      ],
      source: "nach einer Meldung im Rheinischen Boten",
    },
    example: { id: 0, statement: "In Bad Rheinfeld kostet der Bus nichts.", answer: "richtig", explanation: "„kostenlos mit dem Bus fahren“." },
    tasks: [
      { id: 6, statement: "Der Test mit dem Gratis-Bus dauert sechs Monate.", answer: "falsch", explanation: "„Der Test dauert ein Jahr.“" },
      { id: 7, statement: "Im ersten Monat sind mehr Menschen Bus gefahren.", answer: "richtig", explanation: "„30 Prozent mehr Menschen“." },
      { id: 8, statement: "Frau Wagner hat früher keine Monatskarte gehabt.", answer: "falsch", explanation: "„Früher habe ich für die Monatskarte 48 Euro bezahlt.“ – vardı." },
      { id: 9, statement: "Am Morgen sollen zusätzliche Busse fahren.", answer: "richtig", explanation: "İki yeni otobüs „zwischen 7 und 9 Uhr“." },
      { id: 10, statement: "Das Parken in der Innenstadt ist billiger geworden.", answer: "falsch", explanation: "Artık saatte 3 Euro – „ein Euro mehr als früher“ → daha pahalı." },
    ],
  },
  {
    id: "t2-5",
    title: "Vom Hobby zum Restaurant",
    article: {
      headline: "Oma Ayşes Rezepte machen Hamburg glücklich",
      paragraphs: [
        "Vor drei Jahren hat Deniz Arslan (29) angefangen, auf Instagram Videos über die Rezepte seiner Großmutter zu zeigen. Damals hat er noch als Bankkaufmann gearbeitet und nur am Wochenende gekocht. Heute hat er 200.000 Follower – und seit letztem Monat ein eigenes Restaurant in Hamburg-Altona.",
        "„Meine Oma hat mir als Kind alles beigebracht: Linsensuppe, gefüllte Weinblätter, Börek“, erzählt Deniz. Die Großmutter lebt in Izmir. Zur Eröffnung ist sie aber nach Hamburg gekommen und hat eine Woche lang in der Küche mitgeholfen.",
        "Das Restaurant hat nur 30 Plätze und ist fast jeden Abend voll. Wer einen Tisch möchte, muss zwei Wochen vorher reservieren. Mittags gibt es ein günstiges Menü für 12 Euro. Seine Stelle in der Bank hat Deniz gekündigt. „Das war die beste Entscheidung meines Lebens“, sagt er. Im nächsten Jahr möchte er ein Kochbuch mit den Rezepten seiner Oma schreiben.",
      ],
      source: "nach einem Bericht im Hamburger Abendblatt",
    },
    example: { id: 0, statement: "Deniz zeigt Rezepte seiner Großmutter im Internet.", answer: "richtig", explanation: "„auf Instagram Videos über die Rezepte seiner Großmutter“." },
    tasks: [
      { id: 6, statement: "Vor drei Jahren hat Deniz in einem Restaurant gearbeitet.", answer: "falsch", explanation: "O zamanlar Bankkaufmann (bankacı) idi." },
      { id: 7, statement: "Die Großmutter von Deniz wohnt in Hamburg.", answer: "falsch", explanation: "„Die Großmutter lebt in Izmir.“ Açılış için Hamburg'a geldi." },
      { id: 8, statement: "Die Großmutter hat bei der Eröffnung in der Küche geholfen.", answer: "richtig", explanation: "„hat eine Woche lang in der Küche mitgeholfen“." },
      { id: 9, statement: "Für das Abendessen sollte man früh reservieren.", answer: "richtig", explanation: "„muss zwei Wochen vorher reservieren“." },
      { id: 10, statement: "Deniz hat schon ein Kochbuch geschrieben.", answer: "falsch", explanation: "Kitabı „im nächsten Jahr“ yazmak istiyor – henüz yazmadı." },
    ],
  },
];

// ───────────────────────────── TEIL 3 ─────────────────────────────

export const TELC_A2_TEIL3_SETS: TelcA2Teil3Set[] = [
  {
    id: "t3-1",
    title: "Freizeit und Reisen",
    ads: [
      { key: "a", title: "www.fahrrad-touren.de", lines: ["Radreisen an Elbe, Weser und Donau", "Gepäcktransport von Hotel zu Hotel", "Leihräder und E-Bikes inklusive"] },
      { key: "b", title: "www.wandern-alpen.de", lines: ["Geführte Wanderungen in den Alpen", "Für Anfänger und Profis", "Übernachtung in Berghütten"] },
      { key: "c", title: "www.flug-guenstig.de", lines: ["Billigflüge in alle Welt", "Preise vergleichen und sofort buchen", "Last-Minute-Angebote ab 29 €"] },
      { key: "d", title: "www.camping-nordsee.de", lines: ["Campingplätze direkt am Strand", "Wohnmobile zu mieten", "Hunde willkommen!"] },
      { key: "e", title: "Tanzschule Rhythmus", lines: ["Salsa, Tango, Walzer", "Kurse für Paare und Singles", "Hochzeitstanz in 5 Stunden"] },
      { key: "f", title: "www.musical-tickets.de", lines: ["Karten für alle Musicals in Deutschland", "Hamburg – Berlin – Stuttgart", "Mit Hotel-Paket günstiger"] },
      { key: "g", title: "Stadtführungen Heidelberg", lines: ["Altstadt, Schloss, Philosophenweg", "Täglich 11 und 15 Uhr", "Auch auf Englisch und Türkisch"] },
      { key: "h", title: "www.segelschule-bodensee.de", lines: ["Segelkurse für Kinder und Erwachsene", "Bootsführerschein in 2 Wochen", "Boote zu mieten"] },
    ],
    example: { id: 0, situation: "Sie möchten in den Bergen wandern und in einer Hütte schlafen.", answer: "b", explanation: "Berghütten → b." },
    tasks: [
      { id: 11, situation: "Sie und Ihr Partner heiraten bald und möchten für die Feier tanzen lernen.", answer: "e", explanation: "„Hochzeitstanz in 5 Stunden“ → e." },
      { id: 12, situation: "Sie möchten mit dem Fahrrad an einem Fluss entlang fahren, aber Ihren Koffer nicht selbst tragen.", answer: "a", explanation: "Radreisen + „Gepäcktransport“ → a." },
      { id: 13, situation: "Ihre Eltern besuchen Heidelberg und möchten die Stadt mit einem Führer kennen lernen.", answer: "g", explanation: "Stadtführungen Heidelberg → g." },
      { id: 14, situation: "Sie möchten mit Ihrem Hund Urlaub am Meer machen.", answer: "d", explanation: "Nordsee, Strand, „Hunde willkommen!“ → d." },
      { id: 15, situation: "Sie möchten in Deutschland einen Skikurs machen.", answer: "x", explanation: "Kayak kursu ilanı yok. b (Alpen) sadece yürüyüş → X." },
    ],
  },
  {
    id: "t3-2",
    title: "Wohnen",
    ads: [
      { key: "a", title: "Umzüge Schnell & Sicher", lines: ["Wir bringen Ihre Möbel in jede Stadt", "Auch am Wochenende", "Kostenlose Umzugskartons"] },
      { key: "b", title: "WG-Zimmer frei", lines: ["Studentin (23) sucht Mitbewohnerin", "15 m², möbliert, 380 € warm", "Nähe Uni, ab 1. Oktober"] },
      { key: "c", title: "Möbelmarkt Nord", lines: ["Sofas, Betten, Küchen", "Lieferung und Aufbau gratis", "Jetzt 20 % auf alle Küchen"] },
      { key: "d", title: "Hausmeisterservice Kaya", lines: ["Kleine Reparaturen in Haus und Wohnung", "Lampen, Türen, Wasserhähne", "Schnell und günstig"] },
      { key: "e", title: "Ferienwohnung am See", lines: ["2 Zimmer, Balkon, für 4 Personen", "ab 65 € pro Nacht", "Nur Juli und August frei"] },
      { key: "f", title: "Mieterverein e. V.", lines: ["Probleme mit dem Vermieter?", "Rechtsberatung für Mitglieder", "Mo–Do 16–19 Uhr"] },
      { key: "g", title: "Garten-Profi", lines: ["Rasen mähen, Hecken schneiden", "Wir pflegen Ihren Garten", "Auch Balkonpflanzen"] },
      { key: "h", title: "3-Zimmer-Wohnung zu vermieten", lines: ["80 m², 2. Stock mit Aufzug", "Kinderzimmer, großer Balkon", "950 € kalt, frei ab sofort"] },
    ],
    example: { id: 0, situation: "Sie ziehen nächsten Monat in eine andere Stadt und brauchen Hilfe beim Transport.", answer: "a", explanation: "Umzüge → a." },
    tasks: [
      { id: 11, situation: "Ihre Lampe im Badezimmer ist kaputt und Sie können sie nicht selbst reparieren.", answer: "d", explanation: "„Lampen … kleine Reparaturen“ → d." },
      { id: 12, situation: "Eine Familie mit zwei Kindern sucht eine Wohnung zum Mieten.", answer: "h", explanation: "3 Zimmer, Kinderzimmer, zu vermieten → h." },
      { id: 13, situation: "Ihr Vermieter will die Kaution nicht zurückzahlen. Sie brauchen Rat.", answer: "f", explanation: "Probleme mit dem Vermieter → Mieterverein f." },
      { id: 14, situation: "Ihre Schwester beginnt im Herbst ihr Studium und sucht ein günstiges Zimmer.", answer: "b", explanation: "WG-Zimmer, Nähe Uni, ab 1. Oktober → b." },
      { id: 15, situation: "Sie möchten Ihre alte Waschmaschine verkaufen.", answer: "x", explanation: "Eşya satın alan / ikinci el ilanı yok. c sadece yeni mobilya satıyor → X." },
    ],
  },
  {
    id: "t3-3",
    title: "Arbeit und Weiterbildung",
    ads: [
      { key: "a", title: "Café Sonnenschein", lines: ["Wir suchen Aushilfe für Samstag und Sonntag", "Auch für Studenten", "Bewerbung bitte persönlich"] },
      { key: "b", title: "Sprachschule Lingua", lines: ["Deutschkurse A1–C1", "Abendkurse und Intensivkurse", "telc-Prüfungen im Haus"] },
      { key: "c", title: "Pflegedienst Herz", lines: ["Krankenpfleger/in gesucht", "Vollzeit, eigenes Dienstauto", "Gute Bezahlung"] },
      { key: "d", title: "www.jobs-ausland.de", lines: ["Arbeiten in Spanien, Italien und Griechenland", "Hotel und Gastronomie", "Saisonjobs im Sommer"] },
      { key: "e", title: "Computerschule Click", lines: ["Word, Excel, PowerPoint", "Kurse am Vormittag", "Mit Zertifikat"] },
      { key: "f", title: "Bewerbungshilfe Neustart", lines: ["Wir schreiben mit Ihnen Lebenslauf und Anschreiben", "Training für das Vorstellungsgespräch", "Kostenlos für Arbeitssuchende"] },
      { key: "g", title: "Fahrschule Grün", lines: ["Führerschein Klasse B in 6 Wochen", "Unterricht auch auf Türkisch und Arabisch", "Ferienkurse"] },
      { key: "h", title: "Kita Regenbogen", lines: ["Erzieherin für 20 Stunden pro Woche gesucht", "Kleine Gruppen, nettes Team", "Start: 1. September"] },
    ],
    example: { id: 0, situation: "Sie möchten Ihr Deutsch verbessern und die telc-Prüfung machen.", answer: "b", explanation: "Deutschkurse + telc → b." },
    tasks: [
      { id: 11, situation: "Ein Freund studiert und möchte am Wochenende etwas Geld verdienen.", answer: "a", explanation: "Aushilfe am Wochenende, auch für Studenten → a." },
      { id: 12, situation: "Sie haben ein Vorstellungsgespräch und möchten sich gut vorbereiten.", answer: "f", explanation: "„Training für das Vorstellungsgespräch“ → f." },
      { id: 13, situation: "Sie sind Erzieherin und möchten nur halbtags arbeiten.", answer: "h", explanation: "Erzieherin, 20 Stunden pro Woche → h." },
      { id: 14, situation: "Sie brauchen für Ihre neue Arbeit einen Führerschein.", answer: "g", explanation: "Fahrschule → g." },
      { id: 15, situation: "Sie möchten im Winter in einem Skihotel in Österreich arbeiten.", answer: "x", explanation: "d sadece yaz işleri ve İspanya / İtalya / Yunanistan → X." },
    ],
  },
  {
    id: "t3-4",
    title: "Einkaufen und Dienstleistungen",
    ads: [
      { key: "a", title: "Second-Hand-Laden Kinderkiste", lines: ["Kinderkleidung, Spielzeug, Kinderwagen", "Alles gebraucht und günstig", "Wir kaufen auch Ihre Sachen!"] },
      { key: "b", title: "Handy-Doktor", lines: ["Display kaputt? Akku leer?", "Reparatur in 1 Stunde", "Alle Marken"] },
      { key: "c", title: "Bio-Hofladen Sonnenfeld", lines: ["Gemüse, Eier, Käse vom eigenen Hof", "Fr und Sa 8–13 Uhr", "Lieferung im Umkreis von 10 km"] },
      { key: "d", title: "Schneiderei Elif", lines: ["Hosen kürzen, Reißverschlüsse wechseln", "Änderungen in 24 Stunden", "Auch Brautkleider"] },
      { key: "e", title: "Getränke-Blitz", lines: ["Wir bringen Ihre Getränke nach Hause", "Bestellung per App", "Lieferung in 2 Stunden"] },
      { key: "f", title: "Optiker Klarsicht", lines: ["Brillen und Kontaktlinsen", "Kostenloser Sehtest", "Zweite Brille gratis"] },
      { key: "g", title: "Waschsalon Blitzblank", lines: ["Waschen und Trocknen", "Täglich 6–23 Uhr", "Mit WLAN und Café"] },
      { key: "h", title: "Schlüsseldienst 24", lines: ["Tür zu? Schlüssel weg?", "Tag und Nacht für Sie da", "In 30 Minuten bei Ihnen"] },
    ],
    example: { id: 0, situation: "Das Display von Ihrem Smartphone ist kaputt.", answer: "b", explanation: "Display kaputt → Handy-Doktor b." },
    tasks: [
      { id: 11, situation: "Sie haben um Mitternacht Ihren Wohnungsschlüssel verloren.", answer: "h", explanation: "„Tag und Nacht“, Schlüssel weg → h." },
      { id: 12, situation: "Ihre neue Hose ist zu lang.", answer: "d", explanation: "„Hosen kürzen“ → d." },
      { id: 13, situation: "Ihre Waschmaschine ist kaputt und Sie haben viel schmutzige Wäsche.", answer: "g", explanation: "Waschsalon → g." },
      { id: 14, situation: "Ihr Kind ist gewachsen. Sie möchten seine alte Kleidung verkaufen.", answer: "a", explanation: "„Wir kaufen auch Ihre Sachen!“ → a." },
      { id: 15, situation: "Sie möchten frisches Bio-Obst und Gemüse am Sonntag kaufen.", answer: "x", explanation: "c sadece Cuma ve Cumartesi açık → X." },
    ],
  },
  {
    id: "t3-5",
    title: "Gesundheit und Sport",
    ads: [
      { key: "a", title: "Fitnessstudio PowerGym", lines: ["24 Stunden geöffnet", "Sauna und Kurse inklusive", "Erster Monat gratis"] },
      { key: "b", title: "Schwimmschule Delfin", lines: ["Schwimmkurse für Kinder ab 4 Jahren", "Kleine Gruppen", "Auch Kurse für Erwachsene ohne Erfahrung"] },
      { key: "c", title: "Yoga im Park", lines: ["Jeden Sonntag 9 Uhr", "Für alle Altersgruppen", "Ohne Anmeldung, kostenlos"] },
      { key: "d", title: "Raucher-Hilfe", lines: ["In 6 Wochen rauchfrei", "Gruppenkurs mit Ärztin", "Die Krankenkasse bezahlt"] },
      { key: "e", title: "Laufgruppe Stadtpark", lines: ["Gemeinsam joggen: Di und Do 18 Uhr", "Anfänger willkommen", "Treffpunkt: Haupteingang"] },
      { key: "f", title: "Zahnarztpraxis Dr. Kühn", lines: ["Neue Patienten willkommen", "Termine auch am Samstag", "Angstpatienten: viel Zeit und Ruhe"] },
      { key: "g", title: "Tennisclub Grün-Weiß", lines: ["Neue Mitglieder gesucht", "Trainer für Kinder und Erwachsene", "Plätze auch stundenweise zu mieten"] },
      { key: "h", title: "Massagepraxis Relax", lines: ["Rücken- und Nackenmassage", "Termine auch am Abend", "Gutscheine als Geschenk"] },
    ],
    example: { id: 0, situation: "Sie möchten nachts trainieren, weil Sie tagsüber arbeiten.", answer: "a", explanation: "„24 Stunden geöffnet“ → a." },
    tasks: [
      { id: 11, situation: "Sie haben große Angst vor dem Zahnarzt.", answer: "f", explanation: "„Angstpatienten: viel Zeit und Ruhe“ → f." },
      { id: 12, situation: "Sie sind 35 und können nicht schwimmen.", answer: "b", explanation: "„Kurse für Erwachsene ohne Erfahrung“ → b." },
      { id: 13, situation: "Ihr Mann möchte mit dem Rauchen aufhören.", answer: "d", explanation: "„In 6 Wochen rauchfrei“ → d." },
      { id: 14, situation: "Sie möchten Ihrer Mutter zum Geburtstag eine Massage schenken.", answer: "h", explanation: "Massage + „Gutscheine als Geschenk“ → h." },
      { id: 15, situation: "Sie möchten Fußball in einem Verein spielen.", answer: "x", explanation: "Futbol kulübü ilanı yok (g tenis) → X." },
    ],
  },
];
