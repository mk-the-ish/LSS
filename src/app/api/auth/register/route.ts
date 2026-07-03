import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { sendRegistrationNotification } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 500 });
    }

    const body = await request.json();
    const {
      fullName,
      email,
      companyName,
      category,
      phone,
      vehiclePasses = 0,
      multiTickets = 0,
      singleTickets = 0,
      dinnerTickets = 0,
      wantsAdvertising = false,
      sponsorships = [],
      totalUsd = 0,
      isEarlyBird = false,
    } = body;

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: "User not authenticated" }, { status: 401 });
    }

    // Generate payment reference from phone
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const refSuffix = cleanPhone.length >= 4 ? cleanPhone.slice(-4) : user.id.slice(0, 4).toUpperCase();
    const paymentReference = `LSS26-${refSuffix}`;

    // Create or update profile
    const { error: upsertError } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        full_name: fullName,
        email: email,
        company_name: companyName,
        category: category,
        phone: phone,
        additional_vehicle_passes: vehiclePasses,
        additional_multi_tickets: multiTickets,
        additional_single_tickets: singleTickets,
        dinner_tickets_qty: dinnerTickets,
        wants_advertising: wantsAdvertising,
        selected_sponsorships: sponsorships,
        calculated_total_usd: totalUsd,
        is_early_bird: isEarlyBird,
        payment_method: "USD",
        verification_status: "pending_payment",
        payment_reference: paymentReference,
      },
      { onConflict: "id" }
    );

    if (upsertError) {
      console.error("Profile upsert error:", upsertError);
      return NextResponse.json({ ok: false, error: `Failed to create profile: ${upsertError.message}` }, { status: 400 });
    }

    // Send registration notification emails
    const emailResult = await sendRegistrationNotification({
      full_name: fullName,
      email: email,
      company_name: companyName,
      category: category,
      phone: phone,
      calculated_total_usd: totalUsd,
      payment_reference: paymentReference,
    });

    if (!emailResult.ok) {
      console.error("Email notification failed:", emailResult.error);
      // Don't fail the registration if email fails - user still gets registered
    }

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

