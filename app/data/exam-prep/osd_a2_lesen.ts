// Sınav Hazırlık → ÖSD Zertifikat A2 → Lesen (insgesamt 30 Minuten)
// ÖSD Zertifikat A2 Modellsatz formatı birebir örnek alınarak hazırlanmış özgün alıştırmalar.
//   Aufgabe 1 (15 Punkte): 10 başlık (A–K, J yok) + 5 kısa gazete metni. Her metne uygun başlık.
//     Başlıklar ikişer ikişer aynı konudadır; yalnızca biri metne tam uyar.
//   Aufgabe 2 (10 Punkte): Gazete metni + Beispiel + 5 görev, A / B / C.

import type { McOption, McTextSet } from "./goethe_a2_lesen";

export type OsdHeadline = { key: string; text: string };

export type OsdHeadlineText = {
  id: number;
  text: string;
  source: string;
  answer: string;
  explanation: string;
};

export type OsdHeadlineSet = {
  id: string;
  title: string;
  headlines: OsdHeadline[];
  tasks: OsdHeadlineText[];
};

export const OSD_A2_LESEN_INSTRUCTIONS = {
  aufgabe1: {
    de: [
      "Lesen Sie die 10 Überschriften und die 5 Texte.",
      "Suchen Sie dann zu jedem Text (1–5) die passende Überschrift (A–K).",
      "Pro Text gibt es nur eine richtige Lösung.",
    ],
    tr: "Her kısa metne uyan başlığı seçin. 10 başlıktan 5'i kullanılmaz. Başlıklar ikişer ikişer benzer konudadır; metnin asıl konusunu bulun.",
  },
  aufgabe2: {
    de: [
      "Lesen Sie zuerst den Text und lösen Sie dann die 5 Aufgaben, indem Sie die richtige Antwort (A oder B oder C) markieren.",
      "Für jede Aufgabe (1–5) gibt es nur eine richtige Lösung (siehe Beispiel).",
    ],
    tr: "Metni okuyun ve her görev için doğru seçeneği (A, B veya C) işaretleyin. Görevlerin sırası metindeki sırayla aynıdır.",
  },
};

const H = (pairs: [string, string][]): OsdHeadline[] =>
  ["A", "B", "C", "D", "E", "F", "G", "H", "I", "K"].map((key, i) => ({ key, text: pairs[i][1] }));

const abc = (a: string, b: string, c: string): McOption[] => [
  { key: "a", text: a },
  { key: "b", text: b },
  { key: "c", text: c },
];

// ───────────────────────────── AUFGABE 1 · Überschriften ─────────────────────────────

export const OSD_A2_AUFGABE1_SETS: OsdHeadlineSet[] = [
  {
    id: "o1-1",
    title: "Freizeit in der Stadt",
    headlines: H([
      ["A", "Neues Freibad öffnet im Sommer"],
      ["B", "Kochen lernen – nur für Männer"],
      ["C", "Bibliothek jetzt auch am Samstag offen"],
      ["D", "Sonntag: Straßen wegen Stadtlauf gesperrt"],
      ["E", "Umfrage: Was die Grazer am Wochenende machen"],
      ["F", "Bücherflohmarkt in der Bibliothek"],
      ["G", "Hallenbad nach Renovierung wieder geöffnet"],
      ["H", "Laufschuhe jetzt günstiger"],
      ["I", "Grazer Wochenmarkt zieht um"],
      ["K", "Kochbuch-Tipp für Anfänger"],
    ]),
    tasks: [
      { id: 1, text: "Nach acht Monaten Bauzeit ist es endlich so weit: Ab Montag können die Linzer wieder im Hallenbad am Stadtpark schwimmen. Neu sind eine größere Sauna und ein Becken für Kleinkinder. In der ersten Woche ist der Eintritt für alle Besucher gratis.", source: "aus einer österreichischen Zeitung", answer: "G", explanation: "Hallenbad, „nach acht Monaten Bauzeit … wieder“ → G. A (Freibad, yaz) değil." },
      { id: 2, text: "Gute Nachricht für alle Leseratten: Die Stadtbibliothek ist ab Februar nicht nur von Montag bis Freitag, sondern auch am Samstag von 9 bis 13 Uhr geöffnet. So können auch Berufstätige in Ruhe Bücher, Filme und Zeitschriften ausleihen.", source: "aus einer österreichischen Tageszeitung", answer: "C", explanation: "Yeni açılış saati: Samstag → C. F (kitap pazarı) metinde yok." },
      { id: 3, text: "Spazieren gehen, Freunde treffen oder einfach zu Hause bleiben? 500 Grazerinnen und Grazer wurden gefragt, wie sie ihr Wochenende verbringen. Fast die Hälfte geht am liebsten in die Natur, ein Drittel trifft sich mit der Familie. Nur zehn Prozent arbeiten auch am Samstag.", source: "aus einer österreichischen Zeitung", answer: "E", explanation: "500 kişiye soruldu → Umfrage → E." },
      { id: 4, text: "Die Volkshochschule bietet ab März einen besonderen Kurs an: „Kochen für Männer“. An sechs Abenden lernen die Teilnehmer einfache Gerichte wie Suppen, Nudeln und Salate. Vorkenntnisse sind nicht nötig. Frauen dürfen diesmal leider nicht mitmachen.", source: "aus einer deutschen Zeitung", answer: "B", explanation: "Sadece erkekler için yemek kursu → B. K (yemek kitabı) değil." },
      { id: 5, text: "Am Sonntag laufen wieder über 3.000 Sportler durch die Innenstadt. Von 8 bis 14 Uhr sind deshalb viele Straßen rund um den Hauptplatz gesperrt. Autofahrer sollen die Stadt umfahren, die Busse fahren andere Strecken. Informationen unter www.stadtlauf.at.", source: "aus einer österreichischen Tageszeitung", answer: "D", explanation: "Koşu nedeniyle yollar kapalı → D. H (ayakkabı indirimi) değil." },
    ],
  },
  {
    id: "o1-2",
    title: "Gesundheit",
    headlines: H([
      ["A", "Jugendliche schlafen zu wenig"],
      ["B", "Neue Wanderwege für Familien"],
      ["C", "Grippe: Viele Schüler fehlen"],
      ["D", "Kostenloser Vortrag: Was hilft bei Rückenschmerzen?"],
      ["E", "Welche Apotheke hat in der Nacht offen?"],
      ["F", "Gemeinsam wandern – fit bleiben im Alter"],
      ["G", "Besser schlafen mit dieser Matratze"],
      ["H", "Jetzt gegen Grippe impfen lassen"],
      ["I", "Neue Apotheke am Bahnhof"],
      ["K", "Krankenkasse zahlt jetzt Massagen"],
    ]),
    tasks: [
      { id: 1, text: "Der Herbst kommt und mit ihm die Grippe. Ärzte raten deshalb: Gehen Sie schon jetzt zu Ihrem Hausarzt und lassen Sie sich impfen. Besonders wichtig ist das für Menschen über 60 und für alle, die mit Kindern arbeiten. Die Impfung dauert nur fünf Minuten.", source: "aus einer deutschen Tageszeitung", answer: "H", explanation: "Doktorlar aşı tavsiye ediyor → H. C (öğrenciler okula gelmiyor) metinde yok." },
      { id: 2, text: "Sie brauchen am Abend oder am Wochenende dringend ein Medikament? Dann hilft die neue Internetseite www.apotheken-notdienst.at. Dort finden Sie sofort die nächste Apotheke, die Nachtdienst hat. Sie können auch die Telefonnummer 1455 anrufen.", source: "aus einer österreichischen Zeitung", answer: "E", explanation: "Gece açık eczaneyi bulma → E. I (yeni eczane) değil." },
      { id: 3, text: "Eine neue Studie zeigt: Fast 70 Prozent der Schweizer Jugendlichen zwischen 14 und 17 Jahren schlafen weniger als acht Stunden pro Nacht. Der Grund sind oft Handy und Computer im Schlafzimmer. Die Folge: Viele sind in der Schule müde und können sich schlecht konzentrieren.", source: "aus einer Schweizer Zeitung", answer: "A", explanation: "Gençler 8 saatten az uyuyor → A. G (yatak reklamı) değil." },
      { id: 4, text: "Fast jeder hat sie einmal: Rückenschmerzen. Am Donnerstag um 18 Uhr erklärt Dr. Maria Steiner im Landeskrankenhaus, was man selbst dagegen tun kann. Sie zeigt auch einfache Übungen für zu Hause. Der Eintritt ist frei, eine Anmeldung ist nicht nötig.", source: "aus einer österreichischen Tageszeitung", answer: "D", explanation: "Ücretsiz konferans, sırt ağrısı → D. K (masaj ödemesi) değil." },
      { id: 5, text: "Jeden Mittwoch trifft sich die Gruppe „Aktiv 60 plus“ um 9 Uhr am Bahnhof. Dann wandern die Seniorinnen und Senioren zwei bis drei Stunden durch die Berge rund um Innsbruck. „Die Bewegung tut gut, und man lernt nette Leute kennen“, sagt die Leiterin Erika Moser.", source: "aus einer österreichischen Zeitung", answer: "F", explanation: "60 yaş üstü yürüyüş grubu → F. B (aileler için yeni yollar) değil." },
    ],
  },
  {
    id: "o1-3",
    title: "Reisen und Verkehr",
    headlines: H([
      ["A", "Flüge nach Paris werden billiger"],
      ["B", "Ab jetzt: Fahrräder im Bus erlaubt"],
      ["C", "Schweizer machen am liebsten Urlaub im eigenen Land"],
      ["D", "Regenschirme im Sonderangebot"],
      ["E", "Mit dem Nachtzug nach Paris"],
      ["F", "Busfahren wird teurer"],
      ["G", "Sommer: Baustellen auf der Autobahn"],
      ["H", "Am meisten vergessen: Regenschirme"],
      ["I", "Urlaub in der Schweiz wird teurer"],
      ["K", "Autofahren im Winter: Tipps"],
    ]),
    tasks: [
      { id: 1, text: "Abends in Wien einsteigen, schlafen und am nächsten Morgen in Paris frühstücken: Ab Dezember fährt dreimal pro Woche ein neuer Nachtzug zwischen den beiden Städten. Die Fahrt dauert etwa 14 Stunden. Ein Platz im Schlafwagen kostet ab 59 Euro.", source: "aus einer österreichischen Zeitung", answer: "E", explanation: "Gece treni Viyana–Paris → E. A (uçak) değil." },
      { id: 2, text: "Wer im Juli und August mit dem Auto in den Süden fährt, braucht Geduld: Auf der Autobahn A2 wird an mehreren Stellen gebaut. Besonders am Wochenende gibt es lange Staus. Der Automobilclub rät, früh am Morgen loszufahren.", source: "aus einer österreichischen Tageszeitung", answer: "G", explanation: "Yaz aylarında otoyol çalışmaları → G. K (kış) değil." },
      { id: 3, text: "Berge, Seen und gute Hotels: Für viele Schweizerinnen und Schweizer gibt es keinen schöneren Urlaub als zu Hause. In einer Umfrage sagten 55 Prozent, dass sie ihre Ferien am liebsten in der Schweiz verbringen. Nur jeder Fünfte fliegt gern ans Meer.", source: "aus einer Schweizer Zeitung", answer: "C", explanation: "Anket: tatili kendi ülkesinde → C. I (fiyatlar artıyor) metinde yok." },
      { id: 4, text: "Im Fundbüro am Hauptbahnhof landen jedes Jahr über 20.000 Sachen. Ganz oben auf der Liste stehen Regenschirme, danach kommen Handschuhe, Handys und Brillen. Wer etwas verloren hat, kann online nachsehen, ob es gefunden wurde.", source: "aus einer deutschen Zeitung", answer: "H", explanation: "Kayıp eşyalar listesinin başında şemsiye → H. D (indirim) değil." },
      { id: 5, text: "Gute Nachricht für Radfahrer: Seit Montag darf man in allen Stadtbussen ein Fahrrad mitnehmen – außer in der Zeit von 7 bis 9 Uhr, wenn die Busse sehr voll sind. Ein extra Ticket braucht man dafür nicht.", source: "aus einer österreichischen Tageszeitung", answer: "B", explanation: "Otobüste bisiklet artık serbest → B. F (zam) değil; ekstra bilet bile gerekmiyor." },
    ],
  },
  {
    id: "o1-4",
    title: "Arbeit und Lernen",
    headlines: H([
      ["A", "Gratis Deutsch üben im Sprachcafé"],
      ["B", "Brot wird teurer"],
      ["C", "Samstag: Jobmesse für junge Leute"],
      ["D", "Computer zu verschenken"],
      ["E", "Viele möchten nur vier Tage arbeiten"],
      ["F", "Neue Deutschkurse an der Universität"],
      ["G", "Bäckereien suchen Lehrlinge"],
      ["H", "Messe für Hochzeiten"],
      ["I", "Senioren lernen den Computer kennen"],
      ["K", "Mehr Urlaub für alle Angestellten"],
    ]),
    tasks: [
      { id: 1, text: "Sie suchen eine Lehrstelle oder einen ersten Job? Am Samstag präsentieren sich in der Messehalle über 80 Firmen aus der Region. Junge Menschen können dort direkt mit den Chefs sprechen und ihre Bewerbung abgeben. Der Eintritt ist frei.", source: "aus einer österreichischen Zeitung", answer: "C", explanation: "Gençler için iş fuarı → C. H (düğün fuarı) değil." },
      { id: 2, text: "Jeden Dienstagabend treffen sich im Café „Mondschein“ Menschen aus aller Welt, um Deutsch zu sprechen. Freiwillige Helferinnen und Helfer, die Deutsch als Muttersprache haben, sitzen an jedem Tisch. Man muss sich nicht anmelden und es kostet nichts.", source: "aus einer deutschen Zeitung", answer: "A", explanation: "Ücretsiz, kafede Almanca pratik → A. F (üniversite kursu) değil." },
      { id: 3, text: "Weniger arbeiten, mehr Freizeit: In einer Umfrage sagten zwei von drei Österreicherinnen und Österreichern, dass sie gern eine Vier-Tage-Woche hätten. Viele wären sogar bereit, dafür etwas weniger Geld zu verdienen.", source: "aus einer österreichischen Tageszeitung", answer: "E", explanation: "Dört günlük çalışma haftası isteği → E. K (herkese daha fazla izin) değil." },
      { id: 4, text: "Frisches Brot und Gebäck gibt es jeden Morgen – aber wer soll es in Zukunft backen? Viele Bäckereien in Tirol finden keine jungen Leute mehr, die den Beruf lernen wollen. Dabei verdienen Lehrlinge schon im ersten Jahr gut.", source: "aus einer österreichischen Zeitung", answer: "G", explanation: "Fırınlar çırak bulamıyor → G. B (ekmek pahalılaşıyor) değil." },
      { id: 5, text: "E-Mails schreiben, mit den Enkeln telefonieren, Fotos ansehen: In der Stadtbibliothek gibt es ab Oktober einen Computerkurs für Menschen über 65. Die Gruppen sind klein und die Trainer erklären alles ganz langsam.", source: "aus einer Schweizer Zeitung", answer: "I", explanation: "65 yaş üstü için bilgisayar kursu → I. D (bilgisayar hediye) değil." },
    ],
  },
  {
    id: "o1-5",
    title: "Natur und Umwelt",
    headlines: H([
      ["A", "Tierpark: Eisbär-Baby zum ersten Mal zu sehen"],
      ["B", "Endlich Regen!"],
      ["C", "Neu: Biotonne für alle Haushalte"],
      ["D", "Neuer Park in Bern eröffnet"],
      ["E", "Kleider tauschen statt kaufen"],
      ["F", "Müllabfuhr kommt jetzt seltener"],
      ["G", "Hitzewelle: So bleiben Sie gesund"],
      ["H", "Zoo sucht Tierpfleger"],
      ["I", "Berner wünschen sich mehr Parks"],
      ["K", "Modeschau im Einkaufszentrum"],
    ]),
    tasks: [
      { id: 1, text: "Ab Jänner bekommt jeder Haushalt in Salzburg eine braune Tonne für Küchenabfälle wie Obst- und Gemüsereste. Aus dem Bioabfall macht die Stadt dann Erde für Gärten und Parks. Die Tonne ist kostenlos und wird einmal pro Woche geleert.", source: "aus einer österreichischen Zeitung", answer: "C", explanation: "Her eve kahverengi organik çöp kutusu → C. F (çöp daha seyrek) değil; haftada bir boşaltılıyor." },
      { id: 2, text: "Zwei Monate war es im Haus, jetzt dürfen es alle sehen: Das kleine Eisbär-Mädchen im Tiergarten Schönbrunn macht am Wochenende seine ersten Schritte draußen. Besucher können es von 10 bis 12 Uhr mit seiner Mutter beobachten.", source: "aus einer österreichischen Tageszeitung", answer: "A", explanation: "Kutup ayısı yavrusu ilk kez dışarıda → A. H (bakıcı aranıyor) değil." },
      { id: 3, text: "Mehr Bäume, mehr Wiesen, mehr Plätze zum Spielen: Das wünschen sich die meisten Bernerinnen und Berner. Bei einer Befragung der Stadt sagten 72 Prozent, dass es in ihrem Stadtteil zu wenig Grün gibt. Die Stadt will die Ergebnisse jetzt prüfen.", source: "aus einer Schweizer Zeitung", answer: "I", explanation: "Anket: daha fazla yeşil alan isteniyor → I. D yanlış: park henüz açılmadı." },
      { id: 4, text: "In den nächsten Tagen werden bis zu 36 Grad erwartet. Ärzte raten: Trinken Sie mindestens zwei Liter Wasser am Tag, bleiben Sie in der Mittagszeit im Haus und machen Sie keinen Sport in der Sonne. Besonders ältere Menschen sollten vorsichtig sein.", source: "aus einer deutschen Tageszeitung", answer: "G", explanation: "Sıcak hava ve sağlık tavsiyeleri → G. B (yağmur) değil." },
      { id: 5, text: "Der Kleiderschrank ist voll, aber man hat nichts anzuziehen? Dann kommen Sie am Samstag ins Jugendzentrum! Bringen Sie bis zu zehn saubere Kleidungsstücke mit und nehmen Sie dafür andere mit nach Hause. Das ist gut für die Umwelt und kostet nichts.", source: "aus einer österreichischen Zeitung", answer: "E", explanation: "Kıyafet takası → E. K (defile) değil." },
    ],
  },
];

// ───────────────────────────── AUFGABE 2 · Text + A/B/C ─────────────────────────────

export const OSD_A2_AUFGABE2_SETS: McTextSet[] = [
  {
    id: "o2-1",
    title: "Mit 80 auf der Skipiste",
    text: {
      kind: "article",
      headline: "Die älteste Skilehrerin Tirols",
      paragraphs: [
        "Jeden Morgen um halb neun steht Maria Huber auf der Piste in Kitzbühel. Die 80-Jährige ist die älteste Skilehrerin in Tirol – und denkt noch lange nicht ans Aufhören. „Solange ich gesund bin, mache ich weiter“, sagt sie und lacht.",
        "Skifahren hat Maria schon mit drei Jahren gelernt, von ihrem Vater. Mit 18 hat sie die Prüfung zur Skilehrerin gemacht. Damals gab es nur wenige Frauen in diesem Beruf. „Viele Männer haben gesagt, das ist nichts für ein Mädchen“, erzählt sie.",
        "Heute unterrichtet Maria vor allem Kinder. „Mit den Kleinen macht es am meisten Spaß. Sie haben keine Angst und lernen sehr schnell.“ Im Sommer arbeitet sie nicht als Skilehrerin, sondern hilft ihrer Tochter in deren kleinem Hotel.",
        "Ihr Tipp für ein langes, gesundes Leben? „Viel Bewegung an der frischen Luft, gutes Essen und nie zu viel ärgern.“",
      ],
    },
    example: { id: 0, stem: "Maria Huber ist", options: abc("Skilehrerin.", "Hotelbesitzerin.", "Sportärztin."), answer: "a", explanation: "„die älteste Skilehrerin in Tirol“." },
    tasks: [
      { id: 1, stem: "Maria Huber möchte", options: abc("bald aufhören zu arbeiten.", "weiterarbeiten, solange es geht.", "nur noch im Sommer arbeiten."), answer: "b", explanation: "„Solange ich gesund bin, mache ich weiter.“" },
      { id: 2, stem: "Das Skifahren hat Maria", options: abc("von ihrem Vater gelernt.", "mit 18 Jahren gelernt.", "in einer Skischule gelernt."), answer: "a", explanation: "„mit drei Jahren gelernt, von ihrem Vater“. 18'de sınava girdi." },
      { id: 3, stem: "Als Maria jung war,", options: abc("gab es viele Skilehrerinnen.", "waren Frauen als Skilehrerinnen selten.", "durften Frauen nicht Ski fahren."), answer: "b", explanation: "„Damals gab es nur wenige Frauen in diesem Beruf.“" },
      { id: 4, stem: "Maria unterrichtet am liebsten", options: abc("Erwachsene.", "Anfänger ohne Angst.", "Kinder."), answer: "c", explanation: "„Mit den Kleinen macht es am meisten Spaß.“" },
      { id: 5, stem: "Im Sommer", options: abc("arbeitet Maria im Hotel ihrer Tochter mit.", "macht Maria Urlaub.", "gibt Maria Wanderkurse."), answer: "a", explanation: "„hilft ihrer Tochter in deren kleinem Hotel“." },
    ],
  },
  {
    id: "o2-2",
    title: "Der Briefträger, der alle kennt",
    text: {
      kind: "article",
      headline: "Abschied nach 40 Jahren",
      paragraphs: [
        "Wenn Josef Gruber am Freitag zum letzten Mal mit seinem gelben Fahrrad durch das Dorf St. Martin fährt, werden viele Menschen traurig sein. 40 Jahre lang hat der Briefträger hier Briefe und Pakete gebracht. Jetzt geht der 63-Jährige in Pension.",
        "„Ich kenne jedes Haus und fast jeden Hund im Dorf“, sagt Josef. Für viele ältere Menschen war er mehr als nur der Briefträger. Er hat für sie Medikamente aus der Apotheke mitgebracht oder einfach ein paar Minuten mit ihnen geplaudert. „Manche haben außer mir den ganzen Tag niemanden gesehen.“",
        "Früher hat Josef vor allem Briefe und Postkarten gebracht. Heute sind es meistens Pakete, weil viele Leute im Internet einkaufen. „Die Arbeit ist schwerer geworden“, meint er.",
        "Für seine Pension hat Josef schon Pläne: Er möchte mit seiner Frau eine Reise nach Kanada machen, wo sein Sohn lebt. Und das gelbe Fahrrad? „Das darf ich behalten – ein Geschenk von der Post.“",
      ],
    },
    example: { id: 0, stem: "Josef Gruber", options: abc("ist Briefträger.", "verkauft Fahrräder.", "arbeitet in einer Apotheke."), answer: "a", explanation: "„40 Jahre lang hat der Briefträger …“" },
    tasks: [
      { id: 1, stem: "Josef Gruber", options: abc("hört bald auf zu arbeiten.", "zieht in ein anderes Dorf.", "bekommt eine neue Stelle."), answer: "a", explanation: "„Jetzt geht der 63-Jährige in Pension.“" },
      { id: 2, stem: "Für ältere Menschen im Dorf", options: abc("hat Josef auch andere Dinge erledigt.", "hat Josef nie Zeit gehabt.", "war Josef nicht wichtig."), answer: "a", explanation: "„Medikamente aus der Apotheke mitgebracht … geplaudert“." },
      { id: 3, stem: "Heute bringt Josef", options: abc("vor allem Postkarten.", "mehr Pakete als früher.", "weniger Pakete als früher."), answer: "b", explanation: "„Heute sind es meistens Pakete, weil viele Leute im Internet einkaufen.“" },
      { id: 4, stem: "Josef findet, dass die Arbeit", options: abc("leichter geworden ist.", "langweilig ist.", "anstrengender geworden ist."), answer: "c", explanation: "„Die Arbeit ist schwerer geworden.“" },
      { id: 5, stem: "Nach seiner Pensionierung möchte Josef", options: abc("ein neues Fahrrad kaufen.", "seinen Sohn besuchen.", "in Kanada leben."), answer: "b", explanation: "Oğlunun yaşadığı Kanada'ya seyahat etmek istiyor (orada yaşamak değil). Bisiklet hediye." },
    ],
  },
  {
    id: "o2-3",
    title: "Vom Flüchtling zum Bäckermeister",
    text: {
      kind: "article",
      headline: "Süße Träume in Graz",
      paragraphs: [
        "Vor acht Jahren kam Samir Haddad aus Syrien nach Österreich. Er sprach kein Wort Deutsch und hatte nur einen kleinen Rucksack dabei. Heute hat der 34-Jährige seine eigene Bäckerei in der Grazer Innenstadt – und die Menschen stehen jeden Morgen Schlange.",
        "„In Damaskus hat mein Großvater Süßigkeiten gemacht. Als Kind habe ich ihm oft geholfen“, erzählt Samir. In Graz hat er zuerst zwei Jahre lang Deutsch gelernt. Dann hat er bei einem österreichischen Bäcker eine Lehre gemacht. „Mein Chef war sehr streng, aber ich habe viel von ihm gelernt.“",
        "In seiner Bäckerei verkauft Samir heute österreichisches Brot und Apfelstrudel, aber auch arabische Spezialitäten wie Baklava. „Am besten verkauft sich eine Mischung: Croissants mit Pistazien“, lacht er.",
        "Inzwischen hat Samir sechs Mitarbeiter. Zwei von ihnen sind ebenfalls nach Österreich geflüchtet. „Ich weiß, wie schwer der Anfang ist. Deshalb möchte ich anderen eine Chance geben.“",
      ],
    },
    example: { id: 0, stem: "Samir Haddad", options: abc("lebt seit acht Jahren in Österreich.", "ist acht Jahre alt.", "hat acht Bäckereien."), answer: "a", explanation: "„Vor acht Jahren kam Samir … nach Österreich.“" },
    tasks: [
      { id: 1, stem: "Als Samir nach Österreich kam,", options: abc("konnte er schon gut Deutsch.", "konnte er kein Deutsch.", "hatte er viel Gepäck."), answer: "b", explanation: "„Er sprach kein Wort Deutsch“, sadece küçük bir sırt çantası." },
      { id: 2, stem: "Als Kind hat Samir", options: abc("seinem Großvater beim Backen geholfen.", "in einer Bäckerei gearbeitet.", "keine Süßigkeiten gegessen."), answer: "a", explanation: "„mein Großvater Süßigkeiten gemacht … oft geholfen“." },
      { id: 3, stem: "In Graz hat Samir zuerst", options: abc("eine Lehre gemacht.", "eine Bäckerei eröffnet.", "die Sprache gelernt."), answer: "c", explanation: "„zuerst zwei Jahre lang Deutsch gelernt. Dann … eine Lehre“." },
      { id: 4, stem: "In Samirs Bäckerei", options: abc("gibt es nur arabische Süßigkeiten.", "gibt es österreichische und arabische Produkte.", "gibt es kein Brot."), answer: "b", explanation: "Brot, Apfelstrudel ve Baklava – ikisi de var." },
      { id: 5, stem: "Samir möchte", options: abc("Menschen helfen, die neu in Österreich sind.", "eine zweite Bäckerei eröffnen.", "nur Österreicher anstellen."), answer: "a", explanation: "„Deshalb möchte ich anderen eine Chance geben.“" },
    ],
  },
  {
    id: "o2-4",
    title: "Ein Dorf rettet sein Gasthaus",
    text: {
      kind: "article",
      headline: "Das Gasthaus gehört jetzt allen",
      paragraphs: [
        "Fast 200 Jahre lang war das Gasthaus „Zum Löwen“ der Treffpunkt im kleinen Dorf Wil im Kanton Bern. Doch letztes Jahr wollten die Besitzer in Pension gehen und niemand wollte das Haus kaufen. Es drohte, für immer zu schließen.",
        "Da hatte die Lehrerin Anna Zimmermann eine Idee: Das ganze Dorf sollte das Gasthaus zusammen kaufen. Innerhalb von drei Monaten haben über 300 Einwohner Geld gegeben – manche 100 Franken, andere viel mehr. „Ich hätte nie gedacht, dass so viele mitmachen“, sagt Anna.",
        "Seit dem Frühling ist das Gasthaus wieder geöffnet. Ein junges Paar aus Zürich führt es jetzt. Mittags gibt es ein günstiges Menü, und am Freitagabend spielt oft eine Band aus der Region.",
        "Viele Dorfbewohner helfen freiwillig mit, zum Beispiel im Garten oder beim Putzen. „Jetzt ist es wirklich unser Gasthaus“, sagt der 75-jährige Fritz Keller, der hier schon als Kind mit seinem Vater Karten gespielt hat.",
      ],
    },
    example: { id: 0, stem: "Das Gasthaus „Zum Löwen“", options: abc("ist sehr alt.", "ist erst ein Jahr alt.", "liegt in Zürich."), answer: "a", explanation: "„Fast 200 Jahre lang …“" },
    tasks: [
      { id: 1, stem: "Letztes Jahr", options: abc("wollten die Besitzer das Gasthaus größer machen.", "fanden die Besitzer keinen Käufer.", "hat das Dorf ein neues Gasthaus gebaut."), answer: "b", explanation: "„niemand wollte das Haus kaufen“." },
      { id: 2, stem: "Anna Zimmermann", options: abc("hat das Gasthaus allein gekauft.", "hatte die Idee, dass das Dorf das Gasthaus kauft.", "arbeitet jetzt im Gasthaus."), answer: "b", explanation: "„Das ganze Dorf sollte das Gasthaus zusammen kaufen.“" },
      { id: 3, stem: "Die Einwohner", options: abc("haben alle gleich viel Geld gegeben.", "haben unterschiedlich viel Geld gegeben.", "wollten kein Geld geben."), answer: "b", explanation: "„manche 100 Franken, andere viel mehr“." },
      { id: 4, stem: "Heute führt das Gasthaus", options: abc("ein junges Paar.", "Anna Zimmermann.", "Fritz Keller."), answer: "a", explanation: "„Ein junges Paar aus Zürich führt es jetzt.“" },
      { id: 5, stem: "Viele Dorfbewohner", options: abc("arbeiten ohne Geld im Gasthaus mit.", "gehen nicht mehr ins Gasthaus.", "spielen in einer Band."), answer: "a", explanation: "„helfen freiwillig mit“ = gönüllü, para almadan." },
    ],
  },
  {
    id: "o2-5",
    title: "Mit dem Fahrrad um die Welt",
    text: {
      kind: "article",
      headline: "Zwei Jahre, 25.000 Kilometer",
      paragraphs: [
        "Lena und David aus Salzburg sind wieder zu Hause. Zwei Jahre lang sind die beiden 29-Jährigen mit dem Fahrrad durch 22 Länder gefahren – von Österreich über die Türkei und den Iran bis nach Indien und Südostasien.",
        "„Die Idee hatten wir schon während des Studiums“, erzählt Lena. Für die Reise haben beide ihre Arbeit gekündigt und drei Jahre lang Geld gespart. Pro Tag haben sie im Durchschnitt nur 15 Euro ausgegeben. Meistens haben sie im Zelt geschlafen.",
        "Am schönsten war für die beiden die Gastfreundschaft. „Im Iran haben uns fremde Menschen fast jeden Abend zum Essen eingeladen“, sagt David. Schwierig war das Wetter: In Indien war es oft über 40 Grad heiß, in den Bergen von Laos hat es wochenlang geregnet.",
        "Jetzt schreiben Lena und David ein Buch über ihre Reise. Im Herbst halten sie außerdem Vorträge in ganz Österreich. Und die nächste Reise? „Vielleicht Südamerika – aber diesmal mit dem Zug“, lacht Lena.",
      ],
    },
    example: { id: 0, stem: "Lena und David", options: abc("sind mit dem Fahrrad gereist.", "sind mit dem Auto gereist.", "haben in 22 Ländern gearbeitet."), answer: "a", explanation: "„mit dem Fahrrad durch 22 Länder gefahren“." },
    tasks: [
      { id: 1, stem: "Die Idee für die Reise", options: abc("kam von ihren Eltern.", "hatten sie, als sie studiert haben.", "hatten sie in Indien."), answer: "b", explanation: "„Die Idee hatten wir schon während des Studiums.“" },
      { id: 2, stem: "Für die Reise", options: abc("haben die beiden lange gespart.", "haben die beiden einen Kredit genommen.", "haben die beiden unterwegs gearbeitet."), answer: "a", explanation: "„drei Jahre lang Geld gespart“." },
      { id: 3, stem: "Unterwegs haben Lena und David", options: abc("meistens in Hotels übernachtet.", "meistens im Zelt übernachtet.", "jeden Tag 40 Euro ausgegeben."), answer: "b", explanation: "„Meistens haben sie im Zelt geschlafen.“ Günde ortalama 15 Euro." },
      { id: 4, stem: "Besonders gut gefallen hat ihnen", options: abc("das Wetter in Indien.", "die Freundlichkeit der Menschen.", "der Regen in Laos."), answer: "b", explanation: "„Am schönsten war … die Gastfreundschaft.“" },
      { id: 5, stem: "Ihre nächste Reise", options: abc("machen sie wieder mit dem Fahrrad.", "machen sie vielleicht mit dem Zug.", "ist schon gebucht."), answer: "b", explanation: "„Vielleicht Südamerika – aber diesmal mit dem Zug.“" },
    ],
  },
];
