import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type Body = {
  profileId?: string;
  userId?: string;
  action: "approve" | "reject";
  rejectionReason?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
    }
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminError || !adminUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await request.json()) as Body;
    const targetId = body.profileId || body.userId;

    if (!targetId || !["approve", "reject"].includes(body.action)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const update =
      body.action === "approve"
        ? {
            verification_status: "verified",
            rejection_reason: null,
          }
        : {
            verification_status: "pending_payment",
            rejection_reason: body.rejectionReason || "Payment details require review",
            pop_url: null,
            pop_file_name: null,
            pop_uploaded_at: null,
          };

    const { error } = await supabase.from("profiles").update(update).eq("id", targetId);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
