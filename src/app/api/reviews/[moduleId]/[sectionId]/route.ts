import { NextResponse } from "next/server";
import { getSessionRole } from "@/lib/auth";
import {
  addFeedback,
  approveSection,
  getSectionReview,
  replyFeedback,
  returnSection,
  unlockSection,
  updateScores,
  updateTopicScore,
} from "@/lib/reviews";
import { getModule, getSection } from "@/content/modules";
import { errorMessage } from "@/lib/errors";
import { MODULE_QUESTIONS_SECTION_ID } from "@/types/reviews";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isValidReviewTarget(moduleId: string, sectionId: string) {
  if (sectionId === MODULE_QUESTIONS_SECTION_ID) {
    return !!getModule(moduleId);
  }
  return !!getSection(moduleId, sectionId);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ moduleId: string; sectionId: string }> }
) {
  const { moduleId, sectionId } = await params;
  if (!isValidReviewTarget(moduleId, sectionId)) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }
  const review = await getSectionReview(moduleId, sectionId);
  const role = await getSessionRole();
  return NextResponse.json({ review, role });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ moduleId: string; sectionId: string }> }
) {
  const role = await getSessionRole();
  if (!role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { moduleId, sectionId } = await params;
  if (!isValidReviewTarget(moduleId, sectionId)) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }

  const body = (await request.json()) as {
    action: string;
    [key: string]: unknown;
  };

  try {
    switch (body.action) {
      case "score": {
        const review = await updateScores(
          moduleId,
          sectionId,
          {
            completeness: body.completeness as number,
            accuracy: body.accuracy as number,
            signOffReadiness: body.signOffReadiness as number,
            ratedBy: body.ratedBy as string,
            notes: body.notes as string | undefined,
          },
          (body.ratedBy as string) || "Reviewer",
          role
        );
        return NextResponse.json({ review });
      }
      case "topic_score": {
        const review = await updateTopicScore(
          moduleId,
          sectionId,
          {
            topicId: body.topicId as string,
            score: body.score as number,
            ratedBy: body.ratedBy as string,
          },
          role
        );
        return NextResponse.json({ review });
      }
      case "feedback": {
        const review = await addFeedback(moduleId, sectionId, {
          author: (body.author as string) || "ENCC Reviewer",
          role,
          message: body.message as string,
          topicId: body.topicId as string | undefined,
        });
        return NextResponse.json({ review });
      }
      case "reply": {
        const review = await replyFeedback(
          moduleId,
          sectionId,
          body.feedbackId as string,
          body.reply as string,
          (body.actor as string) || "Yaqeen",
          role
        );
        return NextResponse.json({ review });
      }
      case "approve": {
        const review = await approveSection(
          moduleId,
          sectionId,
          {
            approvedBy: body.approvedBy as string,
            approverTitle: body.approverTitle as string | undefined,
          },
          role
        );
        return NextResponse.json({ review });
      }
      case "return": {
        const review = await returnSection(
          moduleId,
          sectionId,
          {
            returnedBy: body.returnedBy as string,
            reason: body.reason as string,
          },
          role
        );
        return NextResponse.json({ review });
      }
      case "unlock": {
        if (role !== "admin") {
          return NextResponse.json({ error: "Admin only" }, { status: 403 });
        }
        const review = await unlockSection(
          moduleId,
          sectionId,
          (body.actor as string) || "Yaqeen Admin"
        );
        return NextResponse.json({ review });
      }
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (err) {
    console.error("Review action failed:", err);
    const message = errorMessage(err);
    const status = message.includes("not configured") ? 503 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
