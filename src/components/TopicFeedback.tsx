"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { AnswerReplyModal } from "@/components/AnswerReplyModal";
import { Modal } from "@/components/ui/Modal";
import { QuestionThreadItem } from "@/components/QuestionThreadItem";
import type { FeedbackEntry } from "@/types/reviews";
import { getFeedbackReplies, hasUnansweredFeedback } from "@/types/reviews";
import {
  feedbackForTopic,
  useOptionalSectionReviewContext,
} from "@/components/SectionReviewContext";

interface TopicFeedbackProps {
  /** Matches TemplateSection id, e.g. "objectives", "workflows" */
  topicId: string;
  /** Display name shown in the modal title */
  label: string;
}

export function TopicFeedback({ topicId, label }: TopicFeedbackProps) {
  const ctx = useOptionalSectionReviewContext();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"form" | "list">("form");
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [answering, setAnswering] = useState<FeedbackEntry | null>(null);

  if (!ctx) return null;

  const { review, busy, error, post, locked, sessionRole } = ctx;
  const isAdmin = sessionRole === "admin";
  const items = feedbackForTopic(review.feedback, topicId);
  const openCount = items.filter((f) => hasUnansweredFeedback(f)).length;

  async function submit() {
    await post({
      action: "feedback",
      author,
      message: text,
      topicId,
    });
    setText("");
    setView("list");
  }

  function openModal(mode: "form" | "list") {
    setView(mode);
    setOpen(true);
  }

  return (
    <>
      <div className="flex items-center gap-1.5">
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => openModal("list")}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-50"
            title="View feedback"
          >
            <span className="font-medium text-slate-700">{items.length}</span>
            {openCount > 0 && (
              <span className="rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white">
                {openCount}
              </span>
            )}
          </button>
        )}
        {!locked && (
          <button
            type="button"
            onClick={() => openModal("form")}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm hover:border-sky-200 hover:text-sky-700"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Feedback
          </button>
        )}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Feedback — ${label}`}
        size={view === "list" ? "lg" : "md"}
      >
        {error && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {view === "form" && !locked ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-500">
              Share corrections or questions about <strong>{label}</strong>.
            </p>
            <input
              placeholder="Your name *"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Your feedback…"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                >
                  View existing ({items.length})
                </button>
              )}
              <button
                type="button"
                disabled={busy || !author || !text.trim()}
                onClick={submit}
                className="flex-1 rounded-lg bg-sky-600 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div>
            {items.length === 0 ? (
              <p className="text-sm text-slate-400">No feedback for this part yet.</p>
            ) : (
              <ul className="space-y-3">
                {items.map((fb) => (
                  <QuestionThreadItem
                    key={fb.id}
                    entry={fb}
                    isAdmin={isAdmin}
                    busy={busy}
                    onAnswer={setAnswering}
                  />
                ))}
              </ul>
            )}
            {!locked && (
              <button
                type="button"
                onClick={() => setView("form")}
                className="mt-4 w-full rounded-lg border border-sky-200 bg-sky-50 py-2 text-sm font-medium text-sky-700 hover:bg-sky-100"
              >
                Add another question
              </button>
            )}
          </div>
        )}
      </Modal>

      {answering && (
        <AnswerReplyModal
          open={!!answering}
          onClose={() => setAnswering(null)}
          question={answering.message}
          authorName={answering.author}
          busy={busy}
          title={
            getFeedbackReplies(answering).length > 0
              ? "Add another answer"
              : "Write your answer"
          }
          onSubmit={async (reply) => {
            await post({
              action: "reply",
              feedbackId: answering.id,
              reply,
              actor: "Yaqeen",
            });
          }}
        />
      )}
    </>
  );
}
