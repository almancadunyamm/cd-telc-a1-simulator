// Sınav Hazırlık → Goethe-Zertifikat B1 → Hören
// Ses: Goethe-Institut'un resmî, herkese açık Modellsatz kaydı. Dosya Goethe'nin kendi sunucusundan oynatılır,
// Almanca Okulum'a kopyalanmaz. Kaynak ve hak sahibi her sette gösterilir.
// Sorular: Almanca Okulum'un özgün soruları. Kaydın yapısına (Teil 1–4, soru numaraları, dinleme sayısı) birebir
// uyacak şekilde yazıldı; resmî kitapçıktaki sorular kopyalanmadı.

export type HoerenOption = { key: string; text: string };
export type HoerenQuestion = {
  id: number | string; // örnek sorular için "0", "01" gibi
  kind: "rf" | "mc" | "who";
  text: string;
  options?: HoerenOption[]; // mc için
  answer: string; // rf: "r" | "f"; mc / who: seçenek anahtarı
  explanation: string;
  example?: boolean;
};
export type HoerenTeil = {
  no: number;
  title: string;
  plays: 1 | 2;
  instruction: string; // Türkçe kısa yönerge
  context?: string; // durum cümlesi (Almanca)
  textLabels?: Record<string, string>; // Teil 1: soru id → "Text 1" başlığı
  speakers?: HoerenOption[]; // Teil 4: a/b/c → kişi
  questions: HoerenQuestion[];
};
export type HoerenSet = {
  id: string;
  title: string;
  minutes: number;
  audioUrl: string;
  sourceLabel: string;
  sourcePage: string;
  sourcePdf?: string;
  teile: HoerenTeil[];
};

const ABC = (a: string, b: string, c: string): HoerenOption[] => [
  { key: "a", text: a },
  { key: "b", text: b },
  { key: "c", text: c },
];

export const GOETHE_B1_HOEREN_SETS: HoerenSet[] = [
  {
    id: "gb1h-modell-erw",
    title: "Modellsatz Erwachsene",
    minutes: 40,
    audioUrl: "https://goethemp4s.akamaized.net/resources/files/mp430/b1_modellsatz_erwachsene.mp4",
    sourceLabel: "Goethe-Institut / ÖSD – Zertifikat B1, Modellsatz Erwachsene, Modul Hören",
    sourcePage: "https://www.goethe.de/de/spr/prf/ueb/pb1.html",
    sourcePdf: "https://www.goethe.de/pro/relaunch/prf/materialien/B1/b1_modellsatz_erwachsene.pdf",
    teile: [
      {
        no: 1,
        title: "Teil 1 · Kurze Texte",
        plays: 2,
        instruction:
          "5 kısa metin (telesekreter mesajı, anons, radyo). Her metni İKİ kez dinlersin ve her metin için 2 soru çözersin: biri Richtig/Falsch, biri a/b/c. Önce örneği oku (kayıtta 10 saniye süre verilir).",
        textLabels: { "01": "Beispiel", "1": "Text 1", "3": "Text 2", "5": "Text 3", "7": "Text 4", "9": "Text 5" },
        questions: [
          { id: "01", kind: "rf", example: true, text: "Frank möchte im Sommer mit Jan ans Meer fahren.", answer: "r", explanation: "Örnek: Frank yazın bir hafta denize gitmek istiyor." },
          { id: "02", kind: "mc", example: true, text: "Was findet Frank am besten?", options: ABC("bei seiner Tante schlafen", "ein billiges Hotelzimmer", "campen"), answer: "c", explanation: "Örnek: Teyze ve otel de geçiyor ama Frank en çok kamp yapmayı istiyor." },
          { id: 1, kind: "rf", text: "Frau Dr. Becker hat am Freitag keine Zeit.", answer: "f", explanation: "Muayenehane Frau Stein'a tam da cuma saat 14'ü öneriyor. Doktorun başka bir zamanda ameliyatı var." },
          { id: 2, kind: "mc", text: "Frau Stein soll …", options: ABC("am Freitag zehn Euro mitbringen.", "heute noch Bescheid geben.", "zu einer Operation kommen."), answer: "b", explanation: "Bugün haber vermesi isteniyor. Bu çeyrekte geldiği için 10 euro ödemesi gerekmiyor; ameliyat doktorun." },
          { id: 3, kind: "rf", text: "Herr Thomas möchte Frau Brahms eine Versicherung verkaufen.", answer: "f", explanation: "Frau Brahms sigorta şirketine satış müdürü olarak başvurmuş; arayan kişi başvuru için arıyor." },
          { id: 4, kind: "mc", text: "In den Unterlagen von Frau Brahms fehlen Zeugnisse …", options: ABC("von einem Computer- und einem Englischkurs.", "von ihrer Arbeit als Verkaufsleiterin.", "von ihrem Studium."), answer: "a", explanation: "Eksik olan, özgeçmişte yazdığı bilgisayar ve İngilizce kursu sertifikaları." },
          { id: 5, kind: "rf", text: "Auf der A8 ist ein Fahrstreifen blockiert.", answer: "r", explanation: "A8'de kaza var, sağ şerit kapalı ve 12 km kuyruk oluşmuş." },
          { id: 6, kind: "mc", text: "Im Stadtgebiet München gibt es Probleme wegen …", options: ABC("eines Unfalls.", "des starken Berufsverkehrs.", "einer Demonstration."), answer: "b", explanation: "Şehir içinde iş trafiği yüzünden aksama var. Kaza otobanda, şantiye ise tünelde." },
          { id: 7, kind: "rf", text: "Der Interregio nach Bern fällt heute aus.", answer: "f", explanation: "Bern treni 13. perona giriyor. İptal edilen tren Cenevre'ye giden Intercity." },
          { id: 8, kind: "mc", text: "Reisende nach Genf sollen …", options: ABC("um 8.45 Uhr von Gleis 13 fahren.", "über Lausanne fahren.", "in den Speisewagen gehen."), answer: "b", explanation: "Cenevre'ye en yakın bağlantı 9.45'te 11. perondan, Lozan üzerinden." },
          { id: 9, kind: "rf", text: "Im Westen Deutschlands bleibt es in der Nacht meist trocken.", answer: "r", explanation: "Batı ve kuzeybatıda az bulutlu ve çoğunlukla kuru." },
          { id: 10, kind: "mc", text: "Im Osten …", options: ABC("wird es über 20 Grad warm.", "kann es Gewitter mit Sturmböen geben.", "weht nur ein schwacher Wind."), answer: "b", explanation: "Doğuda sert gök gürültülü fırtına ve fırtına rüzgârı var. Sıcaklık 17–12 derece; zayıf rüzgâr diğer bölgeler için." },
        ],
      },
      {
        no: 2,
        title: "Teil 2 · Führung im Museum",
        plays: 1,
        instruction:
          "Bir müze rehberini dinlersin. Metni sadece BİR kez duyarsın! Kayıt başlamadan önce soruları okumak için 60 saniyen var. Sorular metindeki sırayı izler.",
        context: "Sie nehmen an einer Führung durch das Münchner Stadtmuseum teil.",
        questions: [
          { id: 11, kind: "mc", text: "Heute sind im Museum …", options: ABC("sehr viele Besucher.", "nur wenige Besucher.", "keine Führungen möglich."), answer: "b", explanation: "Hava güzel olduğu için herkes biraha bahçesinde; müze neredeyse onlara kalmış." },
          { id: 12, kind: "mc", text: "Ein Teil des Museums war …", options: ABC("drei Monate wegen Renovierung geschlossen.", "wegen des Wetters geschlossen.", "nur für Fotografen geöffnet."), answer: "a", explanation: "Binanın bir bölümü son üç ay tadilat nedeniyle kapalıydı." },
          { id: 13, kind: "mc", text: "Der Rundgang dauert …", options: ABC("ungefähr eine Stunde.", "ungefähr zweieinhalb Stunden.", "bis zum Abend."), answer: "b", explanation: "Rehber turun yaklaşık iki buçuk saat süreceğini söylüyor." },
          { id: 14, kind: "mc", text: "Nach der Hauptausstellung können die Teilnehmer …", options: ABC("eine Fotoausstellung im 2. Stock besuchen.", "im Museumscafé zu Mittag essen.", "ein Konzert hören."), answer: "a", explanation: "2. kattaki özel fotoğraf sergisini gezebilirler. „Musik“ koleksiyonu bir sergi, konser değil." },
          { id: 15, kind: "mc", text: "Um 16 Uhr treffen sich alle …", options: ABC("im Biergarten.", "an der Garderobe.", "im Eingangsbereich."), answer: "c", explanation: "Buluşma girişte, kafenin karşısında. Vestiyer sadece çantalar için." },
        ],
      },
      {
        no: 3,
        title: "Teil 3 · Gespräch",
        plays: 1,
        instruction:
          "İki kişinin sohbetini dinlersin. Sohbeti sadece BİR kez duyarsın! Önce 7 cümleyi oku (60 saniye), sonra dinlerken Richtig mi Falsch mı işaretle.",
        context: "Sie sind an einer Bushaltestelle und hören, wie sich ein Mann und eine Frau über ein Fest unterhalten.",
        questions: [
          { id: 16, kind: "rf", text: "Nadia war am Samstag auf einer Geburtstagsfeier.", answer: "r", explanation: "Cumartesi annesinin arkadaşı Anna'nın 50. yaş günündeydi." },
          { id: 17, kind: "rf", text: "Anna ist Nadias Tante.", answer: "f", explanation: "Anna, Nadia'nın annesinin arkadaşı." },
          { id: 18, kind: "rf", text: "Auf dem Fest gab es nur ein kaltes Buffet.", answer: "f", explanation: "Soğuk büfeden sonra 3–4 ana yemek ve tatlılar da vardı." },
          { id: 19, kind: "rf", text: "Nadias Mutter hat ihre Tochter den Gästen vorgestellt.", answer: "r", explanation: "Annesi onu herkese tanıttı; bu Nadia'ya biraz utanç verici geldi." },
          { id: 20, kind: "rf", text: "Nadia spielt beruflich Klavier.", answer: "f", explanation: "Flüt ve piyanoyu sadece hobi olarak çalıyor." },
          { id: 21, kind: "rf", text: "Der Pianist hat Nadia gebeten, in seiner Pause zu spielen.", answer: "r", explanation: "Piyanist mola verince Nadia'dan kendi yerine geçip biraz çalmasını istedi." },
          { id: 22, kind: "rf", text: "Am Sonntag hat Nadia mit Freunden einen Ausflug gemacht.", answer: "r", explanation: "Pazar öğleden sonra arkadaşlarıyla dağa gezmeye gitti." },
        ],
      },
      {
        no: 4,
        title: "Teil 4 · Diskussion: Wer sagt was?",
        plays: 2,
        instruction:
          "Radyoda bir tartışma dinlersin; tartışmayı İKİ kez duyarsın. Her cümleyi kimin söylediğini seç: a moderatör, b Dana Schneider, c Florian Bader. Önce cümleleri oku (60 saniye).",
        context: "Der Moderator der Radiosendung „Diskussion am Abend“ diskutiert mit den Eltern Dana Schneider und Florian Bader zum Thema „Sollen kleine Kinder in die Kinderkrippe gehen?“.",
        speakers: [
          { key: "a", text: "Moderator" },
          { key: "b", text: "Dana Schneider" },
          { key: "c", text: "Florian Bader" },
        ],
        questions: [
          { id: "0", kind: "who", example: true, text: "Kinder brauchen in den ersten Jahren eine feste Bezugsperson.", answer: "b", explanation: "Örnek: Dana Schneider ilk üç yılın çok önemli olduğunu ve sabit bir bakıcı gerektiğini söylüyor." },
          { id: 23, kind: "who", text: "In der Krippe lernen Kinder, auch auf andere Erwachsene zu hören.", answer: "c", explanation: "Bader: Çocuklar başka insanları da dinlemeyi öğreniyor; bu sosyal davranış için faydalı." },
          { id: 24, kind: "who", text: "Mein älteres Kind lernt im Kindergarten, mit anderen zu spielen.", answer: "b", explanation: "Schneider: 5 yaşındaki oğlu anaokulunda başka çocuklarla oynamayı öğreniyor." },
          { id: 25, kind: "who", text: "Kleine Kinder spielen oft lieber mit Sachen als mit anderen Kindern.", answer: "a", explanation: "Moderatör: Üç yaş altı çocuklar genelde eşyalarla oynar." },
          { id: 26, kind: "who", text: "Wer drei Jahre nicht arbeitet, verliert viel für seine Karriere.", answer: "c", explanation: "Bader: Üç yıl çalışmazsan sadece o yılları değil, önceden kazandıklarını da kaybedersin." },
          { id: 27, kind: "who", text: "Kinder sollten für Eltern wichtiger sein als die Karriere.", answer: "b", explanation: "Schneider: Kariyer bu kadar önemliyse neden çocuk yaptınız; birkaç yıl kariyerden vazgeçilebilir." },
          { id: 28, kind: "who", text: "In unserer Krippe sind die Gruppen klein genug.", answer: "c", explanation: "Bader: Çocukları 8 kişilik bir grupta ve yeterince ilgi görüyor." },
          { id: 29, kind: "who", text: "Kinderkrippen sollten mehr Geld bekommen.", answer: "a", explanation: "Moderatör, Bader'in söylediklerini özetliyor: kreşler mali açıdan daha iyi desteklenmeli." },
          { id: 30, kind: "who", text: "Was die beste Lösung ist, hängt auch von den Menschen ab.", answer: "a", explanation: "Moderatör kapanışta: Belki de bu kişiden kişiye değişir; tartışma bitmeyecek gibi." },
        ],
      },
    ],
  },
];
