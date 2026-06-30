import { createClient as createServerClient, createAdminClient } from "@/lib/supabase/server";
import { activityStatusEmailTemplate, sendEmail } from "@/lib/email";
import { NextResponse, type NextRequest } from "next/server";
import type { ApiResponse, Activity, DenyActivityPayload } from "@/types";

/**
 * POST /api/activities/[id]/deny
 *
 * Admin only. Sets status = 'rejected' with admin_comment.
 * Creates in-app notification + sends email to creator.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { id } = params;

    // Authenticate
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nisi prijavljen/a." },
        { status: 401 }
      );
    }

    // Authorize: admin only
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Samo admin može odbiti aktivnosti." },
        { status: 403 }
      );
    }

    const { admin_comment }: DenyActivityPayload = await request.json();

    if (!admin_comment || admin_comment.trim().length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Komentar je obavezan kod odbijanja." },
        { status: 400 }
      );
    }

    // Fetch activity
    const { data: activity, error: fetchErr } = await supabase
      .from("activities")
      .select("*, creator:profiles!created_by(id, email, full_name)")
      .eq("id", id)
      .single();

    if (fetchErr || !activity) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Aktivnost nije pronađena." },
        { status: 404 }
      );
    }

    if (activity.status !== "pending") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Samo aktivnosti na čekanju se mogu odbiti." },
        { status: 400 }
      );
    }

    // Update status
    const { data: updated, error: updateErr } = await supabase
      .from("activities")
      .update({
        status: "rejected",
        admin_comment: admin_comment.trim(),
        reviewed_by: session.user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*, creator:profiles!created_by(id, email, full_name)")
      .single();

    if (updateErr) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: updateErr.message },
        { status: 500 }
      );
    }

    // Create notification
    const adminClient = createAdminClient();
    await adminClient.from("notifications").insert({
      user_id: activity.created_by,
      activity_id: id,
      type: "rejected",
      message: `Tvoja aktivnost "${activity.title}" je odbijena. Komentar: ${admin_comment}`,
    });

    // Send email
    const creatorEmail = (activity.creator as any)?.email;
    if (creatorEmail) {
      const activityUrl = `${process.env.NEXT_PUBLIC_APP_URL}/activities/${id}`;
      await sendEmail({
        to: creatorEmail,
        subject: `[Math Club FER] Aktivnost odbijena: ${activity.title}`,
        html: activityStatusEmailTemplate(
          (activity.creator as any)?.full_name || "",
          activity.title,
          "rejected",
          admin_comment,
          activityUrl
        ),
      });
    }

    return NextResponse.json<ApiResponse<Activity>>(
      { success: true, data: updated },
      { status: 200 }
    );
  } catch (err) {
    console.error("Deny error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
