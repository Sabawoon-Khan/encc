"use client";

import { useState } from "react";
import { Lock, Star } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useOptionalSectionReviewContext } from "@/components/SectionReviewContext";
import { SCORE_LABELS, isTopicScoreLocked } from "@/types/reviews";

interface TopicScoreProps {
  topicId: string;
  label: string;
}

export function TopicScore({ topicId, label }: TopicScoreProps) {
  const ctx = useOptionalSectionReviewContext();
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState<number | "">("");
  const [ratedBy, setRatedBy] = useState("");

  if (!ctx) return null;

  const { review, busy, error, post, locked, sessionRole } = ctx;
  const isAdmin = sessionRole === "admin";
  const saved = review.topicScores?.[topicId];
  const display = saved?.score ?? null;
  const scoreLocked = isTopicScoreLocked(saved);
  const canSet = !scoreLocked && !locked && !saved;
  const canEditAsAdmin = isAdmin && !locked && scoreLocked;

  async function submit() {
    await post({
      action: "topic_score",
      topicId,
      score: Number(score),
      ratedBy,
    });
    setOpen(false);
  }

  if (display !== null && scoreLocked && !canEditAsAdmin) {
    return (
      <span
        title={`${SCORE_LABELS[display]} — ${saved?.ratedBy} (locked)`}
        className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-800"
      >
        <Lock className="h-3 w-3" />
        <Star className="h-3 w-3" />
        {display}
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setScore(saved?.score ?? "");
          setRatedBy(saved?.ratedBy ?? "");
          setOpen(true);
        }}
        title={
          saved
            ? `${SCORE_LABELS[saved.score]} — admin can revise`
            : "Rate this part (0–3)"
        }
        className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium shadow-sm ${
          display !== null
            ? "border-sky-200 bg-sky-50 text-sky-800"
            : "border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-700"
        }`}
      >
        <Star className="h-3.5 w-3.5" />
        {display !== null ? display : "Score"}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={`Score — ${label}`}>
        {error && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        {!canSet && !canEditAsAdmin ? (
          <p className="text-sm text-slate-500">This score is locked.</p>
        ) : (
          <>
            <p className="mb-4 text-sm text-slate-500">
              Rate <strong>{label}</strong> from 0 to 3. Once saved, the score is locked.
            </p>
            <div className="mb-4 flex gap-2">
              {[0, 1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setScore(n)}
                  title={SCORE_LABELS[n]}
                  className={`flex h-10 w-10 flex-col items-center justify-center rounded-lg text-sm font-bold ${
                    score === n
                      ? "bg-sky-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            {score !== "" && (
              <p className="mb-3 text-xs text-slate-500">{SCORE_LABELS[score as number]}</p>
            )}
            <input
              placeholder="Your name *"
              value={ratedBy}
              onChange={(e) => setRatedBy(e.target.value)}
              className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <button
              type="button"
              disabled={busy || ratedBy.trim() === "" || score === ""}
              onClick={submit}
              className="w-full rounded-lg bg-sky-600 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
            >
              Save score
            </button>
          </>
        )}
      </Modal>
    </>
  );
}
