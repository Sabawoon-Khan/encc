/**
 * Move legacy evidence rows (opr/archive) to archive/archive in Supabase.
 * Storage file paths (opr/archive/...) are unchanged — only the DB module_id updates.
 * Usage: node scripts/merge-legacy-evidence.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://sfgcegrbljdmshophrmi.supabase.co";
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_bLJ8ZybIv5nMHgzwr3klMA_lhpY9AVb";

const supabase = createClient(url, key);

const { data: rows, error: fetchError } = await supabase
  .from("evidence_items")
  .select("*")
  .eq("module_id", "opr")
  .eq("section_id", "archive");

if (fetchError) {
  console.error(fetchError.message);
  process.exit(1);
}

if (!rows?.length) {
  console.log("No legacy opr/archive evidence rows to migrate.");
  process.exit(0);
}

for (const row of rows) {
  const { error } = await supabase
    .from("evidence_items")
    .update({ module_id: "archive" })
    .eq("id", row.id);
  if (error) {
    console.error(`Failed ${row.id}:`, error.message);
    process.exit(1);
  }
  console.log(`Migrated ${row.id}: ${row.title} → archive/archive`);
}

console.log(`Done. Migrated ${rows.length} evidence item(s).`);
