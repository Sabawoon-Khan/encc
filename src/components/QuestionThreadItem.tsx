"use client";

import type { FeedbackEntry } from "@/types/reviews";
import { getFeedbackReplies } from "@/types/reviews";

const STATUS_COLORS = {
  open: "bg-amber-50 text-amber-800 ring-amber-200",
  answered: "bg-sky-50 text-sky-800 ring-sky-200",
  closed: "bg-slate-100 text-slate-600 ring-slate-200",
};

interface QuestionThreadItemProps {
  entry: FeedbackEntry;
  isAdmin: boolean;
  busy: boolean;
  onAnswer: (entry: FeedbackEntry) => void;
  showTopic?: boolean;
}

export function QuestionThreadItem({
  entry,
  isAdmin,
  busy,
  onAnswer,
  showTopic = false,
}: QuestionThreadItemProps) {
  const replies = getFeedbackReplies(entry);

  return (
    <li className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-slate-800">{entry.author}</span>
        {showTopic && entry.topicId && (
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
            {entry.topicId}
          </span>
        )}
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${STATUS_COLORS[entry.status]}`}
        >
          {replies.length > 0 ? "answered" : entry.status}
        </span>
        <span className="text-xs text-slate-400">
          {new Date(entry.createdAt).toLocaleString()}
        </span>
      </div>
      <p className="mt-1 whitespace-pre-wrap text-slate-700">{entry.message}</p>

      {replies.length > 0 && (
        <ul className="mt-3 space-y-2">
          {replies.map((r, i) => (
            <li
              key={r.id}
              className="rounded-lg border border-sky-100 bg-sky-50/60 px-4 py-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold text-sky-700">
                  Answer{replies.length > 1 ? ` ${i + 1}` : ""}
                </p>
                <span className="text-xs text-slate-400">
                  {r.author} · {new Date(r.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {r.text}
              </p>
            </li>
          ))}
        </ul>
      )}

      {isAdmin && (
        <button
          type="button"
          disabled={busy}
          onClick={() => onAnswer(entry)}
          className="mt-3 inline-flex items-center rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-100"
        >
          {replies.length > 0 ? "Add another answer" : "Write answer"}
        </button>
      )}
    </li>
  );
}
