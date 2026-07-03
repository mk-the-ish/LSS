import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { sendPaymentUploadNotification } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 500 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: "User not authenticated" }, { status: 401 });
    }

    // Get user profile to send notification
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (!profile) {
      return NextResponse.json({ ok: false, error: "Profile not found" }, { status: 404 });
    }

    // Send payment upload notification
    const emailResult = await sendPaymentUploadNotification({
      full_name: profile.full_name as string,
      email: profile.email as string,
      company_name: profile.company_name as string,
      payment_reference: profile.payment_reference as string,
      calculated_total_usd: profile.calculated_total_usd as number,
    });

    if (!emailResult.ok) {
      console.error("Payment upload email failed:", emailResult.error);
      return NextResponse.json({ ok: false, error: "Email notification failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Payment notification API error:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
