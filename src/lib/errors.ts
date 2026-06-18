/** Turn unknown thrown values (e.g. Supabase PostgrestError) into a message string. */
export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    const msg = (err as { message: unknown }).message;
    if (typeof msg === "string" && msg.length > 0) return msg;
  }
  return "Action failed";
}
