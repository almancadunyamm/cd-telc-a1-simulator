// Sınav Hazırlık: sınav / bölüm ayarları. Hem öğrenci paneli (ExamPrepTab) hem herkese açık
// /sinav-hazirlik sayfaları kullanır. "use client" YOK: sunucu bileşenlerinden de okunabilir.

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
import {
  GOETHE_B1_INSTRUCTIONS,
  GOETHE_B1_TEIL1_SETS,
  GOETHE_B1_TEIL2_SETS,
  GOETHE_B1_TEIL3_SETS,
  GOETHE_B1_TEIL4_SETS,
  GOETHE_B1_TEIL5_SETS,
  type DoubleTextSet,
  type YesNoSet,
} from "@/app/data/exam-prep/goethe_b1_lesen";
import {
  OSD_B1_A1_SETS,
  OSD_B1_A2_SETS,
  OSD_B1_A3_SETS,
  OSD_B1_INSTRUCTIONS,
  OSD_B1_SB1_SETS,
  OSD_B1_SB2_SETS,
} from "@/app/data/exam-prep/osd_b1_lesen";

export type Level = "A1" | "A2" | "B1";
export type ExamKey = "telc" | "goethe" | "osd";

// Görev türleri:
//  board → bilgi panosu + a/b/c (telc Teil 1, Goethe Teil 2)
//  rf    → metin + richtig/falsch (telc Teil 2)
//  match → ilanlar + harf / X (telc Teil 3, Goethe Teil 4)
//  mc    → makale veya e-posta + a/b/c (Goethe Teil 1 ve 3, ÖSD Aufgabe 2)
//  headlines → başlık eşleştirme (ÖSD Aufgabe 1, telc B1 Lesen Teil 1)
//  clozeMc   → mektupta boşluk + a/b/c (telc B1 Sprachbausteine 1)
//  clozeBank → metinde boşluk + kelime bankası (telc B1 Sprachbausteine 2)
export type TeilConfig =
  | { kind: "board"; sets: TelcA2Teil1Set[] }
  | { kind: "rf"; sets: TelcA2Teil2Set[] }
  | { kind: "match"; sets: TelcA2Teil3Set[] }
  | { kind: "mc"; sets: McTextSet[] }
  | { kind: "headlines"; sets: OsdHeadlineSet[] }
  | { kind: "clozeMc"; sets: ClozeMcSet[] }
  | { kind: "clozeBank"; sets: ClozeBankSet[] }
  | { kind: "double"; sets: DoubleTextSet[] }
  | { kind: "yesno"; sets: YesNoSet[] };

export type Teil = TeilConfig & {
  no: number;
  title: string;
  desc: string;
  tips: string[];
  instructions: { de: string[]; tr: string };
  upperKeys?: boolean; // seçenek harflerini A/B/C olarak göster (ÖSD)
  points?: string; // sınavdaki puan bilgisi
  noneLabel?: string; // match: "ilan yok" etiketi (telc "X", Goethe "0")
  reuseAds?: boolean; // match: ilanlar (örnektekiler dahil) tekrar kullanılabilir (ÖSD ZDÖ B1)
};

export type ExamConfig = {
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
    ready: true,
    color: "from-emerald-600 to-teal-700",
    accent: "bg-emerald-800",
    partLabel: "Teil",
    summary: "Lesen Teil 1 · 2 · 3 · 4 · 5",
    header: "Goethe-Zertifikat B1 · Lesen · 65 Minuten",
    intro:
      "Goethe-Zertifikat B1 sınavında Lesen modülü 65 dakikadır ve beş bölümde toplam 30 görevden oluşur. Sonuç 100 puana çevrilir; modülü geçmek için en az 60 puan gerekir. Önerilen süre: Teil 1 10 dk, Teil 2 20 dk, Teil 3 10 dk, Teil 4 15 dk, Teil 5 10 dk. Jugendliche sürümü de aynı yapıdadır; yalnızca konular gençlere yöneliktir.",
    progressSlug: "goethe-b1-lesen",
    teile: [
      {
        no: 1,
        kind: "rf",
        sets: GOETHE_B1_TEIL1_SETS,
        title: "Lesen, Teil 1",
        desc: "Blog / e-posta · 6 cümle (1–6) · Richtig / Falsch",
        points: "6 görev · ~10 dakika",
        tips: [
          "Önce 6 cümleyi oku; cümleler metindeki sırayla gelir. Her cümle için metinde ilgili yeri bul.",
          "Metinde hiç geçmeyen bilgi de Falsch'tır (Goethe'de „steht nicht im Text“ seçeneği yok).",
          "Zaman ve sıra ifadelerine dikkat: eigentlich, zuerst, erst, am Anfang, inzwischen, schließlich.",
          "„wollte / sollte / hatte geplant“ ile anlatılan şey gerçekleşmemiş olabilir.",
        ],
        instructions: GOETHE_B1_INSTRUCTIONS.teil1,
      },
      {
        no: 2,
        kind: "double",
        sets: GOETHE_B1_TEIL2_SETS,
        title: "Lesen, Teil 2",
        desc: "İki basın metni · görev 7–9 ve 10–12 · a, b, c",
        points: "6 görev · ~20 dakika",
        tips: [
          "Her metnin ilk görevi çoğunlukla „In diesem Text geht es um …“: başlığa ve alt başlığa bak.",
          "Seçenekler metindeki kelimeleri kullanır ama anlamı değiştirir. Kim, ne zaman, neden?",
          "„nur“, „alle“, „immer“, „nie“ içeren seçenekler genellikle fazla kesindir.",
          "İki metin için toplam 20 dakikan var: her metne yaklaşık 10 dakika ayır.",
        ],
        instructions: GOETHE_B1_INSTRUCTIONS.teil2,
      },
      {
        no: 3,
        kind: "match",
        sets: GOETHE_B1_TEIL3_SETS,
        title: "Lesen, Teil 3",
        desc: "7 durum (13–19) · 10 ilan (a–j) · bir durum için 0",
        points: "7 görev · ~10 dakika",
        noneLabel: "0",
        tips: [
          "Örnekteki ilan artık kullanılamaz; 10 ilandan 7'si kullanılır, 3'ü boşta kalır.",
          "Kişinin tam ihtiyacının altını çiz: ne? kim için? ne zaman? ücretsiz mi?",
          "Konu tutan ama bir detayı uymayan ilan (yaş, mutfak türü, gün, yer) tipik tuzaktır → 0.",
          "Yalnızca bir durumun cevabı 0'dır. Birden fazla 0 bulduysan tekrar kontrol et.",
        ],
        instructions: GOETHE_B1_INSTRUCTIONS.teil3,
      },
      {
        no: 4,
        kind: "yesno",
        sets: GOETHE_B1_TEIL4_SETS,
        title: "Lesen, Teil 4",
        desc: "7 okur yorumu (20–26) · Ist die Person dafür? Ja / Nein",
        points: "7 görev · ~15 dakika",
        tips: [
          "Kişinin genel görüşüne bak: yorumun sonunda genellikle bir sonuç cümlesi vardır (Mein Fazit …, Deshalb …).",
          "„zwar … aber“, „natürlich … aber“, „trotzdem“ yapılarına dikkat: önemli olan „aber / trotzdem“ sonrasıdır.",
          "Soruyu iyi oku: „für ein Verbot?“ sorusunda yasağa karşı olan biri = Nein.",
          "Kişi alternatif bir çözüm öneriyorsa (bessere Regeln, erst einmal …) genellikle sorudaki öneriye karşıdır.",
        ],
        instructions: GOETHE_B1_INSTRUCTIONS.teil4,
      },
      {
        no: 5,
        kind: "mc",
        sets: GOETHE_B1_TEIL5_SETS,
        title: "Lesen, Teil 5",
        desc: "Kurallar metni (Hausordnung vb.) · görev 27–30 · a, b, c",
        points: "4 görev · ~10 dakika",
        tips: [
          "Önce görevleri oku, sonra metinde ilgili başlığı bul (Anmeldung, Gebühren, Rücktritt …).",
          "Modal fiiller önemli: muss / darf nicht / kann / ist erlaubt / ist untersagt.",
          "İstisnalara dikkat: ausnahmsweise, außer, nur, jedoch.",
          "Ücretler: kostenlos, Gebühr, Pfand (geri alınan depozito), Ermäßigung.",
        ],
        instructions: GOETHE_B1_INSTRUCTIONS.teil5,
      },
    ],
  },
  {
    key: "osd",
    name: "ÖSD",
    full: "ÖSD Zertifikat Deutsch Österreich B1",
    ready: true,
    color: "from-rose-600 to-red-700",
    accent: "bg-rose-800",
    partLabel: "Aufgabe",
    summary: "Lesen 1–3 · Sprachbausteine 1–2",
    header: "ÖSD Zertifikat Deutsch Österreich B1 · Lesen & Sprachbausteine · 90 Minuten",
    intro:
      "Bu bölüm Avusturya'daki ÖSD Zertifikat Deutsch Österreich B1 (ZDÖ B1) sınavının formatını birebir izler: 3 Lesen görevi ve 2 Sprachbausteine görevi, toplam 90 dakika. Not: ÖSD'nin bir de Goethe ile ortak hazırladığı „ÖSD Zertifikat B1“ (ZB1) sınavı var. O sınavın Lesen bölümü Goethe-Zertifikat B1 ile birebir aynıdır, bu yüzden ZB1'e giriyorsan Goethe B1 alıştırmalarını çöz.",
    progressSlug: "osd-b1-lesen",
    teile: [
      {
        no: 1,
        kind: "headlines",
        sets: OSD_B1_A1_SETS,
        title: "Lesen, Aufgabe 1",
        desc: "5 kısa gazete metni (1–5) · 10 başlık (A–K)",
        points: "5 görev · 25 puan · ~20 dakika",
        tips: [
          "Başlıklar ikişer ikişer aynı konudadır (ör. „Zu wenig Schnee“ / „Skisaison beginnt früher“). Doğru olan, metnin asıl mesajını veren başlıktır.",
          "Önce metni oku ve ana fikri bir cümleyle Türkçe söyle, sonra başlıklara bak.",
          "Olumlu / olumsuz farkına dikkat: mehr ↔ weniger, teurer ↔ gratis, früher ↔ später.",
          "Metnin altındaki kaynak etiketi (aus einer österreichischen Zeitung) cevap için ipucu değildir.",
        ],
        instructions: OSD_B1_INSTRUCTIONS.aufgabe1,
      },
      {
        no: 2,
        kind: "mc",
        sets: OSD_B1_A2_SETS,
        title: "Lesen, Aufgabe 2",
        desc: "Uzun gazete makalesi · görev 6–10 · A, B, C",
        points: "5 görev · 25 puan · ~35 dakika",
        upperKeys: true,
        tips: [
          "Görevler metindeki sırayı izler: 6. görevin cevabı metnin başında, 10. görevinki sonundadır.",
          "Önce cümle başlangıcını (Stamm) oku, metinde aynı bilgiyi ara; seçeneklerdeki kelimeler metinden farklı olabilir (eş anlamlılar).",
          "Uzman görüşlerine dikkat: „sagt“, „betont“, „rät“, „warnt“ ile başlayan cümleler sık sorulur.",
          "Bu görev için en uzun süreyi (yaklaşık 35 dakika) ayır.",
        ],
        instructions: OSD_B1_INSTRUCTIONS.aufgabe2,
      },
      {
        no: 3,
        kind: "match",
        sets: OSD_B1_A3_SETS,
        title: "Lesen, Aufgabe 3",
        desc: "10 durum (11–20) · 12 ilan (A–M) · uygun ilan yoksa 0",
        points: "10 görev · 25 puan · ~15 dakika",
        noneLabel: "0",
        reuseAds: true,
        tips: [
          "ÖSD'ye özgü: Bir ilan birden fazla duruma uyabilir, örnekteki ilan da tekrar kullanılabilir.",
          "Genellikle 1–2 durumun cevabı 0'dır. Konu tutan ama bir ayrıntısı uymayan ilan tipik tuzaktır (akşam ↔ sabah, satış ↔ eğitim, yeni ↔ ikinci el).",
          "Durumdaki anahtar bilgiyi işaretle: ne arıyor, kim için, ne zaman, alıyor mu satıyor mu?",
          "Bu bölüm hızlı olmalı: ilanları baştan sona okuma, aradığın bilgiyi tara.",
        ],
        instructions: OSD_B1_INSTRUCTIONS.aufgabe3,
      },
      {
        no: 4,
        kind: "clozeMc",
        sets: OSD_B1_SB1_SETS,
        title: "Sprachbausteine, Aufgabe 1",
        desc: "E-posta / mektup · boşluk 21–30 · A, B, C",
        points: "10 görev · 15 puan · ~10 dakika",
        upperKeys: true,
        tips: [
          "Boşluğun önüne ve arkasına bak: fiil sonda mı (weil, dass, ob, wenn) yoksa ikinci sırada mı (denn, deshalb, aber)?",
          "Sık sorulanlar: Perfekt partizip, sıfat çekimi, fiil + edat (sich freuen auf / sich interessieren für), dönüşlü zamirler.",
          "Kalıplara dikkat: so schnell wie möglich, am besten, Ich wäre Ihnen dankbar, Mit freundlichen Grüßen.",
          "Bir boşlukta birden fazla işaret = 0 puan; her boşluğa tek cevap.",
        ],
        instructions: OSD_B1_INSTRUCTIONS.sb1,
      },
      {
        no: 5,
        kind: "clozeBank",
        sets: OSD_B1_SB2_SETS,
        title: "Sprachbausteine, Aufgabe 2",
        desc: "İlan + mektup · boşluk 31–40 · 15 kelimelik liste",
        points: "10 görev · 15 puan · ~10 dakika",
        tips: [
          "Önce ilanı oku: mektup bu ilana cevap olarak yazılmış; kişi neyi soruyor, neye ilgi duyuyor?",
          "Listede 15 kelime var, 10'u kullanılır. Benzer çiftler bilinçli tuzaktır: dass / ob, aber / denn, mitbringen / mitnehmen.",
          "Önce kolay boşlukları doldur (hitap, kapanış, edatlar), sonra kalan kelimelerle zor boşluklara dön.",
          "Her kelime yalnızca bir kez kullanılır.",
        ],
        instructions: OSD_B1_INSTRUCTIONS.sb2,
      },
    ],
  },
];

export const EXAMS_BY_LEVEL: Record<Level, ExamConfig[]> = { A1: [], A2: EXAMS_A2, B1: EXAMS_B1 };
export const ALL_EXAMS: ExamConfig[] = [...EXAMS_A2, ...EXAMS_B1];
// Sınav Hazırlık içeriği hazır olan seviyeler (en az bir sınavı hazır olanlar).
export const READY_LEVELS: Level[] = (["A1", "A2", "B1"] as Level[]).filter((lvl) => EXAMS_BY_LEVEL[lvl].some((e) => e.ready));

/** URL parçası: "Lesen, Teil 1" → "lesen-teil-1" */
export function teilSlug(teil: Teil): string {
  return teil.title
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function findPublicExam(levelSlug: string, examSlug: string): { level: Level; exam: ExamConfig } | null {
  const level = levelSlug.toUpperCase() as Level;
  if (!(level in EXAMS_BY_LEVEL)) return null;
  const exam = EXAMS_BY_LEVEL[level].find((e) => e.key === examSlug && e.ready);
  return exam ? { level, exam } : null;
}

// ───────── Resmî ücretsiz deneme sınavları (dış linkler; içerik sınav kurumlarına aittir) ─────────
export type OfficialResource = {
  exam: ExamKey;
  title: string;
  desc: string;
  links: { label: string; url: string }[];
};

export const OFFICIAL_RESOURCES: Record<Level, OfficialResource[]> = {
  A1: [],
  A2: [
    {
      exam: "telc",
      title: "telc Deutsch A2 (Start Deutsch 2) – Übungstest 1",
      desc: "Tam deneme sınavı + Hören ses dosyaları, ücretsiz indirme (ZIP).",
      links: [
        { label: "Sınav sayfası", url: "https://www.telc.net/sprachpruefungen/deutsch/start-deutsch-2-telc-deutsch-a2/" },
        { label: "İndir (ZIP)", url: "https://www.telc.net/fileadmin/user_upload/mock_exams/Deutsch/telc_deutsch_a2_01.zip" },
      ],
    },
    {
      exam: "goethe",
      title: "Goethe-Zertifikat A2 – Prüfungstraining",
      desc: "Modellsatz PDF, Hören ses dosyaları ve online (tıklayarak çözülen) deneme sınavı.",
      links: [{ label: "Goethe-Institut sayfası", url: "https://www.goethe.de/de/spr/prf/ueb/pa2.html" }],
    },
    {
      exam: "osd",
      title: "ÖSD Zertifikat A2 – Modellsatz",
      desc: "Modellsatz PDF ücretsiz; Hören dosyaları ÖSD web mağazasından (testsam.at) ücretsiz alınır.",
      links: [
        { label: "Modellsatz (PDF)", url: "https://osd.at/wp-content/uploads/2023/07/ZA2-Modellsatz.pdf" },
        { label: "Sınav sayfası", url: "https://osd.at/en/?p=34364" },
      ],
    },
  ],
  B1: [
    {
      exam: "telc",
      title: "telc Deutsch B1 – Übungstest 1",
      desc: "Tam deneme sınavı + Hören ses dosyaları ücretsiz. B1 Schule (gençler) sürümü aynı formatta ve doğrudan indirilebilir.",
      links: [
        { label: "telc Almanca sınavları", url: "https://www.telc.net/en/language-examinations/certificate-exams/german/" },
        { label: "B1 Schule – İndir (ZIP)", url: "https://www.telc.net/fileadmin/user_upload/mock_exams/Deutsch/telc_deutsch_b1_schule.zip" },
      ],
    },
    {
      exam: "goethe",
      title: "Goethe-Zertifikat B1 – Modellsatz & Übungssatz",
      desc: "Kandidatenblätter PDF, Hören modülü (yaklaşık 37–40 dk, doğrudan dinlenebilir) ve online deneme sınavı.",
      links: [
        { label: "Goethe-Institut sayfası", url: "https://www.goethe.de/de/spr/prf/ueb/pb1.html" },
        { label: "Online Modellsatz", url: "https://bfu.goethe.de/b1_mod/index.php" },
      ],
    },
    {
      exam: "osd",
      title: "ÖSD Zertifikat B1 (ZB1) & Zertifikat Deutsch Österreich B1 (ZDÖ)",
      desc: "Modellsätze PDF ücretsiz; Hören dosyaları ÖSD web mağazasından (testsam.at) ücretsiz alınır (kod PDF içinde).",
      links: [
        { label: "ZB1 Übungsmaterialien (PDF)", url: "https://osd.at/wp-content/uploads/2026/09/ZB1-Uebungsmaterialien-Band-1_WEB.pdf" },
        { label: "ZDÖ B1 Modellsatz (PDF)", url: "https://osd.at/wp-content/uploads/2026/08/ZDOe-B1-Modellsatz-Homepage-LV.pdf" },
        { label: "ZDÖ B1 sınav sayfası", url: "https://www.osd.at/en/?p=9655" },
      ],
    },
  ],
};
