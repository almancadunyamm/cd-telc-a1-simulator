// Sınav Hazırlık → telc Deutsch B1 (Zertifikat Deutsch) → Leseverstehen + Sprachbausteine
// telc Deutsch B1 Übungstest 1 (Zertifikat Deutsch, überarbeitete Auflage 2019) formatı birebir örnek alınarak
// hazırlanmış özgün alıştırmalar. Sınavda Leseverstehen ve Sprachbausteine birlikte 90 dakikadır.
//   Lesen Teil 1 (Globalverstehen, 25 P.):  10 başlık a–j + 5 metin (1–5). Her başlık bir kez.
//   Lesen Teil 2 (Detailverstehen, 25 P.):  Uzun metin + 5 görev (6–10), a / b / c.
//   Lesen Teil 3 (Selektives Verstehen, 25 P.): 10 durum (11–20) + 12 ilan a–l; her ilan bir kez; ilan yoksa x.
//   Sprachbausteine Teil 1 (Grammatik, 15 P.): Mektup / e-posta, 10 boşluk (21–30), a / b / c.
//   Sprachbausteine Teil 2 (Lexik, 15 P.): Metin, 10 boşluk (31–40), 15 kelime a–o; her kelime bir kez.

import type { McOption, McTextSet } from "./goethe_a2_lesen";
import type { OsdHeadlineSet } from "./osd_a2_lesen";
import type { TelcA2Teil3Set } from "./telc_a2_lesen";

export type ClozeMcGap = { id: number; options: McOption[]; answer: "a" | "b" | "c"; explanation: string };

export type ClozeMcSet = {
  id: string;
  title: string;
  // Metin içinde boşluklar [[21]] biçiminde yazılır.
  paragraphs: string[];
  gaps: ClozeMcGap[];
};

export type ClozeBankSet = {
  id: string;
  title: string;
  paragraphs: string[];
  words: { key: string; text: string }[];
  gaps: { id: number; answer: string; explanation: string }[];
  inserat?: { title: string; lines: string[] }; // ÖSD: mektubun cevap verdiği ilan
};

export const TELC_B1_INSTRUCTIONS = {
  teil1: {
    de: [
      "Lesen Sie die Überschriften a–j und die Texte 1–5. Finden Sie für jeden Text die passende Überschrift.",
      "Sie können jede Überschrift nur einmal benutzen.",
    ],
    tr: "Her metne uyan başlığı seçin. 10 başlıktan 5'i kullanılmaz. Başlıklar ikişer ikişer benzer konudadır; metnin asıl mesajını bulun.",
  },
  teil2: {
    de: ["Lesen Sie den Text und die Aufgaben 6–10. Welche Lösung (a, b oder c) ist jeweils richtig?"],
    tr: "Metni okuyun ve her görev için doğru seçeneği işaretleyin. Görevlerin sırası metindeki sırayla aynıdır.",
  },
  teil3: {
    de: [
      "Lesen Sie die Situationen 11–20 und die Anzeigen a–l. Finden Sie für jede Situation die passende Anzeige.",
      "Sie können jede Anzeige nur einmal benutzen.",
      "Wenn Sie zu einer Situation keine Anzeige finden, markieren Sie ein x.",
    ],
    tr: "10 durum ve 12 ilan var. Her ilan en fazla bir kez kullanılır; uygun ilan bulamazsanız x işaretleyin (genellikle 1–3 durum x'tir).",
  },
  sb1: {
    de: ["Lesen Sie den Text und schließen Sie die Lücken 21–30. Welche Lösung (a, b oder c) ist jeweils richtig?"],
    tr: "Her boşluk için dilbilgisi açısından doğru seçeneği seçin: bağlaç, hâl ekleri, edat, fiil biçimi, ilgi zamiri…",
  },
  sb2: {
    de: ["Lesen Sie den Text und schließen Sie die Lücken 31–40. Benutzen Sie die Wörter a–o.", "Jedes Wort passt nur einmal."],
    tr: "15 kelimeden 10'unu boşluklara yerleştirin. Her kelime yalnızca bir kez kullanılır; 5 kelime boşta kalır.",
  },
};

const o = (a: string, b: string, c: string): McOption[] => [
  { key: "a", text: a },
  { key: "b", text: b },
  { key: "c", text: c },
];

const heads = (list: string[]) => list.map((text, i) => ({ key: "abcdefghij"[i], text }));

// ───────────────────────────── LESEN TEIL 1 · Globalverstehen ─────────────────────────────

export const TELC_B1_TEIL1_SETS: OsdHeadlineSet[] = [
  {
    id: "b1t1-1",
    title: "Medien, Freizeit und Alltag",
    headlines: heads([
      "Zeitungen werden immer teurer",
      "Sportvereine laden Kinder zum kostenlosen Probetraining ein",
      "Neue Bibliothek im Stadtzentrum eröffnet",
      "Buchtipp: So sparen Sie Energie im Haushalt",
      "Umfrage: Immer mehr Menschen lesen Nachrichten im Internet",
      "Energiepreise steigen weiter",
      "Carsharing: Auch auf dem Land immer beliebter",
      "Studie: Kinder treiben immer mehr Sport",
      "Bibliothek: E-Books jetzt rund um die Uhr ausleihen",
      "Neue Regeln für Autofahrer in der Innenstadt",
    ]),
    tasks: [
      { id: 1, text: "Die gedruckte Tageszeitung am Frühstückstisch wird seltener. Nach einer aktuellen Befragung von 2.000 Erwachsenen informiert sich inzwischen mehr als die Hälfte der Deutschen hauptsächlich über Websites und Apps. Bei den unter 30-Jährigen sind es sogar über 80 Prozent. Nur noch jeder Fünfte kauft regelmäßig eine Zeitung am Kiosk oder hat ein Abonnement.", source: "", answer: "e", explanation: "Ankete göre insanlar haberleri çoğunlukla internetten okuyor → e. Gazete fiyatından (a) hiç söz edilmiyor." },
      { id: 2, text: "Wer einen Ausweis der Stadtbibliothek hat, muss für ein neues Buch nicht mehr auf die Öffnungszeiten warten. Über die Internetseite der Bibliothek kann man ab sofort mehr als 20.000 elektronische Bücher und Hörbücher auf Tablet oder Smartphone laden – auch nachts und am Sonntag. Nach drei Wochen werden die Dateien automatisch gelöscht.", source: "", answer: "i", explanation: "E-kitap artık gece ve pazar günü de alınabiliyor → i. Yeni bir kütüphane açılmıyor (c)." },
      { id: 3, text: "Viele Kinder sitzen nach der Schule lieber vor dem Bildschirm, als draußen zu spielen. Ärzte warnen schon lange, dass sich Kinder zu wenig bewegen. Deshalb bieten die Sportvereine der Stadt im Mai ein besonderes Programm an: Kinder zwischen 6 und 14 Jahren können vier Wochen lang gratis an Fußball, Handball, Schwimmen oder Judo teilnehmen.", source: "", answer: "b", explanation: "Kulüpler çocuklara ücretsiz deneme antrenmanı sunuyor → b. Metin çocukların az hareket ettiğini söylüyor, h (daha çok spor) tam tersi." },
      { id: 4, text: "Bisher war Carsharing vor allem etwas für Großstädte. Doch jetzt teilen auch in vielen Dörfern Nachbarn ein Auto. In der Gemeinde Wiesental stehen seit einem Jahr zwei Elektroautos am Rathaus, die die Bürger stundenweise mieten können. Über 150 Familien machen schon mit – manche haben ihren Zweitwagen sogar verkauft.", source: "", answer: "g", explanation: "Köylerde de araç paylaşımı yaygınlaşıyor → g. Şehirde yeni trafik kuralları (j) yok." },
      { id: 5, text: "Wie viel Strom verbraucht mein Kühlschrank wirklich? Und lohnt es sich, den Fernseher ganz auszuschalten? Antworten auf diese und 100 weitere Fragen gibt der neue Ratgeber „Clever sparen zu Hause“ der Verbraucherzentrale. Das Buch kostet 12,90 Euro und ist im Buchhandel oder online erhältlich.", source: "", answer: "d", explanation: "Evde enerji tasarrufu üzerine yeni bir kitap → d. Enerji fiyatlarının artışından (f) söz edilmiyor." },
    ],
  },
  {
    id: "b1t1-2",
    title: "Arbeit und Beruf",
    headlines: heads([
      "Lebenslauf: Foto ab sofort verboten",
      "Handwerk: Tausende Ausbildungsplätze bleiben frei",
      "Mehr Urlaub für alle Angestellten",
      "Krankenhäuser bauen neue Stationen",
      "Vier-Tage-Woche: Die meisten Mitarbeiter sind zufrieden",
      "Homeoffice: Immer weniger Menschen arbeiten zu Hause",
      "Samstag: Messe für Berufe in der Pflege",
      "Weniger Lehrstellen im Handwerk",
      "Firma zahlt Zuschuss für das Büro zu Hause",
      "Bewerbung: Die häufigsten Fehler im Lebenslauf",
    ]),
    tasks: [
      { id: 1, text: "Ein halbes Jahr lang haben 45 Firmen in Baden-Württemberg getestet, wie es ist, wenn die Mitarbeiter nur vier Tage pro Woche arbeiten – bei gleichem Lohn. Das Ergebnis: 80 Prozent der Beschäftigten fühlten sich weniger gestresst und wollen das Modell behalten. Auch die meisten Chefs sind positiv überrascht: Die Arbeit wurde trotzdem geschafft.", source: "", answer: "e", explanation: "Dört günlük çalışma testi: çalışanların çoğu memnun → e. Daha fazla tatilden (c) söz edilmiyor." },
      { id: 2, text: "Sie möchten Altenpfleger, Krankenschwester oder Hebamme werden? Am kommenden Samstag stellen sich in der Stadthalle von 10 bis 16 Uhr über 40 Kliniken, Pflegeheime und Pflegeschulen vor. Besucher können direkt mit Auszubildenden sprechen und sich über Ausbildung und Gehalt informieren. Der Eintritt ist frei.", source: "", answer: "g", explanation: "Cumartesi bakım meslekleri fuarı → g. Hastaneler yeni bölüm inşa etmiyor (d)." },
      { id: 3, text: "Personalchefs lesen einen Lebenslauf oft nur 30 Sekunden lang. Umso wichtiger ist es, typische Fehler zu vermeiden: Lücken ohne Erklärung, Rechtschreibfehler oder eine unübersichtliche Form. Übrigens: Ein Foto muss in Deutschland heute nicht mehr unbedingt dabei sein – viele Bewerber schicken aber trotzdem eins mit.", source: "", answer: "j", explanation: "Özgeçmişteki tipik hatalar → j. Fotoğraf yasak değil, sadece zorunlu değil → a yanlış (tuzak!)." },
      { id: 4, text: "Wer regelmäßig von zu Hause arbeitet, braucht einen guten Stuhl und einen richtigen Schreibtisch. Das hat auch die Versicherung Nordlicht erkannt: Jeder Mitarbeiter, der mindestens zwei Tage pro Woche im Homeoffice ist, bekommt einmalig 500 Euro für Büromöbel. „Gesunde Mitarbeiter sind uns wichtig“, sagt die Personalchefin.", source: "", answer: "i", explanation: "Firma evdeki büro mobilyası için para veriyor → i. Evden çalışanların azaldığı (f) söylenmiyor." },
      { id: 5, text: "Bäcker, Elektriker, Dachdecker – im Handwerk werden dringend junge Leute gesucht. Nach Angaben der Handwerkskammer sind in diesem Jahr bundesweit noch über 20.000 Lehrstellen unbesetzt. Viele Betriebe bieten deshalb inzwischen höhere Ausbildungsgehälter, einen Führerschein oder sogar ein Handy an, um Bewerber zu finden.", source: "", answer: "b", explanation: "Binlerce çıraklık yeri boş kalıyor → b. h (daha az çıraklık yeri) tam tersi." },
    ],
  },
  {
    id: "b1t1-3",
    title: "Gesundheit und Ernährung",
    headlines: heads([
      "Medikamente werden billiger",
      "Kantinen: Ein Tag pro Woche ohne Fleisch",
      "Rückenschmerzen: Immer mehr Kinder betroffen",
      "Umfrage: Junge Leute frühstücken seltener",
      "Krankenhaus sucht Pflegekräfte",
      "Buchtipp: Übungen gegen Rückenschmerzen",
      "Frühstück: Müsli ist gesünder als Brötchen",
      "Rezept vom Arzt jetzt auch digital",
      "Fleisch wird immer teurer",
      "Klinikum lädt zum Tag der offenen Tür ein",
    ]),
    tasks: [
      { id: 1, text: "Ein Kaffee im Stehen, dann schnell zur Arbeit: Fast 40 Prozent der 18- bis 29-Jährigen essen morgens nichts, so das Ergebnis einer Befragung der Krankenkasse Vita. Bei den über 60-Jährigen ist es nur jeder Zehnte. Als Grund nennen die Jüngeren vor allem Zeitmangel. Ernährungsexperten empfehlen trotzdem, den Tag mit einer Mahlzeit zu beginnen.", source: "", answer: "d", explanation: "Gençler daha seyrek kahvaltı yapıyor → d. Müsli ile ekmek karşılaştırılmıyor (g)." },
      { id: 2, text: "Der Zettel vom Arzt hat bald ausgedient: Seit Januar bekommen Patienten ihr Rezept auf die Gesundheitskarte oder in eine App. In der Apotheke wird die Karte einfach eingelesen. Wer möchte, kann sich aber weiterhin einen Ausdruck geben lassen. Die Preise für Medikamente ändern sich dadurch nicht.", source: "", answer: "h", explanation: "Reçete artık dijital → h. İlaç fiyatları değişmiyor → a yanlış." },
      { id: 3, text: "Wer viel am Schreibtisch sitzt, kennt das Problem. Die Physiotherapeutin Karin Weber zeigt in ihrem neuen Buch „Starker Rücken“ 50 einfache Übungen, die man zu Hause oder im Büro machen kann – jeweils nur fünf Minuten am Tag. Mit vielen Fotos und einem Trainingsplan für vier Wochen. 16,99 Euro.", source: "", answer: "f", explanation: "Sırt ağrısına karşı egzersiz kitabı → f. Çocuklardan (c) söz edilmiyor." },
      { id: 4, text: "Wie sieht ein Operationssaal von innen aus? Was passiert in der Notaufnahme? Am Sonntag öffnet das Städtische Klinikum von 11 bis 17 Uhr seine Türen für alle Interessierten. Es gibt Führungen, kostenlose Blutdruckmessungen und ein Programm für Kinder. Für das Mittagessen sorgt die Krankenhausküche.", source: "", answer: "j", explanation: "Hastane açık kapı günü düzenliyor → j. Personel aranmıyor (e)." },
      { id: 5, text: "In den Kantinen der Stadtverwaltung gibt es ab Oktober jeden Mittwoch nur vegetarische Gerichte. Die Stadt möchte damit etwas für die Gesundheit der Mitarbeiter und für das Klima tun. An den anderen Tagen steht weiterhin auch Fleisch auf dem Speiseplan. Die ersten Reaktionen der Mitarbeiter sind überwiegend positiv.", source: "", answer: "b", explanation: "Kantinlerde haftada bir gün etsiz → b. Et fiyatlarından (i) söz edilmiyor." },
    ],
  },
  {
    id: "b1t1-4",
    title: "Reisen und Umwelt",
    headlines: heads([
      "Fahrradurlaub immer beliebter",
      "Neue Regeln für die Mülltrennung",
      "Hotels nur für Erwachsene im Trend",
      "Bahn: Fahrräder jetzt auch im ICE",
      "Müllgebühren steigen",
      "Urlaub in Deutschland bleibt die Nummer eins",
      "Stadt fällt alte Bäume",
      "Familienurlaub: Hotels mit Kinderbetreuung",
      "Flugreisen ins Ausland werden billiger",
      "Bürger können Bäume spenden",
    ]),
    tasks: [
      { id: 1, text: "Gute Nachricht für Radfahrer: Ab Dezember kann man sein Fahrrad auch in allen Fernzügen der Deutschen Bahn mitnehmen. Dafür gibt es in jedem Zug acht spezielle Plätze. Eine Reservierung ist allerdings Pflicht und kostet sechs Euro. Bisher war die Mitnahme nur in Regionalzügen und Intercitys möglich.", source: "", answer: "d", explanation: "Bisiklet artık ICE'de de taşınabiliyor → d. Bisiklet tatilinin popülerliğinden (a) söz edilmiyor." },
      { id: 2, text: "Ostsee, Bayern oder Schwarzwald: Auch in diesem Sommer verbringen die meisten Deutschen ihren Urlaub im eigenen Land. Das zeigt die neue Reiseanalyse. 31 Prozent planen eine Reise innerhalb Deutschlands, auf Platz zwei folgt Spanien mit 13 Prozent. Als Gründe nennen viele die kurze Anreise und die gestiegenen Flugpreise.", source: "", answer: "f", explanation: "Almanya içi tatil yine birinci sırada → f. Uçuşlar ucuzlamıyor, tersine pahalanıyor → i yanlış." },
      { id: 3, text: "Ab 1. März gilt in der Stadt eine neue Abfallordnung. Kartons und Papier gehören dann nicht mehr in die gelbe, sondern nur noch in die blaue Tonne. Für Glas werden in allen Stadtteilen neue Container aufgestellt. Wer den Müll falsch sortiert, muss mit einer Strafe rechnen. Die Gebühren bleiben gleich.", source: "", answer: "b", explanation: "Çöp ayrıştırmada yeni kurallar → b. Ücretler aynı kalıyor → e yanlış." },
      { id: 4, text: "Die Stadt möchte in den nächsten fünf Jahren 1.000 neue Bäume pflanzen. Dabei können alle Bürgerinnen und Bürger helfen: Wer 150 Euro bezahlt, wird „Baumpate“. Er bekommt eine Urkunde und ein kleines Schild mit seinem Namen am Baum. Wo der Baum stehen soll, kann man sich selbst aussuchen.", source: "", answer: "j", explanation: "Vatandaşlar ağaç bağışlayabiliyor → j. Ağaç kesilmiyor, dikiliyor → g yanlış." },
      { id: 5, text: "Endlich Urlaub – auch für die Eltern! Immer mehr Hotels an der Nord- und Ostsee bieten eine professionelle Betreuung für Kinder ab drei Jahren an. Während die Kleinen basteln, schwimmen oder Ausflüge machen, können sich Mama und Papa in der Sauna oder am Strand erholen. Die Betreuung ist meist im Preis enthalten.", source: "", answer: "h", explanation: "Çocuk bakımı sunan aile otelleri → h. c (sadece yetişkinlere otel) tam tersi." },
    ],
  },
];

// ───────────────────────────── LESEN TEIL 2 · Detailverstehen ─────────────────────────────

export const TELC_B1_TEIL2_SETS: McTextSet[] = [
  {
    id: "b1t2-1",
    title: "Einkaufen ohne Verpackung",
    text: {
      kind: "article",
      headline: "Einkaufen ohne Plastik – geht das?",
      subline: "Seit zwei Jahren gibt es in Kiel einen Laden, in dem nichts verpackt ist",
      paragraphs: [
        "Wer in den kleinen Laden „Füllgut“ in der Kieler Altstadt kommt, sieht keine Plastiktüten und keine bunten Verpackungen. Nudeln, Reis, Linsen, Müsli und Nüsse stehen in großen Glasbehältern an der Wand. Die Kunden bringen ihre eigenen Dosen und Gläser mit, füllen so viel ein, wie sie brauchen, und bezahlen nach Gewicht.",
        "Gegründet hat den Laden Svenja Möller. Die 34-Jährige hat früher als Ingenieurin bei einer großen Firma gearbeitet. „Jede Woche hatten wir zu Hause zwei volle gelbe Säcke mit Verpackungsmüll. Irgendwann wollte ich das nicht mehr“, erzählt sie. Weil es in Kiel kein passendes Geschäft gab, hat sie ihre Stelle gekündigt und mit einem Kredit von der Bank ihren eigenen Laden eröffnet.",
        "Der Anfang war nicht leicht. In den ersten Monaten kamen nur wenige Kunden, und Svenja musste oft zwölf Stunden am Tag arbeiten. Inzwischen hat sie über 600 Stammkunden und zwei Mitarbeiterinnen. Besonders beliebt sind Waschmittel und Shampoo zum Selbstabfüllen. „Viele Leute denken, dass bei uns alles teurer ist als im Supermarkt. Das stimmt aber nur für einige Produkte. Und man kauft nur so viel, wie man wirklich braucht – so wirft man auch weniger Lebensmittel weg“, sagt sie.",
        "Wer kein eigenes Glas dabeihat, kann im Laden eines leihen. Dafür bezahlt man einen Euro Pfand, den man bei der Rückgabe zurückbekommt. Einmal im Monat bietet Svenja außerdem einen Workshop an, in dem man lernt, wie man Putzmittel selbst herstellen kann.",
        "Ihr nächstes Ziel: ein zweiter Laden in einem anderen Stadtteil. „Aber erst, wenn ich die richtigen Räume gefunden habe. Ich habe es nicht eilig“, lacht sie.",
      ],
    },
    tasks: [
      { id: 6, stem: "Im Laden „Füllgut“ …", options: o("bekommt man alle Lebensmittel in Plastikdosen.", "nehmen die Kunden die Menge, die sie wollen.", "kostet jedes Produkt gleich viel."), answer: "b", explanation: "„füllen so viel ein, wie sie brauchen, und bezahlen nach Gewicht“." },
      { id: 7, stem: "Svenja Möller hat den Laden eröffnet, weil sie …", options: o("weniger Müll produzieren wollte.", "ihre Arbeit als Ingenieurin verloren hatte.", "von der Bank Geld geschenkt bekommen hat."), answer: "a", explanation: "Evde çok ambalaj çöpü vardı, „das wollte ich nicht mehr“. İşini kendisi bıraktı; bankadan kredi aldı, hediye değil." },
      { id: 8, stem: "In der ersten Zeit …", options: o("hatte Svenja zwei Mitarbeiterinnen.", "kamen sehr viele Kunden.", "hat Svenja sehr viel gearbeitet."), answer: "c", explanation: "„musste oft zwölf Stunden am Tag arbeiten“. Az müşteri vardı; çalışanlar sonradan geldi." },
      { id: 9, stem: "Nach Meinung von Svenja …", options: o("sind alle Produkte billiger als im Supermarkt.", "werfen die Kunden weniger Lebensmittel weg.", "kaufen die Kunden zu viel ein."), answer: "b", explanation: "„so wirft man auch weniger Lebensmittel weg“. Bazı ürünler daha pahalı → a yanlış." },
      { id: 10, stem: "Svenja möchte …", options: o("bald einen zweiten Laden eröffnen, wenn sie passende Räume findet.", "sofort einen zweiten Laden eröffnen.", "keine Workshops mehr anbieten."), answer: "a", explanation: "„erst, wenn ich die richtigen Räume gefunden habe. Ich habe es nicht eilig“." },
    ],
  },
  {
    id: "b1t2-2",
    title: "Mit 50 noch einmal Azubi",
    text: {
      kind: "article",
      headline: "Neustart mit 50",
      subline: "Warum ein Bankkaufmann noch einmal eine Ausbildung zum Tischler macht",
      paragraphs: [
        "Wenn Thomas Berger morgens um sieben in die Werkstatt kommt, ist er der Älteste – sogar älter als sein Chef. Der 51-Jährige macht eine Ausbildung zum Tischler. Seine Mitschüler in der Berufsschule sind zwischen 17 und 22 Jahre alt. „Am Anfang haben mich alle für einen Lehrer gehalten“, erzählt er und lacht.",
        "25 Jahre lang hat Thomas in einer Bank gearbeitet. Er hatte ein gutes Gehalt und ein eigenes Büro. „Aber ich saß den ganzen Tag vor dem Computer, und am Abend wusste ich oft nicht, was ich eigentlich gemacht hatte“, sagt er. Holz war schon immer sein Hobby: In seiner Freizeit hat er für seine Familie Regale, einen Tisch und sogar ein Bett gebaut.",
        "Als die Bank vor zwei Jahren mehrere Filialen schließen wollte und Mitarbeitern eine Abfindung anbot, hat Thomas sofort zugegriffen. Seine Frau war zuerst skeptisch. „Wir hatten Angst, dass das Geld nicht reicht“, erzählt sie. Als Azubi verdient Thomas im ersten Jahr nur 800 Euro im Monat. Die Familie hat deshalb ihr zweites Auto verkauft und fährt seltener in Urlaub.",
        "Leicht ist die Ausbildung nicht. Die körperliche Arbeit ist anstrengend, und in der Berufsschule muss er wieder Mathe lernen. „Bei den Berechnungen helfen mir die Jungen, dafür erkläre ich ihnen, wie man mit Kunden spricht“, sagt Thomas. Sein Chef ist froh über den erfahrenen Azubi: „Er ist zuverlässig und hat sehr gute Ideen.“",
        "In einem Jahr ist Thomas fertig. Danach möchte er in dem Betrieb bleiben und sich später auf Möbel für ältere Menschen spezialisieren. „Ich habe den Schritt keinen Tag bereut“, sagt er.",
      ],
    },
    tasks: [
      { id: 6, stem: "In der Berufsschule …", options: o("unterrichtet Thomas Berger junge Leute.", "sind die anderen Schüler viel jünger als Thomas.", "ist Thomas jünger als sein Lehrer."), answer: "b", explanation: "Sınıf arkadaşları 17–22 yaşında. Ona öğretmen sanmışlar ama öğretmen değil." },
      { id: 7, stem: "In der Bank …", options: o("war Thomas mit seiner Arbeit nicht zufrieden.", "hat Thomas wenig Geld verdient.", "hat Thomas mit Holz gearbeitet."), answer: "a", explanation: "Bütün gün bilgisayar başında, akşam ne yaptığını bilmiyordu → memnun değildi. Maaşı iyiydi." },
      { id: 8, stem: "Thomas hat die Bank verlassen, …", options: o("weil man ihm gekündigt hat.", "weil seine Frau es wollte.", "als die Bank Geld für das Ausscheiden angeboten hat."), answer: "c", explanation: "Banka tazminat (Abfindung) teklif edince hemen kabul etti. Eşi başta şüpheliydi." },
      { id: 9, stem: "Die Familie Berger …", options: o("spart jetzt bei einigen Dingen.", "hat ein neues Auto gekauft.", "macht öfter Urlaub."), answer: "a", explanation: "İkinci arabayı sattılar ve daha seyrek tatile gidiyorlar → tasarruf." },
      { id: 10, stem: "In der Ausbildung …", options: o("findet Thomas alles sehr leicht.", "helfen Thomas und die jungen Azubis einander.", "möchte sein Chef ihn nicht behalten."), answer: "b", explanation: "Gençler matematikte yardım ediyor, o da müşteriyle konuşmayı öğretiyor → birbirlerine yardım." },
    ],
  },
  {
    id: "b1t2-3",
    title: "Nachbarn helfen Nachbarn",
    text: {
      kind: "article",
      headline: "Bohrmaschine gesucht? Frag doch die Nachbarn!",
      subline: "Eine App bringt Menschen in der Nachbarschaft zusammen",
      paragraphs: [
        "In vielen Großstädten kennen sich die Nachbarn kaum. Man grüßt sich im Treppenhaus, aber mehr nicht. Das wollte die Studentin Lisa Brandt aus Leipzig ändern. Zusammen mit zwei Freunden hat sie vor drei Jahren die App „Nebenan“ entwickelt. Heute benutzen sie über 200.000 Menschen in ganz Deutschland.",
        "Die Idee ist einfach: Wer etwas braucht oder anbieten möchte, schreibt eine kurze Nachricht. Die sehen dann nur Menschen, die im selben Stadtviertel wohnen. „Viele Leute kaufen zum Beispiel eine Bohrmaschine, benutzen sie zweimal im Jahr und dann liegt sie im Keller“, erklärt Lisa. „Warum sollte nicht der Nachbar sie ausleihen?“",
        "Aber es geht nicht nur ums Ausleihen. Auf der App suchen Menschen Hilfe beim Einkaufen, jemanden, der die Blumen gießt, oder Partner für einen Spaziergang. Besonders ältere Menschen nutzen das Angebot gern. Die 78-jährige Erika Schulze hat über die App Jonas kennengelernt, einen Studenten aus dem Haus gegenüber. Er bringt ihr jeden Samstag die Einkäufe, und sie kocht dafür manchmal für ihn. „Wir sind richtige Freunde geworden“, sagt sie.",
        "Geld spielt bei „Nebenan“ keine Rolle: Die App ist kostenlos, und Bezahlung für Hilfe ist nicht erwünscht. Finanziert wird das Projekt durch Werbung von kleinen Geschäften aus der Umgebung und durch Spenden.",
        "Natürlich gibt es auch Probleme. Manche Nutzer melden sich an, reagieren dann aber nicht auf Nachrichten. Außerdem müssen die Gründer darauf achten, dass niemand die App für Streit oder Beleidigungen benutzt. Deshalb kontrollieren freiwillige Helfer die Beiträge. Lisa ist trotzdem zufrieden: „Jede Freundschaft, die durch die App entsteht, ist ein Erfolg.“",
      ],
    },
    tasks: [
      { id: 6, stem: "Lisa Brandt hat die App entwickelt, weil …", options: o("sie Geld verdienen wollte.", "sich viele Nachbarn in Städten nicht kennen.", "sie eine Bohrmaschine verkaufen wollte."), answer: "b", explanation: "Büyük şehirlerde komşular birbirini tanımıyor; Lisa bunu değiştirmek istedi." },
      { id: 7, stem: "Die Nachrichten auf der App …", options: o("können alle Nutzer in Deutschland lesen.", "lesen nur Nachbarn aus dem gleichen Stadtteil.", "sind nur für ältere Menschen."), answer: "b", explanation: "„Die sehen dann nur Menschen, die im selben Stadtviertel wohnen.“" },
      { id: 8, stem: "Frau Schulze …", options: o("bezahlt Jonas für die Einkäufe.", "hat durch die App einen Freund gefunden.", "kauft für Jonas ein."), answer: "b", explanation: "„Wir sind richtige Freunde geworden.“ Alışverişi Jonas yapıyor." },
      { id: 9, stem: "Die App …", options: o("bekommt Geld von Geschäften und durch Spenden.", "kostet für ältere Menschen etwas.", "verlangt Geld für jede Hilfe."), answer: "a", explanation: "Yakındaki dükkânların reklamları ve bağışlarla finanse ediliyor." },
      { id: 10, stem: "Freiwillige Helfer …", options: o("bringen den Nutzern Einkäufe.", "antworten auf alle Nachrichten.", "prüfen, was in der App geschrieben wird."), answer: "c", explanation: "„kontrollieren freiwillige Helfer die Beiträge“." },
    ],
  },
  {
    id: "b1t2-4",
    title: "Leben ohne Auto",
    text: {
      kind: "article",
      headline: "Familie Kaya braucht kein Auto mehr",
      subline: "Wie eine Familie mit drei Kindern in Freiburg ohne eigenes Auto lebt",
      paragraphs: [
        "Vor vier Jahren hat Familie Kaya ihr Auto verkauft. „Es stand sowieso die meiste Zeit vor dem Haus“, erzählt Mutter Selin. „Und jeden Monat haben wir für Versicherung, Steuer und Reparaturen fast 300 Euro bezahlt.“ Heute fahren die Eltern und ihre drei Kinder Fahrrad, Bus und Bahn.",
        "Leicht war die Entscheidung nicht. Vater Murat arbeitet als Krankenpfleger und hat oft Nachtdienst. „Ich hatte Angst, dass ich nachts nicht nach Hause komme“, sagt er. Doch das Krankenhaus liegt nur sechs Kilometer entfernt – mit dem E-Bike ist er in 20 Minuten dort, schneller als früher mit dem Auto im Berufsverkehr.",
        "Für den Wocheneinkauf hat die Familie ein Lastenrad gekauft. Darin haben zwei Getränkekisten und mehrere Taschen Platz. Wenn sie doch einmal ein Auto brauchen, zum Beispiel für einen Ausflug in den Schwarzwald oder um Möbel zu transportieren, nutzen sie Carsharing. Das kostet sie im Durchschnitt 40 Euro im Monat.",
        "Die Kinder fanden die Idee zuerst nicht so gut. „Meine Freundinnen werden immer mit dem Auto zum Training gebracht“, sagt die 13-jährige Elif. Inzwischen fährt sie selbst mit dem Rad und ist stolz darauf. Nur im Winter, wenn es früh dunkel wird, nimmt sie den Bus.",
        "Natürlich klappt nicht immer alles. Als die Großeltern in der Türkei krank wurden, musste die Familie kurzfristig fliegen und ist mit dem Taxi zum Flughafen gefahren – teuer, aber eine Ausnahme. „Für uns funktioniert es, weil wir in der Stadt wohnen“, sagt Selin. „Auf dem Land wäre es ohne Auto viel schwieriger.“",
      ],
    },
    tasks: [
      { id: 6, stem: "Familie Kaya hat ihr Auto verkauft, weil …", options: o("es kaputt war.", "es wenig benutzt wurde und viel gekostet hat.", "sie umgezogen sind."), answer: "b", explanation: "Araba çoğu zaman evin önünde duruyordu ve ayda 300 Euro'ya mal oluyordu." },
      { id: 7, stem: "Murat Kaya kommt heute …", options: o("schneller zur Arbeit als früher.", "nachts nicht mehr nach Hause.", "mit dem Bus zur Arbeit."), answer: "a", explanation: "E-Bike ile 20 dakika, trafikte arabayla olduğundan daha hızlı." },
      { id: 8, stem: "Mit dem Carsharing-Auto …", options: o("fährt die Familie jeden Tag einkaufen.", "macht die Familie manchmal Ausflüge.", "fährt Elif zum Training."), answer: "b", explanation: "Schwarzwald gezisi veya mobilya taşımak için kullanıyorlar. Alışveriş Lastenrad ile." },
      { id: 9, stem: "Elif …", options: o("fährt heute meistens selbst mit dem Fahrrad.", "wird von den Eltern mit dem Auto gebracht.", "fährt im Winter mit dem Fahrrad."), answer: "a", explanation: "„Inzwischen fährt sie selbst mit dem Rad“. Kışın otobüse biniyor." },
      { id: 10, stem: "Selin Kaya meint, dass ein Leben ohne Auto …", options: o("für alle Familien leicht ist.", "nie Probleme macht.", "in der Stadt einfacher ist als auf dem Land."), answer: "c", explanation: "„Auf dem Land wäre es ohne Auto viel schwieriger.“" },
    ],
  },
];

// ───────────────────────────── LESEN TEIL 3 · Selektives Verstehen ─────────────────────────────

export const TELC_B1_TEIL3_SETS: TelcA2Teil3Set[] = [
  {
    id: "b1t3-1",
    title: "Freizeit, Kurse und Urlaub",
    ads: [
      { key: "a", title: "VHS Süd – Spanisch A1–B1", lines: ["Jeden Mittwoch 18 Uhr", "im Gemeindezentrum", "Kursbeginn: September"] },
      { key: "b", title: "Endlich rauchfrei!", lines: ["Kurs der Krankenkasse in 6 Wochen", "Start: 4. Oktober", "Für Versicherte kostenlos"] },
      { key: "c", title: "FitPoint Studio", lines: ["Kinderbetreuung während Ihres Trainings", "Mo–Fr 9–12 Uhr", "Erster Monat gratis"] },
      { key: "d", title: "Business English", lines: ["Für Berufstätige: Telefonieren, Präsentieren, E-Mails", "Di + Do 19–21 Uhr", "Kleine Gruppen, max. 8 Personen"] },
      { key: "e", title: "Möbelhaus Wohntraum", lines: ["Neue Sofas, Schränke, Betten", "Bis zu 30 % Rabatt", "Lieferung kostenlos"] },
      { key: "f", title: "Kochschule Pfeffer & Salz", lines: ["Kurse: Italien, Asien, Grillen", "Geschenkgutscheine für jeden Anlass", "Auch online bestellen"] },
      { key: "g", title: "Café Sonnendeck", lines: ["Große Terrasse mit Blick auf den Fluss", "Sa + So 9–14 Uhr: Frühstücksbuffet", "Bei Regen im Wintergarten"] },
      { key: "h", title: "Tanzschule Wagner", lines: ["Salsa, Walzer, Discofox", "Kurse für Paare", "Freitags Tanzparty"] },
      { key: "i", title: "Flohmarkt am Rathausplatz", lines: ["Jeden 1. Samstag im Monat", "Standplätze für Privatleute ab 10 €", "Anmeldung im Bürgerbüro"] },
      { key: "j", title: "Ferienwohnung an der Ostsee", lines: ["4 Zimmer, 200 m zum Strand", "Ideal für Familien", "In den Sommerferien: 7 Nächte für 690 €"] },
      { key: "k", title: "Musikschule Allegro", lines: ["Klavier, Gitarre, Geige", "Einzelunterricht für Kinder ab 6 Jahren", "Kostenlose Probestunde"] },
      { key: "l", title: "Gospelchor „Joyful Voices“", lines: ["Wir suchen neue Sängerinnen und Sänger", "Noten lesen nicht nötig", "Probe: Montag 19.30 Uhr"] },
    ],
    tasks: [
      { id: 11, situation: "Sie möchten am Sonntag mit Freunden draußen frühstücken.", answer: "g", explanation: "Teras + hafta sonu kahvaltı büfesi → g." },
      { id: 12, situation: "Ihre Tochter ist zehn und möchte Klavier spielen lernen.", answer: "k", explanation: "Çocuklar için piyano dersi → k." },
      { id: 13, situation: "Sie brauchen für Ihren Beruf besseres Englisch, haben aber nur abends Zeit.", answer: "d", explanation: "İş İngilizcesi, akşam 19–21 → d." },
      { id: 14, situation: "Sie suchen für Freitagabend jemanden, der auf Ihre Kinder aufpasst, weil Sie ausgehen möchten.", answer: "x", explanation: "c sadece spor salonunda antrenman sırasında ve sabahları → x. h'de cuma partisi var ama çocuk bakımı yok." },
      { id: 15, situation: "Sie möchten Ihre alten Sachen privat verkaufen.", answer: "i", explanation: "Bit pazarında özel kişiler için stant → i. e yeni mobilya satıyor." },
      { id: 16, situation: "Ihr Mann möchte im Herbst mit dem Rauchen aufhören.", answer: "b", explanation: "Sigarayı bırakma kursu, Ekim'de başlıyor → b." },
      { id: 17, situation: "Sie singen gern und möchten das in einer Gruppe tun.", answer: "l", explanation: "Koro yeni üye arıyor → l." },
      { id: 18, situation: "Sie möchten mit Ihrer Familie in den Sommerferien am Meer Urlaub machen.", answer: "j", explanation: "Ostsee'de aileler için tatil evi → j." },
      { id: 19, situation: "Ein Freund kocht sehr gern. Sie suchen ein Geschenk für ihn.", answer: "f", explanation: "Yemek kursu hediye çeki → f." },
      { id: 20, situation: "Sie möchten in Spanien einen Sprachkurs machen.", answer: "x", explanation: "a İspanyolca kursu ama İspanya'da değil, Gemeindezentrum'da → x." },
    ],
  },
  {
    id: "b1t3-2",
    title: "Wohnen und Alltag",
    ads: [
      { key: "a", title: "Mieterverein e. V.", lines: ["Ärger mit der Nebenkostenabrechnung?", "Rechtsberatung für Mitglieder", "Mitgliedschaft ab 6 € im Monat"] },
      { key: "b", title: "Sozialkaufhaus Fundgrube", lines: ["Gebrauchte Möbel, auch für Kinderzimmer", "Kleidung und Haushaltswaren", "Di–Sa 10–18 Uhr"] },
      { key: "c", title: "Wohnen auf Zeit", lines: ["Möblierte Apartments in der Innenstadt", "Mietdauer 3 bis 12 Monate", "Internet inklusive"] },
      { key: "d", title: "Tiersitter Pfotenglück", lines: ["Wir kommen zu Ihnen nach Hause", "Füttern, Spielen, Katzenklo", "Wenn Sie im Urlaub sind"] },
      { key: "e", title: "Computerkurs für Einsteiger", lines: ["Internet, E-Mail, Online-Banking", "Mo + Mi 18–20 Uhr", "Im Bürgerhaus"] },
      { key: "f", title: "Gärtnerei Grünzeug", lines: ["Pflanzen für Balkon und Terrasse", "Wir beraten Sie gern", "Auch Lieferung"] },
      { key: "g", title: "Hundeschule Bello", lines: ["Erziehungskurse für junge Hunde", "Gruppen- und Einzeltraining", "Samstags im Stadtpark"] },
      { key: "h", title: "Umzüge Muskelkraft", lines: ["Starke Helfer für Ihren Umzug", "Möbel tragen, auf- und abbauen", "Auch am Wochenende"] },
      { key: "i", title: "Glanz & Co.", lines: ["Wohnungsreinigung nach dem Auszug", "Fenster, Böden, Küche", "Schnell und gründlich"] },
      { key: "j", title: "Hausgeräte-Service Blitz", lines: ["Reparatur von Waschmaschinen, Herden, Kühlschränken", "Alle Marken", "Termin innerhalb von 24 Stunden"] },
      { key: "k", title: "Fahrradwerkstatt Speiche", lines: ["Reparatur und Inspektion", "Neue Räder und E-Bikes", "Mo–Sa 9–18 Uhr"] },
      { key: "l", title: "Malerbetrieb Farbenfroh", lines: ["Streichen, Tapezieren, Lackieren", "Saubere Arbeit zum fairen Preis", "Kostenloser Kostenvoranschlag"] },
    ],
    tasks: [
      { id: 11, situation: "Sie ziehen um und brauchen Leute, die Ihre schweren Möbel tragen.", answer: "h", explanation: "Taşınma yardımcıları, mobilya taşıma → h." },
      { id: 12, situation: "Sie arbeiten ein halbes Jahr in einer anderen Stadt und suchen dort eine Wohnung mit Möbeln.", answer: "c", explanation: "Eşyalı, 3–12 ay kiralık daire → c." },
      { id: 13, situation: "Ihre Waschmaschine funktioniert nicht mehr.", answer: "j", explanation: "Çamaşır makinesi tamiri → j." },
      { id: 14, situation: "Sie möchten Ihren Balkon mit Blumen schön machen und brauchen Tipps.", answer: "f", explanation: "Balkon bitkileri ve danışmanlık → f." },
      { id: 15, situation: "Sie glauben, dass Ihr Vermieter zu viel Geld für die Nebenkosten verlangt.", answer: "a", explanation: "Yan giderler faturasıyla sorun → kiracılar derneği → a." },
      { id: 16, situation: "Sie möchten Ihr altes Fahrrad verkaufen.", answer: "x", explanation: "k tamir yapıyor ve yeni bisiklet satıyor; eski bisiklet satın almıyor → x." },
      { id: 17, situation: "Sie fahren zwei Wochen weg. Jemand soll sich in dieser Zeit um Ihre Katze kümmern.", answer: "d", explanation: "Evcil hayvan bakıcısı, tatil sırasında → d. g köpek okulu." },
      { id: 18, situation: "Die Wände in Ihrem Wohnzimmer sollen eine neue Farbe bekommen.", answer: "l", explanation: "Boya işleri → l." },
      { id: 19, situation: "Sie suchen ein günstiges, gebrauchtes Bett für Ihren Sohn.", answer: "b", explanation: "İkinci el mobilya, çocuk odası için de → b." },
      { id: 20, situation: "Sie möchten am Vormittag lernen, wie man E-Mails schreibt.", answer: "x", explanation: "e sadece akşam 18–20 → x." },
    ],
  },
  {
    id: "b1t3-3",
    title: "Arbeit und Weiterbildung",
    ads: [
      { key: "a", title: "Klinikum Nord", lines: ["Pflegefachkräfte (m/w/d) in Vollzeit", "Unbefristeter Vertrag", "Bewerbung online"] },
      { key: "b", title: "English Club", lines: ["Englisch sprechen in lockerer Atmosphäre", "Jeden Donnerstag im Café Central", "Ohne Anmeldung"] },
      { key: "c", title: "Salon Haarmonie", lines: ["Erfahrene Friseurin (m/w/d) gesucht", "Teilzeit oder Vollzeit", "Keine Ausbildungsplätze"] },
      { key: "d", title: "Kino Metropol", lines: ["Wir suchen Aushilfen für Kasse und Snackbar", "Fr–So, abends", "Ideal für Studierende"] },
      { key: "e", title: "Berghotel Alpenblick (Tirol)", lines: ["Mitarbeiter für die Wintersaison", "Service, Küche, Rezeption", "Unterkunft im Hotel"] },
      { key: "f", title: "Pflegedienst Mobil", lines: ["Pflegehelfer (m/w/d) in Teilzeit", "20 Stunden pro Woche", "Führerschein Klasse B nötig"] },
      { key: "g", title: "Fahrschule Meier", lines: ["Führerschein Klasse C und CE (Lkw)", "Auch mit Förderung durch die Agentur für Arbeit", "Neue Kurse jeden Monat"] },
      { key: "h", title: "Gründerzentrum der IHK", lines: ["Sie wollen sich selbstständig machen?", "Kostenlose Erstberatung", "Jeden Dienstag 14–17 Uhr"] },
      { key: "i", title: "Hort Sonnenschein", lines: ["Betreuung für Grundschulkinder", "Mo–Fr bis 18 Uhr, mit Mittagessen", "Hilfe bei den Hausaufgaben"] },
      { key: "j", title: "Sprachinstitut Lingua", lines: ["Deutsch für den Beruf B2", "Mit Abschlussprüfung und Zertifikat", "Abend- und Wochenendkurse"] },
      { key: "k", title: "Bewerbungscoaching", lines: ["Lebenslauf, Anschreiben, Vorstellungsgespräch", "Individuelle Beratung", "Termine nach Vereinbarung"] },
      { key: "l", title: "Online-Akademie Plus", lines: ["Buchhaltung und Lohnabrechnung", "100 % online – lernen, wann Sie wollen", "Mit Zertifikat"] },
    ],
    tasks: [
      { id: 11, situation: "Sie studieren und möchten am Wochenende etwas Geld verdienen.", answer: "d", explanation: "Cuma–pazar yardımcı eleman, öğrenciler için ideal → d." },
      { id: 12, situation: "Sie sind ausgebildete Krankenpflegerin und suchen eine Vollzeitstelle.", answer: "a", explanation: "Hastane tam zamanlı bakım uzmanı arıyor → a. f yarı zamanlı yardımcı." },
      { id: 13, situation: "Sie brauchen für Ihre Arbeit ein Zertifikat über Ihre Deutschkenntnisse.", answer: "j", explanation: "Meslek Almancası B2, sınav ve sertifikalı → j." },
      { id: 14, situation: "Sie möchten als Lkw-Fahrer arbeiten und brauchen dafür den passenden Führerschein.", answer: "g", explanation: "Kamyon ehliyeti C/CE → g." },
      { id: 15, situation: "Sie haben bald ein Vorstellungsgespräch und möchten sich gut vorbereiten.", answer: "k", explanation: "Mülakata hazırlık koçluğu → k." },
      { id: 16, situation: "Sie möchten ein eigenes Geschäft eröffnen und brauchen Informationen.", answer: "h", explanation: "Kendi işini kurmak için danışmanlık → h." },
      { id: 17, situation: "Ihre Schwester sucht eine Ausbildungsstelle als Friseurin.", answer: "x", explanation: "c deneyimli kuaför arıyor, „Keine Ausbildungsplätze“ → x." },
      { id: 18, situation: "Sie möchten Buchhaltung lernen, können aber nicht zu festen Zeiten an einem Kurs teilnehmen.", answer: "l", explanation: "Tamamen online, istediğin zaman → l." },
      { id: 19, situation: "Sie möchten länger arbeiten und suchen deshalb eine Betreuung für Ihren Sohn (8) nach der Schule.", answer: "i", explanation: "İlkokul çocukları için okul sonrası bakım → i." },
      { id: 20, situation: "Sie möchten im Sommer in einem Hotel in den Bergen arbeiten.", answer: "x", explanation: "e sadece kış sezonu için eleman arıyor → x." },
    ],
  },
];

// ───────────────────────────── SPRACHBAUSTEINE TEIL 1 · Grammatik ─────────────────────────────

export const TELC_B1_SB1_SETS: ClozeMcSet[] = [
  {
    id: "b1sb1-1",
    title: "E-Mail an einen Freund: Die neue Stelle",
    paragraphs: [
      "Lieber Tom,",
      "vielen Dank für deine E-Mail! Entschuldige, [[21]] ich erst heute antworte. In den letzten Wochen war ich sehr beschäftigt, denn ich habe eine neue Stelle [[22]] einer Werbeagentur in Hamburg. Die Kollegen sind sehr nett und haben mir am Anfang viel [[23]].",
      "Ich arbeite jetzt in einem großen Büro, [[24]] Fenster direkt zum Hafen gehen. Leider muss ich jeden Tag eine Stunde [[25]] der S-Bahn fahren, aber das ist nicht so schlimm, weil ich dabei lesen kann.",
      "Letzten Samstag [[26]] ich mit einer Kollegin an die Ostsee gefahren. Das Wetter war toll, und wir haben am Strand ein [[27]] Picknick gemacht. Hast du nicht Lust, mich bald zu besuchen? Ich [[28]] mich sehr freuen! Du kannst bei mir wohnen, ich habe jetzt sogar ein Gästezimmer. Schreib mir, [[29]] du Zeit hast – vielleicht klappt es ja schon im Juni. Ich freue mich [[30]] deine Antwort!",
      "Liebe Grüße",
      "Lena",
    ],
    gaps: [
      { id: 21, options: o("weil", "dass", "ob"), answer: "b", explanation: "„Entschuldige, dass …“ – özür dilenen şeyi dass açar." },
      { id: 22, options: o("bei", "für", "an"), answer: "a", explanation: "Bir firmada çalışmak / iş bulmak: „bei einer Firma“." },
      { id: 23, options: o("helfen", "hilft", "geholfen"), answer: "c", explanation: "Perfekt: „haben … geholfen“." },
      { id: 24, options: o("deren", "dessen", "denen"), answer: "b", explanation: "das Büro (nötr) → ilgi zamiri iyelik hâli: dessen Fenster." },
      { id: 25, options: o("mit", "in", "von"), answer: "a", explanation: "Taşıtla gitmek: „mit der S-Bahn fahren“." },
      { id: 26, options: o("habe", "bin", "hatte"), answer: "b", explanation: "fahren hareket fiili → Perfekt sein ile: „bin … gefahren“." },
      { id: 27, options: o("schönes", "schöne", "schönen"), answer: "a", explanation: "ein + nötr (das Picknick) + Akkusativ → schönes." },
      { id: 28, options: o("werde", "würde", "wurde"), answer: "b", explanation: "Dilek / kibarlık: Konjunktiv II „ich würde mich freuen“." },
      { id: 29, options: o("wann", "wenn", "als"), answer: "a", explanation: "Dolaylı soru „ne zaman?“ → wann. (wenn = eğer / -dığında)" },
      { id: 30, options: o("über", "auf", "für"), answer: "b", explanation: "Gelecekteki bir şeyi dört gözle beklemek: „sich freuen auf“." },
    ],
  },
  {
    id: "b1sb1-2",
    title: "Anfrage an eine Sprachschule",
    paragraphs: [
      "Sehr geehrte Damen und Herren,",
      "ich habe Ihre Anzeige im Internet gelesen und interessiere mich [[21]] einen Intensivkurs Deutsch im Sommer. Ich komme aus Brasilien und lerne seit zwei Jahren Deutsch. Im Moment besuche ich einen Kurs auf dem Niveau B1, [[22]] ich möchte im Herbst die B1-Prüfung machen.",
      "Ich hätte noch einige Fragen: Wie viele Teilnehmer sind in [[23]] Gruppe? Gibt es auch Nachmittagsprogramme, [[24]] man die Stadt kennenlernen kann? Außerdem möchte ich gern wissen, [[25]] Sie auch Zimmer bei Gastfamilien vermitteln. Ich würde am liebsten bei einer Familie wohnen, [[26]] ich dort mehr Deutsch sprechen kann.",
      "Könnten Sie mir bitte auch [[27]], wie viel der Kurs kostet und bis wann ich mich anmelden [[28]]? Ich [[29]] Ihnen sehr dankbar, wenn Sie mir bald antworten würden.",
      "[[30]] freundlichen Grüßen",
      "Ana Souza",
    ],
    gaps: [
      { id: 21, options: o("an", "für", "auf"), answer: "b", explanation: "„sich interessieren für“." },
      { id: 22, options: o("weil", "deshalb", "denn"), answer: "c", explanation: "Ardından fiil 2. sırada (ich möchte) → denn. weil olsaydı fiil sona giderdi; deshalb olsaydı „deshalb möchte ich“." },
      { id: 23, options: o("einer", "eine", "einem"), answer: "a", explanation: "in + Dativ (nerede?), die Gruppe → einer." },
      { id: 24, options: o("die", "bei denen", "bei dem"), answer: "b", explanation: "die Nachmittagsprogramme (çoğul), „bei“ + Dativ çoğul → bei denen." },
      { id: 25, options: o("dass", "wenn", "ob"), answer: "c", explanation: "Evet/hayır sorusu dolaylı → ob." },
      { id: 26, options: o("weil", "denn", "deshalb"), answer: "a", explanation: "Fiil cümle sonunda (sprechen kann) → weil." },
      { id: 27, options: o("mitteilen", "mitgeteilt", "teilen mit"), answer: "a", explanation: "Modal fiil (Könnten) + mastar sonda → mitteilen." },
      { id: 28, options: o("musste", "muss", "gemusst"), answer: "b", explanation: "Şimdiki zaman, yan cümle sonunda çekimli fiil → muss." },
      { id: 29, options: o("würde", "war", "wäre"), answer: "c", explanation: "„Ich wäre Ihnen dankbar“ – sein'in Konjunktiv II hâli." },
      { id: 30, options: o("Von", "Mit", "In"), answer: "b", explanation: "Kalıp: „Mit freundlichen Grüßen“." },
    ],
  },
  {
    id: "b1sb1-3",
    title: "Einladung zur Einweihungsparty",
    paragraphs: [
      "Liebe Sandra, lieber Mehmet,",
      "wie geht es euch? Bei uns gibt es große Neuigkeiten: Wir [[21]] endlich eine größere Wohnung gefunden! Sie liegt in einem ruhigen Stadtteil, nicht weit [[22]] Park. Die Kinder freuen sich sehr, weil jetzt jedes sein [[23]] Zimmer hat.",
      "Am 15. Juni wollen wir [[24]] Einzug feiern und möchten euch herzlich einladen. Die Party beginnt um 18 Uhr. Wenn das Wetter schön ist, grillen wir im Garten, [[25]] wir zusammen mit den Nachbarn benutzen dürfen.",
      "Könnt ihr vielleicht einen Salat mitbringen? Und noch eine Bitte: Thomas hat sich beim Fußball am Fuß verletzt und darf deshalb nichts Schweres [[26]]. Hättet ihr am Samstag vorher Zeit, uns beim Umzug zu helfen? Als Dankeschön [[27]] wir euch natürlich zum Essen ein!",
      "Bitte sagt uns bis Ende Mai Bescheid, [[28]] ihr kommen könnt. Wir freuen uns schon sehr darauf, euch wieder [[29]] sehen. Es ist ja schon fast ein Jahr her, [[30]] wir uns das letzte Mal getroffen haben.",
      "Viele Grüße",
      "Julia und Thomas",
    ],
    gaps: [
      { id: 21, options: o("sind", "haben", "hatten"), answer: "b", explanation: "finden → Perfekt haben ile: „haben gefunden“." },
      { id: 22, options: o("vom", "von", "zum"), answer: "a", explanation: "„nicht weit von + Dativ“: von dem Park = vom Park." },
      { id: 23, options: o("eigene", "eigener", "eigenes"), answer: "c", explanation: "sein (iyelik, ein-tipi) + das Zimmer, Akkusativ → eigenes." },
      { id: 24, options: o("unseren", "unserem", "unser"), answer: "a", explanation: "feiern + Akkusativ, der Einzug (eril) → unseren." },
      { id: 25, options: o("dem", "den", "der"), answer: "b", explanation: "der Garten (eril), benutzen + Akkusativ → den." },
      { id: 26, options: o("getragen", "trägt", "tragen"), answer: "c", explanation: "darf (modal) + mastar → tragen." },
      { id: 27, options: o("laden", "einladen", "lädt"), answer: "a", explanation: "Ayrılabilen fiil: „wir laden euch … ein“." },
      { id: 28, options: o("dass", "ob", "wann"), answer: "b", explanation: "Gelip gelemeyecekleri (evet/hayır) → ob." },
      { id: 29, options: o("um", "zu", "für"), answer: "b", explanation: "„sich darauf freuen, … zu sehen“ – zu + mastar." },
      { id: 30, options: o("dass", "wenn", "ob"), answer: "a", explanation: "Kalıp: „Es ist schon ein Jahr her, dass wir uns … getroffen haben.“" },
    ],
  },
  {
    id: "b1sb1-4",
    title: "Beschwerde an ein Fitnessstudio",
    paragraphs: [
      "Sehr geehrte Damen und Herren,",
      "seit März bin ich Mitglied in Ihrem Fitnessstudio. Leider bin ich in den letzten Wochen sehr unzufrieden, und ich möchte mich [[21]] einige Dinge beschweren.",
      "Bei meiner Anmeldung hat man mir gesagt, dass das Studio täglich bis 23 Uhr geöffnet ist. Seit Anfang Mai schließen Sie aber schon um 21 Uhr, [[22]] die Mitglieder vorher informiert wurden. Da ich erst um 20 Uhr Feierabend habe, [[23]] ich jetzt kaum noch trainieren.",
      "Außerdem sind mehrere Geräte schon seit Wochen kaputt. Ich habe das zweimal an der Rezeption gemeldet, aber niemand hat sich darum [[24]]. Auch die Duschen sind oft kalt, [[25]] im Winter sehr unangenehm ist.",
      "Ich bezahle jeden Monat 45 Euro und erwarte dafür einen [[26]] Service. Deshalb bitte ich Sie, die alten Öffnungszeiten wieder einzuführen und die Geräte so schnell [[27]] möglich zu reparieren. Sollte das nicht möglich sein, möchte ich meinen Vertrag vorzeitig [[28]].",
      "Ich hoffe auf eine schnelle Antwort und [[29]] mich, wenn Sie mich anrufen. Sie erreichen mich unter der Nummer 0171 2345678 oder per E-Mail. Vielen Dank [[30]] Ihr Verständnis.",
      "Mit freundlichen Grüßen",
      "Petra Klein",
    ],
    gaps: [
      { id: 21, options: o("über", "für", "an"), answer: "a", explanation: "„sich beschweren über“." },
      { id: 22, options: o("obwohl", "ohne dass", "damit"), answer: "b", explanation: "Önceden haber verilmeden → „ohne dass … informiert wurden“." },
      { id: 23, options: o("kann", "könnte", "konnte"), answer: "a", explanation: "Şimdiki durum („jetzt“) → kann." },
      { id: 24, options: o("gekümmert", "kümmern", "kümmert"), answer: "a", explanation: "Perfekt: „hat sich … gekümmert“ (sich kümmern um)." },
      { id: 25, options: o("das", "was", "die"), answer: "b", explanation: "Önceki cümlenin tamamına gönderme → was." },
      { id: 26, options: o("guter", "gutes", "guten"), answer: "c", explanation: "einen + der Service (eril) Akkusativ → guten." },
      { id: 27, options: o("als", "wie", "so"), answer: "b", explanation: "Kalıp: „so schnell wie möglich“." },
      { id: 28, options: o("kündigen", "gekündigt", "kündige"), answer: "a", explanation: "möchte + mastar → kündigen." },
      { id: 29, options: o("freue", "würde", "freuen"), answer: "a", explanation: "„ich freue mich, wenn …“ – ich ile çekim." },
      { id: 30, options: o("über", "für", "auf"), answer: "b", explanation: "Kalıp: „Vielen Dank für Ihr Verständnis.“" },
    ],
  },
];

// ───────────────────────────── SPRACHBAUSTEINE TEIL 2 · Lexik ─────────────────────────────

export const TELC_B1_SB2_SETS: ClozeBankSet[] = [
  {
    id: "b1sb2-1",
    title: "Anfrage: Ferienwohnung",
    paragraphs: [
      "Sehr geehrte Frau Hansen,",
      "ich habe Ihre Anzeige in der Zeitung gelesen und interessiere mich sehr [[31]] Ihre Ferienwohnung auf Sylt. Wir möchten vom 3. bis 17. August mit der ganzen Familie Urlaub machen und hätten [[32]] noch einige Fragen.",
      "Wir sind zwei Erwachsene und drei Kinder. Haben Sie genug Betten für alle, oder [[33]] ich ein Kinderbett mitbringen? In der Anzeige steht, dass die Wohnung nur 300 Meter vom Strand entfernt ist. Gibt es in der Nähe auch einen Supermarkt, [[34]] wir einkaufen können?",
      "Unser Sohn hat eine Allergie gegen Tierhaare. Deshalb möchten wir gern wissen, [[35]] in der Wohnung schon einmal Haustiere waren. [[36]] würden wir gern unsere Fahrräder mitbringen. Gibt es einen Platz, wo man sie sicher abstellen [[37]]?",
      "Bitte teilen Sie uns auch mit, wie hoch die Kosten für die Endreinigung sind und bis [[38]] wir die Anzahlung überweisen sollen. Wir wären Ihnen sehr [[39]], wenn Sie uns bald antworten würden, [[40]] wir möchten die Fahrkarten früh buchen.",
      "Mit freundlichen Grüßen",
      "Martin Weber",
    ],
    words: [
      { key: "a", text: "AUSSERDEM" },
      { key: "b", text: "DANKBAR" },
      { key: "c", text: "DESHALB" },
      { key: "d", text: "WO" },
      { key: "e", text: "FÜR" },
      { key: "f", text: "DENN" },
      { key: "g", text: "KANN" },
      { key: "h", text: "OB" },
      { key: "i", text: "WANN" },
      { key: "j", text: "WEIL" },
      { key: "k", text: "MIT" },
      { key: "l", text: "FROH" },
      { key: "m", text: "SOLL" },
      { key: "n", text: "DASS" },
      { key: "o", text: "WIE" },
    ],
    gaps: [
      { id: 31, answer: "e", explanation: "„sich interessieren für“." },
      { id: 32, answer: "c", explanation: "Bu yüzden (tatil planladığımız için) sorularımız var → deshalb." },
      { id: 33, answer: "m", explanation: "„oder soll ich … mitbringen?“ – soru cümlesinde modal fiil başta, mastar sonda." },
      { id: 34, answer: "d", explanation: "Yer bildiren ilgi zarfı: „einen Supermarkt, wo wir einkaufen können“." },
      { id: 35, answer: "h", explanation: "Evet/hayır sorusu dolaylı → ob." },
      { id: 36, answer: "a", explanation: "Yeni bir bilgi ekleniyor: Außerdem (ayrıca); ardından fiil gelir." },
      { id: 37, answer: "g", explanation: "„wo man sie abstellen kann“ – modal fiil sonda." },
      { id: 38, answer: "i", explanation: "„bis wann“ = ne zamana kadar." },
      { id: 39, answer: "b", explanation: "Kalıp: „Wir wären Ihnen sehr dankbar, wenn …“." },
      { id: 40, answer: "f", explanation: "Ardından fiil 2. sırada (wir möchten) → denn." },
    ],
  },
  {
    id: "b1sb2-2",
    title: "Bewerbung um einen Ferienjob",
    paragraphs: [
      "Sehr geehrter Herr Schuster,",
      "auf Ihrer Internetseite habe ich gelesen, dass Sie für die Sommermonate Aushilfen für Ihr Café [[31]]. Ich möchte mich hiermit um eine solche Stelle bewerben.",
      "Ich bin 19 Jahre alt und studiere seit Oktober Betriebswirtschaft an der Universität Göttingen. Im letzten Sommer habe ich bereits drei Monate in einem Restaurant [[32]] und dort Erfahrungen im Service gesammelt. Die Arbeit mit Gästen macht mir großen Spaß, und ich bin es [[33]], auch in stressigen Situationen freundlich zu bleiben.",
      "Neben Deutsch spreche ich [[34]] Englisch und Türkisch, was bei internationalen Gästen sicher hilfreich ist. Ich kann von Juli bis Ende September arbeiten, [[35]] auch am Wochenende und abends. Da ich in der Nähe wohne, kann ich bei Bedarf auch [[36]] einspringen.",
      "Meinen Lebenslauf und ein Zeugnis von meinem letzten Arbeitgeber finden Sie im [[37]]. Über eine Einladung zu einem persönlichen Gespräch [[38]] ich mich sehr freuen. Falls Sie noch Fragen haben, können Sie mich gern [[39]] anrufen oder mir eine E-Mail schreiben.",
      "Ich freue mich darauf, bald von Ihnen zu [[40]].",
      "Mit freundlichen Grüßen",
      "Deniz Aydın",
    ],
    words: [
      { key: "a", text: "ANHANG" },
      { key: "b", text: "GEWOHNT" },
      { key: "c", text: "SUCHEN" },
      { key: "d", text: "HÖREN" },
      { key: "e", text: "GEARBEITET" },
      { key: "f", text: "FLIESSEND" },
      { key: "g", text: "KURZFRISTIG" },
      { key: "h", text: "WÜRDE" },
      { key: "i", text: "JEDERZEIT" },
      { key: "j", text: "GERN" },
      { key: "k", text: "BRIEF" },
      { key: "l", text: "SAGEN" },
      { key: "m", text: "GELERNT" },
      { key: "n", text: "WERDE" },
      { key: "o", text: "BEKANNT" },
    ],
    gaps: [
      { id: 31, answer: "c", explanation: "„dass Sie … Aushilfen suchen“ – yan cümle sonunda fiil." },
      { id: 32, answer: "e", explanation: "Perfekt: „habe … gearbeitet“." },
      { id: 33, answer: "b", explanation: "„es gewohnt sein, … zu …“ = alışkın olmak." },
      { id: 34, answer: "f", explanation: "„fließend Englisch sprechen“ = akıcı konuşmak." },
      { id: 35, answer: "j", explanation: "„gern auch am Wochenende“ = memnuniyetle." },
      { id: 36, answer: "g", explanation: "„kurzfristig einspringen“ = kısa sürede yerine geçmek." },
      { id: 37, answer: "a", explanation: "„im Anhang“ = ekte." },
      { id: 38, answer: "h", explanation: "„Über eine Einladung würde ich mich freuen“ – Konjunktiv II." },
      { id: 39, answer: "i", explanation: "„jederzeit anrufen“ = her zaman arayabilirsiniz." },
      { id: 40, answer: "d", explanation: "Kalıp: „von Ihnen zu hören“." },
    ],
  },
  {
    id: "b1sb2-3",
    title: "Brief an die Hausverwaltung",
    paragraphs: [
      "Sehr geehrte Damen und Herren,",
      "ich wohne seit drei Jahren in der Lindenstraße 12 und war bisher mit meiner Wohnung immer sehr [[31]]. Seit einigen Wochen gibt es aber ein Problem, und [[32]] möchte ich Sie heute informieren.",
      "Im Erdgeschoss ist eine neue Familie eingezogen, die einen großen Hund hat. Das ist natürlich kein Problem, [[33]] der Hund bellt jeden Tag stundenlang, wenn die Familie nicht zu Hause ist. Ich arbeite im Schichtdienst und muss deshalb oft [[34]] Tag schlafen. Das ist im Moment leider kaum möglich.",
      "Ich habe schon mehrmals versucht, mit den neuen Nachbarn zu [[35]], aber sie haben bisher nichts geändert. Sie meinen, dass der Hund sich erst an die neue Wohnung [[36]] muss.",
      "[[37]] habe ich bemerkt, dass der Hund im Treppenhaus oft ohne Leine läuft. Einige ältere Mieter haben [[38]] Angst. Laut Hausordnung müssen Hunde im Haus an der Leine geführt werden.",
      "Ich bitte Sie deshalb, mit der Familie zu sprechen und eine Lösung zu finden. Für einen Rückruf wäre ich Ihnen sehr dankbar. Sie können mich am [[39]] nachmittags erreichen. Vielen Dank [[40]] Ihre Hilfe.",
      "Mit freundlichen Grüßen",
      "Ingrid Lorenz",
    ],
    words: [
      { key: "a", text: "AM" },
      { key: "b", text: "SPRECHEN" },
      { key: "c", text: "ABER" },
      { key: "d", text: "ZUFRIEDEN" },
      { key: "e", text: "GEWÖHNEN" },
      { key: "f", text: "DARÜBER" },
      { key: "g", text: "AUSSERDEM" },
      { key: "h", text: "DAVOR" },
      { key: "i", text: "BESTEN" },
      { key: "j", text: "FÜR" },
      { key: "k", text: "TROTZDEM" },
      { key: "l", text: "IM" },
      { key: "m", text: "GLÜCKLICHER" },
      { key: "n", text: "SAGEN" },
      { key: "o", text: "DENN" },
    ],
    gaps: [
      { id: 31, answer: "d", explanation: "„mit etwas zufrieden sein“ = memnun olmak." },
      { id: 32, answer: "f", explanation: "„jemanden über etwas informieren“ → darüber (bu konuda) informieren. Cümle darüber ile başladığı için fiil hemen ardından gelir." },
      { id: 33, answer: "c", explanation: "Karşıtlık, ardından normal cümle düzeni → aber." },
      { id: 34, answer: "a", explanation: "„am Tag schlafen“ = gündüz uyumak." },
      { id: 35, answer: "b", explanation: "„mit jemandem sprechen“." },
      { id: 36, answer: "e", explanation: "„sich an etwas gewöhnen“ = alışmak." },
      { id: 37, answer: "g", explanation: "Yeni bir sorun ekleniyor → Außerdem." },
      { id: 38, answer: "h", explanation: "„Angst vor etwas haben“ → davor Angst haben (ondan korkmak)." },
      { id: 39, answer: "i", explanation: "Kalıp: „am besten“ = en iyisi." },
      { id: 40, answer: "j", explanation: "„Vielen Dank für …“." },
    ],
  },
  {
    id: "b1sb2-4",
    title: "Antwort auf eine Einladung",
    paragraphs: [
      "Liebe Frau Petersen,",
      "herzlichen Dank für die Einladung zu Ihrem 60. Geburtstag! Ich habe mich sehr darüber [[31]] und komme natürlich gern. [[32]] kann mein Mann nicht mitkommen, weil er an diesem Wochenende beruflich in Wien ist. Er lässt Sie aber herzlich [[33]].",
      "Sie haben geschrieben, dass die Feier in einem Restaurant am See [[34]]. Ich kenne die Gegend leider nicht so gut. Können Sie mir sagen, [[35]] ich am besten mit öffentlichen Verkehrsmitteln dorthin komme? Ich möchte nämlich nicht mit dem Auto fahren, [[36]] ich auch ein Glas Wein trinken möchte.",
      "[[37]] habe ich eine Frage zum Geschenk: Haben Sie einen besonderen Wunsch? Ich habe gehört, dass Sie seit kurzem [[38]] fotografieren. Vielleicht wäre ein Fotobuch oder ein Kurs eine gute [[39]]?",
      "Ich freue mich schon sehr auf den Abend und darauf, Ihre Familie kennenzulernen. Bis [[40]]!",
      "Herzliche Grüße",
      "Ihre Monika Brandt",
    ],
    words: [
      { key: "a", text: "STATTFINDET" },
      { key: "b", text: "GEFREUT" },
      { key: "c", text: "WIE" },
      { key: "d", text: "LEIDER" },
      { key: "e", text: "GRÜSSEN" },
      { key: "f", text: "IDEE" },
      { key: "g", text: "WEIL" },
      { key: "h", text: "AUSSERDEM" },
      { key: "i", text: "BALD" },
      { key: "j", text: "BEGEISTERT" },
      { key: "k", text: "GEFALLEN" },
      { key: "l", text: "DENN" },
      { key: "m", text: "WO" },
      { key: "n", text: "MEINUNG" },
      { key: "o", text: "GESTERN" },
    ],
    gaps: [
      { id: 31, answer: "b", explanation: "„sich über etwas freuen“ → Perfekt: „habe mich … gefreut“." },
      { id: 32, answer: "d", explanation: "Kötü bir haber veriliyor → Leider (ne yazık ki), ardından fiil." },
      { id: 33, answer: "e", explanation: "Kalıp: „Er lässt Sie herzlich grüßen.“" },
      { id: 34, answer: "a", explanation: "„dass die Feier … stattfindet“ – yan cümle sonunda fiil." },
      { id: 35, answer: "c", explanation: "Nasıl gideceğim → wie." },
      { id: 36, answer: "g", explanation: "Fiil cümle sonunda (trinken möchte) → weil. (denn olsaydı fiil 2. sırada olurdu.)" },
      { id: 37, answer: "h", explanation: "Ek bir konu → Außerdem." },
      { id: 38, answer: "j", explanation: "„begeistert fotografieren“ = büyük bir hevesle fotoğraf çekmek." },
      { id: 39, answer: "f", explanation: "„eine gute Idee“." },
      { id: 40, answer: "i", explanation: "Kalıp: „Bis bald!“" },
    ],
  },
];
