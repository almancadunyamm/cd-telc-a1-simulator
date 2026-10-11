// A1 canlı kurs müfredatı (öğrenci panelindeki Ustalık temalarıyla aynı:
// 12 tema × 3 ders). Deneme panelinde kilitli ders programı olarak gösterilir.
export type SyllabusTheme = {
  id: number;
  title: string;
  germanTitle: string;
  lessons: { number: number; title: string }[];
};

export const A1_SYLLABUS: SyllabusTheme[] = [
  { id: 1, title: "Kendini Tanıtma", germanTitle: "Sich vorstellen", lessons: [
    { number: 1, title: "Tanışma + sein fiili" },
    { number: 2, title: "Kişi zamirleri + cümle kurma" },
    { number: 3, title: "Soru cümleleri (W-Fragen)" },
  ] },
  { id: 2, title: "Aile ve Arkadaşlar", germanTitle: "Familie & Freunde", lessons: [
    { number: 4, title: "Aile bireyleri + haben" },
    { number: 5, title: "İyelik: mein / dein" },
    { number: 6, title: "Basit sıfatlar + cümle kurma" },
  ] },
  { id: 3, title: "Meslek", germanTitle: "Beruf", lessons: [
    { number: 7, title: "Meslekler + arbeiten" },
    { number: 8, title: "Artikel: der / die / das" },
    { number: 9, title: "Çoğul: Plural" },
  ] },
  { id: 4, title: "Günlük Hayat", germanTitle: "Alltag", lessons: [
    { number: 10, title: "Günlük fiiller + Sayılar" },
    { number: 11, title: "Saatler" },
    { number: 12, title: "Fiil çekimi: Präsens" },
  ] },
  { id: 5, title: "Yemek & İçecek", germanTitle: "Essen & Trinken", lessons: [
    { number: 13, title: "Yiyecekler + Saatler" },
    { number: 14, title: "mögen + gern" },
    { number: 15, title: "Akkusativ" },
  ] },
  { id: 6, title: "Alışveriş", germanTitle: "Einkaufen", lessons: [
    { number: 16, title: "Fiyat sorma" },
    { number: 17, title: "möchten" },
    { number: 18, title: "haben fiili" },
  ] },
  { id: 7, title: "Ev & Yaşam", germanTitle: "Wohnen", lessons: [
    { number: 19, title: "Ev bölümleri" },
    { number: 20, title: "es gibt" },
    { number: 21, title: "Yer edatları" },
  ] },
  { id: 8, title: "Boş Zaman", germanTitle: "Freizeit", lessons: [
    { number: 22, title: "Hobiler ve aktiviteler" },
    { number: 23, title: "können" },
    { number: 24, title: "Cümle genişletme" },
  ] },
  { id: 9, title: "Ulaşım & Yol Tarifi", germanTitle: "Verkehr & Weg", lessons: [
    { number: 25, title: "Genel konuşma kalıpları" },
    { number: 26, title: "Ulaşım araçları + Emir cümlesi" },
    { number: 27, title: "Yönler" },
  ] },
  { id: 10, title: "Sağlık", germanTitle: "Gesundheit", lessons: [
    { number: 28, title: "Vücut" },
    { number: 29, title: "müssen" },
    { number: 30, title: "Basit tavsiye cümleleri" },
  ] },
  { id: 11, title: "Tatil", germanTitle: "Urlaub", lessons: [
    { number: 31, title: "Tatil-Aylar-Havadurumu" },
    { number: 32, title: "Perfekt tanıtım" },
    { number: 33, title: "Otel+Günler+Renkler" },
  ] },
  { id: 12, title: "Schreiben (Mektup & Form)", germanTitle: "Schreiben", lessons: [
    { number: 34, title: "Form doldurma + Mektup" },
    { number: 35, title: "Örnek mektup kalıpları" },
    { number: 36, title: "Genel tekrar" },
  ] },
];
