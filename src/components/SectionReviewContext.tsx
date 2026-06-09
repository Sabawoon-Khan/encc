"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SectionReview } from "@/types/reviews";
import { useSectionReview } from "@/hooks/useSectionReview";

interface SectionReviewContextValue {
  moduleId: string;
  sectionId: string;
  review: SectionReview;
  busy: boolean;
  error: string;
  post: (body: Record<string, unknown>) => Promise<SectionReview | undefined>;
  locked: boolean;
  sessionRole: "client" | "admin" | null;
}

const SectionReviewContext = createContext<SectionReviewContextValue | null>(null);

export function SectionReviewProvider({
  moduleId,
  sectionId,
  initialReview,
  sessionRole,
  children,
}: {
  moduleId: string;
  sectionId: string;
  initialReview: SectionReview;
  sessionRole: "client" | "admin" | null;
  children: ReactNode;
}) {
  const { review, busy, error, post, locked } = useSectionReview(
    moduleId,
    sectionId,
    initialReview
  );

  return (
    <SectionReviewContext.Provider
      value={{ moduleId, sectionId, review, busy, error, post, locked, sessionRole }}
    >
      {children}
    </SectionReviewContext.Provider>
  );
}

export function useSectionReviewContext() {
  const ctx = useContext(SectionReviewContext);
  if (!ctx) {
    throw new Error("useSectionReviewContext must be used within SectionReviewProvider");
  }
  return ctx;
}

export function useOptionalSectionReviewContext() {
  return useContext(SectionReviewContext);
}

/** Feedback for a topic, or unscoped legacy items when topicId is "general". */
export function feedbackForTopic(
  feedback: SectionReview["feedback"],
  topicId: string
) {
  return feedback.filter(
    (f) => f.topicId === topicId || (!f.topicId && topicId === "general")
  );
}
