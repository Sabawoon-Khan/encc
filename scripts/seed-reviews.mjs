/**
 * One-time import of content/reviews.json into Supabase.
 * Usage: node scripts/seed-reviews.mjs
 */
import { readFile } from "fs/promises";
import { createClient } from "@supabase/supabase-js";

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://sfgcegrbljdmshophrmi.supabase.co";
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_bLJ8ZybIv5nMHgzwr3klMA_lhpY9AVb";

const supabase = createClient(url, key);
const raw = await readFile("content/reviews.json", "utf-8");
const store = JSON.parse(raw);

const rows = Object.values(store.sections ?? {}).map((review) => ({
  module_id: review.moduleId,
  section_id: review.sectionId,
  data: review,
  updated_at: new Date().toISOString(),
}));

if (rows.length === 0) {
  console.log("No sections to import.");
  process.exit(0);
}

const { error } = await supabase.from("section_reviews").upsert(rows, {
  onConflict: "module_id,section_id",
});

if (error) {
  console.error("Import failed:", error.message);
  process.exit(1);
}

console.log(`Imported ${rows.length} section review(s) into Supabase.`);
