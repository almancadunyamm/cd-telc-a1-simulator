// Sınav Hazırlık → Goethe-Zertifikat B1 → Lesen (65 Minuten, 30 Aufgaben)
// Goethe-Zertifikat B1 Modellsatz (Erwachsene / Jugendliche) ve Übungssatz formatı birebir örnek alınarak
// hazırlanmış özgün alıştırmalar.
//   Teil 1 (10 dk): Blog / e-posta + Beispiel 0 + 6 cümle (1–6), Richtig / Falsch.
//   Teil 2 (20 dk): İki basın metni; ilkinde Beispiel 0. Görev 7–9 ve 10–12, a / b / c.
//   Teil 3 (10 dk): 7 durum (13–19) + 10 ilan a–j; örnekteki ilan tekrar kullanılamaz; bir durum için ilan yok → 0.
//   Teil 4 (15 dk): Bir konu hakkında 7 okur yorumu (20–26) + örnek; kişi … yanlısı mı? Ja / Nein.
//   Teil 5 (10 dk): Kurallar metni (Hausordnung vb.) + 4 görev (27–30), a / b / c.

import type { McOption, McTask, McTextSet } from "./goethe_a2_lesen";
import type { TelcA2Teil2Set, TelcA2Teil3Set } from "./telc_a2_lesen";

export type DoubleTextSet = {
  id: string;
  title: string;
  parts: McTextSet[];
  tasks: McTask[]; // parts içindeki görevlerin düz listesi (puanlama için)
};

export type YesNoSet = {
  id: string;
  title: string;
  context: string;
  question: string; // ör. "Ist die Person für ein Handyverbot an Schulen?"
  example: { id: number; name: string; text: string; answer: "ja" | "nein" };
  tasks: { id: number; name: string; text: string; answer: "ja" | "nein"; explanation: string }[];
};

export const GOETHE_B1_INSTRUCTIONS = {
  teil1: {
    de: ["Lesen Sie den Text und die Aufgaben 1 bis 6 dazu.", "Wählen Sie: Sind die Aussagen Richtig oder Falsch?"],
    tr: "Metni okuyun. Cümle metindeki bilgiyle aynıysa Richtig, farklıysa ya da metinde yoksa Falsch işaretleyin. Cümleler metindeki sırayı izler.",
  },
  teil2: {
    de: [
      "Lesen Sie die Texte aus der Presse und die Aufgaben 7 bis 12 dazu.",
      "Wählen Sie bei jeder Aufgabe die richtige Lösung a, b oder c.",
    ],
    tr: "İki basın metni var. İlk metin 7–9, ikinci metin 10–12 numaralı görevlere aittir. İlk görev genellikle metnin ana konusunu sorar.",
  },
  teil3: {
    de: [
      "Lesen Sie die Situationen 13 bis 19 und die Anzeigen a bis j aus verschiedenen deutschsprachigen Medien.",
      "Wählen Sie: Welche Anzeige passt zu welcher Situation? Sie können jede Anzeige nur einmal verwenden.",
      "Die Anzeige aus dem Beispiel können Sie nicht mehr verwenden. Für eine Situation gibt es keine passende Anzeige. In diesem Fall schreiben Sie 0.",
    ],
    tr: "Her duruma uyan ilanı seçin. Örnekteki ilan seçilemez, her ilan bir kez kullanılır. Bir durum için ilan yoktur → 0.",
  },
  teil4: {
    de: ["Lesen Sie die Texte 20 bis 26.", "Wählen Sie: Ist die Person dafür?"],
    tr: "Her okur yorumunu okuyun ve kişinin konuya karşı mı (Nein) yoksa destekliyor mu (Ja) olduğuna karar verin. Kişinin ana fikrine bakın, tek tek cümlelere değil.",
  },
  teil5: {
    de: ["Lesen Sie die Aufgaben 27 bis 30 und den Text dazu.", "Wählen Sie bei jeder Aufgabe die richtige Lösung a, b oder c."],
    tr: "Önce görevleri okuyun, sonra kurallar metninde ilgili bölümü bulun. Ayrıntılara dikkat: muss / darf nicht / kann, kostenlos / Gebühr, Ausnahme.",
  },
};

const o = (a: string, b: string, c: string): McOption[] => [
  { key: "a", text: a },
  { key: "b", text: b },
  { key: "c", text: c },
];

const double = (id: string, title: string, parts: McTextSet[]): DoubleTextSet => ({
  id,
  title,
  parts,
  tasks: parts.flatMap((p) => p.tasks),
});

// ───────────────────────────── TEIL 1 · Blog / E-Mail · Richtig/Falsch ─────────────────────────────

export const GOETHE_B1_TEIL1_SETS: TelcA2Teil2Set[] = [
  {
    id: "gb1t1-1",
    title: "Blog: Mein erster Monat in der WG",
    article: {
      headline: "JanasStadtleben.de – Mein erster Monat in der WG",
      paragraphs: [
        "Samstag, 4. Oktober",
        "Hallo ihr Lieben! Jetzt wohne ich schon einen Monat in Hamburg und habe endlich Zeit, euch zu erzählen, wie es mir in meiner neuen WG geht. Ehrlich gesagt hatte ich vorher ein bisschen Angst. Ich habe ja bisher immer bei meinen Eltern gewohnt und musste mich nie um Einkaufen oder Putzen kümmern.",
        "Gefunden habe ich das Zimmer über eine Internetseite. Zum Kennenlernen haben mich meine beiden Mitbewohner Ole und Fatima zu einem Abendessen eingeladen. Ole hat eine Gemüsesuppe gekocht, die leider total versalzen war – wir haben trotzdem viel gelacht. Am nächsten Tag hat er mich angerufen und gesagt, dass ich das Zimmer haben kann.",
        "Natürlich gibt es auch Regeln. Jede Woche ist jemand anderes für Bad und Küche verantwortlich. Das steht auf einem Plan an der Kühlschranktür. Lebensmittel kauft jeder für sich, nur Dinge wie Putzmittel, Kaffee und Toilettenpapier bezahlen wir aus einer gemeinsamen Kasse. Am Anfang habe ich das oft vergessen, inzwischen klappt es aber gut.",
        "Am schönsten sind die Sonntage. Dann frühstücken wir zusammen, meistens bis mittags. Fatima backt dafür oft Brot, und Ole bringt frische Brötchen vom Bäcker mit. Letzte Woche haben wir sogar die Nachbarn aus dem zweiten Stock eingeladen.",
        "Nur eine Sache stört mich: Die Wohnung liegt direkt an einer großen Straße, und nachts ist es manchmal ziemlich laut. Ich überlege, ob ich mir Ohrstöpsel kaufe – oder ob ich einfach damit leben lerne.",
        "Bis bald, eure Jana",
      ],
    },
    example: { id: 0, statement: "Jana lebt seit einem Monat in Hamburg.", answer: "richtig", explanation: "„Jetzt wohne ich schon einen Monat in Hamburg“." },
    tasks: [
      { id: 1, statement: "Jana hatte schon vorher allein gewohnt.", answer: "falsch", explanation: "„Ich habe ja bisher immer bei meinen Eltern gewohnt.“" },
      { id: 2, statement: "Beim ersten Treffen hat das Essen nicht gut geschmeckt.", answer: "richtig", explanation: "Çorba „total versalzen“ – çok tuzlu." },
      { id: 3, statement: "Jana musste lange auf eine Antwort warten.", answer: "falsch", explanation: "„Am nächsten Tag hat er mich angerufen“ – hemen ertesi gün." },
      { id: 4, statement: "Die Mitbewohner kaufen alle Lebensmittel zusammen ein.", answer: "falsch", explanation: "„Lebensmittel kauft jeder für sich“; yalnızca temizlik malzemesi, kahve vb. ortak kasadan." },
      { id: 5, statement: "Am Sonntag essen die drei oft gemeinsam.", answer: "richtig", explanation: "„Dann frühstücken wir zusammen, meistens bis mittags.“" },
      { id: 6, statement: "Jana möchte wegen des Lärms umziehen.", answer: "falsch", explanation: "Taşınmak istemiyor; kulak tıkacı almayı ya da alışmayı düşünüyor." },
    ],
  },
  {
    id: "gb1t1-2",
    title: "E-Mail: Kochkurs in Italien",
    article: {
      headline: "E-Mail von Marco",
      paragraphs: [
        "Liebe Anna,",
        "endlich komme ich dazu, dir von meinem Urlaub zu erzählen! Du weißt ja, dass ich zum Geburtstag von meiner Familie einen Kochkurs in der Toskana geschenkt bekommen habe. Eigentlich wollte ich schon im Frühling fahren, aber dann hatte ich bei der Arbeit so viel zu tun, dass ich den Kurs auf September verschieben musste.",
        "Der Kurs fand in einem alten Bauernhaus statt, ungefähr 20 Kilometer von Florenz entfernt. Wir waren zehn Teilnehmer aus sechs verschiedenen Ländern. Unterrichtet hat uns eine ältere Dame namens Lucia, die kaum Englisch spricht. Zum Glück hat ihr Sohn alles übersetzt – und nach ein paar Tagen haben wir sie auch so ganz gut verstanden.",
        "Jeden Morgen sind wir zuerst auf den Markt im Dorf gegangen, um frische Zutaten zu kaufen. Danach haben wir bis zum Nachmittag gekocht: Nudeln selbst gemacht, Soßen, Fleischgerichte und natürlich Desserts. Am Abend haben wir alles zusammen auf der Terrasse gegessen. Ich glaube, ich habe in dieser Woche drei Kilo zugenommen!",
        "Am meisten hat mich überrascht, wie einfach viele Rezepte sind. Lucia sagt immer: „Gute Zutaten brauchen keine komplizierten Rezepte.“ Seit ich zurück bin, koche ich fast jeden Tag selbst – früher habe ich mir oft nur etwas beim Lieferdienst bestellt.",
        "Hast du nicht Lust, nächsten Samstag zu mir zum Essen zu kommen? Dann koche ich dir mein Lieblingsgericht aus dem Kurs. Bring doch auch Thomas mit!",
        "Viele Grüße, Marco",
      ],
    },
    example: { id: 0, statement: "Marco hat den Kochkurs geschenkt bekommen.", answer: "richtig", explanation: "„… einen Kochkurs … geschenkt bekommen“." },
    tasks: [
      { id: 1, statement: "Marco hat den Kurs wie geplant im Frühling gemacht.", answer: "falsch", explanation: "İş yoğunluğu yüzünden kursu Eylül'e ertelemek zorunda kaldı." },
      { id: 2, statement: "Die Lehrerin hat den Kurs auf Englisch gegeben.", answer: "falsch", explanation: "Lucia „kaum Englisch spricht“; oğlu çevirdi." },
      { id: 3, statement: "Die Teilnehmer haben die Lebensmittel selbst eingekauft.", answer: "richtig", explanation: "Her sabah malzeme almak için köy pazarına gittiler." },
      { id: 4, statement: "Gegessen haben die Teilnehmer abends gemeinsam.", answer: "richtig", explanation: "„Am Abend haben wir alles zusammen auf der Terrasse gegessen.“" },
      { id: 5, statement: "Marco findet die italienischen Rezepte sehr schwierig.", answer: "falsch", explanation: "Tarifler ne kadar basit diye şaşırdı." },
      { id: 6, statement: "Marco bestellt sein Essen jetzt seltener.", answer: "richtig", explanation: "Artık neredeyse her gün kendisi pişiriyor; eskiden sık sık sipariş veriyordu." },
    ],
  },
  {
    id: "gb1t1-3",
    title: "Blog: Ehrenamt im Tierheim",
    article: {
      headline: "MeinSamstagMitHund.blog",
      paragraphs: [
        "Sonntag, 12. März",
        "Viele von euch haben gefragt, warum ich jeden Samstag so früh aufstehe. Die Antwort: Seit einem halben Jahr helfe ich ehrenamtlich im Tierheim unserer Stadt. Auf die Idee hat mich eigentlich meine Nachbarin gebracht, die dort schon seit Jahren arbeitet.",
        "Bevor man mit den Hunden spazieren gehen darf, muss man einen kurzen Kurs machen. Dort lernt man, wie man mit ängstlichen oder aggressiven Tieren umgeht. Ich hatte zuerst gedacht, dass das unnötig ist, weil ich mit Hunden aufgewachsen bin. Aber ich habe dort wirklich viel Neues gelernt.",
        "Mein Lieblingshund heißt Bruno. Er ist schon zehn Jahre alt und war am Anfang sehr scheu. In den ersten Wochen hat er sich nicht einmal von mir streicheln lassen. Heute wartet er schon an der Tür, wenn ich komme. Leider wollen die meisten Besucher lieber junge Hunde adoptieren, deshalb lebt Bruno schon seit zwei Jahren im Tierheim.",
        "Natürlich ist die Arbeit nicht immer schön. Manchmal muss man Käfige putzen oder bei Regen eine Stunde draußen sein. Bezahlt wird man auch nicht. Trotzdem gehe ich jeden Samstag mit einem guten Gefühl nach Hause.",
        "Übrigens: Das Tierheim sucht immer Helfer. Man muss nicht jede Woche kommen – auch einmal im Monat hilft schon. Wer Interesse hat, kann sich einfach bei mir melden!",
        "Eure Lena",
      ],
    },
    example: { id: 0, statement: "Lena arbeitet am Samstag im Tierheim.", answer: "richtig", explanation: "Her cumartesi barınakta yardım ediyor." },
    tasks: [
      { id: 1, statement: "Die Idee, im Tierheim zu helfen, hatte Lenas Nachbarin.", answer: "richtig", explanation: "„Auf die Idee hat mich … meine Nachbarin gebracht.“" },
      { id: 2, statement: "Lena musste keinen Kurs machen, weil sie schon Erfahrung mit Hunden hatte.", answer: "falsch", explanation: "Kurs herkes için zorunlu; Lena gereksiz sanmış ama yine de katılmış." },
      { id: 3, statement: "Bruno war von Anfang an sehr freundlich zu Lena.", answer: "falsch", explanation: "Başta çok çekingendi, sevilmeye bile izin vermiyordu." },
      { id: 4, statement: "Viele Besucher möchten einen jüngeren Hund.", answer: "richtig", explanation: "„die meisten Besucher lieber junge Hunde adoptieren“." },
      { id: 5, statement: "Lena bekommt für ihre Arbeit etwas Geld.", answer: "falsch", explanation: "„Bezahlt wird man auch nicht.“" },
      { id: 6, statement: "Man kann auch helfen, wenn man nur selten Zeit hat.", answer: "richtig", explanation: "„auch einmal im Monat hilft schon“." },
    ],
  },
  {
    id: "gb1t1-4",
    title: "E-Mail: Reise zur Hochzeit",
    article: {
      headline: "E-Mail von Deniz",
      paragraphs: [
        "Hallo Svenja,",
        "ich bin wieder zurück aus der Türkei – und was für eine Reise das war! Du weißt ja, dass meine Schwester in Izmir geheiratet hat. Eigentlich wollte ich schon eine Woche vor der Hochzeit fliegen, um bei den Vorbereitungen zu helfen. Doch dann ist mein Flug wegen eines Streiks ausgefallen, und ich konnte erst drei Tage später fliegen.",
        "In Izmir ging das Chaos weiter: Mein Koffer war nicht angekommen! Darin war natürlich auch mein Kleid für die Hochzeit. Die Fluggesellschaft hat versprochen, ihn innerhalb von 24 Stunden zu bringen. Als er nach zwei Tagen immer noch nicht da war, bin ich mit meiner Mutter in die Stadt gefahren und habe ein neues Kleid gekauft. Am Ende hat es mir sogar besser gefallen als das alte.",
        "Die Hochzeit selbst war wunderschön. Es waren über 300 Gäste da, und wir haben bis drei Uhr morgens getanzt. Meine Schwester hat die ganze Zeit gestrahlt. Am meisten habe ich mich gefreut, dass ich meine Cousins aus Australien endlich wiedergesehen habe – das letzte Mal war vor acht Jahren.",
        "Und der Koffer? Der kam genau an dem Tag, als ich wieder nach Deutschland geflogen bin. Jetzt muss ich ihn mir nachschicken lassen. Die Kosten dafür bezahlt zum Glück die Fluggesellschaft.",
        "Lass uns doch bald mal einen Kaffee trinken, dann zeige ich dir die Fotos!",
        "Liebe Grüße, Deniz",
      ],
    },
    example: { id: 0, statement: "Deniz' Schwester hat in der Türkei geheiratet.", answer: "richtig", explanation: "„meine Schwester in Izmir geheiratet hat“." },
    tasks: [
      { id: 1, statement: "Deniz ist wie geplant eine Woche vor der Hochzeit geflogen.", answer: "falsch", explanation: "Uçuşu grev yüzünden iptal oldu, üç gün sonra uçabildi." },
      { id: 2, statement: "Deniz' Koffer kam nicht mit ihr in Izmir an.", answer: "richtig", explanation: "„Mein Koffer war nicht angekommen!“" },
      { id: 3, statement: "Die Fluggesellschaft hat den Koffer nach einem Tag gebracht.", answer: "falsch", explanation: "Söz verdiler ama iki gün sonra hâlâ gelmemişti." },
      { id: 4, statement: "Das neue Kleid gefiel Deniz schließlich gut.", answer: "richtig", explanation: "„Am Ende hat es mir sogar besser gefallen als das alte.“" },
      { id: 5, statement: "Deniz hatte ihre Cousins lange nicht gesehen.", answer: "richtig", explanation: "Son görüşmeleri sekiz yıl önceydi." },
      { id: 6, statement: "Deniz muss für das Nachschicken des Koffers bezahlen.", answer: "falsch", explanation: "„Die Kosten dafür bezahlt … die Fluggesellschaft.“" },
    ],
  },
];

// ───────────────────────────── TEIL 2 · Zwei Pressetexte · a/b/c ─────────────────────────────

export const GOETHE_B1_TEIL2_SETS: DoubleTextSet[] = [
  double("gb1t2-1", "Bibliothek der Dinge · Schule ohne Hausaufgaben", [
    {
      id: "gb1t2-1a",
      title: "Bibliothek der Dinge",
      text: {
        kind: "article",
        headline: "Bohrmaschine statt Bestseller",
        subline: "In der Stadtbibliothek Bremen kann man jetzt auch Werkzeug und Spiele ausleihen",
        paragraphs: [
          "Wer in der Bremer Stadtbibliothek nach einem neuen Roman sucht, findet seit Kurzem im Erdgeschoss auch etwas ganz anderes: Bohrmaschinen, Nähmaschinen, Zelte, Brettspiele und sogar einen Beamer. Die „Bibliothek der Dinge“ funktioniert genauso wie die Ausleihe von Büchern. Mit einem gültigen Bibliotheksausweis darf man bis zu drei Gegenstände für zwei Wochen mitnehmen – kostenlos.",
          "„Viele Menschen kaufen Geräte, die sie nur ein- oder zweimal im Jahr brauchen“, erklärt Bibliotheksleiterin Petra Haas. „Das kostet Geld und ist schlecht für die Umwelt.“ Die Idee stammt aus Skandinavien, wo solche Angebote schon seit Jahren beliebt sind. Die meisten Gegenstände hat die Bibliothek mit Geld aus einem Umweltprojekt der Stadt gekauft, einige wurden auch von Bürgern gespendet.",
          "Am beliebtesten ist bisher die Bohrmaschine – sie ist fast immer ausgeliehen. Probleme mit kaputten Geräten gab es bisher kaum. Wer etwas beschädigt, muss allerdings für die Reparatur bezahlen.",
        ],
      },
      example: { id: 0, stem: "Die Gegenstände in der „Bibliothek der Dinge“ …", options: o("kann man kaufen.", "kann man ausleihen.", "muss man selbst mitbringen."), answer: "b", explanation: "Kitap gibi ödünç alınıyor." },
      tasks: [
        { id: 7, stem: "In diesem Text geht es um …", options: o("einen neuen Baumarkt in Bremen.", "ein neues Angebot einer Bibliothek.", "ein Umweltprojekt in Skandinavien."), answer: "b", explanation: "Kütüphanenin yeni hizmeti: eşya ödünç verme." },
        { id: 8, stem: "Die Bibliothek möchte, dass …", options: o("die Menschen weniger Geräte kaufen.", "mehr Menschen Bücher lesen.", "die Bürger Geld spenden."), answer: "a", explanation: "Az kullanılan aletleri satın almak pahalı ve çevreye zararlı." },
        { id: 9, stem: "Wenn man ein Gerät kaputt macht, …", options: o("darf man nichts mehr ausleihen.", "muss man die Reparatur bezahlen.", "bezahlt die Stadt die Reparatur."), answer: "b", explanation: "„muss allerdings für die Reparatur bezahlen“." },
      ],
    },
    {
      id: "gb1t2-1b",
      title: "Schule ohne Hausaufgaben",
      text: {
        kind: "article",
        headline: "Endlich frei nach der Schule?",
        subline: "Ein Gymnasium in Baden-Württemberg schafft die Hausaufgaben ab",
        paragraphs: [
          "Am Schiller-Gymnasium in Ludwigsburg gibt es seit diesem Schuljahr keine Hausaufgaben mehr. Stattdessen haben die Schülerinnen und Schüler jeden Tag eine zusätzliche „Lernstunde“ in der Schule. In dieser Zeit üben sie den Stoff aus dem Unterricht, und Lehrkräfte helfen, wenn jemand etwas nicht versteht.",
          "„Früher haben manche Kinder zu Hause Hilfe von ihren Eltern oder Nachhilfelehrern bekommen, andere nicht. Das war ungerecht“, sagt Schulleiter Markus Brenner. Mit der Lernstunde hätten jetzt alle die gleichen Chancen. Außerdem gebe es zu Hause weniger Streit.",
          "Nicht alle sind begeistert. Einige Eltern kritisieren, dass sie nicht mehr sehen, was ihre Kinder in der Schule lernen. Die Schule hat deshalb eine App eingeführt, in der die Lehrkräfte jede Woche die Themen eintragen. Für Klassenarbeiten müssen die Schüler allerdings weiterhin auch zu Hause lernen. Nach einem Jahr will die Schule entscheiden, ob das Modell bleibt.",
        ],
      },
      tasks: [
        { id: 10, stem: "Am Schiller-Gymnasium …", options: o("haben die Schüler jetzt mehr Freizeit am Nachmittag.", "üben die Schüler in der Schule statt zu Hause.", "gibt es mehr Unterricht in Mathematik."), answer: "b", explanation: "Ev ödevi yerine okulda ek bir „Lernstunde“ var." },
        { id: 11, stem: "Der Schulleiter findet die Lernstunde gut, weil …", options: o("alle Schüler die gleiche Unterstützung bekommen.", "die Lehrer weniger arbeiten müssen.", "die Eltern mehr helfen können."), answer: "a", explanation: "Eskiden bazıları evde yardım alıyordu, bazıları almıyordu; şimdi herkesin şansı eşit." },
        { id: 12, stem: "Die Schüler …", options: o("müssen nie mehr zu Hause lernen.", "lernen für Prüfungen weiterhin auch zu Hause.", "schreiben keine Klassenarbeiten mehr."), answer: "b", explanation: "„Für Klassenarbeiten müssen die Schüler … weiterhin auch zu Hause lernen.“" },
      ],
    },
  ]),
  double("gb1t2-2", "Wohnen für Hilfe · Essbare Stadt", [
    {
      id: "gb1t2-2a",
      title: "Wohnen für Hilfe",
      text: {
        kind: "article",
        headline: "Ein Zimmer gegen Hilfe im Alltag",
        subline: "Das Projekt „Wohnen für Hilfe“ bringt Studierende und Senioren zusammen",
        paragraphs: [
          "Zimmer in Studentenstädten sind teuer und knapp. Gleichzeitig leben viele ältere Menschen allein in großen Wohnungen und brauchen ab und zu Unterstützung. Das Projekt „Wohnen für Hilfe“ in Köln verbindet beide Gruppen: Studierende wohnen bei Seniorinnen und Senioren und zahlen statt Miete mit Hilfe im Alltag. Die Regel: Für jeden Quadratmeter Wohnfläche hilft man eine Stunde im Monat. Nur die Nebenkosten müssen die Studierenden selbst bezahlen.",
          "Die 21-jährige Medizinstudentin Leonie wohnt seit einem Jahr bei der 84-jährigen Gertrud Bauer. Sie kauft für sie ein, hilft im Garten und begleitet sie manchmal zum Arzt. Pflege gehört ausdrücklich nicht zu den Aufgaben. „Am Anfang waren wir beide etwas unsicher“, erzählt Leonie. „Jetzt kochen wir oft zusammen und sie erzählt mir Geschichten aus ihrer Jugend.“",
          "Bevor die Partner zusammenziehen, führt das Studierendenwerk mit beiden ein ausführliches Gespräch. So soll sichergestellt werden, dass Erwartungen und Gewohnheiten zusammenpassen.",
        ],
      },
      example: { id: 0, stem: "Die Studierenden im Projekt …", options: o("bezahlen keine normale Miete.", "wohnen in einem Studentenheim.", "arbeiten als Pfleger."), answer: "a", explanation: "Kira yerine günlük işlerde yardım ediyorlar." },
      tasks: [
        { id: 7, stem: "In diesem Text geht es um …", options: o("Probleme in Studentenwohnheimen.", "ein Wohnmodell für Junge und Alte.", "die Ausbildung von Pflegekräften."), answer: "b", explanation: "Öğrencilerle yaşlıları bir araya getiren bir konut modeli." },
        { id: 8, stem: "Wie viel Hilfe man leisten muss, …", options: o("hängt von der Größe des Zimmers ab.", "entscheidet der Senior allein.", "ist für alle gleich."), answer: "a", explanation: "Metrekare başına ayda bir saat yardım." },
        { id: 9, stem: "Leonie …", options: o("pflegt Frau Bauer jeden Tag.", "hat inzwischen ein gutes Verhältnis zu Frau Bauer.", "möchte bald ausziehen."), answer: "b", explanation: "Artık birlikte yemek yapıyorlar, iyi anlaşıyorlar. Bakım görevleri arasında değil." },
      ],
    },
    {
      id: "gb1t2-2b",
      title: "Essbare Stadt",
      text: {
        kind: "article",
        headline: "Pflücken erlaubt!",
        subline: "In Andernach wachsen Gemüse und Obst mitten in der Stadt – für alle",
        paragraphs: [
          "In den meisten Städten steht auf Schildern in Parks: „Betreten verboten“. In Andernach am Rhein ist das anders. Hier heißt es: „Pflücken erlaubt“. Seit über zehn Jahren pflanzt die Stadt in öffentlichen Grünanlagen Tomaten, Bohnen, Kräuter und Obstbäume. Jeder darf ernten, was er möchte – kostenlos.",
          "Am Anfang hatten viele Bewohner Zweifel. „Wir dachten, dass alles sofort kaputt gemacht oder gestohlen wird“, erzählt ein Mitarbeiter der Stadtgärtnerei. Doch das ist kaum passiert. Im Gegenteil: Die Menschen achten auf die Beete, und einige helfen sogar freiwillig beim Gießen. Die Pflege übernehmen hauptsächlich Langzeitarbeitslose, die so wieder einen Weg in den Arbeitsmarkt finden.",
          "Für die Stadt lohnt sich das Projekt auch finanziell: Gemüsebeete sind günstiger als Blumenbeete, die jedes Jahr neu bepflanzt werden müssen. Inzwischen kommen Besuchergruppen aus ganz Europa, um sich das Modell anzusehen.",
        ],
      },
      tasks: [
        { id: 10, stem: "In Andernach …", options: o("darf man in Parks Obst und Gemüse ernten.", "muss man für das Gemüse bezahlen.", "ist das Betreten der Parks verboten."), answer: "a", explanation: "„Jeder darf ernten, was er möchte – kostenlos.“" },
        { id: 11, stem: "Am Anfang hatten viele Menschen Angst, dass …", options: o("niemand das Gemüse essen möchte.", "die Pflanzen beschädigt werden.", "das Projekt zu teuer ist."), answer: "b", explanation: "Her şeyin hemen bozulacağını ya da çalınacağını düşünmüşler." },
        { id: 12, stem: "Die Beete werden vor allem …", options: o("von Besuchern aus Europa gepflegt.", "von Menschen gepflegt, die eine Arbeit suchen.", "von Schulkindern gepflegt."), answer: "b", explanation: "Bakımı çoğunlukla uzun süreli işsizler yapıyor." },
      ],
    },
  ]),
  double("gb1t2-3", "Urlaub ohne Handy · Lebensmittel retten", [
    {
      id: "gb1t2-3a",
      title: "Urlaub ohne Handy",
      text: {
        kind: "article",
        headline: "Abschalten – im wahrsten Sinne",
        subline: "Immer mehr Hotels bieten „Digital Detox“-Urlaub an",
        paragraphs: [
          "Beim Einchecken im Berghotel „Stille“ im Allgäu müssen die Gäste etwas Ungewöhnliches tun: Sie geben ihr Smartphone an der Rezeption ab. Dort wird es in einen Safe gelegt und erst bei der Abreise zurückgegeben. Fernseher gibt es in den Zimmern nicht, WLAN nur in einem einzigen Raum im Keller – und der ist nur eine Stunde am Tag geöffnet.",
          "Hotelchefin Andrea Wolf hat das Konzept vor drei Jahren eingeführt. „Viele Gäste haben mir erzählt, dass sie im Urlaub ständig ihre beruflichen E-Mails lesen und sich gar nicht richtig erholen“, sagt sie. Statt aufs Display zu schauen, können die Gäste wandern, lesen, Yoga machen oder an Kochkursen teilnehmen.",
          "Die ersten Tage sind für viele schwierig. „Ich habe dauernd in meine Hosentasche gegriffen“, erzählt ein Gast aus Stuttgart. Nach einer Woche aber sagen die meisten, dass sie besser schlafen und sich entspannter fühlen. Das Angebot ist beliebt: Im Sommer ist das Hotel oft Monate im Voraus ausgebucht.",
        ],
      },
      example: { id: 0, stem: "Im Hotel „Stille“ …", options: o("müssen die Gäste ihr Handy abgeben.", "gibt es in jedem Zimmer WLAN.", "kann man Smartphones kaufen."), answer: "a", explanation: "Telefonlar resepsiyonda kasaya konuyor." },
      tasks: [
        { id: 7, stem: "In diesem Text geht es um …", options: o("ein neues Smartphone.", "einen Urlaub ohne digitale Geräte.", "Probleme mit dem Internet in den Bergen."), answer: "b", explanation: "Dijital cihazlardan uzak tatil (Digital Detox)." },
        { id: 8, stem: "Frau Wolf hatte die Idee, weil …", options: o("viele Gäste im Urlaub nicht abschalten konnten.", "das WLAN im Hotel nicht funktionierte.", "sie selbst keine Smartphones mag."), answer: "a", explanation: "Misafirler tatilde sürekli iş e-postalarını okuyup dinlenemediklerini anlatmış." },
        { id: 9, stem: "Nach einer Woche …", options: o("möchten viele Gäste früher abreisen.", "fühlen sich die meisten Gäste besser.", "bekommen die Gäste ihr Handy zurück."), answer: "b", explanation: "Çoğu daha iyi uyuduğunu ve daha rahat hissettiğini söylüyor." },
      ],
    },
    {
      id: "gb1t2-3b",
      title: "Lebensmittel retten",
      text: {
        kind: "article",
        headline: "Zu schade für die Tonne",
        subline: "Foodsaver holen übrig gebliebene Lebensmittel aus Bäckereien und Supermärkten",
        paragraphs: [
          "Jeden Abend um 19 Uhr steht Tobias Klein vor einer Bäckerei in der Leipziger Innenstadt. Er holt Brot und Kuchen ab, die an diesem Tag nicht verkauft wurden und sonst im Müll landen würden. Tobias ist einer von über 2.000 sogenannten Foodsavern in Leipzig. Sie arbeiten ehrenamtlich und verteilen die geretteten Lebensmittel an Freunde, Nachbarn oder soziale Einrichtungen.",
          "In Deutschland werden jedes Jahr Millionen Tonnen Lebensmittel weggeworfen – ein großer Teil davon wäre noch völlig in Ordnung. „Viele Geschäfte sind froh, dass wir kommen“, sagt Tobias. „Für sie ist es billiger, als die Sachen zu entsorgen.“ Verkaufen dürfen die Foodsaver die Lebensmittel nicht.",
          "Außerdem gibt es in der Stadt zwölf öffentliche Kühlschränke, sogenannte „Fair-Teiler“. Dort kann jeder Lebensmittel hineinlegen oder herausnehmen. Nur rohes Fleisch, Fisch und angebrochene Medikamente sind aus hygienischen Gründen nicht erlaubt.",
        ],
      },
      tasks: [
        { id: 10, stem: "Tobias Klein …", options: o("arbeitet in einer Bäckerei.", "holt nicht verkaufte Lebensmittel ab.", "verkauft Brot an Nachbarn."), answer: "b", explanation: "Satılmayan ekmek ve pastaları alıyor; satmak yasak." },
        { id: 11, stem: "Die Geschäfte …", options: o("bezahlen die Foodsaver für ihre Arbeit.", "sparen Geld durch die Foodsaver.", "verkaufen die Lebensmittel billiger."), answer: "b", explanation: "„Für sie ist es billiger, als die Sachen zu entsorgen.“" },
        { id: 12, stem: "In die „Fair-Teiler“ …", options: o("darf man alle Lebensmittel legen.", "darf man kein rohes Fleisch legen.", "dürfen nur Foodsaver etwas legen."), answer: "b", explanation: "Çiğ et, balık ve açılmış ilaç hijyen nedeniyle yasak." },
      ],
    },
  ]),
];

// ───────────────────────────── TEIL 3 · Anzeigen · 0 ─────────────────────────────

export const GOETHE_B1_TEIL3_SETS: TelcA2Teil3Set[] = [
  {
    id: "gb1t3-1",
    title: "Freizeit und Kultur",
    ads: [
      { key: "a", title: "Stadtführungen „Wien bei Nacht“", lines: ["Gruselgeschichten aus der Altstadt", "Fr + Sa 21 Uhr, ab Stephansplatz", "Nur für Erwachsene"] },
      { key: "b", title: "Kletterhalle Vertical", lines: ["Schnupperkurs für Anfänger (ab 8 Jahren)", "Ausrüstung wird gestellt", "Jeden Samstagvormittag"] },
      { key: "c", title: "Theatergruppe „Bühnenfieber“", lines: ["Wir suchen Laienschauspieler jeden Alters", "Proben: Dienstag 19 Uhr", "Vorkenntnisse nicht nötig"] },
      { key: "d", title: "Fotoclub Linse", lines: ["Monatliche Fototouren durch die Region", "Bildbesprechung und Workshops", "Für Profis und Hobbyfotografen"] },
      { key: "e", title: "Konzertkarten-Börse", lines: ["Sie können nicht zum Konzert? Verkaufen Sie Ihre Karte hier!", "Sicher und ohne Gebühr", "www.ticket-tausch.at"] },
      { key: "f", title: "Museum für Technik", lines: ["Neue Ausstellung: Roboter im Alltag", "Mitmach-Stationen für Kinder", "Jeden ersten Sonntag im Monat freier Eintritt"] },
      { key: "g", title: "Lesekreis im Café Buch", lines: ["Wir lesen jeden Monat einen Roman", "und diskutieren darüber", "Nächstes Treffen: 14. März, 19 Uhr"] },
      { key: "h", title: "Tanzschule Swing", lines: ["Swing- und Lindy-Hop-Kurse", "Auch ohne Partner möglich", "Kursstart jeden Monat"] },
      { key: "i", title: "Kochschule Gewürzreise", lines: ["Kurse: Indisch, Thailändisch, Vietnamesisch", "Abends ab 18 Uhr", "Gutscheine erhältlich"] },
      { key: "j", title: "Fahrradtouren Donau", lines: ["Geführte Tagestouren von Wien nach Krems", "Mietrad und Mittagessen inklusive", "April bis Oktober"] },
    ],
    example: { id: 0, situation: "Sabine möchte gern Theater spielen.", answer: "c", explanation: "Theatergruppe sucht Laienschauspieler → c." },
    tasks: [
      { id: 13, situation: "Tim will mit seinen Kindern (9 und 11) am Wochenende etwas Sportliches ausprobieren.", answer: "b", explanation: "Tırmanma deneme kursu, 8 yaştan itibaren, cumartesi → b." },
      { id: 14, situation: "Laura hat zwei Karten für ein Konzert, aber an dem Abend keine Zeit.", answer: "e", explanation: "Bilet satabileceğin platform → e." },
      { id: 15, situation: "Ahmet liest gern und möchte mit anderen über Bücher sprechen.", answer: "g", explanation: "Okuma grubu, romanlar hakkında tartışma → g." },
      { id: 16, situation: "Familie Novak sucht für einen Sonntag ein günstiges Ausflugsziel mit den Kindern.", answer: "f", explanation: "Çocuklar için etkinlik + ayın ilk pazarı ücretsiz → f." },
      { id: 17, situation: "Claudia möchte tanzen lernen, aber ihr Mann hat keine Lust.", answer: "h", explanation: "„Auch ohne Partner möglich“ → h." },
      { id: 18, situation: "Peter möchte lernen, wie man italienische Pasta selbst macht.", answer: "x", explanation: "i sadece Asya mutfağı (Hint, Tay, Vietnam) → 0." },
      { id: 19, situation: "Monika möchte an einem Tag mit dem Rad an der Donau entlangfahren, hat aber kein eigenes Fahrrad.", answer: "j", explanation: "Kiralık bisikletli rehberli Tuna turu → j." },
    ],
  },
  {
    id: "gb1t3-2",
    title: "Wohnen und Umzug",
    ads: [
      { key: "a", title: "Möbelbörse", lines: ["Gebrauchte Möbel kaufen und verkaufen", "Wir holen kostenlos ab", "Mo–Sa 9–18 Uhr"] },
      { key: "b", title: "Umzugsfirma Blitz", lines: ["Umzüge im In- und Ausland", "Verpackungsservice auf Wunsch", "Kostenloses Angebot innerhalb von 24 Stunden"] },
      { key: "c", title: "WG-Portal Mitwohnen", lines: ["Zimmer in Wohngemeinschaften", "In über 80 Städten", "Kostenlos inserieren"] },
      { key: "d", title: "Malerbetrieb Huber", lines: ["Wände streichen, Tapeten", "Saubere und schnelle Arbeit", "Auch am Samstag"] },
      { key: "e", title: "Mieterschutzbund", lines: ["Probleme mit dem Vermieter?", "Rechtsberatung für Mitglieder", "Jahresbeitrag 60 €"] },
      { key: "f", title: "Schlüsseldienst Sofort", lines: ["Tür zugefallen? Schlüssel verloren?", "24 Stunden erreichbar", "Festpreis ohne Nachtzuschlag"] },
      { key: "g", title: "Gartenhilfe Grünfinger", lines: ["Rasen mähen, Hecke schneiden, Laub entfernen", "Regelmäßig oder einmalig", "Faire Preise"] },
      { key: "h", title: "Ferienwohnungen Bodensee", lines: ["Für 2 bis 6 Personen", "Direkt am See", "Haustiere willkommen"] },
      { key: "i", title: "Elektro Krämer", lines: ["Lampen, Steckdosen, Elektroinstallation", "Notdienst am Wochenende", "Meisterbetrieb"] },
      { key: "j", title: "Sprachschule am Markt", lines: ["Deutsch für Neuankömmlinge", "Hilfe bei Behördengängen inklusive", "Abendkurse"] },
    ],
    example: { id: 0, situation: "Oliver zieht nach Zürich und braucht eine Firma, die seine Möbel transportiert.", answer: "b", explanation: "Umzugsfirma → b." },
    tasks: [
      { id: 13, situation: "Julia beginnt ihr Studium in Graz und sucht ein günstiges Zimmer.", answer: "c", explanation: "WG odaları, birçok şehirde → c." },
      { id: 14, situation: "Herr Weber hat sich nachts ausgesperrt und kommt nicht in seine Wohnung.", answer: "f", explanation: "24 saat anahtarcı, gece ek ücreti yok → f." },
      { id: 15, situation: "Familie Schulz möchte das Kinderzimmer neu streichen lassen.", answer: "d", explanation: "Boya işleri → d." },
      { id: 16, situation: "Frau Kaya ist alt und kann ihren Garten nicht mehr selbst pflegen.", answer: "g", explanation: "Bahçe bakımı, düzenli veya bir kerelik → g." },
      { id: 17, situation: "Ihr Vermieter möchte die Miete stark erhöhen. Daniel braucht Rat.", answer: "e", explanation: "Ev sahibiyle sorunlar, hukuki danışmanlık → e." },
      { id: 18, situation: "Svetlana hat zu viele Möbel für ihre neue kleine Wohnung und möchte einige verkaufen.", answer: "a", explanation: "İkinci el mobilya alım-satım, ücretsiz alıyorlar → a." },
      { id: 19, situation: "Marco sucht eine Putzhilfe für seine Wohnung.", answer: "x", explanation: "Temizlik hizmeti ilanı yok → 0." },
    ],
  },
  {
    id: "gb1t3-3",
    title: "Gesundheit und Sport",
    ads: [
      { key: "a", title: "Yoga im Park", lines: ["Jeden Sonntag 10 Uhr im Stadtpark", "Für alle, ohne Anmeldung", "Bei Regen in der Turnhalle"] },
      { key: "b", title: "Rückenfit", lines: ["Kurs gegen Rückenschmerzen", "Von der Krankenkasse bezahlt", "Mo + Mi 18 Uhr"] },
      { key: "c", title: "Schwimmschule Delfin", lines: ["Kurse für Kinder ab 4 Jahren", "Erwachsenenkurse für Nichtschwimmer", "Kleine Gruppen"] },
      { key: "d", title: "Ernährungsberatung Vital", lines: ["Gesund abnehmen ohne Diät", "Einzelberatung und Online-Kurse", "Erstgespräch kostenlos"] },
      { key: "e", title: "Laufgruppe Morgenrot", lines: ["Wir joggen Di + Do um 6.30 Uhr", "Für Anfänger und Fortgeschrittene", "Treffpunkt: Rathaus"] },
      { key: "f", title: "Fitnessstudio Iron", lines: ["Krafttraining und Kurse", "24 Stunden geöffnet", "Nur für Mitglieder ab 18"] },
      { key: "g", title: "Zahnarztpraxis Dr. Lang", lines: ["Neue Patienten willkommen", "Termine auch am Abend und Samstag", "Spezielle Betreuung für Angstpatienten"] },
      { key: "h", title: "Nichtraucherkurs", lines: ["In 6 Wochen rauchfrei", "Gruppenkurs mit Psychologin", "Start: jeden Monat"] },
      { key: "i", title: "Seniorentanz", lines: ["Tanzen hält jung!", "Für Menschen ab 60", "Donnerstags 15 Uhr im Gemeindezentrum"] },
      { key: "j", title: "Tennisclub Grün-Weiß", lines: ["Plätze stundenweise zu mieten", "Training für Kinder", "Clubhaus mit Restaurant"] },
    ],
    example: { id: 0, situation: "Sophie möchte mit dem Rauchen aufhören.", answer: "h", explanation: "Nichtraucherkurs → h." },
    tasks: [
      { id: 13, situation: "Karl hat oft Rückenschmerzen und möchte einen Kurs machen, für den er nichts bezahlen muss.", answer: "b", explanation: "Sırt kursu, sağlık sigortası ödüyor → b." },
      { id: 14, situation: "Mehmet ist 35 und hat nie schwimmen gelernt.", answer: "c", explanation: "Yüzme bilmeyen yetişkinler için kurs → c." },
      { id: 15, situation: "Anna arbeitet im Schichtdienst und möchte nachts trainieren.", answer: "f", explanation: "24 saat açık spor salonu → f." },
      { id: 16, situation: "Frau Berger (68) möchte sich mehr bewegen und neue Leute kennenlernen.", answer: "i", explanation: "60 yaş üstü dans → i." },
      { id: 17, situation: "Lukas hat große Angst vor dem Zahnarzt.", answer: "g", explanation: "„Spezielle Betreuung für Angstpatienten“ → g." },
      { id: 18, situation: "Elena möchte in einer Mannschaft Fußball spielen.", answer: "x", explanation: "Futbol takımı ilanı yok (j tenis) → 0." },
      { id: 19, situation: "Thomas möchte sich gesünder ernähren und ein paar Kilo verlieren.", answer: "d", explanation: "Beslenme danışmanlığı, diyetsiz kilo verme → d." },
    ],
  },
];

// ───────────────────────────── TEIL 4 · Meinungen · Ja/Nein ─────────────────────────────

export const GOETHE_B1_TEIL4_SETS: YesNoSet[] = [
  {
    id: "gb1t4-1",
    title: "Handyverbot an Schulen",
    context: "In einer Zeitschrift lesen Sie Kommentare zu einem Artikel über ein Handyverbot an Schulen.",
    question: "Ist die Person für ein Handyverbot an Schulen?",
    example: { id: 0, name: "Petra, 45, Köln", text: "Meine Tochter schaut sogar in der Pause nur auf ihr Handy, statt mit ihren Freundinnen zu sprechen. Die Schule sollte ein Ort sein, an dem man sich konzentriert und echte Kontakte hat. Ich finde: Handys gehören in der Schule in den Schrank!", answer: "ja" },
    tasks: [
      { id: 20, name: "Jonas, 16, Graz", text: "Wir nutzen das Handy im Unterricht oft sinnvoll, zum Beispiel für Recherchen oder Vokabel-Apps. Statt alles zu verbieten, sollten die Lehrer uns lieber zeigen, wie man das Handy richtig benutzt. Ein Verbot ist einfach altmodisch.", answer: "nein", explanation: "Yasağı „altmodisch“ buluyor; doğru kullanımın öğretilmesini istiyor." },
      { id: 21, name: "Sabine, 52, Lehrerin aus Bremen", text: "Seit wir an unserer Schule die Handys morgens einsammeln, ist es in den Pausen viel lebendiger. Die Kinder spielen wieder Fußball und reden miteinander. Am Anfang gab es Proteste, aber heute will niemand mehr zurück.", answer: "ja", explanation: "Telefon toplama uygulamasından olumlu sonuçlar anlatıyor." },
      { id: 22, name: "Ali, 38, Zürich", text: "Mein Sohn fährt jeden Tag eine Stunde mit dem Bus zur Schule. Ich möchte ihn erreichen können, wenn etwas passiert. Wer garantiert mir das, wenn er sein Handy nicht dabeihaben darf? Für mich kommt so eine Regel nicht in Frage.", answer: "nein", explanation: "Oğluna ulaşabilmek istiyor; böyle bir kural onun için „nicht in Frage“." },
      { id: 23, name: "Miriam, 29, Berlin", text: "Ich verstehe die Sorgen der Eltern. Trotzdem: Cybermobbing und ständige Ablenkung sind echte Probleme. Wenn Eltern ihr Kind dringend erreichen müssen, können sie immer noch im Sekretariat anrufen. Deshalb finde ich es richtig, dass Handys während des Schultags verboten werden.", answer: "ja", explanation: "Velilerin endişesini anlıyor ama „Trotzdem“ – yasağı doğru buluyor." },
      { id: 24, name: "Felix, 17, Linz", text: "Jedes Mal, wenn etwas verboten wird, finden wir sowieso einen Weg, es heimlich zu machen. Dann haben die Lehrer noch weniger Kontrolle. Besser wären klare Regeln, zum Beispiel: Handy nur in der Pause erlaubt.", answer: "nein", explanation: "Yasak yerine açık kurallar istiyor (telefon sadece teneffüste)." },
      { id: 25, name: "Renate, 66, Hannover", text: "Als ich zur Schule ging, gab es keine Handys, und wir haben trotzdem alles gelernt. Heute können sich die Kinder kaum zehn Minuten konzentrieren. Es wird Zeit, dass die Politik endlich handelt und Smartphones aus den Klassenzimmern verbannt.", answer: "ja", explanation: "Akıllı telefonların sınıflardan „verbannt“ edilmesini istiyor." },
      { id: 26, name: "Tobias, 41, Informatiklehrer aus Bern", text: "Natürlich lenkt das Handy manchmal ab. Aber unsere Schüler müssen lernen, mit digitalen Medien verantwortungsvoll umzugehen – das ist eine wichtige Kompetenz für das spätere Berufsleben. Mit einem Verbot nehmen wir ihnen diese Chance.", answer: "nein", explanation: "Dikkat dağıttığını kabul ediyor ama yasak öğrencilerin bu fırsatını elinden alır diyor." },
    ],
  },
  {
    id: "gb1t4-2",
    title: "Autofreie Innenstadt",
    context: "In einer Lokalzeitung lesen Sie Kommentare zu dem Plan, die Innenstadt für Autos zu sperren.",
    question: "Ist die Person für eine autofreie Innenstadt?",
    example: { id: 0, name: "Markus, 34, Freiburg", text: "Ich wohne mitten in der Altstadt und kann nachts wegen des Verkehrs kaum schlafen. Endlich wäre es ruhig, und die Kinder könnten sicher auf der Straße spielen. Ich hoffe sehr, dass der Plan umgesetzt wird!", answer: "ja" },
    tasks: [
      { id: 20, name: "Gisela, 71, Freiburg", text: "Ich kann nicht mehr gut laufen und bin auf mein Auto angewiesen. Wie soll ich dann zum Arzt oder zur Apotheke in der Innenstadt kommen? Busse fahren bei uns nur einmal pro Stunde. So eine Idee können nur junge, gesunde Menschen haben.", answer: "nein", explanation: "Arabaya muhtaç; fikri sadece genç ve sağlıklı insanlar için uygun buluyor." },
      { id: 21, name: "Lars, 28, Radfahrer aus Freiburg", text: "Andere Städte wie Kopenhagen zeigen, dass es funktioniert. Die Luft wird besser, und die Geschäfte haben sogar mehr Kunden, weil die Menschen lieber zu Fuß bummeln. Ich verstehe nicht, worauf wir noch warten.", answer: "ja", explanation: "Kopenhag örneğini veriyor, neyi beklediğimizi anlamıyor → destekliyor." },
      { id: 22, name: "Herr Brenner, Inhaber eines Schuhgeschäfts", text: "Viele meiner Kunden kommen aus den Dörfern rund um die Stadt. Wenn sie nicht mehr in der Nähe parken können, fahren sie zum Einkaufszentrum am Stadtrand. Für uns kleine Geschäfte wäre das das Ende.", answer: "nein", explanation: "Küçük dükkânlar için „das Ende“ olacağını düşünüyor." },
      { id: 23, name: "Aylin, 39, Mutter von zwei Kindern", text: "Natürlich ist es manchmal praktisch, mit dem Auto bis vor die Tür zu fahren. Aber ich wünsche mir, dass meine Kinder allein zur Schule gehen können, ohne dass ich Angst haben muss. Mit guten Bussen und Parkplätzen am Rand der Stadt ist das sicher möglich.", answer: "ja", explanation: "„Natürlich … Aber“ – çocuklarının güvenliği için destekliyor, şehir kenarı otopark öneriyor." },
      { id: 24, name: "Peter, 55, Taxifahrer", text: "Man spricht immer von Umwelt, aber niemand denkt an die Leute, die mit dem Auto ihr Geld verdienen. Handwerker, Lieferanten, Taxifahrer – wir alle müssen in die Innenstadt kommen. Ich halte von diesem Plan überhaupt nichts.", answer: "nein", explanation: "„Ich halte von diesem Plan überhaupt nichts.“" },
      { id: 25, name: "Clara, 22, Studentin", text: "Ich habe kein Auto und fahre überall mit dem Fahrrad. Aber auch ohne Auto merke ich, wie gefährlich es in den engen Straßen ist. Eine Innenstadt nur für Fußgänger und Radfahrer wäre für alle ein Gewinn.", answer: "ja", explanation: "Sadece yaya ve bisikletlilere ait şehir merkezi „ein Gewinn“." },
      { id: 26, name: "Wolfgang, 60, Freiburg", text: "Ich finde, man sollte erst einmal die Busse und Bahnen verbessern, bevor man über Verbote spricht. Im Moment ist der öffentliche Verkehr einfach zu schlecht. Solange sich das nicht ändert, bin ich gegen eine Sperrung.", answer: "nein", explanation: "Önce toplu taşıma iyileştirilmeli; o zamana kadar „gegen eine Sperrung“." },
    ],
  },
  {
    id: "gb1t4-3",
    title: "Die Vier-Tage-Woche",
    context: "In einem Online-Magazin lesen Sie Kommentare zur Frage, ob es in Zukunft eine Vier-Tage-Woche für alle Arbeitnehmer geben soll.",
    question: "Ist die Person für die Vier-Tage-Woche?",
    example: { id: 0, name: "Sandra, 36, Hamburg", text: "Ich arbeite seit einem Jahr nur noch vier Tage pro Woche. Ich bin viel ausgeruhter, habe mehr Zeit für meine Familie und schaffe in vier Tagen fast genauso viel wie früher in fünf. Das sollte es für alle geben!", answer: "ja" },
    tasks: [
      { id: 20, name: "Klaus, 58, Handwerksmeister", text: "Ich finde schon jetzt kaum Mitarbeiter. Wenn alle nur noch vier Tage arbeiten, muss ich Aufträge absagen. Die Kunden wollen nicht eine Woche länger auf ihre neue Heizung warten. Für kleine Betriebe ist das nicht realistisch.", answer: "nein", explanation: "Küçük işletmeler için „nicht realistisch“." },
      { id: 21, name: "Nadia, 31, Krankenschwester", text: "Gerade in der Pflege sind viele Kolleginnen völlig erschöpft und hören deshalb ganz auf. Mit einem zusätzlichen freien Tag würden sicher mehr Menschen in ihrem Beruf bleiben. Ich bin überzeugt, dass sich das am Ende für alle lohnt.", answer: "ja", explanation: "Ek bir boş günün insanları meslekte tutacağına inanıyor." },
      { id: 22, name: "Bernd, 44, Abteilungsleiter", text: "Die Idee klingt zwar schön, aber wer soll das bezahlen? Wenn man weniger arbeitet, aber den gleichen Lohn bekommt, werden die Produkte teurer. Am Ende zahlen wir alle die Rechnung. Ich bin da sehr skeptisch.", answer: "nein", explanation: "„klingt zwar schön, aber …“ – maliyet yüzünden şüpheci → karşı." },
      { id: 23, name: "Lea, 25, Grafikerin", text: "Für meine Generation ist Freizeit genauso wichtig wie Geld. Viele meiner Freunde wählen ihren Arbeitgeber danach aus, wie flexibel die Arbeitszeiten sind. Firmen, die die Vier-Tage-Woche anbieten, finden leichter gute Leute – das ist doch ein Vorteil.", answer: "ja", explanation: "Firmalar için avantaj görüyor → destekliyor." },
      { id: 24, name: "Hans, 63, Rentner", text: "Ich habe mein ganzes Leben fünf, manchmal sechs Tage gearbeitet. Ich glaube nicht, dass unser Land wettbewerbsfähig bleibt, wenn alle weniger arbeiten. Andere Länder werden uns überholen.", answer: "nein", explanation: "Ülkenin rekabet gücünü kaybedeceğine inanıyor." },
      { id: 25, name: "Miriam, 40, Lehrerin", text: "Natürlich kann nicht jeder Beruf sofort umstellen – Schulen und Krankenhäuser müssen ja jeden Tag geöffnet sein. Aber mit guter Planung ist vieles möglich. Ich wünsche mir, dass wir es wenigstens ausprobieren, denn die Vorteile für die Gesundheit sind enorm.", answer: "ja", explanation: "Zorlukları kabul ediyor ama denenmesini istiyor; sağlık faydaları büyük." },
      { id: 26, name: "Ömer, 33, Lagerarbeiter", text: "Vier Tage hört sich toll an. Aber in vielen Firmen bedeutet das: zehn Stunden pro Tag statt acht. Nach so einem Tag bin ich zu müde für alles. Dann lieber fünf normale Tage.", answer: "nein", explanation: "Günde 10 saat çalışmak yerine beş normal günü tercih ediyor." },
    ],
  },
];

// ───────────────────────────── TEIL 5 · Regeln · a/b/c ─────────────────────────────

export const GOETHE_B1_TEIL5_SETS: McTextSet[] = [
  {
    id: "gb1t5-1",
    title: "Benutzungsordnung der Stadtbibliothek",
    text: {
      kind: "article",
      headline: "Benutzungsordnung der Stadtbibliothek",
      subline: "Sie haben sich in der Stadtbibliothek angemeldet und lesen die Benutzungsordnung.",
      paragraphs: [
        "Anmeldung: Für die Ausleihe benötigen Sie einen Bibliotheksausweis. Dieser wird gegen Vorlage eines gültigen Personalausweises oder Reisepasses ausgestellt. Kinder und Jugendliche unter 16 Jahren brauchen zusätzlich die Unterschrift eines Elternteils.",
        "Gebühren: Der Ausweis kostet für Erwachsene 15 Euro pro Jahr. Für Schüler, Studierende und Personen unter 18 Jahren ist er kostenlos. Bei Verlust wird für einen Ersatzausweis eine Gebühr von 5 Euro erhoben.",
        "Ausleihe: Bücher und Hörbücher können für vier Wochen, DVDs und Spiele für eine Woche ausgeliehen werden. Eine Verlängerung ist zweimal möglich, wenn das Medium nicht von einer anderen Person vorbestellt wurde. Verlängerungen sind online, telefonisch oder an der Theke möglich.",
        "Verspätete Rückgabe: Für jeden Tag Verspätung werden pro Medium 0,20 Euro berechnet. Nach vier Wochen erhalten Sie eine schriftliche Mahnung.",
        "Lesesaal und Arbeitsplätze: Im Lesesaal ist Ruhe zu halten. Telefonieren ist nur im Eingangsbereich erlaubt. Getränke in verschließbaren Flaschen sind erlaubt, Essen jedoch nicht. Die Computerarbeitsplätze können für maximal zwei Stunden pro Tag gebucht werden.",
        "Taschen: Große Taschen und Rucksäcke müssen in den Schließfächern im Eingangsbereich abgelegt werden. Die Schließfächer funktionieren mit einer 1-Euro-Münze, die Sie zurückbekommen.",
      ],
    },
    tasks: [
      { id: 27, stem: "Einen Bibliotheksausweis …", options: o("bekommen Studierende kostenlos.", "müssen Kinder selbst unterschreiben.", "bekommt man ohne Ausweisdokument."), answer: "a", explanation: "Öğrenciler ve 18 yaş altı için ücretsiz. Kimlik gerekli; 16 yaş altı için ebeveyn imzası." },
      { id: 28, stem: "Ein ausgeliehenes Buch …", options: o("kann man beliebig oft verlängern.", "kann man nicht verlängern, wenn jemand anderes es reserviert hat.", "muss man zur Verlängerung in die Bibliothek bringen."), answer: "b", explanation: "Başkası önceden ayırttıysa uzatılamaz; uzatma online veya telefonla da olur." },
      { id: 29, stem: "Im Lesesaal …", options: o("darf man ein Brot essen.", "darf man telefonieren, wenn man leise spricht.", "darf man Wasser aus einer Flasche trinken."), answer: "c", explanation: "Kapaklı şişede içecek serbest, yemek yasak; telefon sadece girişte." },
      { id: 30, stem: "Für die Schließfächer …", options: o("braucht man eine Münze, die man zurückerhält.", "muss man jedes Mal einen Euro bezahlen.", "bekommt man einen Schlüssel an der Theke."), answer: "a", explanation: "1 Euro'luk madeni para ile çalışıyor, para geri alınıyor." },
    ],
  },
  {
    id: "gb1t5-2",
    title: "Hausordnung eines Mietshauses",
    text: {
      kind: "article",
      headline: "Hausordnung – Wohnanlage Lindenhof",
      subline: "Sie sind in eine neue Wohnung eingezogen und lesen die Hausordnung.",
      paragraphs: [
        "Ruhezeiten: Zwischen 22 und 7 Uhr sowie sonntags und an Feiertagen ganztägig ist auf Ruhe zu achten. Musik und Fernsehen sind in dieser Zeit auf Zimmerlautstärke einzustellen. Laute Arbeiten wie Bohren oder Hämmern sind nur werktags von 8 bis 12 und von 14 bis 19 Uhr erlaubt.",
        "Treppenhaus und Keller: Das Treppenhaus muss frei bleiben. Fahrräder, Kinderwagen und Schuhe dürfen dort nicht abgestellt werden. Fahrräder gehören in den Fahrradraum im Erdgeschoss, Kinderwagen dürfen ausnahmsweise im Hausflur unter der Treppe stehen.",
        "Reinigung: Die Mieter reinigen das Treppenhaus abwechselnd nach dem Plan, der neben der Haustür hängt. Wer aus gesundheitlichen Gründen nicht putzen kann, kann gegen eine monatliche Gebühr von 15 Euro die Reinigungsfirma beauftragen. Bitte melden Sie dies bei der Hausverwaltung.",
        "Müll: Der Müll ist zu trennen und in die entsprechenden Tonnen im Hof zu werfen. Sperrmüll darf nicht im Hof abgestellt werden. Die Stadt holt ihn zweimal im Jahr kostenlos ab; einen Termin vereinbaren Sie selbst beim Abfallamt.",
        "Grillen und Balkon: Grillen mit Holzkohle ist auf Balkonen nicht gestattet. Elektrogrills sind erlaubt. Im Hof gibt es einen Grillplatz, der bei der Hausverwaltung reserviert werden kann.",
        "Haustiere: Kleintiere wie Fische oder Hamster sind erlaubt. Für Hunde und Katzen ist eine schriftliche Genehmigung der Hausverwaltung nötig.",
      ],
    },
    tasks: [
      { id: 27, stem: "Am Samstagnachmittag um 15 Uhr …", options: o("darf man ein Regal an die Wand bohren.", "muss im ganzen Haus Ruhe sein.", "darf man keine Musik hören."), answer: "a", explanation: "Gürültülü işler hafta içi (werktags = pazartesi–cumartesi) 14–19 arası serbest." },
      { id: 28, stem: "Im Treppenhaus …", options: o("dürfen Fahrräder stehen.", "darf ein Kinderwagen stehen.", "darf man Schuhe abstellen."), answer: "b", explanation: "Bebek arabası istisnai olarak merdiven altında durabilir." },
      { id: 29, stem: "Wenn man das Treppenhaus nicht selbst putzen kann, …", options: o("muss man umziehen.", "putzt der Nachbar ohne Bezahlung.", "kann man für die Reinigung bezahlen."), answer: "c", explanation: "Ayda 15 Euro karşılığında temizlik firması." },
      { id: 30, stem: "Für einen Hund …", options: o("braucht man die Erlaubnis der Hausverwaltung.", "muss man nichts beachten.", "gibt es im Haus ein generelles Verbot."), answer: "a", explanation: "Köpek ve kedi için yazılı izin gerekli." },
    ],
  },
  {
    id: "gb1t5-3",
    title: "Teilnahmebedingungen der Volkshochschule",
    text: {
      kind: "article",
      headline: "Teilnahmebedingungen – Volkshochschule Mitte",
      subline: "Sie möchten sich für einen Deutschkurs anmelden und lesen die Teilnahmebedingungen.",
      paragraphs: [
        "Anmeldung: Die Anmeldung ist online, schriftlich oder persönlich im Servicebüro möglich. Telefonische Anmeldungen können leider nicht angenommen werden. Mit der Anmeldung ist die Kursgebühr zu bezahlen. Die Plätze werden in der Reihenfolge der Anmeldung vergeben.",
        "Ermäßigung: Schüler, Studierende, Auszubildende und Arbeitssuchende erhalten 30 % Ermäßigung. Bitte legen Sie bei der Anmeldung einen entsprechenden Nachweis vor. Eine nachträgliche Ermäßigung ist nicht möglich.",
        "Rücktritt: Bis 14 Tage vor Kursbeginn können Sie kostenlos zurücktreten. Danach wird eine Bearbeitungsgebühr von 20 Euro berechnet. Nach Kursbeginn ist keine Erstattung der Gebühr mehr möglich, außer bei Krankheit mit ärztlichem Attest.",
        "Kursausfall: Kommen weniger als acht Teilnehmende zusammen, kann der Kurs abgesagt werden. In diesem Fall erhalten Sie die Gebühr vollständig zurück. Fällt eine einzelne Unterrichtsstunde wegen Krankheit der Kursleitung aus, wird sie nachgeholt.",
        "Teilnahmebescheinigung: Eine Bescheinigung erhalten Sie, wenn Sie an mindestens 80 % der Unterrichtsstunden teilgenommen haben. Bitte tragen Sie sich dazu in jeder Stunde in die Anwesenheitsliste ein.",
      ],
    },
    tasks: [
      { id: 27, stem: "Für einen Kurs anmelden kann man sich …", options: o("auch telefonisch.", "über das Internet.", "nur im Servicebüro."), answer: "b", explanation: "Online, yazılı veya şahsen; telefonla değil." },
      { id: 28, stem: "Wer eine Ermäßigung möchte, …", options: o("muss bei der Anmeldung einen Nachweis zeigen.", "kann den Nachweis später bringen.", "bekommt sie automatisch."), answer: "a", explanation: "Belge kayıt sırasında gösterilmeli; sonradan indirim yok." },
      { id: 29, stem: "Wenn man eine Woche vor Kursbeginn absagt, …", options: o("bekommt man das ganze Geld zurück.", "muss man eine Gebühr bezahlen.", "bekommt man kein Geld zurück."), answer: "b", explanation: "14 günden az kaldıysa 20 Euro işlem ücreti." },
      { id: 30, stem: "Eine Teilnahmebescheinigung bekommt man, …", options: o("wenn man bei allen Stunden da war.", "wenn man nicht zu oft gefehlt hat.", "wenn man eine Prüfung bestanden hat."), answer: "b", explanation: "Derslerin en az %80'ine katılmak yeterli." },
    ],
  },
];
