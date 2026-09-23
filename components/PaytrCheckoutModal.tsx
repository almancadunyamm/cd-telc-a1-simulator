"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  slug: string | null;
  username: string;
  onClose: () => void;
  onSuccess: () => void;
};

type Phase = "loading" | "ready" | "error" | "success" | "fail";

export default function PaytrCheckoutModal({ open, slug, username, onClose, onSuccess }: Props) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [token, setToken] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!open || !slug) return;

    let cancelled = false;
    setPhase("loading");
    setToken(null);
    setErrorMsg("");

    fetch("/api/paytr/get-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, username }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.status === "success" && data.token) {
          setToken(data.token);
          setPhase("ready");
        } else {
          setErrorMsg(data.reason || "Ödeme başlatılamadı.");
          setPhase("error");
        }
      })
      .catch(() => {
        if (cancelled) return;
        setErrorMsg("Ödeme sunucusuna ulaşılamadı.");
        setPhase("error");
      });

    return () => {
      cancelled = true;
    };
  }, [open, slug, username]);

  useEffect(() => {
    if (!open) return;

    function handleMessage(e: MessageEvent) {
      if (!e.data || e.data.type !== "paytr-payment-result") return;
      if (e.data.status === "success") {
        setPhase("success");
        setTimeout(() => {
          onSuccess();
        }, 1800);
      } else {
        setPhase("fail");
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [open, onSuccess]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
        >
          ✕
        </button>

        {phase === "loading" && (
          <div className="flex flex-col items-center justify-center gap-3 px-8 py-20 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
            <p className="text-sm font-bold text-slate-600">Ödeme ekranı hazırlanıyor...</p>
          </div>
        )}

        {phase === "error" && (
          <div className="px-8 py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">⚠️</div>
            <h2 className="text-lg font-black text-slate-900">Ödeme başlatılamadı</h2>
            <p className="mt-2 text-sm text-slate-600">{errorMsg}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-black text-white hover:bg-slate-800"
            >
              Kapat
            </button>
          </div>
        )}

        {phase === "success" && (
          <div className="px-8 py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">✅</div>
            <h2 className="text-lg font-black text-slate-900">Ödemen alındı</h2>
            <p className="mt-2 text-sm text-slate-600">Erişimin açılıyor, birazdan sayfan yenilenecek.</p>
          </div>
        )}

        {phase === "fail" && (
          <div className="px-8 py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">⚠️</div>
            <h2 className="text-lg font-black text-slate-900">Ödeme tamamlanamadı</h2>
            <p className="mt-2 text-sm text-slate-600">Kartından tutar çekilmedi. Tekrar deneyebilirsin.</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-black text-white hover:bg-slate-800"
            >
              Kapat
            </button>
          </div>
        )}

        {phase === "ready" && token && (
          <iframe
            ref={iframeRef}
            src={`https://www.paytr.com/odeme/guvenli/${token}`}
            className="h-[600px] w-full border-0"
            title="PayTR Ödeme"
          />
        )}
      </div>
    </div>
  );
}