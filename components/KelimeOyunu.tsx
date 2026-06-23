"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { a2Kelimeler } from "@/app/data/vocabulary/a2";
import { b1Kelimeler } from "@/app/data/vocabulary/b1";

type Kelime = { de: string; tr: string };
type TemaKey =
  | "tema1" | "tema2" | "tema3" | "tema4" | "tema5" | "tema6"
  | "tema7" | "tema8" | "tema9" | "tema10" | "tema11" | "tema12";
type Mod = "de_to_tr" | "tr_to_de";
type Soru = { soru: string; dogru: string; secenekler: string[] };
type KelimeTemaMap = Record<TemaKey, { ad: string; kelimeler: Kelime[] }>;
type Ekran = "menu" | "mod" | "oyun" | "sonuc" | "seviye_tamamlandi" | "genel_sinav" | "genel_sinav_sonuc";

const KELIMELER = {
  tema1: { ad: "Kendini Tanıtma", kelimeler: [
    {de:"der Name",tr:"isim, ad"},{de:"der Vorname",tr:"ön ad"},{de:"der Familienname",tr:"soyadı"},
    {de:"die Adresse",tr:"adres"},{de:"das Alter",tr:"yaş"},{de:"der Geburtsort",tr:"doğum yeri"},
    {de:"das Geburtsjahr",tr:"doğum yılı"},{de:"der Familienstand",tr:"medeni durum"},
    {de:"ledig",tr:"bekar"},{de:"verheiratet",tr:"evli"},{de:"die Sprache",tr:"dil"},
    {de:"sprechen",tr:"konuşmak"},{de:"heißen",tr:"adı olmak"},{de:"wohnen",tr:"yaşamak"},
    {de:"hallo",tr:"merhaba"},{de:"Auf Wiedersehen",tr:"hoşça kalın"},{de:"tschüss",tr:"görüşürüz"},
    {de:"Guten Morgen",tr:"günaydın"},{de:"Guten Tag",tr:"iyi günler"},{de:"Guten Abend",tr:"iyi akşamlar"},
    {de:"bitte",tr:"lütfen / rica ederim"},{de:"danke",tr:"teşekkürler"},{de:"ja",tr:"evet"},
    {de:"nein",tr:"hayır"},{de:"vorstellen",tr:"tanıtmak"},{de:"buchstabieren",tr:"harflerle söylemek"},
    {de:"die Nationalität",tr:"milliyet"},{de:"kommen aus",tr:"...den gelmek"},
    {de:"ich",tr:"ben"},{de:"Sie",tr:"siz (resmi)"},{de:"er",tr:"o (erkek)"},
    {de:"sie",tr:"o (kadın) / onlar"},{de:"wir",tr:"biz"},{de:"geboren",tr:"doğmuş"},
    {de:"die Herkunft",tr:"köken, nereli olma"},{de:"international",tr:"uluslararası"},
    {de:"fremd",tr:"yabancı"},{de:"die Heimat",tr:"memleket, yurt"},
    {de:"kennen",tr:"tanımak"},{de:"kennenlernen",tr:"tanışmak"},
    {de:"Wie bitte?",tr:"Efendim? / Tekrar eder misiniz?"},
    {de:"Herzlich willkommen",tr:"Hoş geldiniz"},{de:"Freut mich",tr:"Memnun oldum"},
    {de:"der Ausweis",tr:"kimlik belgesi"},{de:"der Pass",tr:"pasaport"},
    {de:"die Unterschrift",tr:"imza"},{de:"unterschreiben",tr:"imzalamak"},
    {de:"das Formular",tr:"form, dilekçe"},{de:"ausfüllen",tr:"doldurmak"},
    {de:"die Postleitzahl",tr:"posta kodu"},{de:"männlich",tr:"erkek (cinsiyet)"},
    {de:"weiblich",tr:"kadın (cinsiyet)"}
  ] as Kelime[]},
  tema2: { ad: "Aile ve Arkadaşlar", kelimeler: [
    {de:"die Familie",tr:"aile"},{de:"die Mutter",tr:"anne"},{de:"der Vater",tr:"baba"},
    {de:"die Eltern",tr:"ebeveynler"},{de:"der Bruder",tr:"erkek kardeş"},{de:"die Schwester",tr:"kız kardeş"},
    {de:"die Geschwister",tr:"kardeşler"},{de:"der Sohn",tr:"oğul"},{de:"die Tochter",tr:"kız çocuk"},
    {de:"das Kind",tr:"çocuk"},{de:"die Großmutter",tr:"büyükanne"},{de:"der Großvater",tr:"büyükbaba"},
    {de:"die Großeltern",tr:"büyükanne ve büyükbaba"},{de:"die Oma",tr:"nine, büyükanne"},
    {de:"der Opa",tr:"dede, büyükbaba"},{de:"der Freund",tr:"erkek arkadaş / dost"},
    {de:"die Freundin",tr:"kız arkadaş / dost"},{de:"der Bekannte",tr:"tanıdık"},
    {de:"der Verwandte",tr:"akraba"},{de:"der Ehemann",tr:"eş (erkek)"},
    {de:"die Ehefrau",tr:"eş (kadın)"},{de:"heiraten",tr:"evlenmek"},
    {de:"die Hochzeit",tr:"düğün"},{de:"lieben",tr:"sevmek"},
    {de:"der Junge",tr:"erkek çocuk"},{de:"das Mädchen",tr:"kız çocuk"},
    {de:"das Baby",tr:"bebek"},{de:"zusammen",tr:"birlikte"},
    {de:"besuchen",tr:"ziyaret etmek"},{de:"der Partner",tr:"partner"},
    {de:"glücklich",tr:"mutlu"},{de:"sich kümmern",tr:"ilgilenmek"},
    {de:"gestorben",tr:"ölmüş, vefat etmiş"},{de:"tot",tr:"ölü, hayatta olmayan"},
    {de:"leben",tr:"yaşamak"},{de:"das Leben",tr:"hayat, yaşam"},
    {de:"beide",tr:"her ikisi de"},{de:"der Mensch",tr:"insan"},
    {de:"die Leute",tr:"insanlar, halk"},{de:"erzählen",tr:"anlatmak"},
    {de:"lachen",tr:"gülmek"},{de:"böse",tr:"kızgın, sinirli"},
    {de:"lieb",tr:"sevgili, tatlı"},{de:"nett",tr:"nazik, hoş"},
    {de:"groß",tr:"büyük, uzun boylu"},{de:"klein",tr:"küçük"},
    {de:"jung",tr:"genç"},{de:"alt",tr:"yaşlı, eski"},
    {de:"lustig",tr:"komik, eğlenceli"},{de:"bekannt",tr:"tanınmış, bilinen"}
  ] as Kelime[]},
  tema3: { ad: "Meslek", kelimeler: [
    {de:"der Beruf",tr:"meslek"},{de:"arbeiten",tr:"çalışmak"},{de:"die Arbeit",tr:"iş"},
    {de:"der Arbeitsplatz",tr:"işyeri"},{de:"die Firma",tr:"şirket"},{de:"der Chef",tr:"patron, şef"},
    {de:"der Kollege",tr:"iş arkadaşı"},{de:"der Lehrer",tr:"öğretmen"},{de:"der Arzt",tr:"doktor"},
    {de:"der Verkäufer",tr:"satıcı"},{de:"der Beamte",tr:"memur"},{de:"die Hausfrau",tr:"ev hanımı"},
    {de:"der Student",tr:"üniversite öğrencisi"},{de:"studieren",tr:"üniversitede okumak"},
    {de:"das Studium",tr:"üniversite eğitimi"},{de:"die Schule",tr:"okul"},
    {de:"der Schüler",tr:"okul öğrencisi"},{de:"verdienen",tr:"kazanmak"},
    {de:"arbeitslos",tr:"işsiz"},{de:"selbstständig",tr:"serbest meslek"},
    {de:"der Job",tr:"iş, görev"},{de:"das Praktikum",tr:"staj"},
    {de:"die Stelle",tr:"pozisyon, iş yeri"},{de:"die Polizei",tr:"polis"},
    {de:"der Doktor",tr:"doktor"},{de:"die Praxis",tr:"muayenehane"},
    {de:"werden",tr:"olmak (gelecekte)"},{de:"der Rentner",tr:"emekli"},
    {de:"suchen",tr:"aramak"},{de:"der Verein",tr:"dernek, kulüp"},
    {de:"der Fahrer",tr:"sürücü"},{de:"der Hausmann",tr:"ev erkeği"},
    {de:"die Ausbildung",tr:"mesleki eğitim"},{de:"der Kindergarten",tr:"anaokulu"},
    {de:"unterrichten",tr:"ders vermek"},{de:"lernen",tr:"öğrenmek"},
    {de:"der Unterricht",tr:"ders, öğretim"},{de:"die Klasse",tr:"sınıf"},
    {de:"der Kurs",tr:"kurs"},{de:"die Prüfung",tr:"sınav"},
    {de:"bestehen",tr:"geçmek (sınavı)"},{de:"die Aufgabe",tr:"görev, ödev"},
    {de:"die Hausaufgabe",tr:"ev ödevi"},{de:"der Bleistift",tr:"kurşun kalem"},
    {de:"der Kugelschreiber",tr:"tükenmez kalem"},{de:"das Papier",tr:"kağıt"},
    {de:"der Bogen",tr:"sayfa, form"},{de:"ankreuzen",tr:"işaretlemek"},
    {de:"ergänzen",tr:"tamamlamak"},{de:"zuordnen",tr:"eşleştirmek"},
    {de:"die Lösung",tr:"çözüm, cevap"},{de:"richtig",tr:"doğru"},{de:"falsch",tr:"yanlış"}
  ] as Kelime[]},
  tema4: { ad: "Günlük Hayat", kelimeler: [
    {de:"aufstehen",tr:"kalkmak"},{de:"frühstücken",tr:"kahvaltı etmek"},
    {de:"das Frühstück",tr:"kahvaltı"},{de:"schlafen",tr:"uyumak"},
    {de:"müde",tr:"yorgun, uykulu"},{de:"der Morgen",tr:"sabah"},
    {de:"der Vormittag",tr:"öğleden önce"},{de:"der Mittag",tr:"öğle"},
    {de:"der Nachmittag",tr:"öğleden sonra"},{de:"der Abend",tr:"akşam"},
    {de:"die Nacht",tr:"gece"},{de:"heute",tr:"bugün"},
    {de:"morgen",tr:"yarın"},{de:"gestern",tr:"dün"},
    {de:"immer",tr:"her zaman"},{de:"oft",tr:"sık sık"},
    {de:"manchmal",tr:"bazen"},{de:"nie",tr:"hiç, asla"},
    {de:"die Uhr",tr:"saat"},{de:"die Pause",tr:"mola"},
    {de:"machen",tr:"yapmak"},{de:"gehen",tr:"gitmek"},
    {de:"kommen",tr:"gelmek"},{de:"pünktlich",tr:"dakik, zamanında"},
    {de:"spät",tr:"geç"},{de:"früh",tr:"erken"},
    {de:"der Termin",tr:"randevu"},{de:"fertig",tr:"hazır, bitmiş"},
    {de:"der Alltag",tr:"günlük hayat"},{de:"waschen",tr:"yıkamak"},
    {de:"sich duschen",tr:"duş almak"},{de:"die Dusche",tr:"duş"},
    {de:"putzen",tr:"temizlemek"},{de:"kochen",tr:"yemek pişirmek"},
    {de:"einkaufen",tr:"alışveriş yapmak"},{de:"der Haushalt",tr:"ev işleri, hane"},
    {de:"die Waschmaschine",tr:"çamaşır makinesi"},{de:"anfangen",tr:"başlamak"},
    {de:"aufhören",tr:"bitmek, durmak"},{de:"warten",tr:"beklemek"},
    {de:"dauern",tr:"sürmek"},{de:"die Sekunde",tr:"saniye"},
    {de:"die Minute",tr:"dakika"},{de:"die Stunde",tr:"saat (süre)"},
    {de:"der Tag",tr:"gün"},{de:"die Woche",tr:"hafta"},
    {de:"das Jahr",tr:"yıl"},{de:"der Wochentag",tr:"hafta günü"},
    {de:"das Wochenende",tr:"hafta sonu"},{de:"der Feiertag",tr:"resmi tatil günü"},
    {de:"der Feierabend",tr:"mesai sonu"},{de:"die Routine",tr:"rutin"}
  ] as Kelime[]},
  tema5: { ad: "Yemek ve İçecek", kelimeler: [
    {de:"essen",tr:"yemek"},{de:"trinken",tr:"içmek"},{de:"das Essen",tr:"yemek"},
    {de:"das Getränk",tr:"içecek"},{de:"das Wasser",tr:"su"},{de:"der Kaffee",tr:"kahve"},
    {de:"der Tee",tr:"çay"},{de:"das Bier",tr:"bira"},{de:"der Wein",tr:"şarap"},
    {de:"der Saft",tr:"meyve suyu"},{de:"die Milch",tr:"süt"},{de:"das Brot",tr:"ekmek"},
    {de:"das Brötchen",tr:"küçük ekmek"},{de:"die Butter",tr:"tereyağı"},
    {de:"der Käse",tr:"peynir"},{de:"der Schinken",tr:"jambon"},
    {de:"das Ei",tr:"yumurta"},{de:"das Fleisch",tr:"et"},{de:"der Fisch",tr:"balık"},
    {de:"das Gemüse",tr:"sebze"},{de:"das Obst",tr:"meyve"},
    {de:"der Apfel",tr:"elma"},{de:"die Birne",tr:"armut"},
    {de:"die Banane",tr:"muz"},{de:"die Tomate",tr:"domates"},
    {de:"die Kartoffel",tr:"patates"},{de:"der Reis",tr:"pirinç"},
    {de:"der Salat",tr:"salata"},{de:"das Hähnchen",tr:"tavuk"},
    {de:"die Pommes frites",tr:"patates kızartması"},
    {de:"schmecken",tr:"lezzetli olmak, tatmak"},{de:"Guten Appetit",tr:"Afiyet olsun"},
    {de:"das Restaurant",tr:"restoran"},{de:"das Café",tr:"kafe"},
    {de:"die Speisekarte",tr:"menü, yemek listesi"},{de:"bestellen",tr:"sipariş vermek"},
    {de:"bezahlen",tr:"ödemek"},{de:"die Rechnung",tr:"hesap, fatura"},
    {de:"bitter",tr:"acı"},{de:"süß",tr:"tatlı"},{de:"salzig",tr:"tuzlu"},
    {de:"der Hunger",tr:"açlık"},{de:"der Durst",tr:"susuzluk"},
    {de:"das Mittagessen",tr:"öğle yemeği"},{de:"das Abendessen",tr:"akşam yemeği"},
    {de:"die Mahlzeit",tr:"öğün, yemek vakti"},{de:"grillen",tr:"mangal yapmak"},
    {de:"das Öl",tr:"yağ"},{de:"das Salz",tr:"tuz"},
    {de:"das Glas",tr:"bardak"},{de:"die Flasche",tr:"şişe"}
  ] as Kelime[]},
  tema6: { ad: "Alışveriş", kelimeler: [
    {de:"kaufen",tr:"satın almak"},{de:"verkaufen",tr:"satmak"},
    {de:"das Geschäft",tr:"dükkan, mağaza"},{de:"der Laden",tr:"dükkan"},
    {de:"der Supermarkt",tr:"süpermarket"},{de:"der Preis",tr:"fiyat"},
    {de:"kosten",tr:"mal olmak, fiyatı olmak"},{de:"teuer",tr:"pahalı"},
    {de:"billig",tr:"ucuz"},{de:"günstig",tr:"uygun fiyatlı"},
    {de:"bezahlen",tr:"ödemek"},{de:"die Kasse",tr:"kasa"},
    {de:"das Geld",tr:"para"},{de:"bar",tr:"nakit"},
    {de:"die Karte",tr:"kart"},{de:"das Angebot",tr:"teklif, indirim"},
    {de:"die Kleidung",tr:"kıyafet"},{de:"die Jacke",tr:"ceket, mont"},
    {de:"der Schuh",tr:"ayakkabı"},{de:"die Größe",tr:"beden, boyut"},
    {de:"die Bäckerei",tr:"fırın"},{de:"der Kiosk",tr:"büfe"},
    {de:"der Kunde",tr:"müşteri"},{de:"der Euro",tr:"euro"},
    {de:"der Cent",tr:"sent"},{de:"das Pfund",tr:"yarım kilo"},
    {de:"das Kilo",tr:"kilo"},{de:"das Gramm",tr:"gram"},
    {de:"der Liter",tr:"litre"},{de:"der Meter",tr:"metre"},
    {de:"die Lebensmittel",tr:"gıda maddeleri"},{de:"der Markt",tr:"pazar, market"},
    {de:"anziehen",tr:"giymek"},{de:"ausziehen",tr:"çıkarmak (kıyafet)"},
    {de:"passen",tr:"uymak, yakışmak"},{de:"die Farbe",tr:"renk"},
    {de:"schwarz",tr:"siyah"},{de:"weiß",tr:"beyaz"},{de:"rot",tr:"kırmızı"},
    {de:"blau",tr:"mavi"},{de:"grün",tr:"yeşil"},{de:"gelb",tr:"sarı"},
    {de:"grau",tr:"gri"},{de:"braun",tr:"kahverengi"},
    {de:"die Bank",tr:"banka"},{de:"überweisen",tr:"havale etmek"},
    {de:"das Konto",tr:"banka hesabı"},{de:"das Prozent",tr:"yüzde"},
    {de:"wechseln",tr:"değiştirmek, bozmak"},{de:"der Prospekt",tr:"broşür, katalog"}
  ] as Kelime[]},
  tema7: { ad: "Ev ve Yaşam", kelimeler: [
    {de:"die Wohnung",tr:"daire, ev"},{de:"das Haus",tr:"ev, bina"},
    {de:"das Zimmer",tr:"oda"},{de:"die Küche",tr:"mutfak"},
    {de:"das Bad",tr:"banyo"},{de:"die Toilette",tr:"tuvalet"},
    {de:"der Balkon",tr:"balkon"},{de:"der Garten",tr:"bahçe"},
    {de:"die Miete",tr:"kira"},{de:"der Vermieter",tr:"ev sahibi"},
    {de:"mieten",tr:"kiralamak"},{de:"vermieten",tr:"kiraya vermek"},
    {de:"umziehen",tr:"taşınmak"},{de:"der Schrank",tr:"dolap"},
    {de:"das Sofa",tr:"kanepe"},{de:"der Tisch",tr:"masa"},
    {de:"das Bett",tr:"yatak"},{de:"die Möbel",tr:"mobilya"},
    {de:"der Kühlschrank",tr:"buzdolabı"},{de:"der Herd",tr:"ocak"},
    {de:"der Aufzug",tr:"asansör"},{de:"der Stock",tr:"kat"},
    {de:"oben",tr:"yukarıda"},{de:"unten",tr:"aşağıda"},
    {de:"die Treppe",tr:"merdiven"},{de:"das Licht",tr:"ışık"},
    {de:"der Schlüssel",tr:"anahtar"},{de:"die Hausnummer",tr:"kapı numarası"},
    {de:"der Eingang",tr:"giriş"},{de:"der Ausgang",tr:"çıkış"},
    {de:"ruhig",tr:"sessiz, sakin"},{de:"laut",tr:"gürültülü"},
    {de:"hell",tr:"aydınlık"},{de:"das Fenster",tr:"pencere"},
    {de:"die Tür",tr:"kapı"},{de:"öffnen",tr:"açmak"},
    {de:"schließen",tr:"kapatmak"},{de:"an sein",tr:"açık olmak (ışık)"},
    {de:"aus sein",tr:"kapalı olmak"},{de:"auf sein",tr:"açık olmak (kapı)"},
    {de:"zu sein",tr:"kapalı olmak (kapı)"},{de:"der Computer",tr:"bilgisayar"},
    {de:"anmachen",tr:"açmak (cihaz)"},{de:"ausmachen",tr:"kapatmak (cihaz)"},
    {de:"das Apartment",tr:"daire"},{de:"die Straße",tr:"sokak, cadde"},
    {de:"die Stadt",tr:"şehir"},{de:"das Dorf",tr:"köy"},
    {de:"die Adresse",tr:"adres"},{de:"die Postleitzahl",tr:"posta kodu"}
  ] as Kelime[]},
  tema8: { ad: "Boş Zaman", kelimeler: [
    {de:"die Freizeit",tr:"boş vakit"},{de:"das Hobby",tr:"hobi"},
    {de:"der Sport",tr:"spor"},{de:"spielen",tr:"oynamak"},
    {de:"schwimmen",tr:"yüzmek"},{de:"das Schwimmbad",tr:"yüzme havuzu"},
    {de:"wandern",tr:"yürüyüş yapmak"},{de:"Rad fahren",tr:"bisiklet sürmek"},
    {de:"der Fußball",tr:"futbol"},{de:"tanzen",tr:"dans etmek"},
    {de:"die Musik",tr:"müzik"},{de:"das Lied",tr:"şarkı"},
    {de:"das Kino",tr:"sinema"},{de:"der Film",tr:"film"},
    {de:"fernsehen",tr:"televizyon izlemek"},{de:"das Internet",tr:"internet"},
    {de:"lesen",tr:"okumak"},{de:"die Zeitung",tr:"gazete"},
    {de:"das Buch",tr:"kitap"},{de:"die Party",tr:"parti"},
    {de:"feiern",tr:"kutlamak"},{de:"grillen",tr:"mangal yapmak"},
    {de:"der Ausflug",tr:"gezi, piknik"},{de:"die Disco",tr:"disko"},
    {de:"der See",tr:"göl"},{de:"das Meer",tr:"deniz"},
    {de:"reisen",tr:"seyahat etmek"},{de:"der Urlaub",tr:"tatil"},
    {de:"interessant",tr:"ilginç"},{de:"kulturell",tr:"kültürel"},
    {de:"das Museum",tr:"müze"},{de:"besichtigen",tr:"gezmek, ziyaret etmek"},
    {de:"die Führung",tr:"rehberli tur"},{de:"die Sehenswürdigkeit",tr:"turistik yer"},
    {de:"das Foto",tr:"fotoğraf"},{de:"der Gast",tr:"misafir"},
    {de:"einladen",tr:"davet etmek"},{de:"die Einladung",tr:"davet"},
    {de:"sich treffen",tr:"buluşmak"},{de:"das Konzert",tr:"konser"},
    {de:"das Theater",tr:"tiyatro"},{de:"der Eintritt",tr:"giriş ücreti"},
    {de:"gefallen",tr:"beğenmek, hoşuna gitmek"},{de:"mögen",tr:"sevmek, hoşlanmak"},
    {de:"gern",tr:"memnuniyetle, severek"},{de:"das Interesse",tr:"ilgi, merak"},
    {de:"Spaß machen",tr:"eğlenceli olmak"},{de:"die Veranstaltung",tr:"etkinlik"},
    {de:"die Karte",tr:"bilet"},{de:"fotografieren",tr:"fotoğraf çekmek"}
  ] as Kelime[]},
  tema9: { ad: "Ulaşım ve Yol Tarifi", kelimeler: [
    {de:"fahren",tr:"gitmek (araçla)"},{de:"das Auto",tr:"araba"},
    {de:"der Bus",tr:"otobüs"},{de:"der Zug",tr:"tren"},
    {de:"die Bahn",tr:"demiryolu, tren"},{de:"die S-Bahn",tr:"banliyö treni"},
    {de:"die Straßenbahn",tr:"tramvay"},{de:"das Taxi",tr:"taksi"},
    {de:"das Flugzeug",tr:"uçak"},{de:"der Flughafen",tr:"havalimanı"},
    {de:"der Bahnhof",tr:"tren istasyonu"},{de:"der Bahnsteig",tr:"peron"},
    {de:"die Haltestelle",tr:"durak"},{de:"die Fahrkarte",tr:"bilet"},
    {de:"das Ticket",tr:"bilet"},{de:"links",tr:"sol, sola"},
    {de:"rechts",tr:"sağ, sağa"},{de:"geradeaus",tr:"düz, doğru"},
    {de:"die Straße",tr:"sokak, yol"},{de:"die Ecke",tr:"köşe"},
    {de:"der Platz",tr:"meydan, alan"},{de:"weit",tr:"uzak"},
    {de:"nah",tr:"yakın"},{de:"die Autobahn",tr:"otoyol"},
    {de:"der Stadtplan",tr:"şehir haritası"},{de:"aussteigen",tr:"inmek (araçtan)"},
    {de:"einsteigen",tr:"binmek (araca)"},{de:"abfahren",tr:"hareket etmek, kalkmak"},
    {de:"ankommen",tr:"varmak, ulaşmak"},{de:"die Abfahrt",tr:"kalkış"},
    {de:"die Ankunft",tr:"varış"},{de:"der Weg",tr:"yol, rota"},
    {de:"die Richtung",tr:"yön"},{de:"der Norden",tr:"kuzey"},
    {de:"der Süden",tr:"güney"},{de:"der Westen",tr:"batı"},
    {de:"der Osten",tr:"doğu"},{de:"das Fahrrad",tr:"bisiklet"},
    {de:"der Anschluss",tr:"aktarma (ulaşım)"},{de:"das Gleis",tr:"ray, peron numarası"},
    {de:"halten",tr:"durmak"},{de:"umsteigen",tr:"aktarma yapmak"},
    {de:"die Durchsage",tr:"anons"},{de:"der Automat",tr:"otomat"},
    {de:"der Schalter",tr:"gişe"},{de:"die Auskunft",tr:"bilgi, danışma"},
    {de:"zeigen",tr:"göstermek"},{de:"der Kilometer",tr:"kilometre"},
    {de:"circa",tr:"yaklaşık"},{de:"der Lkw",tr:"kamyon"},
    {de:"der Plan",tr:"plan, harita"},{de:"fragen",tr:"sormak"}
  ] as Kelime[]},
  tema10: { ad: "Sağlık", kelimeler: [
    {de:"der Arzt",tr:"doktor"},{de:"krank",tr:"hasta"},
    {de:"das Fieber",tr:"ateş"},{de:"weh tun",tr:"ağrımak, acımak"},
    {de:"der Kopf",tr:"baş"},{de:"der Bauch",tr:"karın"},
    {de:"der Arm",tr:"kol"},{de:"das Bein",tr:"bacak"},
    {de:"der Fuß",tr:"ayak"},{de:"die Hand",tr:"el"},
    {de:"das Auge",tr:"göz"},{de:"der Mund",tr:"ağız"},
    {de:"das Haar",tr:"saç"},{de:"die Apotheke",tr:"eczane"},
    {de:"das Medikament",tr:"ilaç"},{de:"helfen",tr:"yardım etmek"},
    {de:"besser",tr:"daha iyi"},{de:"schlecht",tr:"kötü"},
    {de:"gesund",tr:"sağlıklı"},{de:"die Praxis",tr:"muayenehane"},
    {de:"der Termin",tr:"randevu"},{de:"der Schmerz",tr:"ağrı"},
    {de:"sich waschen",tr:"yıkanmak"},{de:"die Krankheit",tr:"hastalık"},
    {de:"Was fehlt Ihnen?",tr:"Şikayetiniz nedir?"},
    {de:"Mir ist schlecht",tr:"Kendimi kötü hissediyorum"},
    {de:"der Rücken",tr:"sırt"},{de:"das Ohr",tr:"kulak"},
    {de:"die Nase",tr:"burun"},{de:"der Hals",tr:"boğaz, boyun"},
    {de:"die Zähne",tr:"dişler"},{de:"das Herz",tr:"kalp"},
    {de:"Achtung",tr:"Dikkat!"},{de:"die Hilfe",tr:"yardım"},
    {de:"Hilfe!",tr:"İmdat!"},{de:"der Notfall",tr:"acil durum"},
    {de:"holen",tr:"getirmek, almak"},{de:"bringen",tr:"getirmek"},
    {de:"der Körper",tr:"vücut"},{de:"sich fühlen",tr:"hissetmek"},
    {de:"sich erholen",tr:"dinlenmek, iyileşmek"},{de:"die Tablette",tr:"tablet (ilaç)"},
    {de:"das Rezept",tr:"reçete"},{de:"müde",tr:"yorgun"},
    {de:"der Hunger",tr:"açlık"},{de:"der Durst",tr:"susuzluk"},
    {de:"sich duschen",tr:"duş almak"},{de:"schlafen",tr:"uyumak"},
    {de:"die Vorsicht",tr:"dikkat, ihtiyat"},{de:"die Polizei",tr:"polis"}
  ] as Kelime[]},
  tema11: { ad: "Tatil ve Seyahat", kelimeler: [
    {de:"der Urlaub",tr:"tatil"},{de:"reisen",tr:"seyahat etmek"},
    {de:"die Reise",tr:"yolculuk, seyahat"},{de:"das Hotel",tr:"otel"},
    {de:"das Einzelzimmer",tr:"tek kişilik oda"},{de:"das Doppelzimmer",tr:"çift kişilik oda"},
    {de:"die Rezeption",tr:"resepsiyon"},{de:"übernachten",tr:"gecelemek"},
    {de:"die Übernachtung",tr:"geceleme"},{de:"das Gepäck",tr:"bagaj"},
    {de:"der Koffer",tr:"valiz"},{de:"der Pass",tr:"pasaport"},
    {de:"das Meer",tr:"deniz"},{de:"der Strand",tr:"sahil, plaj"},
    {de:"das Land",tr:"ülke, kırsal"},{de:"die Stadt",tr:"şehir"},
    {de:"das Dorf",tr:"köy"},{de:"die Sehenswürdigkeit",tr:"turistik yer"},
    {de:"besichtigen",tr:"gezmek, ziyaret etmek"},{de:"der Ausflug",tr:"gezi"},
    {de:"das Wetter",tr:"hava durumu"},{de:"die Sonne",tr:"güneş"},
    {de:"der Regen",tr:"yağmur"},{de:"regnen",tr:"yağmur yağmak"},
    {de:"scheinen",tr:"parlamak (güneş)"},{de:"warm",tr:"sıcak"},
    {de:"kalt",tr:"soğuk"},{de:"der Wind",tr:"rüzgar"},
    {de:"das Reisebüro",tr:"seyahat acentesi"},{de:"fliegen",tr:"uçmak"},
    {de:"der Abflug",tr:"uçuş kalkışı"},{de:"die Halbpension",tr:"yarım pansiyon"},
    {de:"die Vollpension",tr:"tam pansiyon"},{de:"ankommen",tr:"varmak"},
    {de:"der Zoll",tr:"gümrük"},{de:"die Unterkunft",tr:"konaklama"},
    {de:"der Aufenthalt",tr:"konaklama süresi"},{de:"buchen",tr:"rezervasyon yapmak"},
    {de:"der Reiseführer",tr:"rehber"},{de:"die Landkarte",tr:"harita"},
    {de:"das Ausland",tr:"yurt dışı"},{de:"der Ausländer",tr:"yabancı uyruklu"},
    {de:"ausländisch",tr:"yabancı"},{de:"Europa",tr:"Avrupa"},
    {de:"Deutschland",tr:"Almanya"},{de:"die Türkei",tr:"Türkiye"},
    {de:"der Schlüssel",tr:"anahtar"},{de:"das Zimmer",tr:"oda"},
    {de:"das Frühstück",tr:"kahvaltı"},{de:"der Prospekt",tr:"broşür"}
  ] as Kelime[]},
  tema12: { ad: "Schreiben ve İletişim", kelimeler: [
    {de:"schreiben",tr:"yazmak"},{de:"der Brief",tr:"mektup"},
    {de:"die E-Mail",tr:"e-posta"},{de:"das Formular",tr:"form"},
    {de:"ausfüllen",tr:"doldurmak"},{de:"unterschreiben",tr:"imzalamak"},
    {de:"die Unterschrift",tr:"imza"},{de:"der Absender",tr:"gönderen"},
    {de:"der Empfänger",tr:"alıcı"},{de:"die Anrede",tr:"hitap (mektupta)"},
    {de:"der Gruß",tr:"selam, selamlama"},{de:"die Briefmarke",tr:"posta pulu"},
    {de:"die Post",tr:"posta, postane"},{de:"das Fax",tr:"faks"},
    {de:"schicken",tr:"göndermek"},{de:"antworten",tr:"cevap vermek"},
    {de:"die Antwort",tr:"cevap, yanıt"},{de:"der Satz",tr:"cümle"},
    {de:"das Wort",tr:"kelime"},{de:"der Text",tr:"metin"},
    {de:"lesen",tr:"okumak"},{de:"verstehen",tr:"anlamak"},
    {de:"wiederholen",tr:"tekrarlamak"},{de:"erklären",tr:"açıklamak"},
    {de:"die Aufgabe",tr:"görev, ödev"},{de:"ergänzen",tr:"tamamlamak"},
    {de:"das Telefon",tr:"telefon"},{de:"telefonieren",tr:"telefon etmek"},
    {de:"anrufen",tr:"aramak (telefon)"},{de:"der Anruf",tr:"telefon araması"},
    {de:"der Anrufbeantworter",tr:"telesekreter"},{de:"das Handy",tr:"cep telefonu"},
    {de:"die Nummer",tr:"numara"},{de:"die Vorwahl",tr:"alan kodu"},
    {de:"besetzt",tr:"meşgul (telefon)"},{de:"die Ansage",tr:"mesaj, anons"},
    {de:"hören",tr:"duymak, dinlemek"},{de:"das Gespräch",tr:"konuşma, görüşme"},
    {de:"auf Wiederhören",tr:"telefonda hoşça kalın"},{de:"der Computer",tr:"bilgisayar"},
    {de:"anklicken",tr:"tıklamak"},{de:"drucken",tr:"yazdırmak"},
    {de:"der Drucker",tr:"yazıcı"},{de:"das Internet",tr:"internet"},
    {de:"die CD",tr:"CD"},{de:"automatisch",tr:"otomatik"},
    {de:"die Aussage",tr:"ifade, beyan"},{de:"die Anzeige",tr:"ilan, duyuru"},
    {de:"der Buchstabe",tr:"harf"},{de:"die Durchsage",tr:"anons, ilan"}
  ] as Kelime[]},
};

const KELIMELER_BY_LEVEL: Record<string, typeof KELIMELER> = {
  A1: KELIMELER,
  A2: a2Kelimeler as unknown as typeof KELIMELER,
  B1: b1Kelimeler as unknown as typeof KELIMELER,
};

const ROZETLER = [
  { min: 0,   max: 49,  icon: "🌱", ad: "Kelime Yolcusu" },
  { min: 50,  max: 149, icon: "🔥", ad: "Kelime Avcısı" },
  { min: 150, max: 299, icon: "🏅", ad: "Kelime Ustası" },
  { min: 300, max: 449, icon: "👑", ad: "TELC Kelime Kralı" },
  { min: 450, max: 9999,icon: "🏆", ad: "Goethe Şampiyonu" },
];

function getRozet(toplam: number) {
  return ROZETLER.find(r => toplam >= r.min && toplam <= r.max) || ROZETLER[0];
}
function getSonrakiRozet(toplam: number) {
  return ROZETLER.find(r => r.min > toplam) || null;
}
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
function getWrongOptions(correct: string, pool: Kelime[], count = 3): string[] {
  const others = pool.filter((k) => k.tr !== correct).map((k) => k.tr);
  return shuffle(others).slice(0, count);
}
function playSound(dogru: boolean) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    if (dogru) {
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.setValueAtTime(780, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.4);
    } else {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.35);
    }
  } catch {}
}

type Props = {
  effectivePackageType?: string;
  hasAnyLiveCourseOrder?: boolean;
  currentUserEmail?: string;
  currentUserName?: string;
  activeAccessLevels?: string[];
  onUpsell?: () => void;
  onB1Live?: () => void;
};

export default function KelimeOyunu({ effectivePackageType, hasAnyLiveCourseOrder, currentUserEmail, currentUserName, activeAccessLevels = [], onUpsell, onB1Live }: Props) {
  const [ekran, setEkran] = useState<Ekran>("menu");
  const [tema, setTema] = useState<TemaKey | null>(null);
  const [mod, setMod] = useState<Mod>("de_to_tr");
  const [sorular, setSorular] = useState<Soru[]>([]);
  const [suankiIndex, setSuankiIndex] = useState(0);
  const [canlar, setCanlar] = useState(3);
  const [skor, setSkor] = useState(0);
  const [secilenCevap, setSecilenCevap] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [dogru, setDogru] = useState(0);
  const [yanlis, setYanlis] = useState(0);
  const [yanlisKelimeler, setYanlisKelimeler] = useState<{soru: string, dogru: string, verilen: string}[]>([]);
  const [yanlisGoster, setYanlisGoster] = useState(false);
  const [selectedWordLevel, setSelectedWordLevel] = useState<"A1" | "A2" | "B1">("A1");
  const [completedWordThemes, setCompletedWordThemes] = useState<number[]>([]);
  const [toplamDogru, setToplamDogru] = useState(0);
  const [yukluyor, setYukluyor] = useState(true);
  const [liderler, setLiderler] = useState<{display_name: string, toplam_dogru: number, streak_count: number, rozet_adi: string, rozet_icon: string, ogrenci_turu: string}[]>([]);
  const [temaLearnedWords, setTemaLearnedWords] = useState<Record<string, string[]>>({});
  const [a1TamamlananTema, setA1TamamlananTema] = useState<number[]>([]);
  const [a2TamamlananTema, setA2TamamlananTema] = useState<number[]>([]);
  const [uyariMesaji, setUyariMesaji] = useState<string | null>(null);
  const [genelSinavHak, setGenelSinavHak] = useState(2);
  const [genelSinavYanlis, setGenelSinavYanlis] = useState(0);

  const temaLearnedRef = useRef<Record<string, string[]>>({});

  useEffect(() => {
    if (!currentUserEmail) { setYukluyor(false); return; }
    async function loadProgress() {
      const { data } = await supabase
        .from("word_progress")
        .select("tema_key, tamamlandi, dogru_sayisi, learned_words")
        .eq("user_email", currentUserEmail)
        .eq("level", selectedWordLevel);

      const { data: a1Data } = await supabase
        .from("word_progress")
        .select("tema_key, tamamlandi")
        .eq("user_email", currentUserEmail)
        .eq("level", "A1");
      if (a1Data) {
        const a1Bitti = a1Data.filter(d => d.tamamlandi).map(d => Number(String(d.tema_key).replace("tema", "")));
        setA1TamamlananTema(a1Bitti);
      }
      const { data: a2Data } = await supabase
  .from("word_progress")
  .select("tema_key, tamamlandi")
  .eq("user_email", currentUserEmail)
  .eq("level", "A2");
if (a2Data) {
  const a2Bitti = a2Data.filter(d => d.tamamlandi).map(d => Number(String(d.tema_key).replace("tema", "")));
  setA2TamamlananTema(a2Bitti);
}

      if (data) {
        const tamamlananlar = data.filter(d => d.tamamlandi).map(d => Number(String(d.tema_key).replace("tema", "")));
        setCompletedWordThemes(tamamlananlar);
        const toplam = data.reduce((acc, d) => acc + (d.dogru_sayisi || 0), 0);
        setToplamDogru(toplam);
        const learnedMap: Record<string, string[]> = {};
        data.forEach(d => { learnedMap[d.tema_key] = d.learned_words || []; });
        setTemaLearnedWords(learnedMap);
        temaLearnedRef.current = learnedMap;
      }
      setYukluyor(false);
    }
    loadProgress();
    }, [currentUserEmail, selectedWordLevel]);
  useEffect(() => {
    async function loadLiderler() {
      const { data } = await supabase
        .from("word_leaderboard")
        .select("display_name, toplam_dogru, streak_count, rozet_adi, rozet_icon, ogrenci_turu, level")
        .eq("level", selectedWordLevel)
        .order("toplam_dogru", { ascending: false })
        .limit(8);
      if (data) setLiderler(data);
    }
    loadLiderler();
  }, [selectedWordLevel]);

  const aktifKelimeListesi = KELIMELER_BY_LEVEL[selectedWordLevel] || KELIMELER;

  const tumTemalarTamamlandi = completedWordThemes.length >= 12;

  // Tüm seviyenin kelimelerini döndür (genel sınav için)
  const tumKelimeler = (): Kelime[] => {
    return Object.values(aktifKelimeListesi).flatMap(t => t.kelimeler);
  };

  const oyunuBaslat = useCallback((secilenTema: TemaKey, secilenMod: Mod) => {
    const kelimeHavuzu = aktifKelimeListesi[secilenTema].kelimeler;
    const ogrenilmisler = temaLearnedRef.current[secilenTema] || [];
    const ogrenilmemisler = kelimeHavuzu.filter(k => !ogrenilmisler.includes(k.de));
    const havuz = ogrenilmemisler.length >= 3 ? ogrenilmemisler : kelimeHavuzu;
    const secilen: Kelime[] = shuffle(havuz).slice(0, 15);

    const hazirSorular: Soru[] = secilen.map((k) => {
      const dogruCevap = secilenMod === "de_to_tr" ? k.tr : k.de;
      const soru = secilenMod === "de_to_tr" ? k.de : k.tr;
      const yanlislar = secilenMod === "de_to_tr"
        ? getWrongOptions(k.tr, kelimeHavuzu)
        : shuffle(kelimeHavuzu.filter(x => x.de !== k.de)).slice(0, 3).map(x => x.de);
      return { soru, dogru: dogruCevap, secenekler: shuffle([dogruCevap, ...yanlislar]) };
    });

    setSorular(hazirSorular);
    setSuankiIndex(0); setCanlar(3); setSkor(0);
    setSecilenCevap(null); setStreak(0); setDogru(0); setYanlis(0);
    setYanlisKelimeler([]); setYanlisGoster(false);
    setTema(secilenTema); setMod(secilenMod);
    setEkran("oyun");
  }, [aktifKelimeListesi]);

  const genelSinavBaslat = () => {
    const tumK = tumKelimeler();
    const secilen = shuffle(tumK).slice(0, 30);
    const hazirSorular: Soru[] = secilen.map((k) => {
      const dogruCevap = k.tr;
      const yanlislar = getWrongOptions(k.tr, tumK);
      return { soru: k.de, dogru: dogruCevap, secenekler: shuffle([dogruCevap, ...yanlislar]) };
    });
    setSorular(hazirSorular);
    setSuankiIndex(0); setCanlar(999); setSkor(0);
    setSecilenCevap(null); setStreak(0); setDogru(0); setYanlis(0);
    setYanlisKelimeler([]); setYanlisGoster(false);
    setEkran("genel_sinav");
  };

  const seviyeSifirla = async () => {
    if (!currentUserEmail) return;
    await supabase.from("word_progress")
      .delete()
      .eq("user_email", currentUserEmail)
      .eq("level", selectedWordLevel);
    setCompletedWordThemes([]);
    setTemaLearnedWords({});
    temaLearnedRef.current = {};
    setToplamDogru(0);
    setGenelSinavHak(2);
    setEkran("menu");
  };

  const cevapSec = (cevap: string) => {
    if (secilenCevap) return;
    setSecilenCevap(cevap);
    const mevcutSoru = sorular[suankiIndex];
    const dogruMu = cevap === mevcutSoru.dogru;
    playSound(dogruMu);

    if (dogruMu) {
      setSkor(s => s + 10); setStreak(s => s + 1); setDogru(d => d + 1);
      // Normal oyunda öğrenilen kelimeyi kaydet
      if (ekran === "oyun" && tema) {
        const ogrenilen = mod === "de_to_tr" ? mevcutSoru.soru : mevcutSoru.dogru;
        setTemaLearnedWords(prev => {
          const mevcut = prev[tema] || [];
          if (mevcut.includes(ogrenilen)) return prev;
          const yeni = { ...prev, [tema]: [...mevcut, ogrenilen] };
          temaLearnedRef.current = yeni;
          return yeni;
        });
      }
    } else {
      setStreak(0); setYanlis(y => y + 1);
      setYanlisKelimeler(prev => [...prev, { soru: mevcutSoru.soru, dogru: mevcutSoru.dogru, verilen: cevap }]);
      // Normal oyunda can azalt
      if (ekran === "oyun") {
        setCanlar(c => {
          if (c - 1 <= 0) { setTimeout(() => bitir(), 900); return 0; }
          return c - 1;
        });
        setTimeout(() => sonrakiSoru(), 900);
        return;
      }
    }
    setTimeout(() => sonrakiSoru(), 900);
  };

  const sonrakiSoru = () => {
    setSecilenCevap(null);
    if (suankiIndex + 1 >= sorular.length) bitir();
    else setSuankiIndex(i => i + 1);
  };

  const bitir = () => {
    if (ekran === "oyun") {
      kaydetIlerleme();
      setEkran("sonuc");
    } else if (ekran === "genel_sinav") {
      setGenelSinavYanlis(yanlis);
      kaydetGenelSinav();
      setEkran("genel_sinav_sonuc");
    }
  };

  const kaydetIlerleme = async () => {
    if (!currentUserEmail || !tema) return;
    const kelimeHavuzu = aktifKelimeListesi[tema].kelimeler;
    const mevcutLearned = temaLearnedRef.current[tema] || [];
    console.log("DEBUG:", { tema, mevcutLearnedCount: mevcutLearned.length, kelimeHavuzuCount: kelimeHavuzu.length, esik: Math.ceil(kelimeHavuzu.length * 0.9), tamamlandi: mevcutLearned.length >= Math.ceil(kelimeHavuzu.length * 0.9) });
    const tamamlandi = mevcutLearned.length >= Math.ceil(kelimeHavuzu.length * 0.9);
const bugun = new Date().toISOString().split("T")[0];

    await supabase.from("word_progress").upsert({
      user_email: currentUserEmail,
      level: selectedWordLevel,
      tema_key: tema,
      dogru_sayisi: mevcutLearned.length,
      toplam_soru: kelimeHavuzu.length,
      tamamlandi,
      learned_words: mevcutLearned,
      last_played_date: bugun,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_email,level,tema_key" });

    if (tamamlandi) {
      const temaNo = Number(String(tema).replace("tema", ""));
      setCompletedWordThemes(prev => prev.includes(temaNo) ? prev : [...prev, temaNo]);
    }

    const yeniGenelToplam = toplamDogru + dogru;
    setToplamDogru(yeniGenelToplam);
    const rozet = getRozet(yeniGenelToplam);
    const ogrenciTuru = hasAnyLiveCourseOrder ? "Canlı Sınıf" : "Dijital";
    await supabase.from("word_leaderboard").upsert({
      user_email: currentUserEmail,
      level: selectedWordLevel,
      display_name: (currentUserName && !currentUserName.includes("@") && currentUserName.trim() !== "") ? currentUserName : currentUserEmail,
      toplam_dogru: yeniGenelToplam,
      rozet_adi: rozet.ad, rozet_icon: rozet.icon, ogrenci_turu: ogrenciTuru,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_email,level" });
  };

  const kaydetGenelSinav = async () => {
    if (!currentUserEmail) return;
    // Genel sınav başarılı ise A2 kilidini aç (word_progress'e özel kayıt)
    if (yanlis < 5) {
      await supabase.from("word_progress").upsert({
        user_email: currentUserEmail,
        level: selectedWordLevel,
        tema_key: "genel_sinav",
        dogru_sayisi: dogru,
        toplam_soru: 30,
        tamamlandi: true,
        learned_words: [],
        last_played_date: new Date().toISOString().split("T")[0],
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_email,level,tema_key" });
    }
  };

  const seviyeDegistir = (level: "A1" | "A2" | "B1") => {
    if (level === "B1" && !activeAccessLevels.includes("B1")) {
  if (onUpsell) onUpsell();
  return;
}
    if (level === "B1" && a2TamamlananTema.length < 12) {
  setUyariMesaji("🔒 B1 Seviyesi\n\nB1 seviyesine geçmek için önce A2'deki tüm 12 temayı bitirmen gerekiyor.");
  return;
}
    if (level === "A2" && a1TamamlananTema.length < 12) {
      setUyariMesaji(`🎯 Önce A1'i Tamamla\n\nA2 seviyesine geçmek için A1'deki tüm 12 temayı bitirmen gerekiyor.\n\nŞu an: ${a1TamamlananTema.length}/12 tema tamamlandı.`);
      return;
    }
    setSelectedWordLevel(level);
  };

  const hemenBasla = () => {
    if (selectedWordLevel === "A2" && a1TamamlananTema.length < 12) {
      setUyariMesaji(`🎯 Önce A1'i Tamamla\n\nA2 seviyesine geçmek için A1'deki tüm 12 temayı bitirmen gerekiyor.\n\nŞu an: ${a1TamamlananTema.length}/12 tema tamamlandı.`);
      return;
    }
    // Tüm temalar bittiyse seviye tamamlandı ekranına git
    if (tumTemalarTamamlandi) { setEkran("seviye_tamamlandi"); return; }
    // En son kaldığı temayı bul
    const ilkAcik = (Object.keys(aktifKelimeListesi) as TemaKey[]).find((k, i) => {
      const no = i + 1;
      const hasDev = effectivePackageType === "practice" || effectivePackageType === "master" || hasAnyLiveCourseOrder;
      return (no <= 6 || hasDev) && !completedWordThemes.includes(no);
    });
    if (ilkAcik) { setTema(ilkAcik); setEkran("mod"); }
  };

  const canIkonu = (dolu: boolean) => (dolu ? "❤️" : "🖤");
  const mevcutRozet = getRozet(toplamDogru);
  const sonrakiRozet = getSonrakiRozet(toplamDogru);

  const sertifikaUrl = `/certificate?level=${selectedWordLevel}&name=${encodeURIComponent(currentUserName || currentUserEmail || "Almanca Okulum Öğrencisi")}`;
  const whatsappMesaji = encodeURIComponent(`🏆 Goethe ${selectedWordLevel} Kelime Şampiyonu oldum!\n\nAlmanca Okulum Kelime Arenasındaki tüm temaları tamamlayarak sertifikamı almaya hak kazandım.\n\n${typeof window !== "undefined" ? window.location.origin : "https://almancaokulum.com"}${sertifikaUrl}`);
  const whatsappPaylasUrl = `https://wa.me/?text=${whatsappMesaji}`;

  const C: React.CSSProperties = { background: "linear-gradient(135deg, #ecfdf5, #eff6ff, #ffffff)", fontFamily: "'Segoe UI', sans-serif", color: "#0f172a", borderRadius: 24, border: "1px solid #dbeafe", boxShadow: "0 20px 60px rgba(15,23,42,0.08)" };

  // ── UYARI MODAL ────────────────────────────────────────────────────
  if (uyariMesaji) {
    const satirlar = uyariMesaji.split("\n").filter(s => s.trim() !== "");
    const baslik = satirlar[0];
    const icerik = satirlar.slice(1);
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 }}>
        <div style={{ background: "#ffffff", borderRadius: 24, padding: "32px 28px", maxWidth: 400, width: "100%", textAlign: "center", boxShadow: "0 24px 60px rgba(15,23,42,0.2)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{baslik.split(" ")[0]}</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", margin: "0 0 12px" }}>{baslik.split(" ").slice(1).join(" ")}</h2>
          {icerik.map((s, i) => <p key={i} style={{ fontSize: 14, color: "#64748b", margin: "0 0 8px", lineHeight: 1.6 }}>{s}</p>)}
          <button onClick={() => setUyariMesaji(null)} style={{ marginTop: 20, width: "100%", border: "none", borderRadius: 14, padding: "14px", background: "linear-gradient(135deg, #059669, #2563eb)", color: "#fff", fontWeight: 900, cursor: "pointer", fontSize: 15 }}>Anladım</button>
        </div>
      </div>
    );
  }

  // ── SEVİYE TAMAMLANDI EKRANI ───────────────────────────────────────
  if (ekran === "seviye_tamamlandi") {
    return (
      <div style={{ ...C, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 500, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🏆</div>
          <p style={{ color: "#059669", fontWeight: 900, letterSpacing: 2, fontSize: 12, textTransform: "uppercase" }}>Tebrikler!</p>
          <h2 style={{ fontSize: 26, fontWeight: 900, margin: "8px 0 8px" }}>{selectedWordLevel} Seviyesini Tamamladın!</h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>Tüm 12 temayı başarıyla bitirdin. Şimdi ne yapmak istersin?</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <button onClick={genelSinavBaslat}
              style={{ background: "linear-gradient(135deg, #2563eb, #059669)", border: "none", borderRadius: 16, padding: "16px 24px", color: "#fff", fontWeight: 900, cursor: "pointer", fontSize: 15 }}>
              📝 Genel Sınav Yap
              <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, marginTop: 4 }}>Tüm kelimelerden 30 karışık soru • Başarırsan sertifika kazan</div>
            </button>
            <button onClick={() => {
              if (window.confirm(`${selectedWordLevel} seviyesini sıfırlamak istediğine emin misin? Tüm ilerleme silinecek.`)) seviyeSifirla();
            }}
              style={{ background: "#ffffff", border: "2px solid #fca5a5", borderRadius: 16, padding: "16px 24px", color: "#dc2626", fontWeight: 900, cursor: "pointer", fontSize: 15 }}>
              🔄 {selectedWordLevel} Seviyesini Sıfırla ve Yeniden Başla
            </button>
            <button onClick={() => setEkran("menu")}
              style={{ background: "none", border: "1px solid #dbeafe", borderRadius: 14, padding: "12px", color: "#64748b", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
              ← Ana Menüye Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── GENEL SINAV EKRANI ─────────────────────────────────────────────
  if (ekran === "genel_sinav") {
    const suankiSoru = sorular[suankiIndex];
    const ilerleme = (suankiIndex / sorular.length) * 100;
    return (
      <div style={{ ...C, padding: "20px 16px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: "#2563eb", fontWeight: 900, letterSpacing: 2, textTransform: "uppercase" }}>Genel Sınav</div>
              <div style={{ fontSize: 13, color: "#059669", fontWeight: 900 }}>{selectedWordLevel} Seviyesi • Tüm Temalar</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: "#dc2626", fontWeight: 900 }}>❌ {yanlis} yanlış</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>Max 4 yanlış</div>
            </div>
          </div>
          <div style={{ height: 8, background: "#dbeafe", borderRadius: 99, marginBottom: 20, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${ilerleme}%`, background: "linear-gradient(90deg, #2563eb, #059669)", borderRadius: 99, transition: "width 0.3s" }} />
          </div>
          <div style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginBottom: 16, fontWeight: 700 }}>
            {suankiIndex + 1} / {sorular.length}
          </div>
          <div style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 24, padding: "36px 24px", textAlign: "center", marginBottom: 20, minHeight: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10, textTransform: "uppercase", letterSpacing: 2, fontWeight: 900 }}>Almanca</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a" }}>{suankiSoru.soru}</div>
              <button
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance(suankiSoru.soru);
                  utterance.lang = "de-DE";
                  utterance.rate = 0.85;
                  window.speechSynthesis.cancel();
                  window.speechSynthesis.speak(utterance);
                }}
                style={{ marginTop: 12, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "8px 16px", cursor: "pointer", fontSize: 18, color: "#2563eb" }}
                title="Sesi Dinle"
              >
                🔊
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {suankiSoru.secenekler.map((s, i) => {
              let bg = "#ffffff", border = "1px solid #dbeafe", color = "#0f172a";
              if (secilenCevap) {
                if (s === suankiSoru.dogru) { bg = "#ecfdf5"; border = "2px solid #10b981"; color = "#065f46"; }
                else if (s === secilenCevap) { bg = "#fef2f2"; border = "2px solid #ef4444"; color = "#991b1b"; }
              }
              return (
                <button key={i} onClick={() => cevapSec(s)}
                  style={{ background: bg, border, borderRadius: 16, padding: "16px 12px", color, cursor: secilenCevap ? "default" : "pointer", fontSize: 14, fontWeight: 900, lineHeight: 1.3 }}>
                  {s}
                </button>
              );
            })}
          </div>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <button onClick={() => { setEkran("seviye_tamamlandi"); }}
              style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 12, padding: "10px 20px", color: "#64748b", cursor: "pointer", fontSize: 13, fontWeight: 900 }}>
              ← Vazgeç
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── GENEL SINAV SONUÇ EKRANI ───────────────────────────────────────
  if (ekran === "genel_sinav_sonuc") {
    const basarili = genelSinavYanlis < 5;
    return (
      <div style={{ ...C, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>{basarili ? "🏆" : "😔"}</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 8px" }}>
            {basarili ? "Tebrikler! Genel Sınavı Geçtin!" : "Genel Sınav Başarısız"}
          </h2>

          <div style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 20, padding: "20px", marginBottom: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              {[{ label: "Doğru", val: dogru, color: "#059669" }, { label: "Yanlış", val: genelSinavYanlis, color: "#dc2626" }, { label: "Puan", val: `${Math.round((dogru / 30) * 100)}%`, color: "#2563eb" }].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {basarili ? (
            <div style={{ background: "linear-gradient(135deg, #fefce8, #fffbeb)", border: "1px solid #fde68a", borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <p style={{ fontWeight: 900, color: "#0f172a", marginBottom: 8 }}>🎖 Sertifikana hak kazandın!</p>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>Başarını paylaşarak diğer öğrencilere ilham ver.</p>
              <button onClick={() => window.open(sertifikaUrl, "_blank")}
                style={{ width: "100%", border: "none", borderRadius: 14, padding: "12px", background: "linear-gradient(135deg, #facc15, #f59e0b)", color: "#0f172a", fontWeight: 900, cursor: "pointer", marginBottom: 8 }}>
                📜 Sertifikamı Görüntüle
              </button>
              <button onClick={() => window.open(whatsappPaylasUrl, "_blank")}
                style={{ width: "100%", border: "none", borderRadius: 14, padding: "12px", background: "#25D366", color: "#fff", fontWeight: 900, cursor: "pointer" }}>
                📲 WhatsApp'ta Paylaş
              </button>
            </div>
          ) : (
            <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 16, padding: 20, marginBottom: 16 }}>
              {genelSinavHak > 1 ? (
                <>
                  <p style={{ fontWeight: 900, color: "#dc2626", marginBottom: 8 }}>⚠️ {selectedWordLevel} kelimelerini unutmuş gibisin.</p>
                  <p style={{ fontSize: 13, color: "#64748b", marginBottom: 0 }}>Son bir sınav hakkın var. Başaramazsan {selectedWordLevel} seviyesi sıfırlanacak.</p>
                </>
              ) : (
                <>
                  <p style={{ fontWeight: 900, color: "#dc2626", marginBottom: 8 }}>❌ İki sınavı da geçemedin.</p>
                  <p style={{ fontSize: 13, color: "#64748b", marginBottom: 0 }}>{selectedWordLevel} seviyesi sıfırlanıyor. Kelimeleri tekrar öğrenmeni öneririz.</p>
                </>
              )}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {basarili && (
              <button onClick={genelSinavBaslat}
                style={{ border: "none", borderRadius: 14, padding: "13px", background: "#f1f5f9", color: "#0f172a", fontWeight: 900, cursor: "pointer", fontSize: 14 }}>
                📝 Tekrar Genel Sınav Yap
              </button>
            )}
            {!basarili && genelSinavHak > 1 && (
              <button onClick={() => { setGenelSinavHak(1); genelSinavBaslat(); }}
                style={{ border: "none", borderRadius: 14, padding: "13px", background: "linear-gradient(135deg, #2563eb, #059669)", color: "#fff", fontWeight: 900, cursor: "pointer", fontSize: 14 }}>
                🔁 Son Hakkımı Kullan
              </button>
            )}
            {!basarili && genelSinavHak <= 1 && (
              <button onClick={() => { setGenelSinavHak(2); seviyeSifirla(); }}
                style={{ border: "none", borderRadius: 14, padding: "13px", background: "#dc2626", color: "#fff", fontWeight: 900, cursor: "pointer", fontSize: 14 }}>
                🔄 {selectedWordLevel} Seviyesini Sıfırla
              </button>
            )}
            <button onClick={() => setEkran("seviye_tamamlandi")}
              style={{ background: "none", border: "1px solid #dbeafe", borderRadius: 14, padding: "12px", color: "#64748b", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
              ← Geri Dön
            </button>
          </div>

          {yanlisKelimeler.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <button onClick={() => setYanlisGoster(!yanlisGoster)}
                style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 12, padding: "10px 20px", color: "#dc2626", cursor: "pointer", fontSize: 13, fontWeight: 900, width: "100%" }}>
                {yanlisGoster ? "▲ Yanlışları Gizle" : `▼ Yanlış Yaptığım ${yanlisKelimeler.length} Kelimeyi Gör`}
              </button>
              {yanlisGoster && (
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 12, padding: "14px", marginTop: 8, textAlign: "left" }}>
                  {yanlisKelimeler.map((k, i) => (
                    <div key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: i < yanlisKelimeler.length - 1 ? "1px solid #fecaca" : "none" }}>
                      <div style={{ fontSize: 14, fontWeight: 900 }}>❓ {k.soru}</div>
                      <div style={{ fontSize: 13, color: "#059669", fontWeight: 700 }}>✅ {k.dogru}</div>
                      <div style={{ fontSize: 13, color: "#dc2626", fontWeight: 700 }}>❌ {k.verilen}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── OYUN SONUÇ EKRANI ─────────────────────────────────────────────
  if (ekran === "sonuc" && tema) {
    const kelimeHavuzu = aktifKelimeListesi[tema].kelimeler;
    const mevcutLearned = temaLearnedRef.current[tema] || [];
    const temaYuzde = Math.min(100, Math.round((mevcutLearned.length / kelimeHavuzu.length) * 100));
    const tamamlandi = mevcutLearned.length >= Math.ceil(kelimeHavuzu.length * 0.9);
const temaNo = Number(String(tema).replace("tema", ""));
    const sonrakiTemaVar = temaNo < 12;

    return (
      <div style={{ ...C, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>{tamamlandi ? "🏆" : dogru >= 10 ? "⭐" : "🔄"}</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 16px" }}>
            {tamamlandi ? "Tema Tamamlandı!" : dogru >= 10 ? "Harika İlerleme!" : "Devam Et!"}
          </h2>

          <div style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 20, padding: "20px", marginBottom: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 14 }}>
              {[{ label: "Doğru", val: dogru, color: "#059669" }, { label: "Yanlış", val: yanlis, color: "#dc2626" }, { label: "Skor", val: skor, color: "#2563eb" }].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 16, padding: "16px", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom: 8 }}>{aktifKelimeListesi[tema].ad} — İlerleme</div>
            <div style={{ height: 10, background: "#f1f5f9", borderRadius: 99, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ height: "100%", width: `${temaYuzde}%`, background: tamamlandi ? "#16a34a" : "linear-gradient(90deg, #10b981, #2563eb)", borderRadius: 99, transition: "width 0.5s" }} />
            </div>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 6 }}>{mevcutLearned.length}/{kelimeHavuzu.length} kelime öğrenildi</div>
            <div style={{ fontSize: 13, color: tamamlandi ? "#16a34a" : "#f59e0b", fontWeight: 900 }}>
              {tamamlandi ? "🎉 Bu temayı tamamladın!" : `💪 ${kelimeHavuzu.length - mevcutLearned.length} kelime daha öğren!`}
            </div>
          </div>

          {yanlisKelimeler.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <button onClick={() => setYanlisGoster(!yanlisGoster)}
                style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 12, padding: "10px 20px", color: "#dc2626", cursor: "pointer", fontSize: 13, fontWeight: 900, width: "100%" }}>
                {yanlisGoster ? "▲ Yanlışları Gizle" : `▼ Yanlış Yaptığım ${yanlisKelimeler.length} Kelime`}
              </button>
              {yanlisGoster && (
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 12, padding: "14px", marginTop: 8, textAlign: "left" }}>
                  {yanlisKelimeler.map((k, i) => (
                    <div key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: i < yanlisKelimeler.length - 1 ? "1px solid #fecaca" : "none" }}>
                      <div style={{ fontSize: 14, fontWeight: 900 }}>❓ {k.soru}</div>
                      <div style={{ fontSize: 13, color: "#059669", fontWeight: 700 }}>✅ {k.dogru}</div>
                      <div style={{ fontSize: 13, color: "#dc2626", fontWeight: 700 }}>❌ {k.verilen}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {tamamlandi && sonrakiTemaVar ? (
              <button onClick={() => {
                const sonrakiTema = `tema${temaNo + 1}` as TemaKey;
                setTema(sonrakiTema); setEkran("mod");
              }}
                style={{ background: "linear-gradient(135deg, #10b981, #059669)", border: "none", borderRadius: 14, padding: "14px 24px", color: "#fff", fontWeight: 900, cursor: "pointer", fontSize: 15 }}>
                ➡️ Sonraki Temaya Geç
              </button>
            ) : tamamlandi && !sonrakiTemaVar ? (
              <button onClick={() => setEkran("seviye_tamamlandi")}
                style={{ background: "linear-gradient(135deg, #facc15, #f59e0b)", border: "none", borderRadius: 14, padding: "14px 24px", color: "#0f172a", fontWeight: 900, cursor: "pointer", fontSize: 15 }}>
                🏆 Seviye Tamamlandı!
              </button>
            ) : (
              <button onClick={() => oyunuBaslat(tema, mod)}
                style={{ background: "linear-gradient(135deg, #10b981, #2563eb)", border: "none", borderRadius: 14, padding: "14px 24px", color: "#fff", fontWeight: 900, cursor: "pointer", fontSize: 15 }}>
                🔄 Devam Et
              </button>
            )}
            <button onClick={() => setEkran("menu")}
              style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 14, padding: "14px 24px", color: "#0f172a", fontWeight: 900, cursor: "pointer", fontSize: 15 }}>
              🏠 Ana Menü
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── MOD SEÇİM EKRANI ──────────────────────────────────────────────
  if (ekran === "mod" && tema) {
    return (
      <div style={{ ...C, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 460, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>⚙️</div>
          <p style={{ color: "#059669", fontWeight: 900, letterSpacing: 2, fontSize: 12, margin: 0, textTransform: "uppercase" }}>Çalışma Modu</p>
          <h2 style={{ fontSize: 24, margin: "8px 0", fontWeight: 900 }}>{aktifKelimeListesi[tema].ad}</h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>Hangi yönde çalışmak istersin?</p>
          {([
            { id: "de_to_tr" as Mod, icon: "🇩🇪→🇹🇷", label: "Almanca → Türkçe", desc: "Almanca kelimeyi gör, Türkçesini bul" },
            { id: "tr_to_de" as Mod, icon: "🇹🇷→🇩🇪", label: "Türkçe → Almanca", desc: "Türkçe anlamı gör, Almancasını bul" },
          ]).map(m => (
            <button key={m.id} onClick={() => oyunuBaslat(tema, m.id)}
              style={{ display: "block", width: "100%", background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 18, padding: "20px 24px", color: "#0f172a", cursor: "pointer", textAlign: "left", marginBottom: 14, boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{m.icon}</div>
              <div style={{ fontWeight: 900, fontSize: 16 }}>{m.label}</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{m.desc}</div>
            </button>
          ))}
          <button onClick={() => setEkran("menu")} style={{ background: "none", border: "1px solid #dbeafe", borderRadius: 12, color: "#64748b", cursor: "pointer", fontSize: 14, padding: "10px 18px" }}>← Geri dön</button>
        </div>
      </div>
    );
  }

  // ── OYUN EKRANI ───────────────────────────────────────────────────
  if (ekran === "oyun" && tema) {
    const suankiSoru = sorular[suankiIndex];
    const ilerleme = (suankiIndex / sorular.length) * 100;
    return (
      <div style={{ ...C, padding: "20px 16px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#059669", fontWeight: 900 }}>{aktifKelimeListesi[tema].ad}</div>
            <div style={{ display: "flex", gap: 4, fontSize: 20 }}>{[1, 2, 3].map(i => canIkonu(i <= canlar))}</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#2563eb" }}>{skor} puan</div>
          </div>
          <div style={{ height: 8, background: "#dbeafe", borderRadius: 99, marginBottom: 24, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${ilerleme}%`, background: "linear-gradient(90deg, #10b981, #2563eb)", borderRadius: 99, transition: "width 0.3s" }} />
          </div>
          <div style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginBottom: 20, fontWeight: 700 }}>
            {suankiIndex + 1} / {sorular.length}
            {streak >= 3 && <span style={{ marginLeft: 12, color: "#f59e0b", fontWeight: 900 }}>🔥 {streak} seri!</span>}
          </div>
          <div style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 24, padding: "36px 24px", textAlign: "center", marginBottom: 24, minHeight: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 12, textTransform: "uppercase", letterSpacing: 2, fontWeight: 900 }}>{mod === "de_to_tr" ? "Almanca" : "Türkçe"}</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: "#0f172a" }}>{suankiSoru.soru}</div>
              {mod === "de_to_tr" && (
                <button
                  onClick={() => {
                    const utterance = new SpeechSynthesisUtterance(suankiSoru.soru);
                    utterance.lang = "de-DE";
                    utterance.rate = 0.85;
                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(utterance);
                  }}
                  style={{ marginTop: 12, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "8px 16px", cursor: "pointer", fontSize: 18, color: "#2563eb" }}
                  title="Sesi Dinle"
                >
                  🔊
                </button>
              )}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {suankiSoru.secenekler.map((s, i) => {
              let bg = "#ffffff", border = "1px solid #dbeafe", color = "#0f172a";
              if (secilenCevap) {
                if (s === suankiSoru.dogru) { bg = "#ecfdf5"; border = "2px solid #10b981"; color = "#065f46"; }
                else if (s === secilenCevap) { bg = "#fef2f2"; border = "2px solid #ef4444"; color = "#991b1b"; }
              }
              return (
                <button key={i} onClick={() => cevapSec(s)}
                  style={{ background: bg, border, borderRadius: 16, padding: "18px 14px", color, cursor: secilenCevap ? "default" : "pointer", fontSize: 14, fontWeight: 900, transition: "all 0.2s", lineHeight: 1.3 }}>
                  {s}
                </button>
              );
            })}
          </div>
          <div style={{ textAlign: "center", marginTop: 18 }}>
            <button onClick={() => setEkran("menu")}
              style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 12, padding: "10px 22px", color: "#64748b", cursor: "pointer", fontSize: 13, fontWeight: 900 }}>
              ← Geri Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── ANA MENÜ ──────────────────────────────────────────────────────
  return (
    <div style={{ ...C, padding: "28px 20px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <p style={{ color: "#059669", fontWeight: 900, letterSpacing: 2, fontSize: 12, margin: "0 0 6px", textTransform: "uppercase" }}>Kelime Arenası</p>
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 6px" }}>TELC Almanca Kelime Arenası</h1>
        <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 20px" }}>TELC & Goethe kelimelerini tema bazlı çalış, rozet kazan.</p>

        {/* Seviye butonları */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {(["A1", "A2", "B1"] as const).map(level => {
            const kilitli = (level === "B1" && a2TamamlananTema.length < 12) || (level === "A2" && a1TamamlananTema.length < 12);
            return (
              <button key={level} onClick={() => seviyeDegistir(level)}
                style={{ borderRadius: 99, padding: "8px 20px", fontSize: 14, fontWeight: 900, cursor: kilitli ? "not-allowed" : "pointer", border: "none", background: selectedWordLevel === level ? "#059669" : "#e2e8f0", color: selectedWordLevel === level ? "#fff" : "#64748b", opacity: kilitli ? 0.6 : 1 }}>
                {kilitli ? "🔒 " : "✓ "}{level}
              </button>
            );
          })}
        </div>

        {/* Aksiyon butonları */}
        {selectedWordLevel !== "B1" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
            <button onClick={hemenBasla}
              style={{ background: "#0f172a", border: "none", borderRadius: 16, padding: "13px 24px", color: "#fff", fontWeight: 900, cursor: "pointer", fontSize: 14 }}>
              {tumTemalarTamamlandi ? "🏆 Seviye Tamamlandı — Devam Et" : "🎯 Hemen Kelime Çalış"}
            </button>
            {tumTemalarTamamlandi && (
              <button onClick={genelSinavBaslat}
                style={{ background: "linear-gradient(135deg, #2563eb, #059669)", border: "none", borderRadius: 16, padding: "13px 24px", color: "#fff", fontWeight: 900, cursor: "pointer", fontSize: 14 }}>
                📝 Genel Sınav Yap
              </button>
            )}
            <button onClick={() => document.getElementById("kelime-tema-listesi")?.scrollIntoView({ behavior: "smooth" })}
              style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 16, padding: "13px 24px", color: "#059669", fontWeight: 900, cursor: "pointer", fontSize: 14 }}>
              📚 Temaları İncele
            </button>
          </div>
        )}

        {/* Rozet kutusu */}
        {!yukluyor && (
          <div style={{ background: "linear-gradient(135deg, #fefce8, #fffbeb)", border: "1px solid #fde68a", borderRadius: 16, padding: "16px 20px", marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 900, color: "#b45309", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 4px" }}>🎖 Mevcut Rozet</p>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", margin: "0 0 4px" }}>{mevcutRozet.icon} {mevcutRozet.ad}</h3>
            <p style={{ fontSize: 13, color: "#64748b", margin: 0, fontWeight: 700 }}>
              {tumTemalarTamamlandi
                ? `Tebrikler! Goethe ${selectedWordLevel} Kelime Şampiyonu oldun.`
                : sonrakiRozet
                ? `Bir sonraki rozete ${sonrakiRozet.min - toplamDogru} kelime kaldı.`
                : "Tebrikler! En yüksek rozeti kazandın."}
            </p>
          </div>
        )}

        {/* Liderlik tablosu */}
        {liderler.length > 0 && (
          <div style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 20, padding: "20px 24px", marginBottom: 24, boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 900, letterSpacing: 1, textTransform: "uppercase" }}>🏆 Kelime Liderleri</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", marginTop: 4 }}>{selectedWordLevel} Seviyesi Liderleri</div>
              </div>
              <span style={{ background: "#ecfdf5", color: "#059669", borderRadius: 99, padding: "4px 12px", fontSize: 12, fontWeight: 900 }}>Canlı</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {liderler.map((lider, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", borderRadius: 14, padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 99, background: "linear-gradient(135deg, #ecfdf5, #dbeafe)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14 }}>{index + 1}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: "#0f172a" }}>{lider.display_name?.includes("@") ? "Almanca Okulum Öğrencisi" : lider.display_name}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{lider.rozet_icon} {lider.rozet_adi} · {lider.ogrenci_turu || "Dijital"}{lider.streak_count > 1 ? ` · 🔥 ${lider.streak_count} gün seri` : ""}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 15, fontWeight: 900, color: "#059669" }}>{lider.toplam_dogru}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>kelime</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tema kartları */}
        {false ? (
          <div />
        ) : (
          <>
            <div id="kelime-tema-listesi" style={{ scrollMarginTop: 20 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
              {(Object.entries(aktifKelimeListesi) as [TemaKey, { ad: string; kelimeler: Kelime[] }][]).map(([key, val], i) => {
                const temaNo = i + 1;
                const hasDev = effectivePackageType === "practice" || effectivePackageType === "master" || hasAnyLiveCourseOrder;
const hasB1Access = selectedWordLevel !== "B1" || activeAccessLevels.includes("B1");
const hasAccess = (temaNo <= 6 || hasDev) && hasB1Access;
                const prevDone = temaNo === 1 || completedWordThemes.includes(temaNo - 1);
                const isLocked = !hasAccess || !prevDone;
                const isCompleted = completedWordThemes.includes(temaNo);
                const temaLearned = temaLearnedWords[key] || [];
                const temaYuzde = Math.min(100, Math.round((temaLearned.length / val.kelimeler.length) * 100));
                return (
                  <button key={key} onClick={() => {
                    if (!hasAccess) { setUyariMesaji("🔒 Bu Tema Kilitli\n\nBu temaya erişmek için Gelişim Paketi gerekiyor."); return; }
                    if (!prevDone) { setUyariMesaji(`🎯 Sıradaki Tema Kilitli\n\nÖnce Tema ${temaNo - 1}'i tamamlamalısın.`); return; }
                    setTema(key); setEkran("mod");
                  }}
                    style={{ background: isCompleted ? "#f0fdf4" : "#ffffff", border: isCompleted ? "1px solid #86efac" : "1px solid #dbeafe", borderRadius: 18, padding: "18px 16px", color: "#0f172a", cursor: isLocked ? "not-allowed" : "pointer", textAlign: "left", opacity: isLocked ? 0.55 : 1, boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}>
                    <div style={{ fontSize: 11, color: isCompleted ? "#16a34a" : isLocked ? "#b45309" : "#059669", marginBottom: 6, fontWeight: 900, letterSpacing: 1, display: "flex", alignItems: "center", gap: 5 }}>
                      {isCompleted ? "✅" : isLocked ? "🔒" : "▶"} TEMA {temaNo}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 900 }}>{val.ad}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>{val.kelimeler.length} kelime</div>
                    {!isLocked && temaLearned.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ height: 4, background: "#dbeafe", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${temaYuzde}%`, background: isCompleted ? "#16a34a" : "#2563eb", borderRadius: 99 }} />
                        </div>
                        <div style={{ fontSize: 10, color: "#64748b", marginTop: 3, fontWeight: 700 }}>{temaLearned.length}/{val.kelimeler.length} kelime öğrenildi</div>
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: isCompleted ? "#16a34a" : isLocked ? "#b45309" : "#059669", marginTop: 6, fontWeight: 800 }}>
                      {isCompleted ? "Tamamlandı ✓" : isLocked ? "Kilitli" : temaLearned.length > 0 ? "Devam et →" : "Başlamaya hazır"}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}