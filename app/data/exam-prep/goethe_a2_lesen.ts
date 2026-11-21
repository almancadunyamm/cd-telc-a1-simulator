// Sınav Hazırlık → Goethe-Zertifikat A2 → Lesen (30 Minuten)
// Goethe-Zertifikat A2 Übungssatz 01 formatı birebir örnek alınarak hazırlanmış özgün alıştırmalar.
//   Teil 1: Gazete makalesi + 5 görev (1–5), a / b / c. Cevaplı Beispiel 0 var.
//   Teil 2: Bilgi panosu / program (Wohin gehen Sie?) + 5 görev (6–10), a / b / c (c = "andere …").
//   Teil 3: E-posta + 5 görev (11–15), a / b / c.
//   Teil 4: 6 ilan (a–f) + 5 kişi (16–20); örnekteki ilan tekrar seçilemez, bir kişi için ilan yok → X.

import type { TelcA2Teil1Option, TelcA2Teil1Set, TelcA2Teil3Set } from "./telc_a2_lesen";

export type McOption = { key: "a" | "b" | "c"; text: string };

export type McTask = {
  id: number;
  stem: string;
  options: McOption[];
  answer: "a" | "b" | "c";
  explanation: string;
};

export type McTextSet = {
  id: string;
  title: string;
  text: {
    kind: "article" | "email";
    headline?: string;
    subline?: string;
    greeting?: string;
    paragraphs: string[];
    closing?: string[];
  };
  example?: McTask;
  tasks: McTask[];
};

export const GOETHE_A2_LESEN_INSTRUCTIONS = {
  teil1: {
    de: ["Sie lesen in einer Zeitung diesen Text.", "Wählen Sie für die Aufgaben 1 bis 5 die richtige Lösung a, b oder c."],
    tr: "Gazete makalesini okuyun ve her görev için doğru seçeneği işaretleyin. Görevlerin sırası metindeki sırayla aynıdır.",
  },
  teil2: {
    de: ["Lesen Sie die Aufgaben 6 bis 10 und den Text.", "Wohin gehen Sie?", "Wählen Sie die richtige Lösung a, b oder c."],
    tr: "Önce görevleri, sonra panoyu okuyun. Aradığınız şey a ve b'deki yerlerde değilse c (andere …) doğrudur.",
  },
  teil3: {
    de: ["Sie lesen eine E-Mail.", "Wählen Sie für die Aufgaben 11 bis 15 die richtige Lösung a, b oder c."],
    tr: "E-postayı okuyun ve her görev için doğru seçeneği işaretleyin.",
  },
  teil4: {
    de: [
      "Lesen Sie die Aufgaben 16 bis 20 und die Anzeigen a bis f.",
      "Welche Anzeige passt zu welcher Person?",
      "Für eine Aufgabe gibt es keine Lösung. Markieren Sie so X.",
      "Die Anzeige aus dem Beispiel können Sie nicht mehr wählen.",
    ],
    tr: "Her kişiye uyan ilanı seçin. Örnekteki ilan tekrar seçilemez; her ilan bir kez kullanılır. Bir kişi için uygun ilan yoktur → X.",
  },
};

const mc = (a: string, b: string, c: string): McOption[] => [
  { key: "a", text: a },
  { key: "b", text: b },
  { key: "c", text: c },
];

const place = (a: string, b: string, c: string): TelcA2Teil1Option[] => [
  { key: "a", text: a },
  { key: "b", text: b },
  { key: "c", text: c },
];

// ───────────────────────────── TEIL 1 · Zeitungsartikel ─────────────────────────────

export const GOETHE_A2_TEIL1_SETS: McTextSet[] = [
  {
    id: "g1-1",
    title: "Handy-Pause in der Schule",
    text: {
      kind: "article",
      headline: "Handy aus, Kopf an?",
      subline: "Eine Schule in Kassel verbietet Handys – was Schüler, Eltern und Lehrer sagen",
      paragraphs: [
        "Seit September dürfen die Schüler der Goethe-Schule in Kassel ihr Handy in der Schule nicht mehr benutzen. Am Morgen legen sie es in einen Schrank im Klassenzimmer. Erst nach der letzten Stunde bekommen sie es zurück.",
        "„Am Anfang fand ich das schrecklich“, sagt Mia (14). „Ich wollte in der Pause immer meine Nachrichten lesen. Aber jetzt spiele ich mit meinen Freunden Tischtennis oder wir reden einfach. Das ist eigentlich schöner.“",
        "Nicht alle Eltern sind zufrieden. „Ich möchte meinen Sohn erreichen, wenn etwas passiert“, sagt Herr Brandt. Die Schule hat deshalb eine Lösung: Die Eltern können im Sekretariat anrufen, die Sekretärin sagt den Kindern dann Bescheid.",
        "Die Lehrer merken schon einen Unterschied. „Die Schüler sind im Unterricht ruhiger und können sich besser konzentrieren“, sagt Direktorin Frau Weiß. Nur für Projekte im Unterricht dürfen die Schüler ihr Handy manchmal benutzen – aber nur, wenn der Lehrer es erlaubt.",
      ],
    },
    example: {
      id: 0,
      stem: "Der Artikel informiert über …",
      options: mc("ein neues Handy für Schüler.", "eine neue Regel an einer Schule.", "einen Computerkurs für Eltern."),
      answer: "b",
      explanation: "Okul telefonu yasaklıyor → yeni bir kural.",
    },
    tasks: [
      { id: 1, stem: "Die Schüler …", options: mc("bekommen ihr Handy nach dem Unterricht zurück.", "dürfen ihr Handy in der Pause benutzen.", "müssen ihr Handy zu Hause lassen."), answer: "a", explanation: "„Erst nach der letzten Stunde bekommen sie es zurück.“ Telefon evde kalmıyor, sınıftaki dolaba konuyor." },
      { id: 2, stem: "Mia …", options: mc("findet die Regel immer noch schlecht.", "liest in der Pause Nachrichten.", "verbringt die Pause jetzt mit Freunden."), answer: "c", explanation: "„jetzt spiele ich mit meinen Freunden Tischtennis oder wir reden“. Başta kötü buldu ama artık değil." },
      { id: 3, stem: "Herr Brandt …", options: mc("möchte mit seinem Sohn in Kontakt bleiben.", "arbeitet im Sekretariat.", "findet die Regel sehr gut."), answer: "a", explanation: "„Ich möchte meinen Sohn erreichen, wenn etwas passiert.“" },
      { id: 4, stem: "Wenn Eltern ihr Kind erreichen wollen, …", options: mc("schreiben sie eine Nachricht.", "rufen sie in der Schule an.", "kommen sie in die Schule."), answer: "b", explanation: "„Die Eltern können im Sekretariat anrufen“." },
      { id: 5, stem: "Im Unterricht …", options: mc("dürfen die Schüler nie ein Handy benutzen.", "arbeiten die Schüler konzentrierter.", "sind die Schüler lauter als früher."), answer: "b", explanation: "„können sich besser konzentrieren“. Projelerde öğretmen izin verirse telefon kullanılabiliyor → „nie“ yanlış." },
    ],
  },
  {
    id: "g1-2",
    title: "Gärtnern in der Stadt",
    text: {
      kind: "article",
      headline: "Tomaten vom Parkplatz",
      subline: "Immer mehr Menschen gärtnern mitten in der Stadt – zum Beispiel in Leipzig",
      paragraphs: [
        "Wo früher Autos standen, wachsen heute Tomaten, Salat und Blumen. Auf einem alten Parkplatz in Leipzig gibt es seit zwei Jahren einen Gemeinschaftsgarten. Rund 60 Nachbarn kümmern sich zusammen um die Beete.",
        "„Ich wohne in einer kleinen Wohnung ohne Balkon“, erzählt Karim (35). „Hier kann ich endlich mein eigenes Gemüse anbauen. Und meine Kinder lernen, wo das Essen herkommt.“ Jeder kann mitmachen, man muss nur einmal im Monat zu einem Treffen kommen.",
        "Für Renate (68) ist der Garten vor allem ein Ort für Kontakte. „Seit mein Mann gestorben ist, war ich viel allein. Hier treffe ich jeden Tag Leute und wir trinken zusammen Kaffee.“",
        "Probleme gibt es aber auch: Im Sommer muss man fast jeden Tag gießen, und Wasser kostet Geld. Die Stadt bezahlt deshalb jetzt die Hälfte der Wasserkosten. Im nächsten Jahr soll ein zweiter Garten in einem anderen Stadtteil entstehen.",
      ],
    },
    example: {
      id: 0,
      stem: "Der Artikel informiert über …",
      options: mc("einen neuen Parkplatz.", "einen Garten in der Stadt.", "ein Gemüsegeschäft."),
      answer: "b",
      explanation: "Şehirdeki ortak bahçe anlatılıyor.",
    },
    tasks: [
      { id: 1, stem: "Der Gemeinschaftsgarten …", options: mc("liegt auf einem früheren Parkplatz.", "gehört einer Familie.", "ist erst einen Monat alt."), answer: "a", explanation: "„Auf einem alten Parkplatz … seit zwei Jahren“." },
      { id: 2, stem: "Karim gärtnert hier, weil er …", options: mc("Gemüse verkaufen möchte.", "zu Hause keinen Platz dafür hat.", "einen großen Balkon hat."), answer: "b", explanation: "„kleine Wohnung ohne Balkon“." },
      { id: 3, stem: "Wer mitmachen möchte, …", options: mc("muss jeden Tag kommen.", "muss Geld bezahlen.", "muss an den Treffen teilnehmen."), answer: "c", explanation: "„man muss nur einmal im Monat zu einem Treffen kommen“." },
      { id: 4, stem: "Für Renate ist am wichtigsten, dass …", options: mc("sie andere Menschen trifft.", "sie Blumen pflanzen kann.", "ihr Mann mitkommt."), answer: "a", explanation: "„vor allem ein Ort für Kontakte … treffe ich jeden Tag Leute“." },
      { id: 5, stem: "Die Stadt …", options: mc("bezahlt alle Kosten für das Wasser.", "hilft bei den Wasserkosten.", "hat schon einen zweiten Garten gebaut."), answer: "b", explanation: "„bezahlt … die Hälfte der Wasserkosten“. İkinci bahçe gelecek yıl yapılacak." },
    ],
  },
  {
    id: "g1-3",
    title: "Mit dem Fahrrad zur Arbeit",
    text: {
      kind: "article",
      headline: "Radeln für die Gesundheit",
      subline: "Eine Firma in Münster belohnt Mitarbeiter, die mit dem Fahrrad kommen",
      paragraphs: [
        "Bei der Versicherung „Westfalia“ in Münster bekommt jeder Mitarbeiter 50 Cent für jeden Kilometer, den er mit dem Fahrrad zur Arbeit fährt. Die Firma will, dass ihre Mitarbeiter gesünder leben und weniger Autos auf dem Parkplatz stehen.",
        "Jan Becker (41) fährt jeden Tag zwölf Kilometer. „Früher bin ich mit dem Auto gefahren und stand oft im Stau. Jetzt bin ich nur fünf Minuten länger unterwegs, aber ich fühle mich viel fitter.“ Im letzten Jahr hat er so fast 1.000 Euro extra bekommen.",
        "Für Kollegin Sandra Opitz ist das Angebot nichts. „Ich wohne 40 Kilometer entfernt und muss morgens meine Tochter in den Kindergarten bringen. Das geht nur mit dem Auto.“ Sie wünscht sich, dass die Firma auch Mitarbeitern hilft, die mit Bus und Bahn kommen.",
        "Die Firma hat außerdem Duschen und einen sicheren Fahrradkeller gebaut. Seit dem Start sind die Mitarbeiter seltener krank. Der Chef ist sicher: „Das Geld ist gut investiert.“",
      ],
    },
    example: {
      id: 0,
      stem: "Der Artikel informiert über …",
      options: mc("ein Angebot einer Firma.", "ein neues Fahrradgeschäft.", "eine Radtour durch Münster."),
      answer: "a",
      explanation: "Firmanın bisikletle gelenlere verdiği teklif.",
    },
    tasks: [
      { id: 1, stem: "Die Mitarbeiter von „Westfalia“ …", options: mc("bekommen ein Fahrrad von der Firma.", "bekommen Geld, wenn sie mit dem Rad kommen.", "dürfen nicht mehr mit dem Auto kommen."), answer: "b", explanation: "„50 Cent für jeden Kilometer“." },
      { id: 2, stem: "Jan Becker …", options: mc("braucht mit dem Fahrrad viel länger.", "fährt manchmal noch mit dem Auto.", "fühlt sich jetzt besser."), answer: "c", explanation: "„ich fühle mich viel fitter“. Sadece 5 dakika daha uzun sürüyor." },
      { id: 3, stem: "Sandra Opitz fährt mit dem Auto, weil …", options: mc("sie ihr Kind morgens wegbringen muss.", "sie kein Fahrrad hat.", "der Bus zu teuer ist."), answer: "a", explanation: "„muss morgens meine Tochter in den Kindergarten bringen“ (ayrıca 40 km uzakta)." },
      { id: 4, stem: "Frau Opitz möchte, dass die Firma …", options: mc("mehr Parkplätze baut.", "auch Bus- und Bahnfahrer unterstützt.", "einen Kindergarten eröffnet."), answer: "b", explanation: "„dass die Firma auch Mitarbeitern hilft, die mit Bus und Bahn kommen“." },
      { id: 5, stem: "Seit es das Angebot gibt, …", options: mc("sind die Mitarbeiter weniger oft krank.", "hat die Firma Geld gespart.", "gibt es keine Autos mehr auf dem Parkplatz."), answer: "a", explanation: "„sind die Mitarbeiter seltener krank“." },
    ],
  },
  {
    id: "g1-4",
    title: "Repair-Café",
    text: {
      kind: "article",
      headline: "Reparieren statt wegwerfen",
      subline: "Im Repair-Café in Freiburg bekommen alte Sachen ein zweites Leben",
      paragraphs: [
        "Jeden ersten Samstag im Monat ist der Saal im Stadtteilzentrum voll. Menschen bringen kaputte Toaster, Lampen, Fahrräder oder Hosen mit. Ehrenamtliche Helfer zeigen ihnen, wie man die Sachen repariert. Das kostet nichts, aber viele geben eine kleine Spende.",
        "Peter Huber (72) war früher Elektriker. „Ich habe Zeit und repariere gern. Und es ist schön, wenn die Leute glücklich nach Hause gehen“, sagt er. Etwa sieben von zehn Geräten kann das Team reparieren.",
        "Studentin Lea ist heute zum ersten Mal hier. Ihr Kopfhörer funktioniert auf einer Seite nicht mehr. „Ein neuer kostet 80 Euro, das ist für mich zu viel. Ich hoffe, dass man ihn reparieren kann.“ Nach einer halben Stunde ist das Problem gelöst – und Lea hat dabei selbst etwas gelernt.",
        "Die Organisatoren suchen noch Helfer, besonders Leute, die nähen können. Wer Interesse hat, kann einfach am Samstag vorbeikommen.",
      ],
    },
    example: {
      id: 0,
      stem: "Der Artikel informiert über …",
      options: mc("einen Ort, wo man Sachen repariert.", "ein neues Elektrogeschäft.", "einen Flohmarkt in Freiburg."),
      answer: "a",
      explanation: "Repair-Café: eşyaların tamir edildiği yer.",
    },
    tasks: [
      { id: 1, stem: "Im Repair-Café …", options: mc("muss man für jede Reparatur bezahlen.", "lernen die Besucher, wie man Sachen repariert.", "kann man gebrauchte Geräte kaufen."), answer: "b", explanation: "„Helfer zeigen ihnen, wie man die Sachen repariert. Das kostet nichts.“" },
      { id: 2, stem: "Peter Huber …", options: mc("hilft, weil ihm die Arbeit Spaß macht.", "arbeitet noch als Elektriker.", "bekommt Geld für seine Hilfe."), answer: "a", explanation: "„Ich habe Zeit und repariere gern.“ Früher Elektriker → artık değil." },
      { id: 3, stem: "Das Team …", options: mc("kann alle Geräte reparieren.", "repariert die meisten Geräte.", "repariert nur Fahrräder."), answer: "b", explanation: "„Etwa sieben von zehn Geräten“ = çoğu." },
      { id: 4, stem: "Lea möchte keinen neuen Kopfhörer kaufen, weil …", options: mc("er zu teuer ist.", "sie ihn selbst reparieren möchte.", "es keinen neuen gibt."), answer: "a", explanation: "„80 Euro, das ist für mich zu viel“." },
      { id: 5, stem: "Das Repair-Café sucht …", options: mc("Studenten.", "Elektriker.", "Leute, die nähen können."), answer: "c", explanation: "„besonders Leute, die nähen können“." },
    ],
  },
  {
    id: "g1-5",
    title: "Arbeiten im Homeoffice",
    text: {
      kind: "article",
      headline: "Büro am Küchentisch",
      subline: "Viele Menschen arbeiten heute oft von zu Hause – nicht für alle ist das ideal",
      paragraphs: [
        "In Deutschland arbeitet heute etwa jeder vierte Angestellte mindestens einen Tag pro Woche im Homeoffice. Viele finden das praktisch: Sie sparen den Weg zur Arbeit und können ihre Zeit freier planen.",
        "„Ich arbeite montags und freitags zu Hause“, erzählt Ayşe Demir (33), Grafikerin aus Köln. „Dann kann ich meinen Sohn von der Schule abholen. Früher war das nur mit Hilfe meiner Mutter möglich.“",
        "Thomas Lindner (52) sieht das anders. „Zu Hause bin ich oft allein und vermisse meine Kollegen. Außerdem arbeite ich am Abend oft noch weiter, weil der Computer immer da ist.“ Er geht deshalb lieber jeden Tag ins Büro.",
        "Experten raten: Wer zu Hause arbeitet, sollte einen festen Arbeitsplatz haben – nicht den Küchentisch – und feste Pausen machen. Viele Firmen bezahlen inzwischen einen Teil der Kosten für Schreibtisch und Stuhl.",
      ],
    },
    example: {
      id: 0,
      stem: "Der Artikel informiert über …",
      options: mc("neue Küchenmöbel.", "das Arbeiten von zu Hause.", "einen Computerkurs."),
      answer: "b",
      explanation: "Evden çalışma (Homeoffice) konusu.",
    },
    tasks: [
      { id: 1, stem: "Viele Menschen finden das Homeoffice gut, weil …", options: mc("sie nicht zur Arbeit fahren müssen.", "sie mehr Geld verdienen.", "sie weniger arbeiten müssen."), answer: "a", explanation: "„Sie sparen den Weg zur Arbeit“." },
      { id: 2, stem: "Ayşe Demir …", options: mc("arbeitet jeden Tag zu Hause.", "hat mehr Zeit für ihr Kind.", "braucht jetzt mehr Hilfe von ihrer Mutter."), answer: "b", explanation: "Evden çalıştığı günler oğlunu okuldan alabiliyor; artık annesinin yardımına gerek yok." },
      { id: 3, stem: "Thomas Lindner …", options: mc("arbeitet gern allein.", "macht abends oft keine Pause von der Arbeit.", "arbeitet zweimal pro Woche zu Hause."), answer: "b", explanation: "„am Abend oft noch weiter, weil der Computer immer da ist“." },
      { id: 4, stem: "Herr Lindner …", options: mc("geht lieber ins Büro.", "möchte eine neue Arbeit.", "hat keine Kollegen."), answer: "a", explanation: "„Er geht deshalb lieber jeden Tag ins Büro.“" },
      { id: 5, stem: "Experten sagen, man sollte im Homeoffice …", options: mc("am Küchentisch arbeiten.", "keine Pausen machen.", "einen eigenen Arbeitsplatz haben."), answer: "c", explanation: "„einen festen Arbeitsplatz haben – nicht den Küchentisch“." },
    ],
  },
];

// ───────────────────────────── TEIL 2 · Informationstafel ─────────────────────────────

export const GOETHE_A2_TEIL2_SETS: TelcA2Teil1Set[] = [
  {
    id: "g2-1",
    title: "Messe „Wohnen & Leben“",
    board: {
      title: "Messe „Wohnen & Leben“ – Hallenplan",
      floors: [
        { label: "Halle A", items: "Küchen und Küchengeräte / 11–12 Uhr: Kochshow „Schnell und gesund“ / Restaurant „Messeblick“" },
        { label: "Halle B", items: "Möbel für Wohn- und Schlafzimmer / Matratzen / 14–15 Uhr: Vortrag „Besser schlafen“" },
        { label: "Halle C", items: "Garten und Balkon / Pflanzen / Gartenmöbel / Kinderbetreuung (3–10 Jahre)" },
        { label: "Halle D", items: "Energie sparen zu Hause / Beratung: Strom und Heizung / 10–11 Uhr: Vortrag „Weniger zahlen für Strom“" },
        { label: "Halle E", items: "Bad und Sanitär / Licht und Lampen / Information / Erste Hilfe / Fundbüro" },
      ],
    },
    example: { id: 0, situation: "Sie suchen eine neue Matratze.", options: place("Halle A", "Halle B", "andere Halle"), answer: "b", explanation: "Matratzen → Halle B." },
    tasks: [
      { id: 6, situation: "Ihre Stromrechnung ist zu hoch. Sie möchten Tipps.", options: place("Halle D", "Halle E", "andere Halle"), answer: "a", explanation: "„Energie sparen … Beratung: Strom“ → Halle D." },
      { id: 7, situation: "Sie möchten Ihre Kinder für eine Stunde abgeben.", options: place("Halle A", "Halle B", "andere Halle"), answer: "c", explanation: "Kinderbetreuung → Halle C. Seçeneklerde yok → c." },
      { id: 8, situation: "Sie haben Ihren Schlüssel verloren.", options: place("Halle C", "Halle E", "andere Halle"), answer: "b", explanation: "Fundbüro → Halle E." },
      { id: 9, situation: "Sie möchten etwas essen.", options: place("Halle A", "Halle D", "andere Halle"), answer: "a", explanation: "Restaurant „Messeblick“ → Halle A. (Kochshow da orada.)" },
      { id: 10, situation: "Sie suchen Blumen für Ihren Balkon.", options: place("Halle B", "Halle E", "andere Halle"), answer: "c", explanation: "Pflanzen, Balkon → Halle C. Seçeneklerde yok → c." },
    ],
  },
  {
    id: "g2-2",
    title: "Kaufhaus Merkur",
    board: {
      title: "Kaufhaus Merkur – Wegweiser",
      floors: [
        { label: "4. Etage", items: "Restaurant mit Dachterrasse / Friseur / Kundentoiletten / Reisebüro" },
        { label: "3. Etage", items: "Haushaltswaren / Bettwäsche / Teppiche / Lampen / Geschenkservice" },
        { label: "2. Etage", items: "Kindermode / Spielwaren / Schreibwaren / Bücher / Babyartikel" },
        { label: "1. Etage", items: "Damen- und Herrenmode / Sportmode / Bademode / Änderungsschneiderei" },
        { label: "Erdgeschoss", items: "Parfümerie / Uhren und Schmuck / Handtaschen / Kasse und Kundenservice / Schlüsseldienst" },
      ],
    },
    example: { id: 0, situation: "Sie möchten Ihrer Tochter eine Puppe schenken.", options: place("1. Etage", "2. Etage", "andere Etage"), answer: "b", explanation: "Spielwaren → 2. Etage." },
    tasks: [
      { id: 6, situation: "Sie brauchen einen Badeanzug für den Urlaub.", options: place("Erdgeschoss", "1. Etage", "andere Etage"), answer: "b", explanation: "Bademode → 1. Etage." },
      { id: 7, situation: "Sie möchten sich die Haare schneiden lassen.", options: place("3. Etage", "4. Etage", "andere Etage"), answer: "b", explanation: "Friseur → 4. Etage." },
      { id: 8, situation: "Sie möchten eine neue Bettdecke kaufen und das Geschenk schön einpacken lassen.", options: place("2. Etage", "4. Etage", "andere Etage"), answer: "c", explanation: "Bettwäsche + Geschenkservice → 3. Etage. Seçeneklerde yok → c." },
      { id: 9, situation: "Ihre Hose ist zu lang. Sie möchten sie kürzer machen lassen.", options: place("Erdgeschoss", "1. Etage", "andere Etage"), answer: "b", explanation: "Änderungsschneiderei (terzi) → 1. Etage." },
      { id: 10, situation: "Ihr Sohn braucht neue Hefte und Stifte für die Schule.", options: place("2. Etage", "3. Etage", "andere Etage"), answer: "a", explanation: "Schreibwaren → 2. Etage." },
    ],
  },
  {
    id: "g2-3",
    title: "Stadtfest Rosenheim",
    board: {
      title: "Stadtfest Rosenheim – Programm am Samstag",
      floors: [
        { label: "Marktplatz", items: "ab 10 Uhr: Bauernmarkt mit regionalen Produkten / 18 Uhr: Konzert der Stadtkapelle / Information" },
        { label: "Rathausplatz", items: "11–17 Uhr: Kinderfest mit Kinderschminken und Zauberer / Kinderflohmarkt" },
        { label: "Stadtpark", items: "10–12 Uhr: Yoga für alle (kostenlos) / 14 Uhr: Fußballturnier der Vereine / Erste Hilfe" },
        { label: "Am Fluss", items: "ab 12 Uhr: Essen aus aller Welt / 21 Uhr: Feuerwerk" },
        { label: "Stadtbibliothek", items: "15 Uhr: Lesung für Erwachsene „Krimis aus Bayern“ / 16 Uhr: Stadtführung (Treffpunkt vor der Bibliothek)" },
      ],
    },
    example: { id: 0, situation: "Sie möchten Käse und Wurst von Bauern aus der Region kaufen.", options: place("Marktplatz", "Am Fluss", "anderer Ort"), answer: "a", explanation: "Bauernmarkt → Marktplatz." },
    tasks: [
      { id: 6, situation: "Ihre Kinder möchten ihre alten Spielsachen verkaufen.", options: place("Marktplatz", "Rathausplatz", "anderer Ort"), answer: "b", explanation: "Kinderflohmarkt → Rathausplatz." },
      { id: 7, situation: "Sie möchten am Abend Musik hören.", options: place("Stadtpark", "Am Fluss", "anderer Ort"), answer: "c", explanation: "18 Uhr Konzert → Marktplatz. Seçeneklerde yok → c." },
      { id: 8, situation: "Sie möchten die Stadt besser kennenlernen.", options: place("Stadtbibliothek", "Rathausplatz", "anderer Ort"), answer: "a", explanation: "Stadtführung, Treffpunkt vor der Bibliothek → Stadtbibliothek." },
      { id: 9, situation: "Sie möchten Sport machen, aber nichts bezahlen.", options: place("Stadtpark", "Marktplatz", "anderer Ort"), answer: "a", explanation: "Yoga für alle (kostenlos) → Stadtpark." },
      { id: 10, situation: "Sie haben Hunger und möchten internationale Gerichte probieren.", options: place("Marktplatz", "Stadtpark", "anderer Ort"), answer: "c", explanation: "Essen aus aller Welt → Am Fluss. Seçeneklerde yok → c." },
    ],
  },
  {
    id: "g2-4",
    title: "Stadtbibliothek",
    board: {
      title: "Stadtbibliothek Mitte – Übersicht",
      floors: [
        { label: "3. Stock", items: "Lernräume (bitte reservieren) / Sprachkurse auf CD und online / Deutsch als Fremdsprache" },
        { label: "2. Stock", items: "Romane / Krimis / Reiseführer / Zeitschriften und Zeitungen / Lesecafé" },
        { label: "1. Stock", items: "Kinder- und Jugendbücher / Spiele / Vorlesestunde (Mi 15 Uhr)" },
        { label: "Erdgeschoss", items: "Ausleihe und Rückgabe / Anmeldung (Bibliotheksausweis) / Computerarbeitsplätze / Kopierer" },
        { label: "Untergeschoss", items: "Filme (DVD) / Musik-CDs / Schließfächer / Toiletten" },
      ],
    },
    example: { id: 0, situation: "Sie möchten einen Bibliotheksausweis bekommen.", options: place("Erdgeschoss", "1. Stock", "anderer Stock"), answer: "a", explanation: "Anmeldung (Bibliotheksausweis) → Erdgeschoss." },
    tasks: [
      { id: 6, situation: "Sie planen eine Reise nach Italien und brauchen Informationen.", options: place("1. Stock", "2. Stock", "anderer Stock"), answer: "b", explanation: "Reiseführer → 2. Stock." },
      { id: 7, situation: "Sie möchten in Ruhe für eine Prüfung lernen.", options: place("Erdgeschoss", "2. Stock", "anderer Stock"), answer: "c", explanation: "Lernräume → 3. Stock. Seçeneklerde yok → c." },
      { id: 8, situation: "Sie möchten Ihre Jacke und Ihre Tasche einschließen.", options: place("Erdgeschoss", "Untergeschoss", "anderer Stock"), answer: "b", explanation: "Schließfächer → Untergeschoss." },
      { id: 9, situation: "Sie möchten eine Seite aus einem Buch kopieren.", options: place("Erdgeschoss", "3. Stock", "anderer Stock"), answer: "a", explanation: "Kopierer → Erdgeschoss." },
      { id: 10, situation: "Ihre Tochter (6) möchte eine Geschichte hören.", options: place("2. Stock", "3. Stock", "anderer Stock"), answer: "c", explanation: "Vorlesestunde → 1. Stock. Seçeneklerde yok → c." },
    ],
  },
  {
    id: "g2-5",
    title: "Tag der offenen Tür – Universität",
    board: {
      title: "Universität Bremen – Tag der offenen Tür",
      floors: [
        { label: "Gebäude A", items: "Studienberatung: Welches Fach passt zu mir? / Anmeldung und Bewerbung / Information" },
        { label: "Gebäude B", items: "Medizin und Biologie: Labore besichtigen / 13 Uhr: Vortrag „Gesund im Studium“" },
        { label: "Gebäude C", items: "Sprachenzentrum: Deutschkurse für internationale Studierende / Auslandsbüro: Studieren im Ausland" },
        { label: "Gebäude D", items: "Informatik und Technik / Roboter-Ausstellung / 11 Uhr: Mini-Programmierkurs" },
        { label: "Mensa", items: "Mittagessen 11:30–14 Uhr / Studentenwerk: Wohnheimzimmer und BAföG-Beratung" },
      ],
    },
    example: { id: 0, situation: "Sie wissen noch nicht, was Sie studieren möchten.", options: place("Gebäude A", "Gebäude C", "anderes Gebäude"), answer: "a", explanation: "Studienberatung → Gebäude A." },
    tasks: [
      { id: 6, situation: "Sie möchten ein Semester in Spanien studieren.", options: place("Gebäude A", "Gebäude C", "anderes Gebäude"), answer: "b", explanation: "Auslandsbüro → Gebäude C." },
      { id: 7, situation: "Sie suchen ein günstiges Zimmer für das Studium.", options: place("Gebäude A", "Gebäude D", "anderes Gebäude"), answer: "c", explanation: "Wohnheimzimmer → Mensa (Studentenwerk). Seçeneklerde yok → c." },
      { id: 8, situation: "Ihr Sohn interessiert sich für Roboter.", options: place("Gebäude B", "Gebäude D", "anderes Gebäude"), answer: "b", explanation: "Roboter-Ausstellung → Gebäude D." },
      { id: 9, situation: "Sie möchten Medizin studieren und die Labore sehen.", options: place("Gebäude B", "Mensa", "anderes Gebäude"), answer: "a", explanation: "Medizin, Labore → Gebäude B." },
      { id: 10, situation: "Sie kommen aus dem Ausland und müssen Ihr Deutsch verbessern.", options: place("Gebäude A", "Gebäude D", "anderes Gebäude"), answer: "c", explanation: "Deutschkurse → Gebäude C. Seçeneklerde yok → c." },
    ],
  },
];

// ───────────────────────────── TEIL 3 · E-Mail ─────────────────────────────

export const GOETHE_A2_TEIL3_SETS: McTextSet[] = [
  {
    id: "g3-1",
    title: "Die neue Stelle",
    text: {
      kind: "email",
      greeting: "Liebe Tante Helga,",
      paragraphs: [
        "vielen Dank für deine Karte zum Geburtstag! Entschuldige, dass ich erst jetzt antworte, aber die letzten Wochen waren sehr stressig. Ich habe nämlich eine neue Stelle!",
        "Seit dem 1. März arbeite ich in einem Hotel in Hamburg an der Rezeption. Die Arbeit gefällt mir sehr, weil ich jeden Tag Gäste aus der ganzen Welt kennenlerne. Endlich kann ich mein Englisch und mein Spanisch benutzen. Nur die Arbeitszeiten sind nicht so toll: Manchmal muss ich nachts oder am Wochenende arbeiten.",
        "Eine Wohnung in Hamburg zu finden war nicht leicht. Die ersten zwei Wochen habe ich bei einem Kollegen auf dem Sofa geschlafen. Jetzt habe ich ein kleines Zimmer in einer WG gefunden – mit zwei Studentinnen. Sie sind sehr nett und wir kochen oft zusammen.",
        "Im Mai habe ich eine Woche Urlaub. Dann möchte ich nach Hause fahren und euch alle besuchen. Mama hat gesagt, dass du im Mai Geburtstag feierst – ich komme natürlich!",
      ],
      closing: ["Viele liebe Grüße", "dein Jonas"],
    },
    tasks: [
      { id: 11, stem: "Jonas antwortet spät, weil …", options: mc("er krank war.", "er viel zu tun hatte.", "er die Karte nicht bekommen hat."), answer: "b", explanation: "„die letzten Wochen waren sehr stressig“ – yeni iş." },
      { id: 12, stem: "An seiner neuen Arbeit gefällt Jonas besonders, dass …", options: mc("er Fremdsprachen sprechen kann.", "er nur am Tag arbeitet.", "er am Wochenende frei hat."), answer: "a", explanation: "„Endlich kann ich mein Englisch und mein Spanisch benutzen.“ Gece ve hafta sonu da çalışıyor." },
      { id: 13, stem: "Jonas wohnt jetzt …", options: mc("bei einem Kollegen.", "allein in einer Wohnung.", "mit anderen Leuten zusammen."), answer: "c", explanation: "WG mit zwei Studentinnen. Kollegen yanında sadece ilk iki hafta kaldı." },
      { id: 14, stem: "Im Mai möchte Jonas …", options: mc("seine Familie besuchen.", "nach Spanien fahren.", "eine Party in Hamburg machen."), answer: "a", explanation: "„nach Hause fahren und euch alle besuchen“." },
      { id: 15, stem: "Tante Helga …", options: mc("hat im März Geburtstag.", "feiert im Mai ihren Geburtstag.", "kommt im Mai nach Hamburg."), answer: "b", explanation: "„dass du im Mai Geburtstag feierst“." },
    ],
  },
  {
    id: "g3-2",
    title: "Urlaub in den Bergen",
    text: {
      kind: "email",
      greeting: "Hallo Lukas,",
      paragraphs: [
        "viele Grüße aus Österreich! Wir sind jetzt seit fünf Tagen in Tirol. Leider hat der Urlaub nicht so gut angefangen: Unser Zug hatte drei Stunden Verspätung und wir sind erst um Mitternacht im Hotel angekommen. Zum Glück hat der Mann an der Rezeption auf uns gewartet.",
        "Das Hotel ist sehr schön und das Frühstück ist super. Unser Zimmer hat einen Balkon mit Blick auf die Berge. Nur das Schwimmbad ist leider geschlossen, weil es repariert wird. Die Kinder sind darüber natürlich traurig.",
        "Am Montag haben wir eine lange Wanderung gemacht. Am Dienstag hat es den ganzen Tag geregnet, deshalb waren wir im Museum. Morgen wollen wir mit der Seilbahn auf den höchsten Berg fahren. Ich habe ein bisschen Angst, aber Emma freut sich schon sehr.",
        "Kannst du bitte am Wochenende unsere Blumen gießen? Der Schlüssel liegt bei Frau Kraus im Erdgeschoss. Wir kommen am Montag zurück.",
      ],
      closing: ["Liebe Grüße", "Sabine"],
    },
    tasks: [
      { id: 11, stem: "Am ersten Tag …", options: mc("ist die Familie sehr spät angekommen.", "war das Hotel schon geschlossen.", "hat die Familie den Zug verpasst."), answer: "a", explanation: "Tren 3 saat gecikti, „erst um Mitternacht“ geldiler. Resepsiyon bekledi." },
      { id: 12, stem: "Im Hotel …", options: mc("gibt es kein Frühstück.", "kann man im Moment nicht schwimmen.", "haben die Zimmer keinen Balkon."), answer: "b", explanation: "„das Schwimmbad ist leider geschlossen“." },
      { id: 13, stem: "Am Dienstag …", options: mc("ist die Familie gewandert.", "hat die Familie ein Museum besucht.", "ist die Familie mit der Seilbahn gefahren."), answer: "b", explanation: "Yağmur yağdı → „waren wir im Museum“." },
      { id: 14, stem: "Sabine …", options: mc("freut sich sehr auf die Fahrt mit der Seilbahn.", "möchte nicht auf den Berg fahren.", "ist ein bisschen nervös wegen der Seilbahn."), answer: "c", explanation: "„Ich habe ein bisschen Angst“. Sevinen Emma." },
      { id: 15, stem: "Lukas soll …", options: mc("die Blumen der Familie gießen.", "Frau Kraus den Schlüssel bringen.", "die Familie am Montag abholen."), answer: "a", explanation: "„Kannst du bitte am Wochenende unsere Blumen gießen?“ Anahtar Frau Kraus'ta." },
    ],
  },
  {
    id: "g3-3",
    title: "Die Geburtstagsparty",
    text: {
      kind: "email",
      greeting: "Liebe Nora,",
      paragraphs: [
        "nächsten Monat wird mein Mann Daniel 40 Jahre alt. Ich möchte für ihn eine Überraschungsparty machen – er darf also noch nichts wissen! Die Party ist am Samstag, den 14. Juni, ab 19 Uhr.",
        "Zuerst wollte ich die Party bei uns im Garten machen. Aber wir haben fast 50 Gäste eingeladen und unser Garten ist zu klein. Jetzt habe ich einen Raum im Restaurant „Am See“ gemietet. Dort gibt es auch Platz zum Tanzen.",
        "Kannst du mir helfen? Du backst doch so tolle Kuchen! Vielleicht kannst du einen Schokoladenkuchen machen? Das Essen bestelle ich im Restaurant, aber den Kuchen möchte ich lieber selbst organisieren.",
        "Daniels Bruder holt ihn um halb acht ab und sagt, dass sie zusammen ins Kino gehen. Bitte sei pünktlich um sieben da, damit alle Gäste schon da sind, wenn Daniel kommt. Und schreib mir bitte keine Nachrichten auf mein Handy, Daniel liest manchmal mit! Ruf mich lieber im Büro an.",
      ],
      closing: ["Bis bald und liebe Grüße", "Katrin"],
    },
    tasks: [
      { id: 11, stem: "Katrin plant die Party, …", options: mc("aber Daniel weiß schon davon.", "ohne dass Daniel davon weiß.", "zusammen mit Daniel."), answer: "b", explanation: "Überraschungsparty – „er darf also noch nichts wissen“." },
      { id: 12, stem: "Die Party ist nicht im Garten, weil …", options: mc("das Wetter schlecht sein kann.", "zu viele Leute kommen.", "die Nachbarn sich beschweren."), answer: "b", explanation: "„fast 50 Gäste … unser Garten ist zu klein“." },
      { id: 13, stem: "Nora soll …", options: mc("das Essen bestellen.", "einen Kuchen backen.", "einen Raum mieten."), answer: "b", explanation: "„Vielleicht kannst du einen Schokoladenkuchen machen?“" },
      { id: 14, stem: "Daniel denkt, dass er am Abend …", options: mc("mit seinem Bruder ins Kino geht.", "im Restaurant arbeiten muss.", "seinen Geburtstag zu Hause feiert."), answer: "a", explanation: "Kardeşi „sagt, dass sie zusammen ins Kino gehen“." },
      { id: 15, stem: "Nora soll Katrin …", options: mc("eine Nachricht schreiben.", "auf dem Handy anrufen.", "bei der Arbeit anrufen."), answer: "c", explanation: "„Ruf mich lieber im Büro an.“ Mesaj yazmamalı." },
    ],
  },
  {
    id: "g3-4",
    title: "Sprachkurs in Berlin",
    text: {
      kind: "email",
      greeting: "Hallo Elena,",
      paragraphs: [
        "jetzt bin ich schon drei Wochen in Berlin und mache hier einen Deutschkurs. Der Kurs ist jeden Tag von 9 bis 13 Uhr. In meiner Klasse sind zwölf Leute aus acht Ländern. Unsere Lehrerin ist sehr freundlich, aber sie spricht ziemlich schnell. Am Anfang habe ich wenig verstanden, jetzt geht es schon besser.",
        "Ich wohne bei einer Gastfamilie. Herr und Frau Schulz haben zwei Kinder, Max und Lina. Mit den Kindern spreche ich am meisten Deutsch, denn sie können kein Englisch! Frau Schulz kocht jeden Abend, nur am Wochenende muss ich mich selbst um das Essen kümmern.",
        "Nachmittags habe ich frei. Oft gehe ich mit Leuten aus dem Kurs in ein Museum oder in einen Park. Letzten Samstag waren wir auf einem großen Flohmarkt. Dort habe ich eine alte Kamera für nur 15 Euro gekauft!",
        "Der Kurs dauert noch zwei Wochen. Danach möchte ich noch ein paar Tage nach Dresden fahren. Warst du nicht letztes Jahr dort? Kannst du mir ein gutes und billiges Hotel empfehlen?",
      ],
      closing: ["Viele Grüße", "Paula"],
    },
    tasks: [
      { id: 11, stem: "Im Deutschkurs …", options: mc("versteht Paula jetzt mehr als am Anfang.", "spricht die Lehrerin sehr langsam.", "sind alle Leute aus einem Land."), answer: "a", explanation: "„Am Anfang habe ich wenig verstanden, jetzt geht es schon besser.“" },
      { id: 12, stem: "Paula spricht am meisten Deutsch mit …", options: mc("Herrn und Frau Schulz.", "den Kindern der Familie.", "den Leuten aus dem Kurs."), answer: "b", explanation: "„Mit den Kindern spreche ich am meisten Deutsch“." },
      { id: 13, stem: "Am Wochenende …", options: mc("kocht Frau Schulz für Paula.", "muss Paula selbst etwas zu essen machen.", "geht Paula mit der Familie essen."), answer: "b", explanation: "„nur am Wochenende muss ich mich selbst um das Essen kümmern“." },
      { id: 14, stem: "Auf dem Flohmarkt hat Paula …", options: mc("eine Kamera gekauft.", "Leute aus dem Kurs getroffen.", "15 Euro verloren."), answer: "a", explanation: "„eine alte Kamera für nur 15 Euro gekauft“." },
      { id: 15, stem: "Paula möchte von Elena …", options: mc("eine Einladung nach Dresden.", "einen Tipp für eine Unterkunft.", "Informationen über den Kurs."), answer: "b", explanation: "„Kannst du mir ein gutes und billiges Hotel empfehlen?“" },
    ],
  },
  {
    id: "g3-5",
    title: "Ein gebrochenes Bein",
    text: {
      kind: "email",
      greeting: "Lieber Markus,",
      paragraphs: [
        "leider habe ich keine guten Nachrichten: Ich kann am Samstag nicht zu deiner Hochzeit kommen. Letzten Sonntag bin ich beim Skifahren gestürzt und habe mir das Bein gebrochen. Ich war zwei Tage im Krankenhaus, jetzt bin ich wieder zu Hause.",
        "Der Arzt sagt, dass ich sechs Wochen nicht laufen darf. Ich muss die ganze Zeit zu Hause bleiben. Das ist so langweilig! Zum Glück hilft mir meine Schwester. Sie kauft für mich ein und kommt jeden Abend vorbei.",
        "Es tut mir wirklich sehr leid, dass ich bei deinem großen Tag nicht dabei sein kann. Ich habe dir schon ein Geschenk gekauft. Mein Freund Tim kommt ja auch zur Hochzeit – er bringt es dir mit.",
        "Kannst du mir bitte ein paar Fotos von der Feier schicken? Und wenn ihr aus den Flitterwochen zurück seid, müsst ihr mich unbedingt besuchen. Dann koche ich für euch – sitzen kann ich ja!",
      ],
      closing: ["Herzliche Grüße", "dein Stefan"],
    },
    tasks: [
      { id: 11, stem: "Stefan schreibt, weil er …", options: mc("Markus zur Hochzeit einladen möchte.", "nicht zur Hochzeit kommen kann.", "im Krankenhaus arbeitet."), answer: "b", explanation: "„Ich kann am Samstag nicht zu deiner Hochzeit kommen.“" },
      { id: 12, stem: "Stefan …", options: mc("ist noch im Krankenhaus.", "hatte einen Unfall beim Sport.", "darf in zwei Wochen wieder laufen."), answer: "b", explanation: "„beim Skifahren gestürzt“. Hastaneden çıktı; 6 hafta yürüyemeyecek." },
      { id: 13, stem: "Stefans Schwester …", options: mc("macht für ihn die Einkäufe.", "wohnt bei ihm.", "kommt zur Hochzeit."), answer: "a", explanation: "„Sie kauft für mich ein und kommt jeden Abend vorbei.“" },
      { id: 14, stem: "Das Geschenk für Markus …", options: mc("schickt Stefan mit der Post.", "bringt Tim zur Hochzeit mit.", "kauft Stefan später."), answer: "b", explanation: "„Mein Freund Tim … bringt es dir mit.“" },
      { id: 15, stem: "Nach den Flitterwochen …", options: mc("möchte Stefan das Paar besuchen.", "soll das Paar zu Stefan kommen.", "schickt Markus Fotos."), answer: "b", explanation: "„müsst ihr mich unbedingt besuchen. Dann koche ich für euch“. Fotoğrafları düğünden sonra istiyor." },
    ],
  },
];

// ───────────────────────────── TEIL 4 · Anzeigen ─────────────────────────────

export const GOETHE_A2_TEIL4_SETS: TelcA2Teil3Set[] = [
  {
    id: "g4-1",
    title: "Sport und Bewegung",
    ads: [
      { key: "a", title: "www.schwimmen-lernen.de", lines: ["Schwimmkurse für Kinder ab 5 Jahren", "Kleine Gruppen, erfahrene Trainer", "Kurs: 10 × 45 Minuten, 90 €"] },
      { key: "b", title: "www.fitness-plus.de", lines: ["Fitnessstudio im Zentrum", "Geöffnet täglich 6–24 Uhr", "Jetzt anmelden: 3 Monate zum halben Preis!"] },
      { key: "c", title: "www.sportschuhe-outlet.de", lines: ["Lauf- und Fußballschuhe aller Marken", "Bis zu 50 % billiger", "Lieferung in 2 Tagen"] },
      { key: "d", title: "www.tanzen-ab-60.de", lines: ["Tanzkurse für Seniorinnen und Senioren", "Walzer, Tango, Discofox", "Ohne Partner möglich – Mo und Do 10 Uhr"] },
      { key: "e", title: "www.wandergruppe-harz.de", lines: ["Wir wandern jeden Sonntag im Harz", "Für alle, die gern draußen sind", "Neue Mitglieder herzlich willkommen!"] },
      { key: "f", title: "www.radverleih-am-see.de", lines: ["Fahrräder und E-Bikes mieten", "Ab 12 € pro Tag", "Mit Karte für schöne Touren um den See"] },
    ],
    example: { id: 0, situation: "Leon (6) soll schwimmen lernen.", answer: "a", explanation: "Schwimmkurse für Kinder → a." },
    tasks: [
      { id: 16, situation: "Gisela ist 67 und möchte mit anderen Menschen tanzen, aber ihr Mann hat keine Lust.", answer: "d", explanation: "Tanzkurse für Senioren, „ohne Partner möglich“ → d." },
      { id: 17, situation: "Felix arbeitet bis spät abends und möchte danach noch trainieren.", answer: "b", explanation: "Fitnessstudio täglich bis 24 Uhr → b." },
      { id: 18, situation: "Familie Kaya macht Urlaub am See und möchte dort Rad fahren. Sie haben aber keine Fahrräder dabei.", answer: "f", explanation: "Fahrräder mieten am See → f." },
      { id: 19, situation: "Martin sucht günstige Schuhe zum Joggen.", answer: "c", explanation: "Laufschuhe, bis zu 50 % billiger → c." },
      { id: 20, situation: "Anna möchte Tennis spielen lernen.", answer: "x", explanation: "Tenis ilanı yok → X. (e yürüyüş grubu kullanılmadı.)" },
    ],
  },
  {
    id: "g4-2",
    title: "Wohnung und Möbel",
    ads: [
      { key: "a", title: "www.moebel-gebraucht.de", lines: ["Gebrauchte Möbel in gutem Zustand", "Sofas, Schränke, Tische – sehr günstig", "Wir holen auch Ihre alten Möbel ab"] },
      { key: "b", title: "www.umzug-express.de", lines: ["Umzüge in ganz Deutschland", "Wir packen für Sie ein und aus", "Kostenloses Angebot in 24 Stunden"] },
      { key: "c", title: "www.wg-zimmer-finden.de", lines: ["Zimmer in Wohngemeinschaften", "In über 50 Städten", "Für Studierende und junge Berufstätige"] },
      { key: "d", title: "www.malermeister-roth.de", lines: ["Wir streichen Ihre Wohnung", "Schnell, sauber, zuverlässig", "Auch Tapezieren"] },
      { key: "e", title: "www.kuechenstudio-nord.de", lines: ["Neue Küchen nach Maß", "Planung bei Ihnen zu Hause", "Jetzt 15 % Rabatt"] },
      { key: "f", title: "www.ferienhaus-ostsee.de", lines: ["Ferienhäuser direkt am Meer", "Für Familien mit Kindern", "Haustiere erlaubt"] },
    ],
    example: { id: 0, situation: "Herr Weber zieht von München nach Berlin und braucht Hilfe beim Transport.", answer: "b", explanation: "Umzüge in ganz Deutschland → b." },
    tasks: [
      { id: 16, situation: "Julia beginnt ihr Studium in Köln und sucht ein günstiges Zimmer.", answer: "c", explanation: "WG-Zimmer für Studierende → c." },
      { id: 17, situation: "Familie Öztürk möchte die Wände im Kinderzimmer neu streichen lassen.", answer: "d", explanation: "„Wir streichen Ihre Wohnung“ → d." },
      { id: 18, situation: "Peter hat wenig Geld und braucht einen Kleiderschrank.", answer: "a", explanation: "Gebrauchte Möbel, sehr günstig → a." },
      { id: 19, situation: "Frau Lang möchte ihre Wohnung in Hamburg für ein Jahr vermieten.", answer: "x", explanation: "Ev kiraya veren / emlak ilanı yok → X. (f tatil evi kiralıyor, başkasının evini kiraya vermiyor.)" },
      { id: 20, situation: "Ehepaar Schmidt möchte eine neue Küche kaufen.", answer: "e", explanation: "Neue Küchen → e." },
    ],
  },
  {
    id: "g4-3",
    title: "Reisen",
    ads: [
      { key: "a", title: "www.sprachreisen-jung.de", lines: ["Sprachferien für Jugendliche (14–17 Jahre)", "England, Irland, Malta", "Unterricht am Vormittag, Freizeitprogramm am Nachmittag"] },
      { key: "b", title: "www.bahn-sparpreis.de", lines: ["Mit dem Zug durch Europa", "Tickets schon ab 19 €", "Früh buchen und sparen!"] },
      { key: "c", title: "www.kreuzfahrt-traum.de", lines: ["Kreuzfahrten im Mittelmeer", "7 Tage ab 899 €", "Mit Pool, Theater und Restaurants an Bord"] },
      { key: "d", title: "www.camping-schwarzwald.de", lines: ["Campingplatz mitten im Wald", "Zelte und Wohnwagen zu mieten", "Spielplatz und Grillplatz"] },
      { key: "e", title: "www.staedtereisen-wochenende.de", lines: ["Wochenendreisen nach Paris, Rom und Prag", "Flug und Hotel zusammen", "Ideal für Paare"] },
      { key: "f", title: "www.reiseversicherung24.de", lines: ["Krank im Urlaub?", "Wir bezahlen Arzt und Krankenhaus im Ausland", "Online abschließen in 5 Minuten"] },
    ],
    example: { id: 0, situation: "Tom möchte mit dem Zug billig nach Amsterdam fahren.", answer: "b", explanation: "Zug, Tickets ab 19 € → b." },
    tasks: [
      { id: 16, situation: "Lisa (15) möchte in den Sommerferien Englisch lernen.", answer: "a", explanation: "Sprachferien für Jugendliche, England → a." },
      { id: 17, situation: "Familie Wolf mit drei Kindern möchte billig Urlaub in der Natur machen.", answer: "d", explanation: "Camping im Wald, Spielplatz → d." },
      { id: 18, situation: "Sandra und Ben möchten zu zweit ein romantisches Wochenende in einer Großstadt verbringen.", answer: "e", explanation: "Wochenendreisen Paris/Rom/Prag, ideal für Paare → e." },
      { id: 19, situation: "Herr Ahmadi fliegt in die USA und möchte sicher sein, dass er beim Arzt nichts bezahlen muss.", answer: "f", explanation: "Arzt und Krankenhaus im Ausland → f." },
      { id: 20, situation: "Clara sucht einen Ferienjob in einem Hotel.", answer: "x", explanation: "İş ilanı yok → X. (c gemi turu kullanılmadı.)" },
    ],
  },
  {
    id: "g4-4",
    title: "Kurse und Lernen",
    ads: [
      { key: "a", title: "www.nachhilfe-mathe.de", lines: ["Nachhilfe in Mathematik und Physik", "Für Schüler der Klassen 5–13", "Ich komme zu Ihnen nach Hause"] },
      { key: "b", title: "www.vhs-kochkurse.de", lines: ["Kochen wie in Italien, Thailand oder Indien", "Abendkurse, 4 Termine", "Alle Zutaten inklusive"] },
      { key: "c", title: "www.computer-fuer-senioren.de", lines: ["Internet, E-Mail, Videotelefonie", "Langsam und mit viel Geduld", "Kleine Gruppen ab 60 Jahren"] },
      { key: "d", title: "www.fotokurs-online.de", lines: ["Bessere Fotos mit dem Handy", "Online-Kurs – lernen, wann Sie wollen", "Nur 29 €"] },
      { key: "e", title: "www.gitarre-lernen-berlin.de", lines: ["Gitarrenunterricht für Erwachsene", "Einzelstunden am Abend", "Erste Stunde gratis"] },
      { key: "f", title: "www.deutsch-am-arbeitsplatz.de", lines: ["Deutschkurse für Berufstätige", "Telefonieren, E-Mails schreiben, Besprechungen", "Samstags 9–13 Uhr"] },
    ],
    example: { id: 0, situation: "Jonas (14) hat schlechte Noten in Mathe.", answer: "a", explanation: "Nachhilfe Mathematik → a." },
    tasks: [
      { id: 16, situation: "Oma Inge (72) möchte mit ihren Enkeln im Ausland per Video sprechen.", answer: "c", explanation: "Videotelefonie, ab 60 Jahren → c." },
      { id: 17, situation: "Mehmet arbeitet in einer Firma und möchte am Wochenende sein Deutsch für den Beruf verbessern.", answer: "f", explanation: "Deutsch für Berufstätige, samstags → f." },
      { id: 18, situation: "Sophie hat wenig Zeit und möchte von zu Hause lernen, schönere Bilder zu machen.", answer: "d", explanation: "Online-Fotokurs, lernen, wann Sie wollen → d." },
      { id: 19, situation: "Daniel möchte für seine Freunde asiatisch kochen lernen.", answer: "b", explanation: "Kochen wie in Thailand oder Indien → b." },
      { id: 20, situation: "Lea (8) möchte Klavier spielen lernen.", answer: "x", explanation: "Piyano kursu yok; e gitar ve sadece yetişkinler için → X." },
    ],
  },
  {
    id: "g4-5",
    title: "Essen und Trinken",
    ads: [
      { key: "a", title: "www.pizza-blitz.de", lines: ["Pizza, Pasta und Salate", "Lieferung bis 23 Uhr", "Ab 15 € kostenlos"] },
      { key: "b", title: "www.vegan-und-lecker.de", lines: ["Vegetarisches und veganes Restaurant", "Mittagstisch für 9,90 €", "Mo–Fr 11:30–15 Uhr"] },
      { key: "c", title: "www.catering-feste.de", lines: ["Essen für Ihre Feier", "Hochzeit, Geburtstag, Firmenfest", "Von 20 bis 300 Personen"] },
      { key: "d", title: "www.bio-kiste.de", lines: ["Frisches Bio-Obst und -Gemüse", "Jede Woche direkt zu Ihnen nach Hause", "Erste Kiste zum halben Preis"] },
      { key: "e", title: "www.cafe-kuchenzeit.de", lines: ["Hausgemachte Torten und Kuchen", "Großer Garten, Spielecke für Kinder", "Sonntags Frühstücksbuffet"] },
      { key: "f", title: "www.weinprobe-mosel.de", lines: ["Weinproben im Weingut", "Mit kleinem Essen", "Nur Gruppen ab 10 Personen"] },
    ],
    example: { id: 0, situation: "Paul möchte spät am Abend noch Essen nach Hause bestellen.", answer: "a", explanation: "Lieferung bis 23 Uhr → a." },
    tasks: [
      { id: 16, situation: "Familie Becker feiert die Hochzeit ihrer Tochter mit 120 Gästen und braucht Essen.", answer: "c", explanation: "Catering für Hochzeit, bis 300 Personen → c." },
      { id: 17, situation: "Miriam isst kein Fleisch und sucht ein günstiges Mittagessen in der Nähe ihres Büros.", answer: "b", explanation: "Vegetarisch/vegan, Mittagstisch 9,90 € → b." },
      { id: 18, situation: "Herr und Frau Klein möchten am Sonntag mit ihren kleinen Kindern frühstücken gehen.", answer: "e", explanation: "Sonntags Frühstücksbuffet, Spielecke → e." },
      { id: 19, situation: "Tim hat keine Zeit zum Einkaufen und möchte trotzdem frisches Gemüse essen.", answer: "d", explanation: "Bio-Gemüse jede Woche nach Hause → d." },
      { id: 20, situation: "Karin und ihr Mann möchten zu zweit eine Weinprobe machen.", answer: "x", explanation: "f sadece 10 kişiden büyük gruplar için → X." },
    ],
  },
];
