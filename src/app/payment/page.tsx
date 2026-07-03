import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import PaymentClient from "@/components/payment-client";

export default async function PaymentPage() {
  const supabase = createSupabaseServerClient();
  if (!supabase) redirect("/login?next=payment");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=payment");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!profile) redirect("/login?next=payment&reason=profile");

  return <PaymentClient profile={profile as Record<string, unknown>} userEmail={user.email ?? null} />;
}
