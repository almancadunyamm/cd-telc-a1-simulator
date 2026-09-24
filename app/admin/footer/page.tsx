"use client";

import { useEffect, useState } from "react";

type FooterLinkItem = {
  title: string;
  description: string;
  href: string;
};

type FooterColumn = {
  title: string;
  links: FooterLinkItem[];
};

const defaultFooterColumns: FooterColumn[] = [
  {
    title: "TELC Dijital Sistem",
    links: [
      {
        title: "TELC Dijital Sınav",
        description: "TELC sınav formatına uygun dijital denemelerle seviyeni ölç.",
        href: "/telc-dijital-sinav",
      },
      {
        title: "Online TELC Denemeleri",
        description: "A1, A2 ve B1 seviyelerine uygun online TELC deneme sınavları.",
        href: "/online-telc-denemeleri",
      },
    ],
  },
  {
    title: "TELC Hazırlık",
    links: [
      {
        title: "TELC A1 Hazırlık",
        description: "TELC A1 sınavına yazma, konuşma, dinleme ve okuma çalışmalarıyla hazırlan.",
        href: "/telc-a1-hazirlik",
      },
      {
        title: "TELC B1 Hazırlık",
        description: "TELC B1 sınavına yönelik kapsamlı online hazırlık içerikleri.",
        href: "/telc-b1-hazirlik",
      },
    ],
  },
];

export default function AdminFooterPage() {
  const [content, setContent] = useState<FooterColumn[]>(defaultFooterColumns);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("footerContent");

    if (stored) {
      setContent(JSON.parse(stored));
    }
  }, []);

  function saveContent() {
    localStorage.setItem("footerContent", JSON.stringify(content));
    setSaved(true);
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <a
          href="/admin"
          className="mb-4 inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900"
        >
          ← Admin Paneline Dön
        </a>
        <h1 className="text-3xl font-black text-slate-900">Footer SEO Yönetimi</h1>

        <p className="mt-3 text-sm text-slate-600">
          Footer başlıklarını ve açıklamalarını buradan düzenleyebilirsin.
        </p>

        <div className="mt-8 space-y-6">
          {content.map((column, columnIndex) => (
            <section
              key={column.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-900">{column.title}</h2>

              <div className="mt-5 space-y-4">
                {column.links.map((link, linkIndex) => (
                  <div
                    key={link.title}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <label className="text-xs font-bold text-slate-500">
  Başlık
</label>

<input
  value={link.title}
  onChange={(e) => {
    const updated = [...content];
    updated[columnIndex].links[linkIndex].title = e.target.value;
    setContent(updated);
    setSaved(false);
  }}
  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
/>

<label className="mt-4 block text-xs font-bold text-slate-500">
  SEO Açıklaması
</label>

<textarea
  value={link.description}
  onChange={(e) => {
    const updated = [...content];
    updated[columnIndex].links[linkIndex].description = e.target.value;
    setContent(updated);
    setSaved(false);
  }}
  rows={3}
  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
/>

<label className="mt-4 block text-xs font-bold text-slate-500">
  Link
</label>

<input
  value={link.href}
  onChange={(e) => {
    const updated = [...content];
    updated[columnIndex].links[linkIndex].href = e.target.value;
    setContent(updated);
    setSaved(false);
  }}
  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
/>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <button
          type="button"
          onClick={saveContent}
          className="mt-8 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white"
        >
          Kaydet
        </button>

        {saved ? (
          <p className="mt-4 text-sm text-green-600">Kaydedildi.</p>
        ) : null}
      </div>
    </main>
  );
}