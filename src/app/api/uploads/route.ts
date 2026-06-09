import { NextResponse } from "next/server";
import { saveEvidence } from "@/lib/evidence";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    const moduleId = form.get("moduleId") as string;
    const sectionId = form.get("sectionId") as string;
    const title = form.get("title") as string;
    const description = (form.get("description") as string) || undefined;

    if (!file || !moduleId || !sectionId || !title?.trim()) {
      return NextResponse.json(
        { error: "file, moduleId, sectionId, and title are required" },
        { status: 400 }
      );
    }

    const item = await saveEvidence(file, {
      moduleId,
      sectionId,
      title: title.trim(),
      description,
    });

    return NextResponse.json({ item });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Failed to save upload" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const moduleId = searchParams.get("moduleId");
  const sectionId = searchParams.get("sectionId");

  const { readManifest } = await import("@/lib/evidence");
  const manifest = await readManifest();

  let items = manifest.items;
  if (moduleId) items = items.filter((i) => i.moduleId === moduleId);
  if (sectionId) items = items.filter((i) => i.sectionId === sectionId);

  return NextResponse.json({ items });
}
