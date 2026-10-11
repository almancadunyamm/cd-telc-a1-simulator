"use client";

import { useEffect, useState } from "react";
import { TRIAL_LEAD_STORAGE_KEY } from "@/lib/trial";
import TrialLeadForm, { type TrialLead } from "./TrialLeadForm";
import TrialPanel from "./TrialPanel";

export default function DenemeDersiPage() {
  const [lead, setLead] = useState<TrialLead | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Formu daha önce dolduran ziyaretçi doğrudan panele girer.
    try {
      const raw = localStorage.getItem(TRIAL_LEAD_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as TrialLead;
        if (parsed?.name) setLead(parsed);
      }
    } catch {}
    setReady(true);
  }, []);

  if (!ready) {
    return <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50" />;
  }

  if (!lead) {
    return (
      <TrialLeadForm
        onDone={(nextLead) => {
          setLead(nextLead);
          // Mobilde form sayfanın altında; panel en üstten açılsın.
          window.scrollTo({ top: 0 });
        }}
      />
    );
  }

  return <TrialPanel lead={lead} />;
}
