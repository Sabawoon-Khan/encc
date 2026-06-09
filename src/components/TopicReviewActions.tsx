"use client";

import { TopicFeedback } from "@/components/TopicFeedback";
import { TopicScore } from "@/components/TopicScore";

interface TopicReviewActionsProps {
  topicId: string;
  label: string;
}

/** Score + feedback controls for a template subsection heading (reusable). */
export function TopicReviewActions({ topicId, label }: TopicReviewActionsProps) {
  return (
    <div className="flex items-center gap-1.5">
      <TopicScore topicId={topicId} label={label} />
      <TopicFeedback topicId={topicId} label={label} />
    </div>
  );
}
