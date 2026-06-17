/** Client-safe upload URL base (mirrors server local-data routing). */
export const UPLOAD_PUBLIC_BASE =
  process.env.NEXT_PUBLIC_UPLOAD_BASE ?? "/uploads";

export function uploadPublicUrl(filename: string): string {
  return `${UPLOAD_PUBLIC_BASE}/${filename}`;
}

export const IS_LOCAL_DATA =
  process.env.NEXT_PUBLIC_LOCAL_DATA === "true";
