"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Loader2 } from "lucide-react";
import type { DocumentCategory } from "./DocumentDropzones";

type FileStatus = "uploading" | "analysing" | "validated";

interface UploadedFile {
  id: string;
  name: string;
  status: FileStatus;
}

const FILE_STATUS: Record<FileStatus, { label: string; dotClass: string; textClass: string }> = {
  uploading: {
    label: "Envoi...",
    dotClass: "bg-blue-400 animate-pulse",
    textClass: "text-blue-400",
  },
  analysing: {
    label: "En analyse 🟡",
    dotClass: "bg-amber-400 animate-pulse",
    textClass: "text-amber-400",
  },
  validated: { label: "Validé ✅", dotClass: "bg-emerald-400", textClass: "text-emerald-400" },
};

const COLORS: Record<
  string,
  {
    border: string;
    headerBg: string;
    headerBorder: string;
    badge: string;
    dragActive: string;
    dropIconClass: string;
  }
> = {
  blue: {
    border: "border-blue-500/20",
    headerBg: "bg-blue-500/8",
    headerBorder: "border-blue-500/15",
    badge: "bg-blue-500/10 text-blue-300",
    dragActive: "border-blue-500/60 bg-blue-500/8",
    dropIconClass: "text-blue-500",
  },
  emerald: {
    border: "border-emerald-500/20",
    headerBg: "bg-emerald-500/8",
    headerBorder: "border-emerald-500/15",
    badge: "bg-emerald-500/10 text-emerald-300",
    dragActive: "border-emerald-500/60 bg-emerald-500/8",
    dropIconClass: "text-emerald-500",
  },
  violet: {
    border: "border-violet-500/20",
    headerBg: "bg-violet-500/8",
    headerBorder: "border-violet-500/15",
    badge: "bg-violet-500/10 text-violet-300",
    dragActive: "border-violet-500/60 bg-violet-500/8",
    dropIconClass: "text-violet-500",
  },
  amber: {
    border: "border-amber-500/20",
    headerBg: "bg-amber-500/8",
    headerBorder: "border-amber-500/15",
    badge: "bg-amber-500/10 text-amber-300",
    dragActive: "border-amber-500/60 bg-amber-500/8",
    dropIconClass: "text-amber-500",
  },
};

interface DropzoneCardProps {
  category: DocumentCategory;
  sessionId: string;
}

export default function DropzoneCard({ category, sessionId }: DropzoneCardProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const c = COLORS[category.color] ?? COLORS.blue;

  const uploadFile = useCallback(
    async (file: File) => {
      if (file.size > 20 * 1024 * 1024) return; // 20 MB guard

      const fileId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setFiles((prev) => [...prev, { id: fileId, name: file.name, status: "uploading" }]);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("sessionId", sessionId);
        formData.append("category", category.id);

        const res = await fetch("/api/salle-de-vente/upload", {
          method: "POST",
          body: formData,
        });

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, status: res.ok ? "analysing" : "uploading" } : f
          )
        );
      } catch {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
      }
    },
    [sessionId, category.id]
  );

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    Array.from(list).forEach(uploadFile);
  };

  const uploadedCount = files.filter((f) => f.status !== "uploading").length;
  const expected = category.documents.length;

  return (
    <div className={`flex flex-col rounded-2xl border bg-[#0b1020] overflow-hidden ${c.border}`}>
      {/* Card header */}
      <div
        className={`flex items-center justify-between px-4 py-2.5 ${c.headerBg} border-b ${c.headerBorder}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{category.icon}</span>
          <span className="text-sm font-semibold text-white">{category.title}</span>
        </div>
        <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${c.badge}`}>
          {uploadedCount}/{expected}
        </span>
      </div>

      {/* Expected document list */}
      <div className="px-4 pt-3 pb-2 space-y-1">
        {category.documents.map((doc) => (
          <p key={doc} className="text-[11px] text-slate-600 flex items-start gap-1.5">
            <span className="w-1 h-1 rounded-full bg-slate-700 shrink-0 mt-1.5" />
            {doc}
          </p>
        ))}
      </div>

      {/* Drop zone */}
      <div
        className={`mx-3 mb-3 mt-1.5 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          dragOver
            ? `${c.dragActive} ${c.dropIconClass}`
            : "border-white/8 hover:border-white/15 hover:bg-white/[0.02] text-slate-600"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={category.accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Upload size={16} className="mx-auto mb-1.5 opacity-70" />
        <p className="text-[11px] text-slate-500">
          <span className="text-slate-400">Glisser</span> ou{" "}
          <span className="text-slate-400">cliquer</span>
        </p>
        <p className="text-[10px] text-slate-700 mt-0.5">PDF · JPG · PNG — 20 Mo max</p>
      </div>

      {/* Uploaded files list */}
      {files.length > 0 && (
        <div className="px-3 pb-3 space-y-1.5">
          {files.map((file) => {
            const s = FILE_STATUS[file.status];
            return (
              <div
                key={file.id}
                className="flex items-center gap-2 bg-white/[0.03] rounded-lg px-3 py-2"
              >
                {file.status === "uploading" ? (
                  <Loader2 size={12} className="text-blue-400 animate-spin shrink-0" />
                ) : (
                  <div className={`w-2 h-2 rounded-full shrink-0 ${s.dotClass}`} />
                )}
                <span className="text-[11px] text-slate-400 truncate flex-1 min-w-0">
                  {file.name}
                </span>
                <span className={`text-[10px] shrink-0 font-medium ${s.textClass}`}>{s.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
