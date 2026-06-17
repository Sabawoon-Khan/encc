"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface AnswerReplyModalProps {
  open: boolean;
  onClose: () => void;
  question: string;
  authorName?: string;
  busy?: boolean;
  title?: string;
  onSubmit: (reply: string) => void | Promise<void>;
}

export function AnswerReplyModal({
  open,
  onClose,
  question,
  authorName,
  busy = false,
  title = "Write your answer",
  onSubmit,
}: AnswerReplyModalProps) {
  const [reply, setReply] = useState("");

  useEffect(() => {
    if (open) setReply("");
  }, [open, question]);

  async function handleSubmit() {
    if (!reply.trim()) return;
    await onSubmit(reply.trim());
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={title} size="lg">
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Question{authorName ? ` from ${authorName}` : ""}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
            {question}
          </p>
        </div>

        <div>
          <label
            htmlFor="answer-reply"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Your answer
          </label>
          <textarea
            id="answer-reply"
            autoFocus
            placeholder="Write a detailed answer…"
            rows={10}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />
          <p className="mt-1.5 text-xs text-slate-400">
            {reply.length > 0 ? `${reply.length} characters` : "Supports long, multi-paragraph answers"}
          </p>
        </div>

        <div className="flex gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy || !reply.trim()}
            onClick={handleSubmit}
            className="flex-1 rounded-lg bg-sky-600 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
          >
            {busy ? "Saving…" : "Post answer"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
