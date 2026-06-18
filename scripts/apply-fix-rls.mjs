/**
 * One-time fix: apply RLS policies so the publishable key can write.
 * Usage: node scripts/apply-fix-rls.mjs
 */
import { readFile } from "fs/promises";
import pg from "pg";

const { Client } = pg;

const databaseUrl =
  process.env.SUPABASE_DB_URL ??
  "postgresql://postgres:Encc%400787936236@db.sfgcegrbljdmshophrmi.supabase.co:5432/postgres";

const sql = await readFile("supabase/fix-rls.sql", "utf-8");
const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  await client.query(sql);
  console.log("RLS policies applied successfully.");
} catch (err) {
  console.error("Failed:", err instanceof Error ? err.message : err);
  process.exit(1);
} finally {
  await client.end();
}
