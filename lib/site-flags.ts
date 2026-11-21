// Site genelindeki aç/kapa anahtarları.

// Dijital Simülatör tanıtım linkleri (ana sayfa kartı, üst menü, kayıt
// ekranındaki "Dijital Kurs" seçeneği, Kaynaklar sayfası).
// false: linkler gizlenir, yerine "Ücretsiz Deneme Dersi" gösterilir (giriş sayfasındaki deneme kutusu dahil).
// true (19.10.2026'dan beri): dijital simülatör görünür; deneme dersi sitede
// hiçbir yerde linklenmez ama /deneme-dersi sayfası ve paneli çalışmaya devam eder.
// /digital-simulation sayfası ve mevcut dijital öğrencilerin paneli
// etkilenmez. Reklam dönemi bitince true yapmanız yeterli.
export const DIGITAL_SIMULATOR_VISIBLE = true;

// Canlı Akademi tanıtım linkleri (ana sayfa kartı, üst menü, kayıt ekranındaki
// "Canlı Akademi" seçeneği, footer, Kaynaklar, Almanca Okulum sayfası, seviye
// tespit sonucu). false (22.11.2026'dan beri): canlı kurs verilmiyor, linkler
// gizli. /academy-live sayfası, kodu ve mevcut canlı öğrencilerin paneli
// çalışmaya devam eder. Geri açmak için true yapmanız yeterli.
export const LIVE_ACADEMY_VISIBLE = false;

// Dijital Kurs sayfasında (/digital-simulation) Gelişim / Zirve fiyat kartları.
// false (22.11.2026'dan beri): herkese açık sayfada yalnızca ücretsiz Başlangıç
// kartı görünür; öğrenci ücretli paketleri ve fiyatlarını panel içinde görür.
// /packages sayfası ve panel içindeki paket seçimi etkilenmez.
export const PUBLIC_PAID_PRICES_VISIBLE = false;
