/**
 * Merge legacy review rows (e.g. opr/archive) into the current module key (archive/archive).
 * Usage: node scripts/merge-legacy-reviews.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://sfgcegrbljdmshophrmi.supabase.co";
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_bLJ8ZybIv5nMHgzwr3klMA_lhpY9AVb";

/** legacy module/section → current module/section */
const MERGES = [
  { from: { moduleId: "opr", sectionId: "archive" }, to: { moduleId: "archive", sectionId: "archive" } },
];

const supabase = createClient(url, key);

function mergeReviews(base, incoming) {
  const feedbackById = new Map();
  for (const fb of [...(base.feedback ?? []), ...(incoming.feedback ?? [])]) {
    feedbackById.set(fb.id, { ...fb, moduleId: base.moduleId, sectionId: base.sectionId });
  }

  const auditById = new Map();
  for (const a of [...(base.auditLog ?? []), ...(incoming.auditLog ?? [])]) {
    auditById.set(a.id, a);
  }

  const topicScores = { ...(incoming.topicScores ?? {}), ...(base.topicScores ?? {}) };

  const scores = { ...(incoming.scores ?? {}), ...(base.scores ?? {}) };
  for (const k of ["completeness", "accuracy", "signOffReadiness"]) {
    if (base.scores?.[k] != null) scores[k] = base.scores[k];
    else if (incoming.scores?.[k] != null) scores[k] = incoming.scores[k];
  }

  return {
    ...incoming,
    ...base,
    moduleId: base.moduleId,
    sectionId: base.sectionId,
    feedback: [...feedbackById.values()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    auditLog: [...auditById.values()].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ),
    topicScores,
    scores,
    signOffPersonnel: [...(base.signOffPersonnel ?? []), ...(incoming.signOffPersonnel ?? [])],
  };
}

async function load(moduleId, sectionId) {
  const { data, error } = await supabase
    .from("section_reviews")
    .select("data")
    .eq("module_id", moduleId)
    .eq("section_id", sectionId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.data ?? null;
}

for (const { from, to } of MERGES) {
  const legacy = await load(from.moduleId, from.sectionId);
  if (!legacy) {
    console.log(`Skip ${from.moduleId}/${from.sectionId} — no legacy row`);
    continue;
  }

  const current =
    (await load(to.moduleId, to.sectionId)) ?? {
      moduleId: to.moduleId,
      sectionId: to.sectionId,
      locked: false,
      approvalStatus: "draft",
      paymentMilestone: "pending",
      scores: { completeness: null, accuracy: null, signOffReadiness: null },
      feedback: [],
      topicScores: {},
      signOffPersonnel: [],
      auditLog: [],
    };

  const merged = mergeReviews(
    { ...current, moduleId: to.moduleId, sectionId: to.sectionId },
    legacy
  );

  const { error } = await supabase.from("section_reviews").upsert(
    {
      module_id: to.moduleId,
      section_id: to.sectionId,
      data: merged,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "module_id,section_id" }
  );
  if (error) throw new Error(error.message);

  console.log(
    `Merged ${from.moduleId}/${from.sectionId} → ${to.moduleId}/${to.sectionId}: ${merged.feedback.length} feedback item(s)`
  );
}

console.log("Done.");
