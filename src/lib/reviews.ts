import { readFile, writeFile } from "fs/promises";
import type {
  AuditEntry,
  FeedbackEntry,
  FeedbackReply,
  ReviewsStore,
  SectionReview,
  SectionScores,
} from "@/types/reviews";
import {
  MODULE_QUESTIONS_SECTION_ID,
  reviewKey,
  isTopicScoreLocked,
} from "@/types/reviews";
import {
  ensureLocalDataDir,
  getReviewsStorePath,
} from "@/lib/runtimeData";
import { getSupabase } from "@/lib/supabase";
import { useRemoteStore } from "@/lib/dataStore";
import { isHostedDeployment } from "@/lib/env";
import { errorMessage } from "@/lib/errors";

function storePath() {
  return getReviewsStorePath();
}

async function readReviewsFromFile(): Promise<ReviewsStore> {
  try {
    const raw = await readFile(storePath(), "utf-8");
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

async function readReviewsFromSupabase(): Promise<ReviewsStore> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("section_reviews").select("data");
  if (error) throw new Error(errorMessage(error));

  const sections: ReviewsStore["sections"] = {};
  for (const row of data ?? []) {
    const review = row.data as SectionReview;
    sections[reviewKey(review.moduleId, review.sectionId)] = {
      ...review,
      topicScores: review.topicScores ?? {},
      signOffPersonnel: review.signOffPersonnel ?? [],
      feedback: review.feedback ?? [],
      auditLog: review.auditLog ?? [],
    };
  }
  return { sections };
}

export async function readReviewsStore(): Promise<ReviewsStore> {
  if (useRemoteStore()) {
    return readReviewsFromSupabase();
  }
  return readReviewsFromFile();
}

async function writeStoreToFile(store: ReviewsStore) {
  await ensureLocalDataDir();
  await writeFile(storePath(), JSON.stringify(store, null, 2), "utf-8");
}

async function writeReviewToSupabase(review: SectionReview) {
  const supabase = getSupabase();
  const { error } = await supabase.from("section_reviews").upsert(
    {
      module_id: review.moduleId,
      section_id: review.sectionId,
      data: review,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "module_id,section_id" }
  );
  if (error) throw new Error(errorMessage(error));
}

async function writeStore(store: ReviewsStore) {
  if (useRemoteStore()) {
    await Promise.all(
      Object.values(store.sections).map((review) => writeReviewToSupabase(review))
    );
    return;
  }
  await writeStoreToFile(store);
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

/** Old keys from before archive became its own module — merged on read & via scripts/merge-legacy-reviews.mjs */
const LEGACY_REVIEW_SOURCES: Record<string, { moduleId: string; sectionId: string }[]> = {
  [reviewKey("archive", "archive")]: [{ moduleId: "opr", sectionId: "archive" }],
};

function mergeReviewData(primary: SectionReview, legacy: SectionReview): SectionReview {
  const feedbackById = new Map<string, FeedbackEntry>();
  for (const fb of [...legacy.feedback, ...primary.feedback]) {
    feedbackById.set(fb.id, {
      ...fb,
      moduleId: primary.moduleId,
      sectionId: primary.sectionId,
    });
  }

  const auditById = new Map<string, AuditEntry>();
  for (const entry of [...legacy.auditLog, ...primary.auditLog]) {
    auditById.set(entry.id, entry);
  }

  return {
    ...primary,
    feedback: [...feedbackById.values()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    auditLog: [...auditById.values()].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ),
    topicScores: { ...legacy.topicScores, ...primary.topicScores },
    scores: {
      completeness: primary.scores.completeness ?? legacy.scores.completeness,
      accuracy: primary.scores.accuracy ?? legacy.scores.accuracy,
      signOffReadiness: primary.scores.signOffReadiness ?? legacy.scores.signOffReadiness,
      ratedBy: primary.scores.ratedBy ?? legacy.scores.ratedBy,
      ratedAt: primary.scores.ratedAt ?? legacy.scores.ratedAt,
      notes: primary.scores.notes ?? legacy.scores.notes,
    },
    signOffPersonnel: [...primary.signOffPersonnel, ...legacy.signOffPersonnel],
  };
}

async function loadLegacyReviews(
  moduleId: string,
  sectionId: string,
  loader: (moduleId: string, sectionId: string) => Promise<SectionReview | null>
): Promise<SectionReview | null> {
  const sources = LEGACY_REVIEW_SOURCES[reviewKey(moduleId, sectionId)];
  if (!sources?.length) return null;

  let merged: SectionReview | null = null;
  for (const src of sources) {
    const legacy = await loader(src.moduleId, src.sectionId);
    if (!legacy) continue;
    merged = merged
      ? mergeReviewData(emptyReview(moduleId, sectionId), mergeReviewData(merged, legacy))
      : legacy;
  }
  return merged;
}

async function getSectionReviewFromSupabase(
  moduleId: string,
  sectionId: string
): Promise<SectionReview | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("section_reviews")
    .select("data")
    .eq("module_id", moduleId)
    .eq("section_id", sectionId)
    .maybeSingle();
  if (error) throw new Error(errorMessage(error));
  if (!data) return null;
  const review = data.data as SectionReview;
  return {
    ...review,
    topicScores: review.topicScores ?? {},
    signOffPersonnel: review.signOffPersonnel ?? [],
    feedback: review.feedback ?? [],
    auditLog: review.auditLog ?? [],
  };
}

export async function getSectionReview(
  moduleId: string,
  sectionId: string
): Promise<SectionReview> {
  if (useRemoteStore()) {
    const [review, legacy] = await Promise.all([
      getSectionReviewFromSupabase(moduleId, sectionId),
      loadLegacyReviews(moduleId, sectionId, getSectionReviewFromSupabase),
    ]);
    const base = review ?? emptyReview(moduleId, sectionId);
    if (legacy) return mergeReviewData(base, legacy);
    return base;
  }
  if (isHostedDeployment()) {
    throw new Error(
      "Review storage is not configured for production. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY on Vercel."
    );
  }
  const store = await readReviewsFromFile();
  const key = reviewKey(moduleId, sectionId);
  const review = store.sections[key] ?? emptyReview(moduleId, sectionId);
  const legacySources = LEGACY_REVIEW_SOURCES[key];
  if (legacySources) {
    let legacyMerged: SectionReview | null = null;
    for (const src of legacySources) {
      const leg = store.sections[reviewKey(src.moduleId, src.sectionId)];
      if (!leg) continue;
      legacyMerged = legacyMerged
        ? mergeReviewData(emptyReview(moduleId, sectionId), mergeReviewData(legacyMerged, leg))
        : leg;
    }
    if (legacyMerged) return mergeReviewData({ ...review, topicScores: review.topicScores ?? {} }, legacyMerged);
  }
  return { ...review, topicScores: review.topicScores ?? {} };
}

export async function getModuleQuestionsReview(moduleId: string) {
  return getSectionReview(moduleId, MODULE_QUESTIONS_SECTION_ID);
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
  if (useRemoteStore()) {
    await writeReviewToSupabase(review);
    return;
  }
  if (isHostedDeployment()) {
    throw new Error(
      "Review storage is not configured for production. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY on Vercel (or use the built-in defaults)."
    );
  }
  const store = await readReviewsStore();
  store.sections[reviewKey(review.moduleId, review.sectionId)] = review;
  await writeStore(store);
}


export { isTopicScoreLocked } from "@/types/reviews";

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
  if (review.scoresLocked && role !== "admin") {
    throw new Error("Scores are locked and cannot be changed");
  }
  review = {
    ...review,
    scores: { ...review.scores, ...scores, ratedAt: new Date().toISOString() },
    scoresLocked: true,
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
  const existing = review.topicScores?.[data.topicId];
  if (isTopicScoreLocked(existing) && role !== "admin") {
    throw new Error("Score for this part is locked");
  }
  review = {
    ...review,
    topicScores: {
      ...review.topicScores,
      [data.topicId]: {
        score: data.score,
        ratedBy: data.ratedBy,
        ratedAt: new Date().toISOString(),
        locked: true,
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
  const item: FeedbackEntry = {
    ...entry,
    id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
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
  const existing = review.feedback[idx];
  const priorReplies =
    existing.replies ??
    (existing.reply
      ? [
          {
            id: `${existing.id}-legacy`,
            text: existing.reply,
            author: "Yaqeen",
            createdAt: existing.createdAt,
          },
        ]
      : []);
  const newReply: FeedbackReply = {
    id: `reply-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text: reply,
    author: actor,
    createdAt: new Date().toISOString(),
  };
  const replies = [...priorReplies, newReply];
  review.feedback[idx] = {
    ...existing,
    replies,
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
    scoresLocked: false,
    approvalStatus: "in_review",
    paymentMilestone: "pending",
    approvedBy: undefined,
    approvedAt: undefined,
  };
  review = appendAudit(review, { action: "admin_unlock", actor, role: "admin" });
  await save(review);
  return review;
}
