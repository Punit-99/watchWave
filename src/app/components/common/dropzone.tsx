"use client";

import { useEffect, useState } from "react";
import { Upload, Trash2, Video, Image as ImageIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";

interface DropzoneProps {
  type: "image" | "video";

  previewUrl?: string;

  isUploading?: boolean;

  onUpload: (file: File) => Promise<void>;

  onDelete?: () => Promise<void>;
}

export function Dropzone({
  type,
  previewUrl,
  isUploading,
  onUpload,
  onDelete,
}: DropzoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string>();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept:
      type === "image"
        ? {
            "image/jpeg": [".jpeg", ".jpg"],
            "image/png": [".png"],
            "image/webp": [".webp"],
          }
        : {
            "video/mp4": [".mp4"],
            "video/x-matroska": [".mkv"],
          },
    onDrop: (files) => {
      const selected = files[0];
      if (!selected) return;

      setFile(selected);
      setLocalPreview(URL.createObjectURL(selected));
    },
  });

  const preview = localPreview || previewUrl;

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const handleUpload = async () => {
    if (!file) return;

    await onUpload(file);

    setFile(null);
    setLocalPreview(undefined);
  };

  const handleDelete = async () => {
    setFile(null);
    setLocalPreview(undefined);
    await onDelete?.();
  };

  return (
    <div className="space-y-3">
      {!preview && (
        <div
          {...getRootProps()}
          className={`flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-6 transition-all duration-200 ${
            isDragActive
              ? "border-primary bg-primary/5 dark:bg-primary/10"
              : "border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/10"
          }`}
        >
          <input {...getInputProps()} />

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border shadow-sm mb-3 text-zinc-500">
            <Upload className="h-5 w-5" />
          </div>

          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            Select or drag {type}
          </p>
          <p className="text-xs text-muted-foreground mt-1 text-center">
            {type === "image"
              ? "PNG, JPG, or WEBP up to 5MB"
              : "MP4 or MKV high-definition video"}
          </p>
        </div>
      )}

      {preview && (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-black/5 dark:bg-black/20 relative group">
            {type === "image" ? (
              <img
                src={preview}
                className="max-h-[260px] w-full object-contain mx-auto"
                alt="Upload preview"
              />
            ) : (
              <video src={preview} controls className="max-h-[260px] w-full" />
            )}
          </div>

          {file && (
            <div className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 px-3 py-2 text-xs">
              <span className="truncate max-w-[200px] text-muted-foreground font-mono">
                {file.name}
              </span>
              <span className="text-muted-foreground font-mono">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 rounded-lg text-xs hover:bg-red-500/10 hover:text-red-500 transition-colors"
              onClick={handleDelete}
            >
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              <span>Delete</span>
            </Button>

            {file && (
              <Button
                type="button"
                size="sm"
                className="h-8 rounded-lg text-xs"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Confirm Upload"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
