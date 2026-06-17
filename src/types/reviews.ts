export type SessionRole = "client" | "admin";

export type ApprovalStatus = "draft" | "in_review" | "approved" | "returned";

export type MessageStatus = "open" | "answered" | "closed";

export interface SectionScores {
  completeness: number | null;
  accuracy: number | null;
  signOffReadiness: number | null;
  ratedBy?: string;
  ratedAt?: string;
  notes?: string;
}

export interface FeedbackReply {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface FeedbackEntry {
  id: string;
  moduleId: string;
  sectionId: string;
  /** Template subsection id, e.g. objectives, workflows */
  topicId?: string;
  author: string;
  role: "client" | "admin";
  message: string;
  status: MessageStatus;
  /** @deprecated use replies — kept for older saved data */
  reply?: string;
  replies?: FeedbackReply[];
  createdAt: string;
}

/** All answers on a question, including legacy single-reply field. */
export function getFeedbackReplies(entry: FeedbackEntry): FeedbackReply[] {
  if (entry.replies?.length) return entry.replies;
  if (entry.reply) {
    return [
      {
        id: `${entry.id}-legacy`,
        text: entry.reply,
        author: "Yaqeen",
        createdAt: entry.createdAt,
      },
    ];
  }
  return [];
}

export function hasUnansweredFeedback(entry: FeedbackEntry): boolean {
  return getFeedbackReplies(entry).length === 0;
}

export interface SignOffEntry {
  name: string;
  position: string;
  signedAt?: string;
}

export interface TopicScoreEntry {
  score: number;
  ratedBy: string;
  ratedAt: string;
  /** Set true when saved — cannot change except by admin */
  locked: boolean;
}

export interface SectionReview {
  moduleId: string;
  sectionId: string;
  locked: boolean;
  lockedAt?: string;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  approverTitle?: string;
  paymentMilestone?: "pending" | "released";
  scores: SectionScores;
  /** Overall scores locked after first save */
  scoresLocked?: boolean;
  /** Per-template-part scores keyed by topicId */
  topicScores?: Record<string, TopicScoreEntry>;
  feedback: FeedbackEntry[];
  signOffPersonnel: SignOffEntry[];
  auditLog: AuditEntry[];
}

export interface AuditEntry {
  id: string;
  action: string;
  actor: string;
  role: SessionRole;
  timestamp: string;
  detail?: string;
}

export interface ReviewsStore {
  sections: Record<string, SectionReview>;
}

/** Sentinel section id for module-level client questions (not a real section). */
export const MODULE_QUESTIONS_SECTION_ID = "__module__";

export function reviewKey(moduleId: string, sectionId: string) {
  return `${moduleId}/${sectionId}`;
}

export const SCORE_CRITERIA = [
  {
    key: "completeness" as const,
    label: "Completeness",
    description: "All required template sections present.",
  },
  {
    key: "accuracy" as const,
    label: "Accuracy",
    description: "Matches ENCC actual process and forms.",
  },
  {
    key: "signOffReadiness" as const,
    label: "Sign-off readiness",
    description: "Ready for formal approval and payment milestone.",
  },
] as const;

export const SCORE_LABELS: Record<number, string> = {
  0: "Not acceptable",
  1: "Partial",
  2: "Good",
  3: "Ready for sign-off",
};

export function isTopicScoreLocked(entry?: TopicScoreEntry): boolean {
  if (!entry) return false;
  return entry.locked !== false;
}
