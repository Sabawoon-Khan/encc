"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";

interface ImageUploadProps {
  moduleId: string;
  sectionId: string;
  onUploaded?: () => void;
}

export function ImageUpload({
  moduleId,
  sectionId,
  onUploaded,
}: ImageUploadProps) {
  const router = useRouter();
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/") && f.type !== "application/pdf") {
      setError("Only images and PDF files are allowed");
      return;
    }
    setError(null);
    setFile(f);
    if (f.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ""));
  }, [title]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const upload = async () => {
    if (!file || !title.trim()) {
      setError("File and title are required");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("moduleId", moduleId);
      form.append("sectionId", sectionId);
      form.append("title", title.trim());
      form.append("description", description.trim());

      const res = await fetch("/api/uploads", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }
      setFile(null);
      setPreview(null);
      setTitle("");
      setDescription("");
      router.refresh();
      onUploaded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
        <ImagePlus className="h-4 w-4 text-sky-600" />
        Upload Evidence
      </h3>
      <p className="mb-4 text-xs text-slate-500">
        Attach form samples, paper scans, or screenshots (Paper 1.1, outgoing
        letters, etc.)
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative mb-4 flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
          dragging
            ? "border-sky-400 bg-sky-50"
            : "border-slate-200 bg-slate-50 hover:border-sky-300"
        }`}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        {preview ? (
          <div className="relative p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="max-h-32 rounded object-contain"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setPreview(null);
              }}
              className="absolute -right-1 -top-1 rounded-full bg-slate-800 p-0.5 text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : file ? (
          <p className="text-sm text-slate-600">{file.name}</p>
        ) : (
          <>
            <Upload className="mb-2 h-6 w-6 text-slate-400" />
            <p className="text-sm text-slate-500">
              Drop image or PDF here, or click to browse
            </p>
          </>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Title *
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Internal Archive Paper 1.1 sample"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Optional notes for developers"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
      </div>

      {error && (
        <p className="mt-3 text-xs text-red-600">{error}</p>
      )}

      <button
        type="button"
        onClick={upload}
        disabled={uploading || !file}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading…
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Upload attachment
          </>
        )}
      </button>
    </div>
  );
}
