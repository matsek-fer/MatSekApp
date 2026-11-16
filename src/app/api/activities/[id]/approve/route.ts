import { NextResponse, type NextRequest } from "next/server";
import { asService, withUser } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { activityStatusEmailTemplate, appUrl, sendEmail } from "@/lib/email";
import { isUuid } from "@/lib/validation";
import type { ApiResponse, Activity, ReviewResult } from "@/types";

/**
 * POST /api/activities/[id]/approve
 *
 * Admin only. Sets status = 'approved'.
 * Creates in-app notification + sends email to creator.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Authenticate
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nisi prijavljen/a." },
        { status: 401 }
      );
    }

    // Authorize: admin only
    if (user.role !== "admin") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Samo admin može odobriti aktivnosti." },
        { status: 403 }
      );
    }

    // Fetch activity
    const [activity] = isUuid(id)
      ? await withUser(user.id, (tx) =>
          tx<Activity[]>`SELECT * FROM activities WHERE id = ${id}`
        )
      : [];

    if (!activity) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Aktivnost nije pronađena." },
        { status: 404 }
      );
    }

    if (activity.status !== "pending") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Samo aktivnosti na čekanju se mogu odobriti." },
        { status: 400 }
      );
    }

    // Update status. `status = 'pending'` again in the WHERE, so two admins
    // acting at once cannot both review the same proposal.
    const updated = await withUser(user.id, async (tx) => {
      const changed = await tx`
        UPDATE activities
        SET status = 'approved',
            reviewed_by = ${user.id},
            reviewed_at = now(),
            -- Shown on the public page as the admin's words, so nothing a
            -- member managed to leave in it survives approval.
            admin_comment = NULL
        WHERE id = ${id} AND status = 'pending'
      `;
      if (changed.count === 0) return null;
      const [row] = await tx<Activity[]>`
        SELECT * FROM activities_with_creator WHERE id = ${id}
      `;
      return row;
    });

    if (!updated) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Samo aktivnosti na čekanju se mogu odobriti." },
        { status: 409 }
      );
    }

    // The notification belongs to another member, which no policy lets an
    // admin insert, and the proposer's address is a column members cannot
    // read (profiles grants them the name and role only) — so both go
    // through asService(), after the admin check above and for nothing else.
    const creator = await asService(async (tx) => {
      await tx`
        INSERT INTO notifications (user_id, activity_id, type, message)
        VALUES (${activity.created_by}, ${id}, 'approved',
                ${`Tvoja aktivnost "${activity.title}" je odobrena.`})
      `;
      const [row] = await tx<{ email: string; full_name: string }[]>`
        SELECT email, full_name FROM profiles WHERE id = ${activity.created_by}
      `;
      return row;
    });

    const creatorEmail = creator?.email;
    // Reported back rather than swallowed: the admin should know when the
    // proposer did not hear about the decision and tell them another way.
    let emailSent = false;
    if (creatorEmail) {
      const activityUrl = `${appUrl()}/activities/${id}`;
      emailSent = await sendEmail({
        to: creatorEmail,
        subject: `[Math Club FER] Aktivnost odobrena: ${activity.title}`,
        html: activityStatusEmailTemplate(
          creator?.full_name || "",
          activity.title,
          "approved",
          "",
          activityUrl
        ),
      });
    }

    return NextResponse.json<ApiResponse<ReviewResult>>(
      { success: true, data: { ...updated, email_sent: emailSent } },
      { status: 200 }
    );
  } catch (err) {
    console.error("Approve error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
