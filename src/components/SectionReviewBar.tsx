"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Lock,
  RotateCcw,
  Star,
  Unlock,
} from "lucide-react";
import type { SectionReview } from "@/types/reviews";
import { SCORE_CRITERIA, SCORE_LABELS } from "@/types/reviews";
import { useSectionReviewContext } from "@/components/SectionReviewContext";
import { Modal } from "@/components/ui/Modal";

type ModalKind = "rate" | "approve" | null;

interface SectionReviewBarProps {
  initialReview: SectionReview;
}

export function SectionReviewBar({ initialReview }: SectionReviewBarProps) {
  const { review, busy, error, post, locked, sessionRole } =
    useSectionReviewContext();
  const isAdmin = sessionRole === "admin";

  const [modal, setModal] = useState<ModalKind>(null);
  const [scores, setScores] = useState({
    completeness: initialReview.scores.completeness ?? "",
    accuracy: initialReview.scores.accuracy ?? "",
    signOffReadiness: initialReview.scores.signOffReadiness ?? "",
    ratedBy: initialReview.scores.ratedBy ?? "",
  });
  const [approve, setApprove] = useState({ name: "", title: "" });
  const [returnReason, setReturnReason] = useState("");

  const scoreTotal = SCORE_CRITERIA.reduce(
    (sum, c) => sum + (review.scores[c.key] ?? 0),
    0
  );
  const scoredCount = SCORE_CRITERIA.filter(
    (c) => review.scores[c.key] !== null
  ).length;
  const totalFeedback = review.feedback.length;
  const topicScoreEntries = Object.values(review.topicScores ?? {});
  const topicScoreTotal = topicScoreEntries.reduce((s, t) => s + t.score, 0);
  const topicScoreAvg =
    topicScoreEntries.length > 0
      ? (topicScoreTotal / topicScoreEntries.length).toFixed(1)
      : null;

  async function submitScores() {
    await post({
      action: "score",
      completeness: Number(scores.completeness),
      accuracy: Number(scores.accuracy),
      signOffReadiness: Number(scores.signOffReadiness),
      ratedBy: scores.ratedBy,
    });
    setModal(null);
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm">
        <span
          className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${
            locked
              ? "bg-emerald-50 text-emerald-800"
              : review.approvalStatus === "returned"
                ? "bg-amber-50 text-amber-800"
                : "bg-slate-100 text-slate-600"
          }`}
        >
          {locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
          {locked
            ? "Approved"
            : review.approvalStatus === "returned"
              ? "Returned"
              : review.approvalStatus === "in_review"
                ? "In review"
                : "Draft"}
        </span>

        <span className="hidden h-4 w-px bg-slate-200 sm:block" />

        <div className="flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-xs text-slate-500">Scores</span>
          <div className="flex gap-1">
            {SCORE_CRITERIA.map((c) => {
              const v = review.scores[c.key];
              return (
                <span
                  key={c.key}
                  title={`${c.label}: ${v ?? "not rated"}`}
                  className={`inline-flex h-6 min-w-6 items-center justify-center rounded px-1 text-xs font-bold ${
                    v !== null ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {v ?? "—"}
                </span>
              );
            })}
          </div>
          {scoredCount === 3 && (
            <span className="text-xs text-slate-400">({scoreTotal}/9)</span>
          )}
        </div>

        {topicScoreEntries.length > 0 && (
          <>
            <span className="hidden h-4 w-px bg-slate-200 sm:block" />
            <span className="text-xs text-slate-500">
              {topicScoreEntries.length} part{topicScoreEntries.length !== 1 ? "s" : ""} scored
              {topicScoreAvg && ` · avg ${topicScoreAvg}/3`}
            </span>
          </>
        )}

        {totalFeedback > 0 && (
          <>
            <span className="hidden h-4 w-px bg-slate-200 sm:block" />
            <span className="text-xs text-slate-500">
              {totalFeedback} feedback item{totalFeedback !== 1 ? "s" : ""} across sections
            </span>
          </>
        )}

        <div className="ml-auto flex flex-wrap gap-1.5">
          {!locked && (
            <>
              <button
                type="button"
                onClick={() => setModal("rate")}
                className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Rate section
              </button>
              <button
                type="button"
                onClick={() => setModal("approve")}
                className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
              >
                Approve
              </button>
            </>
          )}
          {isAdmin && locked && (
            <button
              type="button"
              disabled={busy}
              onClick={() => post({ action: "unlock", actor: "Yaqeen Admin" })}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium hover:bg-slate-50"
            >
              <RotateCcw className="h-3 w-3" />
              Unlock
            </button>
          )}
        </div>
      </div>

      <Modal open={modal === "rate"} onClose={() => setModal(null)} title="Rate this section">
        {error && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        <p className="mb-4 text-sm text-slate-500">
          Overall section rating (0–3 each). Rate individual parts using the Score button on each
          section heading.
        </p>
        <div className="space-y-4">
          {SCORE_CRITERIA.map((c) => (
            <div key={c.key}>
              <p className="text-sm font-medium text-slate-800">{c.label}</p>
              <div className="mt-2 flex gap-1.5">
                {[0, 1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setScores((s) => ({ ...s, [c.key]: n }))}
                    title={SCORE_LABELS[n]}
                    className={`h-9 w-9 rounded-lg text-sm font-bold ${
                      scores[c.key] === n
                        ? "bg-sky-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <input
            placeholder="Your name *"
            value={scores.ratedBy}
            onChange={(e) => setScores((s) => ({ ...s, ratedBy: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={
              busy ||
              !scores.ratedBy ||
              scores.completeness === "" ||
              scores.accuracy === "" ||
              scores.signOffReadiness === ""
            }
            onClick={submitScores}
            className="w-full rounded-lg bg-sky-600 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
          >
            Save scores
          </button>
        </div>
      </Modal>

      <Modal open={modal === "approve"} onClose={() => setModal(null)} title="Approve section">
        {error && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        <div className="space-y-4">
          <div>
            <input
              placeholder="Your name *"
              value={approve.name}
              onChange={(e) => setApprove((a) => ({ ...a, name: e.target.value }))}
              className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              placeholder="Position / department"
              value={approve.title}
              onChange={(e) => setApprove((a) => ({ ...a, title: e.target.value }))}
              className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <button
              type="button"
              disabled={busy || !approve.name}
              onClick={async () => {
                await post({
                  action: "approve",
                  approvedBy: approve.name,
                  approverTitle: approve.title,
                });
                setModal(null);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve &amp; lock
            </button>
          </div>
          <div className="border-t border-slate-100 pt-4">
            <textarea
              placeholder="Return reason…"
              rows={3}
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <button
              type="button"
              disabled={busy || !returnReason.trim()}
              onClick={async () => {
                await post({
                  action: "return",
                  returnedBy: approve.name || "ENCC Reviewer",
                  reason: returnReason,
                });
                setModal(null);
              }}
              className="w-full rounded-lg border border-amber-300 py-2 text-sm font-medium text-amber-800 hover:bg-amber-50 disabled:opacity-50"
            >
              Return to Yaqeen
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
