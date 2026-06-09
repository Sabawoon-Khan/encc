import Link from "next/link";
import { CheckCircle2, Clock, Lock, RotateCcw } from "lucide-react";
import { modules } from "@/content/modules";
import { getAllReviews } from "@/lib/reviews";
import { reviewKey } from "@/types/reviews";

export default async function ApprovalsPage() {
  const reviews = await getAllReviews();
  const reviewMap = Object.fromEntries(
    reviews.map((r) => [reviewKey(r.moduleId, r.sectionId), r])
  );

  const sections = modules.flatMap((mod) =>
    mod.sections
      .filter((s) => s.enableReview)
      .map((sec) => ({ mod, sec }))
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Section reviews</h1>
        <p className="mt-2 text-sm text-slate-600">
          Review and approve each documented section from its own page.
        </p>
      </header>

      <div className="space-y-3">
        {sections.length === 0 ? (
          <p className="text-sm text-slate-500">No sections open for review yet.</p>
        ) : (
          sections.map(({ mod, sec }) => {
            const review = reviewMap[reviewKey(mod.id, sec.id)];
            const locked = review?.locked || review?.approvalStatus === "approved";
            const href = `/modules/${mod.id}/sections/${sec.id}`;

            return (
              <Link
                key={sec.id}
                href={href}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-sky-200"
              >
                <div>
                  <p className="text-xs text-slate-400">
                    {mod.code} · {mod.nameDari}
                  </p>
                  <p className="font-semibold text-slate-900">
                    {sec.nameDari ?? sec.name}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {locked ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
                      <Lock className="h-3 w-3" />
                      Approved
                    </span>
                  ) : review?.approvalStatus === "returned" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                      <RotateCcw className="h-3 w-3" />
                      Returned
                    </span>
                  ) : review?.approvalStatus === "in_review" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-800">
                      <Clock className="h-3 w-3" />
                      In review
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                      Draft
                    </span>
                  )}
                  {review?.paymentMilestone === "released" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white">
                      <CheckCircle2 className="h-3 w-3" />
                      Milestone
                    </span>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
