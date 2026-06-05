"use client";

import { useState, useCallback } from "react";

type Kelime = { de: string; tr: string };
type TemaKey = keyof typeof KELIMELER;
type Mod = "de_to_tr" | "tr_to_de";
type Soru = { soru: string; dogru: string; secenekler: string[] };

const KELIMELER = {
  tema1: { ad: "Kendini Tanıtma", kelimeler: [
    {de:"der Name",tr:"isim, ad"},{de:"der Vorname",tr:"ön ad"},{de:"der Familienname",tr:"soyadı"},
    {de:"die Adresse",tr:"adres"},{de:"das Alter",tr:"yaş"},{de:"der Geburtsort",tr:"doğum yeri"},
    {de:"ledig",tr:"bekar"},{de:"verheiratet",tr:"evli"},{de:"die Sprache",tr:"dil"},
    {de:"sprechen",tr:"konuşmak"},{de:"heißen",tr:"adı olmak"},{de:"wohnen",tr:"yaşamak"},
    {de:"hallo",tr:"merhaba"},{de:"Auf Wiedersehen",tr:"hoşça kalın"},{de:"tschüss",tr:"görüşürüz"},
    {de:"Guten Morgen",tr:"günaydın"},{de:"Guten Tag",tr:"iyi günler"},{de:"bitte",tr:"lütfen"},
    {de:"danke",tr:"teşekkürler"},{de:"ja",tr:"evet"},{de:"nein",tr:"hayır"},
    {de:"vorstellen",tr:"tanıtmak"},{de:"buchstabieren",tr:"harflerle söylemek"},
    {de:"die Nationalität",tr:"milliyet"},{de:"das Geburtsjahr",tr:"doğum yılı"},
    {de:"der Familienstand",tr:"medeni durum"},{de:"kommen aus",tr:"...den gelmek"},
    {de:"ich",tr:"ben"},{de:"Sie",tr:"siz (resmi)"},{de:"Guten Abend",tr:"iyi akşamlar"}
  ] as Kelime[]},
  tema2: { ad: "Aile ve Arkadaşlar", kelimeler: [
    {de:"die Familie",tr:"aile"},{de:"die Mutter",tr:"anne"},{de:"der Vater",tr:"baba"},
    {de:"die Eltern",tr:"ebeveynler"},{de:"der Bruder",tr:"erkek kardeş"},{de:"die Schwester",tr:"kız kardeş"},
    {de:"der Sohn",tr:"oğul"},{de:"die Tochter",tr:"kız çocuk"},{de:"das Kind",tr:"çocuk"},
    {de:"die Großmutter",tr:"büyükanne"},{de:"der Großvater",tr:"büyükbaba"},{de:"die Oma",tr:"nine"},
    {de:"der Opa",tr:"dede"},{de:"der Freund",tr:"erkek arkadaş"},{de:"die Freundin",tr:"kız arkadaş"},
    {de:"der Bekannte",tr:"tanıdık"},{de:"der Verwandte",tr:"akraba"},{de:"der Ehemann",tr:"eş (erkek)"},
    {de:"die Ehefrau",tr:"eş (kadın)"},{de:"heiraten",tr:"evlenmek"},{de:"die Hochzeit",tr:"düğün"},
    {de:"lieben",tr:"sevmek"},{de:"der Junge",tr:"erkek çocuk"},{de:"das Mädchen",tr:"kız çocuk"},
    {de:"das Baby",tr:"bebek"},{de:"zusammen",tr:"birlikte"},{de:"besuchen",tr:"ziyaret etmek"},
    {de:"kennenlernen",tr:"tanışmak"},{de:"die Geschwister",tr:"kardeşler"},{de:"der Partner",tr:"partner"}
  ] as Kelime[]},
  tema3: { ad: "Meslek", kelimeler: [
    {de:"der Beruf",tr:"meslek"},{de:"arbeiten",tr:"çalışmak"},{de:"die Arbeit",tr:"iş"},
    {de:"der Arbeitsplatz",tr:"işyeri"},{de:"die Firma",tr:"şirket"},{de:"der Chef",tr:"patron"},
    {de:"der Kollege",tr:"iş arkadaşı"},{de:"der Lehrer",tr:"öğretmen"},{de:"der Arzt",tr:"doktor"},
    {de:"der Verkäufer",tr:"satıcı"},{de:"der Beamte",tr:"memur"},{de:"die Hausfrau",tr:"ev hanımı"},
    {de:"der Student",tr:"üniversite öğrencisi"},{de:"studieren",tr:"üniversitede okumak"},
    {de:"die Schule",tr:"okul"},{de:"der Schüler",tr:"okul öğrencisi"},{de:"verdienen",tr:"kazanmak"},
    {de:"arbeitslos",tr:"işsiz"},{de:"selbstständig",tr:"serbest meslek"},{de:"der Job",tr:"iş"},
    {de:"das Praktikum",tr:"staj"},{de:"die Stelle",tr:"pozisyon"},{de:"die Polizei",tr:"polis"},
    {de:"der Doktor",tr:"doktor"},{de:"die Praxis",tr:"muayenehane"},{de:"werden",tr:"olmak"},
    {de:"der Rentner",tr:"emekli"},{de:"suchen",tr:"aramak"},{de:"der Verein",tr:"dernek"},
    {de:"das Studium",tr:"üniversite eğitimi"}
  ] as Kelime[]},
  tema4: { ad: "Günlük Hayat", kelimeler: [
    {de:"aufstehen",tr:"kalkmak"},{de:"frühstücken",tr:"kahvaltı etmek"},{de:"das Frühstück",tr:"kahvaltı"},
    {de:"schlafen",tr:"uyumak"},{de:"müde",tr:"yorgun"},{de:"der Morgen",tr:"sabah"},
    {de:"der Mittag",tr:"öğle"},{de:"der Abend",tr:"akşam"},{de:"die Nacht",tr:"gece"},
    {de:"heute",tr:"bugün"},{de:"morgen",tr:"yarın"},{de:"gestern",tr:"dün"},
    {de:"immer",tr:"her zaman"},{de:"oft",tr:"sık sık"},{de:"nie",tr:"hiç, asla"},
    {de:"die Uhr",tr:"saat"},{de:"die Pause",tr:"mola"},{de:"machen",tr:"yapmak"},
    {de:"gehen",tr:"gitmek"},{de:"kommen",tr:"gelmek"},{de:"pünktlich",tr:"dakik"},
    {de:"spät",tr:"geç"},{de:"der Termin",tr:"randevu"},{de:"fertig",tr:"hazır, bitmiş"},
    {de:"der Alltag",tr:"günlük hayat"},{de:"der Nachmittag",tr:"öğleden sonra"},
    {de:"der Vormittag",tr:"öğleden önce"},{de:"die Hausaufgabe",tr:"ödev"},
    {de:"manchmal",tr:"bazen"},{de:"früh",tr:"erken"}
  ] as Kelime[]},
  tema5: { ad: "Yemek ve İçecek", kelimeler: [
    {de:"essen",tr:"yemek"},{de:"trinken",tr:"içmek"},{de:"das Essen",tr:"yemek"},
    {de:"das Wasser",tr:"su"},{de:"der Kaffee",tr:"kahve"},{de:"der Tee",tr:"çay"},
    {de:"das Bier",tr:"bira"},{de:"der Wein",tr:"şarap"},{de:"der Saft",tr:"meyve suyu"},
    {de:"die Milch",tr:"süt"},{de:"das Brot",tr:"ekmek"},{de:"die Butter",tr:"tereyağı"},
    {de:"der Käse",tr:"peynir"},{de:"das Ei",tr:"yumurta"},{de:"das Fleisch",tr:"et"},
    {de:"der Fisch",tr:"balık"},{de:"das Gemüse",tr:"sebze"},{de:"das Obst",tr:"meyve"},
    {de:"der Apfel",tr:"elma"},{de:"die Kartoffel",tr:"patates"},{de:"der Reis",tr:"pirinç"},
    {de:"der Salat",tr:"salata"},{de:"das Hähnchen",tr:"tavuk"},{de:"schmecken",tr:"lezzetli olmak"},
    {de:"kochen",tr:"pişirmek"},{de:"Guten Appetit",tr:"Afiyet olsun"},{de:"das Brötchen",tr:"küçük ekmek"},
    {de:"die Banane",tr:"muz"},{de:"das Getränk",tr:"içecek"},{de:"der Hunger",tr:"açlık"}
  ] as Kelime[]},
  tema6: { ad: "Alışveriş", kelimeler: [
    {de:"kaufen",tr:"satın almak"},{de:"verkaufen",tr:"satmak"},{de:"das Geschäft",tr:"mağaza"},
    {de:"der Preis",tr:"fiyat"},{de:"kosten",tr:"fiyatı olmak"},{de:"teuer",tr:"pahalı"},
    {de:"billig",tr:"ucuz"},{de:"günstig",tr:"uygun fiyatlı"},{de:"bezahlen",tr:"ödemek"},
    {de:"die Kasse",tr:"kasa"},{de:"das Geld",tr:"para"},{de:"bar",tr:"nakit"},
    {de:"das Angebot",tr:"indirim, teklif"},{de:"die Kleidung",tr:"kıyafet"},
    {de:"die Jacke",tr:"ceket"},{de:"der Schuh",tr:"ayakkabı"},{de:"die Größe",tr:"beden"},
    {de:"einkaufen",tr:"alışveriş yapmak"},{de:"die Bäckerei",tr:"fırın"},
    {de:"die Rechnung",tr:"fatura, hesap"},{de:"der Kunde",tr:"müşteri"},
    {de:"das Euro",tr:"euro"},{de:"das Pfund",tr:"yarım kilo"},{de:"das Kilo",tr:"kilo"},
    {de:"der Laden",tr:"dükkan"},{de:"der Supermarkt",tr:"süpermarket"},
    {de:"die Karte",tr:"kart"},{de:"der Kiosk",tr:"büfe"},
    {de:"der Verkäufer",tr:"satıcı"},{de:"das Cent",tr:"sent"}
  ] as Kelime[]},
  tema7: { ad: "Ev ve Yaşam", kelimeler: [
    {de:"die Wohnung",tr:"daire"},{de:"das Haus",tr:"ev"},{de:"das Zimmer",tr:"oda"},
    {de:"die Küche",tr:"mutfak"},{de:"das Bad",tr:"banyo"},{de:"die Toilette",tr:"tuvalet"},
    {de:"der Balkon",tr:"balkon"},{de:"der Garten",tr:"bahçe"},{de:"die Miete",tr:"kira"},
    {de:"mieten",tr:"kiralamak"},{de:"umziehen",tr:"taşınmak"},{de:"der Schrank",tr:"dolap"},
    {de:"das Sofa",tr:"kanepe"},{de:"der Tisch",tr:"masa"},{de:"das Bett",tr:"yatak"},
    {de:"der Kühlschrank",tr:"buzdolabı"},{de:"der Herd",tr:"ocak"},{de:"der Aufzug",tr:"asansör"},
    {de:"der Stock",tr:"kat"},{de:"oben",tr:"yukarıda"},{de:"unten",tr:"aşağıda"},
    {de:"die Treppe",tr:"merdiven"},{de:"das Licht",tr:"ışık"},{de:"der Schlüssel",tr:"anahtar"},
    {de:"die Postleitzahl",tr:"posta kodu"},{de:"die Möbel",tr:"mobilya"},
    {de:"der Vermieter",tr:"ev sahibi"},{de:"die Waschmaschine",tr:"çamaşır makinesi"},
    {de:"wohnen",tr:"yaşamak"},{de:"die Adresse",tr:"adres"}
  ] as Kelime[]},
  tema8: { ad: "Boş Zaman", kelimeler: [
    {de:"die Freizeit",tr:"boş vakit"},{de:"das Hobby",tr:"hobi"},{de:"der Sport",tr:"spor"},
    {de:"spielen",tr:"oynamak"},{de:"schwimmen",tr:"yüzmek"},{de:"das Schwimmbad",tr:"yüzme havuzu"},
    {de:"wandern",tr:"yürüyüş yapmak"},{de:"Rad fahren",tr:"bisiklet sürmek"},{de:"der Fußball",tr:"futbol"},
    {de:"tanzen",tr:"dans etmek"},{de:"die Musik",tr:"müzik"},{de:"das Kino",tr:"sinema"},
    {de:"der Film",tr:"film"},{de:"fernsehen",tr:"TV izlemek"},{de:"das Internet",tr:"internet"},
    {de:"lesen",tr:"okumak"},{de:"die Zeitung",tr:"gazete"},{de:"das Buch",tr:"kitap"},
    {de:"die Party",tr:"parti"},{de:"feiern",tr:"kutlamak"},{de:"grillen",tr:"mangal yapmak"},
    {de:"der Ausflug",tr:"gezi"},{de:"das Café",tr:"kafe"},{de:"das Restaurant",tr:"restoran"},
    {de:"der See",tr:"göl"},{de:"das Meer",tr:"deniz"},{de:"reisen",tr:"seyahat etmek"},
    {de:"das Lied",tr:"şarkı"},{de:"die Disco",tr:"disko"},{de:"der Urlaub",tr:"tatil"}
  ] as Kelime[]},
  tema9: { ad: "Ulaşım ve Yol Tarifi", kelimeler: [
    {de:"fahren",tr:"gitmek (araçla)"},{de:"das Auto",tr:"araba"},{de:"der Bus",tr:"otobüs"},
    {de:"der Zug",tr:"tren"},{de:"die Bahn",tr:"demiryolu"},{de:"die S-Bahn",tr:"banliyö treni"},
    {de:"das Taxi",tr:"taksi"},{de:"das Flugzeug",tr:"uçak"},{de:"der Flughafen",tr:"havalimanı"},
    {de:"der Bahnhof",tr:"tren istasyonu"},{de:"die Haltestelle",tr:"durak"},{de:"die Fahrkarte",tr:"bilet"},
    {de:"links",tr:"sol, sola"},{de:"rechts",tr:"sağ, sağa"},{de:"geradeaus",tr:"düz"},
    {de:"die Straße",tr:"sokak"},{de:"die Ecke",tr:"köşe"},{de:"weit",tr:"uzak"},
    {de:"die Autobahn",tr:"otoyol"},{de:"aussteigen",tr:"inmek (araçtan)"},
    {de:"einsteigen",tr:"binmek (araca)"},{de:"abfahren",tr:"kalkmak"},
    {de:"ankommen",tr:"varmak"},{de:"der Weg",tr:"yol, rota"},
    {de:"die Straßenbahn",tr:"tramvay"},{de:"das Ticket",tr:"bilet"},
    {de:"der Platz",tr:"meydan"},{de:"der Stadtplan",tr:"şehir haritası"},
    {de:"nah",tr:"yakın"},{de:"die Richtung",tr:"yön"}
  ] as Kelime[]},
  tema10: { ad: "Sağlık", kelimeler: [
    {de:"der Arzt",tr:"doktor"},{de:"krank",tr:"hasta"},{de:"das Fieber",tr:"ateş"},
    {de:"weh tun",tr:"ağrımak"},{de:"der Kopf",tr:"baş"},{de:"der Bauch",tr:"karın"},
    {de:"der Arm",tr:"kol"},{de:"das Bein",tr:"bacak"},{de:"der Fuß",tr:"ayak"},
    {de:"die Hand",tr:"el"},{de:"das Auge",tr:"göz"},{de:"der Mund",tr:"ağız"},
    {de:"das Haar",tr:"saç"},{de:"die Apotheke",tr:"eczane"},{de:"das Medikament",tr:"ilaç"},
    {de:"helfen",tr:"yardım etmek"},{de:"besser",tr:"daha iyi"},{de:"schlecht",tr:"kötü"},
    {de:"müde",tr:"yorgun"},{de:"der Hunger",tr:"açlık"},{de:"der Durst",tr:"susuzluk"},
    {de:"duschen",tr:"duş almak"},{de:"die Dusche",tr:"duş"},{de:"schlafen",tr:"uyumak"},
    {de:"gesund",tr:"sağlıklı"},{de:"die Praxis",tr:"muayenehane"},{de:"der Termin",tr:"randevu"},
    {de:"der Schmerz",tr:"ağrı"},{de:"sich waschen",tr:"yıkanmak"},{de:"die Krankheit",tr:"hastalık"}
  ] as Kelime[]},
  tema11: { ad: "Tatil", kelimeler: [
    {de:"der Urlaub",tr:"tatil"},{de:"reisen",tr:"seyahat etmek"},{de:"die Reise",tr:"yolculuk"},
    {de:"das Hotel",tr:"otel"},{de:"das Einzelzimmer",tr:"tek kişilik oda"},
    {de:"das Doppelzimmer",tr:"çift kişilik oda"},{de:"die Rezeption",tr:"resepsiyon"},
    {de:"übernachten",tr:"gecelemek"},{de:"das Gepäck",tr:"bagaj"},{de:"der Koffer",tr:"valiz"},
    {de:"der Pass",tr:"pasaport"},{de:"der Ausweis",tr:"kimlik"},{de:"das Meer",tr:"deniz"},
    {de:"das Land",tr:"ülke"},{de:"die Stadt",tr:"şehir"},{de:"das Dorf",tr:"köy"},
    {de:"die Sehenswürdigkeit",tr:"turistik yer"},{de:"besichtigen",tr:"gezmek"},
    {de:"der Ausflug",tr:"gezi"},{de:"das Wetter",tr:"hava"},{de:"die Sonne",tr:"güneş"},
    {de:"der Regen",tr:"yağmur"},{de:"warm",tr:"sıcak"},{de:"kalt",tr:"soğuk"},
    {de:"das Reisebüro",tr:"seyahat acentesi"},{de:"fliegen",tr:"uçmak"},
    {de:"ankommen",tr:"varmak"},{de:"der Strand",tr:"sahil"},
    {de:"das Zimmer",tr:"oda"},{de:"der Prospekt",tr:"broşür"}
  ] as Kelime[]},
  tema12: { ad: "Schreiben (Yazma)", kelimeler: [
    {de:"schreiben",tr:"yazmak"},{de:"der Brief",tr:"mektup"},{de:"die E-Mail",tr:"e-posta"},
    {de:"das Formular",tr:"form"},{de:"ausfüllen",tr:"doldurmak"},{de:"unterschreiben",tr:"imzalamak"},
    {de:"die Unterschrift",tr:"imza"},{de:"der Absender",tr:"gönderen"},{de:"der Empfänger",tr:"alıcı"},
    {de:"die Anrede",tr:"hitap"},{de:"der Gruß",tr:"selam"},{de:"die Briefmarke",tr:"posta pulu"},
    {de:"die Post",tr:"postane"},{de:"schicken",tr:"göndermek"},{de:"antworten",tr:"cevap vermek"},
    {de:"die Antwort",tr:"cevap"},{de:"der Satz",tr:"cümle"},{de:"das Wort",tr:"kelime"},
    {de:"der Text",tr:"metin"},{de:"lesen",tr:"okumak"},{de:"verstehen",tr:"anlamak"},
    {de:"wiederholen",tr:"tekrarlamak"},{de:"erklären",tr:"açıklamak"},{de:"die Aufgabe",tr:"görev"},
    {de:"richtig",tr:"doğru"},{de:"falsch",tr:"yanlış"},{de:"ergänzen",tr:"tamamlamak"},
    {de:"die Adresse",tr:"adres"},{de:"die Postleitzahl",tr:"posta kodu"},{de:"das Fax",tr:"faks"}
  ] as Kelime[]},
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getWrongOptions(correct: string, pool: Kelime[], count = 3): string[] {
  const others = pool.filter((k) => k.tr !== correct).map((k) => k.tr);
  return shuffle(others).slice(0, count);
}

export default function KelimeOyunu() {
  const [tema, setTema] = useState<TemaKey | null>(null);
  const [mod, setMod] = useState<Mod | null>(null);
  const [sorular, setSorular] = useState<Soru[]>([]);
  const [suankiIndex, setSuankiIndex] = useState(0);
  const [canlar, setCanlar] = useState(3);
  const [skor, setSkor] = useState(0);
  const [secilenCevap, setSecilenCevap] = useState<string | null>(null);
  const [oyunBitti, setOyunBitti] = useState(false);
  const [streak, setStreak] = useState(0);
  const [dogru, setDogru] = useState(0);
  const [yanlis, setYanlis] = useState(0);

  const oyunuBaslat = useCallback((secilenTema: TemaKey, secilenMod: Mod) => {
    const kelimeler = shuffle(KELIMELER[secilenTema].kelimeler).slice(0, 15);
    const hazirSorular: Soru[] = kelimeler.map((k) => {
      const dogruCevap = secilenMod === "de_to_tr" ? k.tr : k.de;
      const soru = secilenMod === "de_to_tr" ? k.de : k.tr;
      const yanlislar =
        secilenMod === "de_to_tr"
          ? getWrongOptions(k.tr, KELIMELER[secilenTema].kelimeler)
          : shuffle(KELIMELER[secilenTema].kelimeler.filter((x) => x.de !== k.de))
              .slice(0, 3)
              .map((x) => x.de);
      const secenekler = shuffle([dogruCevap, ...yanlislar]);
      return { soru, dogru: dogruCevap, secenekler };
    });
    setSorular(hazirSorular);
    setSuankiIndex(0);
    setCanlar(3);
    setSkor(0);
    setSecilenCevap(null);
    setOyunBitti(false);
    setStreak(0);
    setDogru(0);
    setYanlis(0);
    setTema(secilenTema);
    setMod(secilenMod);
  }, []);

  const cevapSec = (cevap: string) => {
    if (secilenCevap) return;
    setSecilenCevap(cevap);
    const mevcutSoru = sorular[suankiIndex];
    if (cevap === mevcutSoru.dogru) {
      setSkor((s) => s + 10);
      setStreak((s) => s + 1);
      setDogru((d) => d + 1);
      setTimeout(() => sonrakiSoru(), 900);
    } else {
      setCanlar((c) => c - 1);
      setStreak(0);
      setYanlis((y) => y + 1);
      if (canlar - 1 <= 0) {
        setTimeout(() => setOyunBitti(true), 900);
      } else {
        setTimeout(() => sonrakiSoru(), 900);
      }
    }
  };

  const sonrakiSoru = () => {
    setSecilenCevap(null);
    if (suankiIndex + 1 >= sorular.length) {
      setOyunBitti(true);
    } else {
      setSuankiIndex((i) => i + 1);
    }
  };

  const canIkonu = (dolu: boolean) => (dolu ? "❤️" : "🖤");

  if (!tema) {
    return (
      <div style={{ background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)", fontFamily: "'Segoe UI', sans-serif", color: "#fff", padding: "24px 16px", borderRadius: 24 }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🎮</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Kelime Oyunu</h1>
            <p style={{ color: "#a78bfa", marginTop: 8, fontSize: 15 }}>Goethe A1 — 360 kelime, 12 tema</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {(Object.entries(KELIMELER) as [TemaKey, typeof KELIMELER[TemaKey]][]).map(([key, val], i) => (
              <button key={key} onClick={() => setTema(key)}
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: "16px 14px", color: "#fff", cursor: "pointer", textAlign: "left" }}>
                <div style={{ fontSize: 11, color: "#a78bfa", marginBottom: 4, fontWeight: 600 }}>TEMA {i + 1}</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{val.ad}</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>{val.kelimeler.length} kelime</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!mod) {
    return (
      <div style={{ background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)", fontFamily: "'Segoe UI', sans-serif", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, borderRadius: 24 }}>
        <div style={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>⚙️</div>
          <h2 style={{ fontSize: 22, margin: "0 0 8px" }}>{KELIMELER[tema].ad}</h2>
          <p style={{ color: "#a78bfa", fontSize: 14, marginBottom: 32 }}>Hangi yönde çalışmak istersin?</p>
          {([
            { id: "de_to_tr" as Mod, icon: "🇩🇪→🇹🇷", label: "Almanca → Türkçe", desc: "Almanca kelimeyi gör, Türkçesini bul" },
            { id: "tr_to_de" as Mod, icon: "🇹🇷→🇩🇪", label: "Türkçe → Almanca", desc: "Türkçe anlamı gör, Almancasını bul" },
          ]).map((m) => (
            <button key={m.id} onClick={() => oyunuBaslat(tema, m.id)}
              style={{ display: "block", width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 16, padding: "20px 24px", color: "#fff", cursor: "pointer", textAlign: "left", marginBottom: 14 }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{m.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{m.label}</div>
              <div style={{ fontSize: 13, color: "#999", marginTop: 4 }}>{m.desc}</div>
            </button>
          ))}
          <button onClick={() => setTema(null)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 14, marginTop: 8 }}>← Geri dön</button>
        </div>
      </div>
    );
  }

  if (oyunBitti) {
    const basari = Math.round((dogru / sorular.length) * 100);
    const mesaj = basari >= 80 ? "Harika! 🏆" : basari >= 60 ? "İyi iş! 👍" : "Tekrar dene! 💪";
    return (
      <div style={{ background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)", fontFamily: "'Segoe UI', sans-serif", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, borderRadius: 24 }}>
        <div style={{ maxWidth: 380, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>{basari >= 80 ? "🏆" : basari >= 60 ? "⭐" : "🔄"}</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 8px" }}>{mesaj}</h2>
          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 20, padding: "24px", margin: "24px 0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
              {[{ label: "Skor", val: skor, color: "#a78bfa" }, { label: "Doğru", val: dogru, color: "#34d399" }, { label: "Yanlış", val: yanlis, color: "#f87171" }].map((s) => (
                <div key={s.label}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(167,139,250,0.1)", borderRadius: 12, padding: "12px", fontSize: 18, fontWeight: 700, color: "#a78bfa" }}>Başarı: %{basari}</div>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => oyunuBaslat(tema, mod!)}
              style={{ background: "linear-gradient(135deg, #a78bfa, #7c3aed)", border: "none", borderRadius: 12, padding: "14px 28px", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
              🔄 Tekrar Oyna
            </button>
            <button onClick={() => { setTema(null); setMod(null); }}
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "14px 28px", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
              🏠 Ana Menü
            </button>
          </div>
        </div>
      </div>
    );
  }

  const suankiSoru = sorular[suankiIndex];
  const ilerleme = (suankiIndex / sorular.length) * 100;

  return (
    <div style={{ background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)", fontFamily: "'Segoe UI', sans-serif", color: "#fff", padding: "20px 16px", borderRadius: 24 }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "#a78bfa", fontWeight: 600 }}>{KELIMELER[tema].ad}</div>
          <div style={{ display: "flex", gap: 4, fontSize: 20 }}>{[1, 2, 3].map((i) => canIkonu(i <= canlar))}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24" }}>{skor} puan</div>
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 99, marginBottom: 24, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${ilerleme}%`, background: "linear-gradient(90deg, #a78bfa, #7c3aed)", borderRadius: 99, transition: "width 0.3s" }} />
        </div>
        <div style={{ textAlign: "center", fontSize: 13, color: "#666", marginBottom: 20 }}>
          {suankiIndex + 1} / {sorular.length}
          {streak >= 3 && <span style={{ marginLeft: 12, color: "#fbbf24", fontWeight: 700 }}>🔥 {streak} seri!</span>}
        </div>
        <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 24, padding: "40px 24px", textAlign: "center", marginBottom: 24, minHeight: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: "#666", marginBottom: 12, textTransform: "uppercase", letterSpacing: 2 }}>{mod === "de_to_tr" ? "Almanca" : "Türkçe"}</div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>{suankiSoru.soru}</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {suankiSoru.secenekler.map((s, i) => {
            let bg = "rgba(255,255,255,0.07)";
            let border = "1px solid rgba(255,255,255,0.12)";
            if (secilenCevap) {
              if (s === suankiSoru.dogru) { bg = "rgba(52,211,153,0.2)"; border = "2px solid #34d399"; }
              else if (s === secilenCevap) { bg = "rgba(248,113,113,0.2)"; border = "2px solid #f87171"; }
            }
            return (
              <button key={i} onClick={() => cevapSec(s)}
                style={{ background: bg, border, borderRadius: 16, padding: "18px 14px", color: "#fff", cursor: secilenCevap ? "default" : "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.2s", lineHeight: 1.3 }}>
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
