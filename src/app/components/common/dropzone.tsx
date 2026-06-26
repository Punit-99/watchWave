"use client";

import { useEffect, useState } from "react";
import { UploadCloud, Trash2 } from "lucide-react";
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

  const { getRootProps, getInputProps } = useDropzone({
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
    <div className="space-y-4">
      {!preview && (
        <div
          {...getRootProps()}
          className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed"
        >
          <input {...getInputProps()} />

          <UploadCloud className="mb-3 h-10 w-10" />

          <p className="font-medium">Select or Drop {type}</p>
        </div>
      )}

      {preview && (
        <>
          <div className="overflow-hidden rounded-xl border">
            {type === "image" ? (
              <img
                src={preview}
                className="max-h-[350px] w-full object-cover"
              />
            ) : (
              <video src={preview} controls className="max-h-[350px] w-full" />
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>

            {file && (
              <Button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
