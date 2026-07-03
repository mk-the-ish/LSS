import { redirect } from "next/navigation";
import PortalPageClient from "@/components/portal-page-client";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function PortalPage() {
  const supabase = createSupabaseServerClient();
  if (!supabase) redirect("/login?next=portal");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=portal");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!profile) redirect("/login?next=portal&reason=profile");

  return <PortalPageClient initialProfile={(profile as Record<string, unknown> | null) ?? null} userEmail={user.email ?? null} />;
}
