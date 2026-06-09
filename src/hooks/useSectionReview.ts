"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SectionReview } from "@/types/reviews";

export function useSectionReview(
  moduleId: string,
  sectionId: string,
  initialReview: SectionReview
) {
  const router = useRouter();
  const [review, setReview] = useState(initialReview);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const api = `/api/reviews/${moduleId}/${sectionId}`;

  const post = useCallback(
    async (body: Record<string, unknown>) => {
      setBusy(true);
      setError("");
      try {
        const res = await fetch(api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Request failed");
        setReview(data.review);
        router.refresh();
        return data.review as SectionReview;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Request failed";
        setError(msg);
        throw err;
      } finally {
        setBusy(false);
      }
    },
    [api, router]
  );

  useEffect(() => {
    setReview(initialReview);
  }, [initialReview]);

  const locked = review.locked || review.approvalStatus === "approved";
  const openMessages = review.feedback.filter((f) => f.status === "open").length;

  return { review, busy, error, setError, post, locked, openMessages };
}
