import { redirect } from "next/navigation";

export default async function LevelRedirect({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  redirect(`/sinav-hazirlik#${level.toLowerCase()}`);
}
