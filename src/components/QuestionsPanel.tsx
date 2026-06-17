"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, MessageSquare } from "lucide-react";
import { AnswerReplyModal } from "@/components/AnswerReplyModal";
import { QuestionThreadItem } from "@/components/QuestionThreadItem";
import { useOptionalSectionReviewContext } from "@/components/SectionReviewContext";
import type { FeedbackEntry } from "@/types/reviews";
import { getFeedbackReplies, hasUnansweredFeedback } from "@/types/reviews";

interface QuestionsPanelProps {
  /** e.g. "آرشیف section" or "OPR module" */
  scopeLabel: string;
  sessionRole: "client" | "admin" | null;
  id?: string;
}

export function QuestionsPanel({
  scopeLabel,
  sessionRole,
  id = "questions",
}: QuestionsPanelProps) {
  const ctx = useOptionalSectionReviewContext();
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [answering, setAnswering] = useState<FeedbackEntry | null>(null);

  const questions = (ctx?.review.feedback ?? []).filter((q) => !q.topicId);
  const openCount = questions.filter((q) => hasUnansweredFeedback(q)).length;
  const canAsk = !!sessionRole && !!ctx;
  const isAdmin = sessionRole === "admin";
  const busy = ctx?.busy ?? false;
  const error = ctx?.error ?? "";

  async function submit() {
    if (!ctx || !author.trim() || !text.trim()) return;
    await ctx.post({
      action: "feedback",
      author: author.trim(),
      message: text.trim(),
    });
    setText("");
    setShowForm(true);
    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 4000);
  }

  return (
    <section id={id} className="scroll-mt-20 rounded-2xl border border-sky-200 bg-sky-50/30 p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <MessageSquare className="h-5 w-5 text-sky-600" />
            Questions &amp; Answers
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Ask as many questions as you need about the{" "}
            <strong>{scopeLabel}</strong>. Each one can have one or more answers.
          </p>
        </div>
        {openCount > 0 && (
          <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white">
            {openCount} awaiting answer
          </span>
        )}
      </div>

      {!sessionRole && (
        <p className="mb-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <Link href="/login" className="font-medium text-sky-600 hover:underline">
            Sign in
          </Link>{" "}
          to ask a question or view replies.
        </p>
      )}

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {justSubmitted && (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
          Question submitted. You can ask another below.
        </p>
      )}

      {canAsk && (
        <div className="mb-6">
          {!showForm ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-sky-700 shadow-sm hover:bg-sky-50"
            >
              <HelpCircle className="h-4 w-4" />
              {questions.length > 0 ? "Ask another question" : "Ask a question"}
            </button>
          ) : (
            <div className="space-y-3 rounded-xl border border-sky-100 bg-white p-4">
              <input
                placeholder="Your name *"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <textarea
                placeholder="Your question…"
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={busy || !author.trim() || !text.trim()}
                  onClick={submit}
                  className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
                >
                  Submit question
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {questions.length === 0 ? (
        <p className="text-sm text-slate-400">No questions yet. Be the first to ask.</p>
      ) : (
        <ul className="space-y-3">
          {questions.map((q) => (
            <QuestionThreadItem
              key={q.id}
              entry={q}
              isAdmin={isAdmin}
              busy={busy}
              onAnswer={setAnswering}
            />
          ))}
        </ul>
      )}

      {canAsk && questions.length > 0 && !showForm && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-dashed border-sky-200 bg-white px-4 py-2 text-sm font-medium text-sky-700 hover:bg-sky-50"
        >
          <HelpCircle className="h-4 w-4" />
          Ask another question
        </button>
      )}

      {answering && ctx && (
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
            await ctx.post({
              action: "reply",
              feedbackId: answering.id,
              reply,
              actor: "Yaqeen",
            });
          }}
        />
      )}
    </section>
  );
}
