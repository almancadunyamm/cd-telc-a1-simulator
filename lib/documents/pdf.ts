import fs from "fs/promises";
import path from "path";
import { PDFDocument, rgb, degrees, type PDFFont, type PDFPage, type PDFImage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import QRCode from "qrcode";
import { formatDateDot, formatVerifyCode, type DocumentLanguage } from "@/lib/documents/config";

export type DocumentPdfData = {
  documentNo: string;
  verifyCode: string;
  issuedAt: string; // YYYY-MM-DD
  fullName: string;
  birthDate: string; // YYYY-MM-DD
  birthPlace: string;
  language: DocumentLanguage;
  level: string;
  courseType: "live" | "digital";
  courseStart: string;
  courseEnd: string;
  weeklyHours: number | null;
  verifyUrl: string;
  revoked?: boolean;
};

const ASSETS = path.join(process.cwd(), "lib", "documents", "assets");

const NAVY = rgb(0.059, 0.153, 0.306); // #0F274E
const TEAL = rgb(0.02, 0.553, 0.62); // #058D9E
const TEXT = rgb(0.16, 0.2, 0.28);
const MUTED = rgb(0.42, 0.46, 0.53);
const BOX = rgb(0.925, 0.957, 0.98);

const T = {
  tr: {
    subtitleBrand: "ÇEVRİM İÇİ ALMANCA KURSLARI",
    tagline: ["Daha iyi bir gelecek için", "Almanca öğrenin."],
    title: "KURSİYER BELGESİ",
    subtitle: "Çevrim İçi Almanca Kursu Kayıt ve Devam Belgesi",
    issued: "Belge Tarihi",
    docNo: "Belge No",
    name: "Adı Soyadı",
    birthDate: "Doğum Tarihi",
    birthPlace: "Doğum Yeri",
    statement:
      "Yukarıda bilgileri bulunan kursiyer, Almanca Okulum tarafından düzenlenen çevrim içi Almanca kursuna kayıtlıdır ve belge düzenleme tarihi itibarıyla derslere devam etmektedir.",
    section: "Kurs Bilgileri",
    course: "Kurs",
    courseValue: "Genel Almanca",
    level: "Seviye",
    mode: "Eğitim Şekli",
    modeLive: "Canlı çevrim içi ders",
    modeDigital: "Çevrim içi dijital kurs (video dersler)",
    start: "Başlangıç Tarihi",
    end: "Bitiş Tarihi",
    weekly: "Haftalık Ders",
    weeklyValue: (h: number) => `${h} ders saati (1 ders saati: 45 dakika)`,
    weeklySub: null as string | null,
    purpose: "Bu belge, kursiyerin talebi üzerine kurs kayıt ve devam durumunu bildirmek amacıyla düzenlenmiştir.",
    signRole: "Kurum Yetkilisi",
    signLabel: "İmza",
    contactTitle: "İletişim ve Belge Doğrulama",
    contactText: "Bu belgenin doğruluğunu karekodu okutarak veya aşağıdaki adreste belge kodunu girerek kontrol edebilirsiniz.",
    qrLabel: "Doğrulama Kodu",
    footer: "Bu belge dil yeterlilik veya sınav başarı belgesi değildir.",
    revoked: "İPTAL EDİLDİ",
  },
  de: {
    subtitleBrand: "ONLINE-DEUTSCHKURSE",
    tagline: ["Deutsch lernen für", "eine bessere Zukunft."],
    title: "KURSBESCHEINIGUNG",
    subtitle: "Anmelde- und Teilnahmebestätigung für einen Online-Deutschkurs",
    issued: "Ausstellungsdatum",
    docNo: "Dokumentnummer",
    name: "Vor- und Nachname",
    birthDate: "Geburtsdatum",
    birthPlace: "Geburtsort",
    statement:
      "Hiermit bestätigen wir, dass die oben genannte Person bei Almanca Okulum für einen Online-Deutschkurs angemeldet ist und zum Zeitpunkt der Ausstellung am Unterricht teilnimmt.",
    section: "Kursangaben",
    course: "Kurs",
    courseValue: "Allgemeiner Deutschkurs",
    level: "Kursniveau",
    mode: "Unterrichtsform",
    modeLive: "Live-Online-Unterricht",
    modeDigital: "Digitaler Online-Kurs (Videolektionen)",
    start: "Kursbeginn",
    end: "Kursende",
    weekly: "Umfang",
    weeklyValue: (h: number) => `${h} Unterrichtseinheiten pro Woche`,
    weeklySub: "(1 Unterrichtseinheit = 45 Minuten)" as string | null,
    purpose:
      "Diese Bescheinigung wird auf Wunsch der teilnehmenden Person als Nachweis ihrer Kursanmeldung und aktuellen Kursteilnahme ausgestellt.",
    signRole: "Kursleitung",
    signLabel: "Unterschrift",
    contactTitle: "Kontakt und Dokumentenprüfung",
    contactText: "Die Echtheit dieses Dokuments können Sie durch Scannen des QR-Codes oder unter der folgenden Adresse prüfen.",
    qrLabel: "Prüfcode",
    footer: "Kein Sprachzertifikat und kein Prüfungsnachweis.",
    revoked: "UNGÜLTIG",
  },
};

const SIGNER_NAME = "Sultan Sağlam";
const CONTACT_EMAIL = "info@almancaokulum.com";
const CONTACT_PHONE = "+90 542 695 44 19";
const CONTACT_WEB = "almancaokulum.com/belge-dogrula";

type Fonts = { serif: PDFFont; serifBold: PDFFont; serifBlack: PDFFont; sans: PDFFont; sansSemi: PDFFont; sansBold: PDFFont };

async function loadFonts(doc: PDFDocument): Promise<Fonts> {
  doc.registerFontkit(fontkit);
  const read = (f: string) => fs.readFile(path.join(ASSETS, f));
  const [a, b, c, d, e, f] = await Promise.all([
    read("Merriweather_400Regular.ttf"),
    read("Merriweather_700Bold.ttf"),
    read("Merriweather_900Black.ttf"),
    read("NotoSans_400Regular.ttf"),
    read("NotoSans_600SemiBold.ttf"),
    read("NotoSans_700Bold.ttf"),
  ]);
  const opt = { subset: false }; // fontlar depoda önceden Latin+Türkçe+Almanca karakterlere indirildi (pdf-lib subset hatası)
  return {
    serif: await doc.embedFont(a, opt),
    serifBold: await doc.embedFont(b, opt),
    serifBlack: await doc.embedFont(c, opt),
    sans: await doc.embedFont(d, opt),
    sansSemi: await doc.embedFont(e, opt),
    sansBold: await doc.embedFont(f, opt),
  };
}

async function loadSignature(doc: PDFDocument): Promise<PDFImage | null> {
  for (const name of ["imza.png", "imza.jpg"]) {
    try {
      const bytes = await fs.readFile(path.join(ASSETS, name));
      return name.endsWith(".png") ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
    } catch {
      /* imza dosyası yoksa boş imza alanı */
    }
  }
  return null;
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawSpaced(page: PDFPage, text: string, x: number, y: number, font: PDFFont, size: number, spacing: number, color = NAVY) {
  let cx = x;
  for (const ch of text) {
    page.drawText(ch, { x: cx, y, size, font, color });
    cx += font.widthOfTextAtSize(ch, size) + spacing;
  }
}

function centered(page: PDFPage, text: string, y: number, font: PDFFont, size: number, color = NAVY) {
  const w = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: (page.getWidth() - w) / 2, y, size, font, color });
}

// Şablondaki açık kitap logosu (vektör)
function drawBookLogo(page: PDFPage, x: number, y: number, s: number) {
  const navyPath = `M 0 ${-6 * s} L 0 ${-40 * s} L ${4 * s} ${-40 * s} L ${4 * s} ${-10 * s} C ${16 * s} ${-12 * s} ${30 * s} ${-10 * s} ${42 * s} ${-2 * s} L ${42 * s} ${2 * s} C ${30 * s} ${-4 * s} ${14 * s} ${-6 * s} 0 ${-6 * s} Z`;
  const pages = [
    { d: `M ${8 * s} ${-12 * s} L ${8 * s} ${-44 * s} C ${20 * s} ${-46 * s} ${32 * s} ${-42 * s} ${40 * s} ${-36 * s} L ${40 * s} ${-4 * s} C ${32 * s} ${-10 * s} ${20 * s} ${-13 * s} ${8 * s} ${-12 * s} Z`, color: NAVY },
    { d: `M ${76 * s} ${-12 * s} L ${76 * s} ${-44 * s} C ${64 * s} ${-46 * s} ${52 * s} ${-42 * s} ${44 * s} ${-36 * s} L ${44 * s} ${-4 * s} C ${52 * s} ${-10 * s} ${64 * s} ${-13 * s} ${76 * s} ${-12 * s} Z`, color: TEAL },
  ];
  page.drawSvgPath(navyPath, { x, y, color: NAVY });
  const right = `M ${84 * s} ${-6 * s} L ${84 * s} ${-40 * s} L ${80 * s} ${-40 * s} L ${80 * s} ${-10 * s} C ${68 * s} ${-12 * s} ${54 * s} ${-10 * s} ${42 * s} ${-2 * s} L ${42 * s} ${2 * s} C ${54 * s} ${-4 * s} ${70 * s} ${-6 * s} ${84 * s} ${-6 * s} Z`;
  page.drawSvgPath(right, { x, y, color: NAVY });
  for (const p of pages) {
    page.drawSvgPath(p.d, { x, y, borderColor: p.color, borderWidth: 2.2 * s, color: rgb(1, 1, 1) });
  }
}

function drawLabelRows(
  page: PDFPage,
  rows: { label: string; value: string; sub?: string | null }[],
  x: number,
  startY: number,
  colonX: number,
  f: Fonts,
  gap: number,
) {
  let y = startY;
  for (const r of rows) {
    page.drawText(r.label, { x, y, size: 11, font: f.sansBold, color: NAVY });
    page.drawText(":", { x: colonX, y, size: 11, font: f.sansBold, color: NAVY });
    page.drawText(r.value, { x: colonX + 14, y, size: 11.5, font: f.serif, color: TEXT });
    if (r.sub) {
      y -= 15;
      page.drawText(r.sub, { x: colonX + 14, y, size: 9.5, font: f.serif, color: TEXT });
    }
    y -= gap;
  }
  return y;
}

function drawQr(page: PDFPage, text: string, x: number, y: number, size: number) {
  const qr = QRCode.create(text, { errorCorrectionLevel: "M" });
  const n = qr.modules.size;
  const quiet = 2;
  const cell = size / (n + quiet * 2);
  page.drawRectangle({ x, y, width: size, height: size, color: rgb(1, 1, 1) });
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.modules.get(r, c)) {
        page.drawRectangle({
          x: x + (c + quiet) * cell,
          y: y + size - (r + quiet + 1) * cell,
          width: cell + 0.05,
          height: cell + 0.05,
          color: rgb(0.05, 0.08, 0.15),
        });
      }
    }
  }
}

function drawEnvelopeIcon(page: PDFPage, cx: number, cy: number) {
  page.drawCircle({ x: cx, y: cy, size: 11, color: TEAL });
  page.drawRectangle({ x: cx - 6, y: cy - 4, width: 12, height: 8, borderColor: rgb(1, 1, 1), borderWidth: 1.1 });
  page.drawLine({ start: { x: cx - 6, y: cy + 4 }, end: { x: cx, y: cy - 0.5 }, thickness: 1.1, color: rgb(1, 1, 1) });
  page.drawLine({ start: { x: cx + 6, y: cy + 4 }, end: { x: cx, y: cy - 0.5 }, thickness: 1.1, color: rgb(1, 1, 1) });
}

function drawPhoneIcon(page: PDFPage, cx: number, cy: number) {
  page.drawCircle({ x: cx, y: cy, size: 11, color: TEAL });
  page.drawRectangle({ x: cx - 3.6, y: cy - 6, width: 7.2, height: 12, borderColor: rgb(1, 1, 1), borderWidth: 1.1 });
  page.drawLine({ start: { x: cx - 1.2, y: cy - 4 }, end: { x: cx + 1.2, y: cy - 4 }, thickness: 1, color: rgb(1, 1, 1) });
}

export async function renderStudentDocumentPdf(data: DocumentPdfData): Promise<Uint8Array> {
  const t = T[data.language] || T.tr;
  const doc = await PDFDocument.create();
  doc.setTitle(`${t.title} ${data.documentNo}`);
  doc.setAuthor("Almanca Okulum");
  doc.setSubject(t.subtitle);
  doc.setCreator("almancaokulum.com");
  doc.setProducer("almancaokulum.com");

  const f = await loadFonts(doc);
  const signature = await loadSignature(doc);
  const page = doc.addPage([595.28, 841.89]);
  const W = page.getWidth();
  const M = 40;

  // ── Üst kısım: logo + slogan
  drawBookLogo(page, M, 762, 0.72);
  page.drawText("ALMANCA", { x: M + 72, y: 772, size: 27, font: f.serifBlack, color: NAVY });
  const almW = f.serifBlack.widthOfTextAtSize("ALMANCA ", 27);
  page.drawText("OKULUM", { x: M + 72 + almW, y: 772, size: 27, font: f.serifBlack, color: TEAL });
  drawSpaced(page, t.subtitleBrand, M + 74, 756, f.sans, 8.6, 2.6, NAVY);

  const tagSize = 10.5;
  t.tagline.forEach((line, i) => {
    const w = f.serif.widthOfTextAtSize(line, tagSize);
    page.drawText(line, { x: W - M - w, y: 782 - i * 15, size: tagSize, font: f.serif, color: NAVY });
  });
  page.drawRectangle({ x: W - M - 34, y: 755, width: 34, height: 2, color: TEAL });

  page.drawLine({ start: { x: M, y: 738 }, end: { x: W - M, y: 738 }, thickness: 1, color: NAVY });

  // ── Başlık
  centered(page, t.title, 694, f.serifBlack, 32, NAVY);
  const subSize = data.language === "de" ? 12.5 : 14;
  centered(page, t.subtitle, 671, f.serifBold, subSize, NAVY);
  page.drawRectangle({ x: W / 2 - 18, y: 658, width: 36, height: 2.4, color: TEAL });

  // ── Belge tarihi / no
  const colon1 = data.language === "de" ? 170 : 152;
  drawLabelRows(
    page,
    [
      { label: t.issued, value: formatDateDot(data.issuedAt) },
      { label: t.docNo, value: data.documentNo },
    ],
    M + 12,
    630,
    colon1,
    f,
    20,
  );

  // ── Kişi kutusu
  page.drawRectangle({ x: M, y: 508, width: W - 2 * M, height: 82, color: BOX });
  const colon2 = colon1;
  drawLabelRows(
    page,
    [
      { label: t.name, value: data.fullName },
      { label: t.birthDate, value: formatDateDot(data.birthDate) },
      { label: t.birthPlace, value: data.birthPlace },
    ],
    M + 14,
    569,
    colon2,
    f,
    21,
  );

  // ── Açıklama
  let y = 484;
  for (const line of wrap(t.statement, f.serif, 11, W - 2 * M - 24)) {
    page.drawText(line, { x: M + 12, y, size: 11, font: f.serif, color: TEXT });
    y -= 16;
  }

  // ── Kurs bilgileri başlığı (soldan sağa açılan şerit)
  y -= 14;
  const bandW = W - 2 * M - 120;
  const steps = 24;
  for (let i = 0; i < steps; i++) {
    page.drawRectangle({
      x: M + (bandW / steps) * i,
      y: y - 8,
      width: bandW / steps + 0.5,
      height: 28,
      color: BOX,
      opacity: 1 - i / steps,
    });
  }
  page.drawText(t.section, { x: M + 12, y: y, size: 14.5, font: f.sansBold, color: NAVY });

  // ── Kurs satırları
  const rows: { label: string; value: string; sub?: string | null }[] = [
    { label: t.course, value: t.courseValue },
    { label: t.level, value: data.level },
    { label: t.mode, value: data.courseType === "live" ? t.modeLive : t.modeDigital },
    { label: t.start, value: formatDateDot(data.courseStart) },
    { label: t.end, value: formatDateDot(data.courseEnd) },
  ];
  if (data.courseType === "live" && data.weeklyHours) {
    rows.push({ label: t.weekly, value: t.weeklyValue(data.weeklyHours), sub: t.weeklySub });
  }
  y = drawLabelRows(page, rows, M + 12, y - 32, colon1, f, 20);

  // ── Amaç cümlesi
  y -= 8;
  for (const line of wrap(t.purpose, f.serif, 11, W - 2 * M - 24)) {
    page.drawText(line, { x: M + 12, y, size: 11, font: f.serif, color: TEXT });
    y -= 16;
  }

  // ── İmza (metnin altına, alt kutuya taşmadan)
  const signLineY = Math.max(176, Math.min(200, y - 46));
  if (signature) {
    const maxW = 130;
    const maxH = 46;
    const scale = Math.min(maxW / signature.width, maxH / signature.height);
    page.drawImage(signature, {
      x: M + 18,
      y: signLineY + 3,
      width: signature.width * scale,
      height: signature.height * scale,
    });
  }
  page.drawLine({ start: { x: M + 12, y: signLineY }, end: { x: M + 170, y: signLineY }, thickness: 0.8, color: NAVY });
  page.drawText(t.signRole, { x: M + 12, y: signLineY - 17, size: 11, font: f.sansBold, color: NAVY });
  page.drawText(SIGNER_NAME, { x: M + 12, y: signLineY - 32, size: 11, font: f.serif, color: TEXT });
  page.drawText(t.signLabel, { x: M + 12, y: signLineY - 45, size: 9.5, font: f.serif, color: TEXT });

  // ── Alt bilgi kutusu (iletişim + doğrulama + karekod)
  const boxY = 50;
  const boxH = 76;
  page.drawRectangle({ x: M, y: boxY, width: W - 2 * M, height: boxH, color: BOX });
  page.drawText(t.contactTitle, { x: M + 14, y: boxY + boxH - 22, size: 11.5, font: f.sansBold, color: NAVY });
  let cy = boxY + boxH - 37;
  for (const line of wrap(t.contactText, f.serif, 8.4, 238)) {
    page.drawText(line, { x: M + 14, y: cy, size: 8.4, font: f.serif, color: TEXT });
    cy -= 11;
  }
  page.drawText(CONTACT_WEB, { x: M + 14, y: cy - 1, size: 8.6, font: f.sansBold, color: TEAL });

  page.drawLine({ start: { x: M + 266, y: boxY + 12 }, end: { x: M + 266, y: boxY + boxH - 12 }, thickness: 0.6, color: rgb(0.75, 0.8, 0.86) });
  drawEnvelopeIcon(page, M + 290, boxY + 51);
  page.drawText(CONTACT_EMAIL, { x: M + 308, y: boxY + 47.5, size: 9.5, font: f.sans, color: NAVY });
  drawPhoneIcon(page, M + 290, boxY + 24);
  page.drawText(CONTACT_PHONE, { x: M + 308, y: boxY + 20.5, size: 9.5, font: f.sans, color: NAVY });

  const qrSize = 62;
  const qrX = W - M - qrSize - 8;
  drawQr(page, data.verifyUrl, qrX, boxY + 12, qrSize);
  const codeText = formatVerifyCode(data.verifyCode);
  const lblW = f.sans.widthOfTextAtSize(t.qrLabel, 6.5);
  page.drawText(t.qrLabel, { x: qrX + (qrSize - lblW) / 2, y: boxY + 6.5, size: 6.5, font: f.sans, color: MUTED });
  const codeW = f.sansBold.widthOfTextAtSize(codeText, 7);
  page.drawText(codeText, { x: qrX + (qrSize - codeW) / 2, y: boxY - 2, size: 7, font: f.sansBold, color: NAVY });

  // ── En alt satır
  page.drawLine({ start: { x: M, y: 34 }, end: { x: W - M, y: 34 }, thickness: 1, color: NAVY });
  centered(page, t.footer, 20, f.sans, 8, MUTED);

  if (data.revoked) {
    page.drawText(t.revoked, {
      x: 120,
      y: 300,
      size: 70,
      font: f.sansBold,
      color: rgb(0.85, 0.1, 0.1),
      opacity: 0.25,
      rotate: degrees(35),
    });
  }

  return doc.save();
}
