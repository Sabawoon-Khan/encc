import { readFile, writeFile } from "fs/promises";
import path from "path";
import type {
  AuditEntry,
  FeedbackEntry,
  ReviewsStore,
  SectionReview,
  SectionScores,
} from "@/types/reviews";
import { reviewKey } from "@/types/reviews";

const STORE_PATH = path.join(process.cwd(), "content/reviews.json");
const UPLOADS_DIR = path.join(process.cwd(), "public/uploads");

export async function readReviewsStore(): Promise<ReviewsStore> {
  try {
    const raw = await readFile(STORE_PATH, "utf-8");
    const data = JSON.parse(raw) as ReviewsStore & {
      modules?: Record<
        string,
        Omit<SectionReview, "sectionId"> & { sectionId?: string }
      >;
    };

    if (data.sections) return { sections: data.sections };

    const sections: ReviewsStore["sections"] = {};
    if (data.modules) {
      for (const [moduleId, modReview] of Object.entries(data.modules)) {
        const sectionId = modReview.sectionId ?? "archive";
        sections[reviewKey(moduleId, sectionId)] = {
          ...modReview,
          moduleId,
          sectionId,
          signOffPersonnel: modReview.signOffPersonnel ?? [],
          feedback: (modReview.feedback ?? []).map((fb) => ({
            ...fb,
            sectionId: fb.sectionId ?? sectionId,
            status: fb.status ?? "open",
          })),
        };
      }
    }
    return { sections };
  } catch {
    return { sections: {} };
  }
}

async function writeStore(store: ReviewsStore) {
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

function emptyReview(moduleId: string, sectionId: string): SectionReview {
  return {
    moduleId,
    sectionId,
    locked: false,
    approvalStatus: "draft",
    paymentMilestone: "pending",
    scores: {
      completeness: null,
      accuracy: null,
      signOffReadiness: null,
    },
    feedback: [],
    topicScores: {},
    signOffPersonnel: [],
    auditLog: [],
  };
}

export async function getSectionReview(
  moduleId: string,
  sectionId: string
): Promise<SectionReview> {
  const store = await readReviewsStore();
  const key = reviewKey(moduleId, sectionId);
  const review = store.sections[key] ?? emptyReview(moduleId, sectionId);
  return { ...review, topicScores: review.topicScores ?? {} };
}

/** @deprecated use getSectionReview */
export async function getModuleReview(moduleId: string) {
  return getSectionReview(moduleId, "archive");
}

export function isSectionLocked(review: SectionReview): boolean {
  return review.locked || review.approvalStatus === "approved";
}

/** @deprecated use isSectionLocked */
export function isModuleLocked(review: SectionReview): boolean {
  return isSectionLocked(review);
}

export async function getAllReviews(): Promise<SectionReview[]> {
  const store = await readReviewsStore();
  return Object.values(store.sections);
}

function appendAudit(
  review: SectionReview,
  entry: Omit<AuditEntry, "id" | "timestamp">
): SectionReview {
  return {
    ...review,
    auditLog: [
      { ...entry, id: `audit-${Date.now()}`, timestamp: new Date().toISOString() },
      ...review.auditLog,
    ].slice(0, 100),
  };
}

async function save(review: SectionReview) {
  const store = await readReviewsStore();
  store.sections[reviewKey(review.moduleId, review.sectionId)] = review;
  await writeStore(store);
}

export async function updateScores(
  moduleId: string,
  sectionId: string,
  scores: Partial<SectionScores> & { ratedBy: string },
  actor: string,
  role: "client" | "admin"
) {
  let review = await getSectionReview(moduleId, sectionId);
  if (isSectionLocked(review) && role !== "admin") {
    throw new Error("Section is locked");
  }
  review = {
    ...review,
    scores: { ...review.scores, ...scores, ratedAt: new Date().toISOString() },
    approvalStatus: review.approvalStatus === "draft" ? "in_review" : review.approvalStatus,
  };
  review = appendAudit(review, { action: "scores_updated", actor, role });
  await save(review);
  return review;
}

export async function updateTopicScore(
  moduleId: string,
  sectionId: string,
  data: { topicId: string; score: number; ratedBy: string },
  role: "client" | "admin"
) {
  if (data.score < 0 || data.score > 3) {
    throw new Error("Score must be 0–3");
  }
  let review = await getSectionReview(moduleId, sectionId);
  if (isSectionLocked(review) && role !== "admin") {
    throw new Error("Section is locked");
  }
  review = {
    ...review,
    topicScores: {
      ...review.topicScores,
      [data.topicId]: {
        score: data.score,
        ratedBy: data.ratedBy,
        ratedAt: new Date().toISOString(),
      },
    },
    approvalStatus: review.approvalStatus === "draft" ? "in_review" : review.approvalStatus,
  };
  review = appendAudit(review, {
    action: "topic_score_updated",
    actor: data.ratedBy,
    role,
    detail: `${data.topicId}: ${data.score}/3`,
  });
  await save(review);
  return review;
}

export async function addFeedback(
  moduleId: string,
  sectionId: string,
  entry: Omit<FeedbackEntry, "id" | "createdAt" | "moduleId" | "sectionId" | "status"> & {
    status?: FeedbackEntry["status"];
  }
) {
  let review = await getSectionReview(moduleId, sectionId);
  if (review.approvalStatus === "approved" && review.locked && entry.role !== "admin") {
    throw new Error("Section is locked");
  }
  const item: FeedbackEntry = {
    ...entry,
    id: `fb-${Date.now()}`,
    moduleId,
    sectionId,
    status: entry.status ?? "open",
    createdAt: new Date().toISOString(),
  };
  review = {
    ...review,
    feedback: [item, ...review.feedback],
    approvalStatus: review.approvalStatus === "draft" ? "in_review" : review.approvalStatus,
  };
  review = appendAudit(review, {
    action: "feedback_added",
    actor: entry.author,
    role: entry.role,
    detail: entry.message.slice(0, 80),
  });
  await save(review);
  return review;
}

export async function replyFeedback(
  moduleId: string,
  sectionId: string,
  feedbackId: string,
  reply: string,
  actor: string,
  role: "client" | "admin"
) {
  let review = await getSectionReview(moduleId, sectionId);
  const idx = review.feedback.findIndex((f) => f.id === feedbackId);
  if (idx === -1) throw new Error("Message not found");
  review.feedback[idx] = {
    ...review.feedback[idx],
    reply,
    status: "answered",
  };
  review = appendAudit(review, { action: "feedback_answered", actor, role });
  await save(review);
  return review;
}

export async function approveSection(
  moduleId: string,
  sectionId: string,
  data: { approvedBy: string; approverTitle?: string },
  role: "client" | "admin"
) {
  let review = await getSectionReview(moduleId, sectionId);
  const { completeness, accuracy, signOffReadiness } = review.scores;
  if (completeness === null || accuracy === null || signOffReadiness === null) {
    throw new Error("Submit all three scores (0–3) before approval");
  }
  review = {
    ...review,
    locked: true,
    lockedAt: new Date().toISOString(),
    approvalStatus: "approved",
    approvedBy: data.approvedBy,
    approverTitle: data.approverTitle,
    approvedAt: new Date().toISOString(),
    paymentMilestone: "released",
    signOffPersonnel: [
      { name: data.approvedBy, position: data.approverTitle ?? "ENCC Reviewer", signedAt: new Date().toISOString() },
      ...review.signOffPersonnel,
    ],
  };
  review = appendAudit(review, {
    action: "approved_and_locked",
    actor: data.approvedBy,
    role,
    detail: `Scores: ${completeness}/${accuracy}/${signOffReadiness}`,
  });
  await save(review);
  return review;
}

export async function returnSection(
  moduleId: string,
  sectionId: string,
  data: { returnedBy: string; reason: string },
  role: "client" | "admin"
) {
  let review = await getSectionReview(moduleId, sectionId);
  if (review.locked && review.approvalStatus === "approved" && role !== "admin") {
    throw new Error("Admin must unlock first");
  }
  const item: FeedbackEntry = {
    id: `fb-${Date.now()}`,
    moduleId,
    sectionId,
    author: data.returnedBy,
    role,
    message: data.reason,
    status: "open",
    createdAt: new Date().toISOString(),
  };
  review = {
    ...review,
    locked: false,
    approvalStatus: "returned",
    paymentMilestone: "pending",
    feedback: [item, ...review.feedback],
  };
  review = appendAudit(review, { action: "returned", actor: data.returnedBy, role });
  await save(review);
  return review;
}

export async function unlockSection(moduleId: string, sectionId: string, actor: string) {
  let review = await getSectionReview(moduleId, sectionId);
  review = {
    ...review,
    locked: false,
    approvalStatus: "in_review",
    paymentMilestone: "pending",
    approvedBy: undefined,
    approvedAt: undefined,
  };
  review = appendAudit(review, { action: "admin_unlock", actor, role: "admin" });
  await save(review);
  return review;
}
