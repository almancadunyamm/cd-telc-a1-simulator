"use client";

import { usePathname } from "next/navigation";

// Öğrenci paneli: buton burada global olarak gösterilmez; panel sayfası
// öğrencinin türüne göre <WhatsAppLink /> bileşenini kendisi render eder.
const STUDENT_PANEL_PREFIXES = ["/dashboard"];

// Öğretmen ve admin panellerinde buton hiç gösterilmez.
const STAFF_PANEL_PREFIXES = ["/teacher", "/admin"];

export function WhatsAppLink() {
  return (
    <a
      href="https://wa.me/905013434419"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile iletişime geç"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 transition hover:scale-110 hover:bg-emerald-600 md:bottom-6 md:right-6"
    >
      <svg
        viewBox="0 0 32 32"
        className="h-8 w-8"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.7 4.605 1.905 6.472L4 29l7.72-1.865A11.93 11.93 0 0 0 16.001 27C22.629 27 28 21.627 28 15S22.629 3 16.001 3Zm0 21.75c-1.98 0-3.83-.55-5.41-1.505l-.388-.23-4.58 1.107 1.128-4.463-.253-.401A9.71 9.71 0 0 1 5.25 15c0-5.936 4.815-10.75 10.751-10.75S26.75 9.064 26.75 15 21.937 24.75 16.001 24.75Zm5.955-8.058c-.326-.163-1.929-.952-2.228-1.061-.299-.109-.516-.163-.733.163-.217.327-.842 1.06-1.032 1.278-.19.217-.38.245-.706.082-.326-.163-1.377-.508-2.622-1.618-.969-.865-1.623-1.933-1.813-2.259-.19-.327-.02-.503.143-.665.147-.146.326-.38.489-.571.163-.19.217-.327.326-.544.109-.218.054-.408-.027-.571-.082-.163-.733-1.767-1.005-2.42-.264-.634-.532-.548-.733-.558l-.625-.011c-.217 0-.571.082-.87.408-.299.327-1.14 1.115-1.14 2.719 0 1.605 1.167 3.156 1.33 3.374.163.217 2.298 3.507 5.567 4.918.778.336 1.385.536 1.858.686.78.248 1.49.213 2.052.129.626-.093 1.929-.789 2.201-1.55.272-.762.272-1.415.19-1.55-.081-.136-.298-.218-.625-.381Z" />
      </svg>
    </a>
  );
}

export default function WhatsAppButton() {
  const pathname = usePathname() || "";
  const matches = (prefixes: string[]) =>
    prefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
    );

  if (matches(STUDENT_PANEL_PREFIXES) || matches(STAFF_PANEL_PREFIXES)) {
    return null;
  }
  return <WhatsAppLink />;
}
