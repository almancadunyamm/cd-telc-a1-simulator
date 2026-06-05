"use client";

import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Kelime = { de: string; tr: string };
type TemaKey = keyof typeof KELIMELER;
type Mod = "de_to_tr" | "tr_to_de";
type Soru = { soru: string; dogru: string; secenekler: string[] };

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

const ROZETLER = [
  { min: 0,   max: 49,  icon: "🌱", ad: "Kelime Yolcusu",    renk: "#6b7280" },
  { min: 50,  max: 149, icon: "🔥", ad: "Kelime Avcısı",     renk: "#f59e0b" },
  { min: 150, max: 299, icon: "🏅", ad: "Kelime Ustası",     renk: "#3b82f6" },
  { min: 300, max: 449, icon: "👑", ad: "TELC Kelime Kralı", renk: "#8b5cf6" },
  { min: 450, max: 619, icon: "🏆", ad: "Goethe Şampiyonu",  renk: "#10b981" },
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

type Props = {
  effectivePackageType?: string;
  hasAnyLiveCourseOrder?: boolean;
  currentUserEmail?: string;
};

export default function KelimeOyunu({ effectivePackageType, hasAnyLiveCourseOrder, currentUserEmail }: Props) {
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
  const [selectedWordLevel, setSelectedWordLevel] = useState<"A1" | "A2" | "B1">("A1");
  const [completedWordThemes, setCompletedWordThemes] = useState<number[]>([]);
  const [toplamDogru, setToplamDogru] = useState(0);
  const [yukluyor, setYukluyor] = useState(true);

  useEffect(() => {
    if (!currentUserEmail) { setYukluyor(false); return; }
    async function loadProgress() {
      const { data } = await supabase
        .from("word_progress")
        .select("tema_key, tamamlandi, dogru_sayisi")
        .eq("user_email", currentUserEmail);
      if (data) {
        const tamamlananTemalar = data
          .filter(d => d.tamamlandi)
          .map(d => Number(String(d.tema_key).replace("tema", "")));
        setCompletedWordThemes(tamamlananTemalar);
        const toplam = data.reduce((acc, d) => acc + (d.dogru_sayisi || 0), 0);
        setToplamDogru(toplam);
      }
      setYukluyor(false);
    }
    loadProgress();
  }, [currentUserEmail]);
  useEffect(() => {
    if (!oyunBitti || !tema) return;
    const basari = Math.round((dogru / sorular.length) * 100);
    const tamamlandi = basari >= 80;
    kaydetIlerleme(tema, dogru, sorular.length, tamamlandi);
  }, [oyunBitti]);

  const oyunuBaslat = useCallback((secilenTema: TemaKey, secilenMod: Mod) => {
    const kelimeler = shuffle(KELIMELER[secilenTema].kelimeler).slice(0, 15);
    const hazirSorular: Soru[] = kelimeler.map((k) => {
      const dogruCevap = secilenMod === "de_to_tr" ? k.tr : k.de;
      const soru = secilenMod === "de_to_tr" ? k.de : k.tr;
      const yanlislar = secilenMod === "de_to_tr"
        ? getWrongOptions(k.tr, KELIMELER[secilenTema].kelimeler)
        : shuffle(KELIMELER[secilenTema].kelimeler.filter((x) => x.de !== k.de)).slice(0, 3).map((x) => x.de);
      return { soru, dogru: dogruCevap, secenekler: shuffle([dogruCevap, ...yanlislar]) };
    });
    setSorular(hazirSorular);
    setSuankiIndex(0); setCanlar(3); setSkor(0);
    setSecilenCevap(null); setOyunBitti(false);
    setStreak(0); setDogru(0); setYanlis(0);
    setTema(secilenTema); setMod(secilenMod);
  }, []);

  const cevapSec = (cevap: string) => {
    if (secilenCevap) return;
    setSecilenCevap(cevap);
    const mevcutSoru = sorular[suankiIndex];
    if (cevap === mevcutSoru.dogru) {
      setSkor((s) => s + 10); setStreak((s) => s + 1); setDogru((d) => d + 1);
      setTimeout(() => sonrakiSoru(), 900);
    } else {
      setCanlar((c) => c - 1); setStreak(0); setYanlis((y) => y + 1);
      if (canlar - 1 <= 0) setTimeout(() => setOyunBitti(true), 900);
      else setTimeout(() => sonrakiSoru(), 900);
    }
  };

  const sonrakiSoru = () => {
    setSecilenCevap(null);
    if (suankiIndex + 1 >= sorular.length) setOyunBitti(true);
    else setSuankiIndex((i) => i + 1);
  };

  const kaydetIlerleme = async (temaKey: TemaKey, dogruSayisi: number, toplamSoru: number, tamamlandi: boolean) => {
    if (!currentUserEmail) return;
    const yeniToplam = toplamDogru + dogruSayisi;
    setToplamDogru(yeniToplam);
    if (tamamlandi) {
      const temaNo = Number(String(temaKey).replace("tema", ""));
      setCompletedWordThemes(prev => prev.includes(temaNo) ? prev : [...prev, temaNo]);
    }
    await supabase.from("word_progress").upsert({
      user_email: currentUserEmail,
      tema_key: temaKey,
      mod: mod || "de_to_tr",
      dogru_sayisi: dogruSayisi,
      toplam_soru: toplamSoru,
      tamamlandi,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_email,tema_key,mod" });
  };

  const canIkonu = (dolu: boolean) => (dolu ? "❤️" : "🖤");
  const mevcutRozet = getRozet(toplamDogru);
  const sonrakiRozet = getSonrakiRozet(toplamDogru);
  const ilerlemeYuzdesi = sonrakiRozet
    ? Math.round(((toplamDogru - mevcutRozet.min) / (sonrakiRozet.min - mevcutRozet.min)) * 100)
    : 100;

  // TEMA SEÇİM EKRANI
  if (!tema) {
    return (
      <div style={{ background: "linear-gradient(135deg, #ecfdf5, #eff6ff, #ffffff)", fontFamily: "'Segoe UI', sans-serif", color: "#0f172a", padding: "24px 16px", borderRadius: 24, border: "1px solid #dbeafe", boxShadow: "0 20px 60px rgba(15,23,42,0.08)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          {/* Başlık */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 44, marginBottom: 8 }}>🎮</div>
            <p style={{ color: "#059669", fontWeight: 900, letterSpacing: 2, fontSize: 12, margin: 0, textTransform: "uppercase" }}>Kelime Oyunu</p>
            <h1 style={{ fontSize: 28, fontWeight: 900, margin: "8px 0 0" }}>TELC Almanca Kelime Arenası</h1>
            <p style={{ color: "#64748b", marginTop: 8, fontSize: 14 }}>TELC & Goethe A1 — Tema bazlı kelime pratiği</p>
          </div>

          {/* Rozet Kartı */}
          {!yukluyor && (
            <div style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 20, padding: "20px 24px", marginBottom: 24, boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 900, letterSpacing: 1, textTransform: "uppercase" }}>Mevcut Rozet</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: mevcutRozet.renk, marginTop: 4 }}>
                    {mevcutRozet.icon} {mevcutRozet.ad}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{toplamDogru} doğru kelime</div>
                </div>
                {sonrakiRozet && (
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 900, letterSpacing: 1, textTransform: "uppercase" }}>Sonraki Rozet</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: sonrakiRozet.renk, marginTop: 4 }}>{sonrakiRozet.icon} {sonrakiRozet.ad}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{sonrakiRozet.min - toplamDogru} kelime kaldı</div>
                  </div>
                )}
              </div>
              <div style={{ marginTop: 14, height: 10, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${ilerlemeYuzdesi}%`, background: `linear-gradient(90deg, ${mevcutRozet.renk}, ${sonrakiRozet?.renk || mevcutRozet.renk})`, borderRadius: 99, transition: "width 0.5s" }} />
              </div>
              <div style={{ textAlign: "right", fontSize: 11, color: "#64748b", marginTop: 4, fontWeight: 700 }}>%{ilerlemeYuzdesi}</div>
            </div>
          )}

          {/* Seviye seçici */}
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
            {(["A1", "A2", "B1"] as const).map((level) => (
              <button key={level} onClick={() => setSelectedWordLevel(level)}
                style={{ borderRadius: 14, padding: "10px 22px", fontSize: 14, fontWeight: 900, cursor: "pointer", border: selectedWordLevel === level ? "none" : "1px solid #dbeafe", background: selectedWordLevel === level ? "linear-gradient(135deg, #10b981, #2563eb)" : "#ffffff", color: selectedWordLevel === level ? "#fff" : "#334155" }}>
                {level !== "A1" ? "🔒 " : "✅ "}{level}
              </button>
            ))}
          </div>

          {selectedWordLevel !== "A1" ? (
            <div style={{ background: "#ffffff", border: "1px solid #fde68a", borderRadius: 20, padding: "32px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🚀</div>
              <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>{selectedWordLevel} Kelime Arenası Yakında</h2>
              <p style={{ color: "#64748b", fontSize: 14 }}>Bu seviye için kelime oyunu hazırlanıyor. Gelişim ve Zirve öğrencileri ilk erişenler olacak.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
              {(Object.entries(KELIMELER) as [TemaKey, typeof KELIMELER[TemaKey]][]).map(([key, val], i) => {
                const temaNo = i + 1;
                const hasDevelopmentAccess = effectivePackageType === "practice" || effectivePackageType === "master" || hasAnyLiveCourseOrder;
                const hasPackageAccess = temaNo <= 6 || hasDevelopmentAccess;
                const isPreviousCompleted = temaNo === 1 || completedWordThemes.includes(temaNo - 1);
                const isLocked = !hasPackageAccess || !isPreviousCompleted;
                const isCompleted = completedWordThemes.includes(temaNo);
                return (
                  <button key={key} onClick={() => {
                    if (!hasPackageAccess) { alert("Bu tema Gelişim Paketi ile açılır."); return; }
                    if (!isPreviousCompleted) { alert(`Önce Tema ${temaNo - 1} kelime oyununu tamamlamalısınız.`); return; }
                    setTema(key);
                  }}
                    style={{ background: isCompleted ? "#f0fdf4" : "#ffffff", border: isCompleted ? "1px solid #86efac" : "1px solid #dbeafe", borderRadius: 18, padding: "18px 16px", color: "#0f172a", cursor: "pointer", textAlign: "left", opacity: isLocked ? 0.55 : 1, boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}>
                    <div style={{ fontSize: 11, color: isCompleted ? "#16a34a" : isLocked ? "#b45309" : "#059669", marginBottom: 6, fontWeight: 900, letterSpacing: 1 }}>
                      {isCompleted ? "✅ " : isLocked ? "🔒 " : "🔥 "}TEMA {temaNo}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 900 }}>{val.ad}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>{val.kelimeler.length} kelime</div>
                    <div style={{ fontSize: 11, color: isCompleted ? "#16a34a" : isLocked ? "#b45309" : "#059669", marginTop: 8, fontWeight: 800 }}>
                      {isCompleted ? "Tamamlandı" : isLocked ? "Kilitli" : "Başlamaya hazır"}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // MOD SEÇİM EKRANI
  if (!mod) {
    return (
      <div style={{ background: "linear-gradient(135deg, #ecfdf5, #eff6ff, #ffffff)", fontFamily: "'Segoe UI', sans-serif", color: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, borderRadius: 24, border: "1px solid #dbeafe" }}>
        <div style={{ maxWidth: 460, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>⚙️</div>
          <p style={{ color: "#059669", fontWeight: 900, letterSpacing: 2, fontSize: 12, margin: 0, textTransform: "uppercase" }}>Çalışma Modu</p>
          <h2 style={{ fontSize: 24, margin: "8px 0", fontWeight: 900 }}>{KELIMELER[tema].ad}</h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>Hangi yönde çalışmak istersin?</p>
          {([
            { id: "de_to_tr" as Mod, icon: "🇩🇪→🇹🇷", label: "Almanca → Türkçe", desc: "Almanca kelimeyi gör, Türkçesini bul" },
            { id: "tr_to_de" as Mod, icon: "🇹🇷→🇩🇪", label: "Türkçe → Almanca", desc: "Türkçe anlamı gör, Almancasını bul" },
          ]).map((m) => (
            <button key={m.id} onClick={() => oyunuBaslat(tema, m.id)}
              style={{ display: "block", width: "100%", background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 18, padding: "20px 24px", color: "#0f172a", cursor: "pointer", textAlign: "left", marginBottom: 14, boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{m.icon}</div>
              <div style={{ fontWeight: 900, fontSize: 16 }}>{m.label}</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{m.desc}</div>
            </button>
          ))}
          <button onClick={() => setTema(null)} style={{ background: "none", border: "1px solid #dbeafe", borderRadius: 12, color: "#64748b", cursor: "pointer", fontSize: 14, padding: "10px 18px" }}>← Geri dön</button>
        </div>
      </div>
    );
  }

  // OYUN BİTTİ EKRANI
  if (oyunBitti) {
    const basari = Math.round((dogru / sorular.length) * 100);
    const tamamlandi = basari >= 80;
    const yeniToplam = toplamDogru + dogru;
    const yeniRozet = getRozet(yeniToplam);
    const eskiRozet = getRozet(toplamDogru);
    const rozetAtladi = yeniRozet.ad !== eskiRozet.ad;
    const mesaj = basari >= 80 ? "Harika! 🏆" : basari >= 60 ? "İyi iş! 👍" : "Tekrar dene! 💪";
    return (
      <div style={{ background: "linear-gradient(135deg, #ecfdf5, #eff6ff, #ffffff)", fontFamily: "'Segoe UI', sans-serif", color: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, borderRadius: 24, border: "1px solid #dbeafe" }}>
        <div style={{ maxWidth: 440, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>{basari >= 80 ? "🏆" : basari >= 60 ? "⭐" : "🔄"}</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 8px" }}>{mesaj}</h2>

          {rozetAtladi && (
            <div style={{ background: "linear-gradient(135deg, #fef3c7, #fff)", border: "2px solid #f59e0b", borderRadius: 16, padding: "16px", marginBottom: 20 }}>
              <div style={{ fontSize: 32 }}>{yeniRozet.icon}</div>
              <div style={{ fontWeight: 900, fontSize: 16, color: yeniRozet.renk, marginTop: 6 }}>Yeni Rozet Kazandın!</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#64748b" }}>{yeniRozet.ad}</div>
            </div>
          )}

          <div style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 20, padding: "20px", margin: "16px 0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
              {[{ label: "Skor", val: skor, color: "#2563eb" }, { label: "Doğru", val: dogru, color: "#059669" }, { label: "Yanlış", val: yanlis, color: "#dc2626" }].map((s) => (
                <div key={s.label}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "linear-gradient(135deg, #ecfdf5, #eff6ff)", borderRadius: 12, padding: "10px", fontSize: 16, fontWeight: 900, color: "#059669" }}>Başarı: %{basari}</div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => oyunuBaslat(tema, mod!)}
              style={{ background: "linear-gradient(135deg, #10b981, #2563eb)", border: "none", borderRadius: 14, padding: "14px 24px", color: "#fff", fontWeight: 900, cursor: "pointer", fontSize: 15 }}>
              🔄 Tekrar Oyna
            </button>
            <button onClick={() => { setTema(null); setMod(null); }}
              style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 14, padding: "14px 24px", color: "#0f172a", fontWeight: 900, cursor: "pointer", fontSize: 15 }}>
              🏠 Ana Menü
            </button>
          </div>
        </div>
      </div>
    );
  }

  // OYUN EKRANI
  const suankiSoru = sorular[suankiIndex];
  const ilerleme = (suankiIndex / sorular.length) * 100;
  return (
    <div style={{ background: "linear-gradient(135deg, #ecfdf5, #eff6ff, #ffffff)", fontFamily: "'Segoe UI', sans-serif", color: "#0f172a", padding: "20px 16px", borderRadius: 24, border: "1px solid #dbeafe", boxShadow: "0 20px 60px rgba(15,23,42,0.08)" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "#059669", fontWeight: 900 }}>{KELIMELER[tema].ad}</div>
          <div style={{ display: "flex", gap: 4, fontSize: 20 }}>{[1, 2, 3].map((i) => canIkonu(i <= canlar))}</div>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#2563eb" }}>{skor} puan</div>
        </div>
        <div style={{ height: 8, background: "#dbeafe", borderRadius: 99, marginBottom: 24, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${ilerleme}%`, background: "linear-gradient(90deg, #10b981, #2563eb)", borderRadius: 99, transition: "width 0.3s" }} />
        </div>
        <div style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginBottom: 20, fontWeight: 700 }}>
          {suankiIndex + 1} / {sorular.length}
          {streak >= 3 && <span style={{ marginLeft: 12, color: "#f59e0b", fontWeight: 900 }}>🔥 {streak} seri!</span>}
        </div>
        <div style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 24, padding: "36px 24px", textAlign: "center", marginBottom: 24, minHeight: 120, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(15,23,42,0.06)" }}>
          <div>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 12, textTransform: "uppercase", letterSpacing: 2, fontWeight: 900 }}>{mod === "de_to_tr" ? "Almanca" : "Türkçe"}</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: "#0f172a" }}>{suankiSoru.soru}</div>
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
          <button onClick={() => { setTema(null); setMod(null); setOyunBitti(false); }}
            style={{ background: "#ffffff", border: "1px solid #dbeafe", borderRadius: 12, padding: "10px 22px", color: "#64748b", cursor: "pointer", fontSize: 13, fontWeight: 900 }}>
            ← Geri Dön
          </button>
        </div>
      </div>
    </div>
  );
}
