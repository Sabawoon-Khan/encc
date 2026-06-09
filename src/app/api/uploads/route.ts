import { NextResponse } from "next/server";
import { getSessionRole } from "@/lib/auth";
import { saveEvidence, deleteEvidence } from "@/lib/evidence";
import { getSectionReview, isSectionLocked } from "@/lib/reviews";

export async function POST(request: Request) {
  try {
    const role = await getSessionRole();
    if (!role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const review = await getSectionReview(moduleId, sectionId);
    if (isSectionLocked(review) && role !== "admin") {
      return NextResponse.json(
        { error: "Section is locked — uploads disabled until admin unlock" },
        { status: 403 }
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

export async function DELETE(request: Request) {
  const role = await getSessionRole();
  if (!role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const { readManifest } = await import("@/lib/evidence");
  const manifest = await readManifest();
  const item = manifest.items.find((i) => i.id === id);
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const review = await getSectionReview(item.moduleId, item.sectionId);
  if (isSectionLocked(review) && role !== "admin") {
    return NextResponse.json(
      { error: "Section is locked — cannot delete attachments" },
      { status: 403 }
    );
  }

  const ok = await deleteEvidence(id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
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
