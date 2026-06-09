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
  reply?: string;
  createdAt: string;
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
