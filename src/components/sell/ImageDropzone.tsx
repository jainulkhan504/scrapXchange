// src/components/sell/ImageDropzone.tsx
"use client";

import React, { useRef, useState } from "react";

type Props = {
  onFilesChangeAction: (files: File[]) => void; // fixed name
  maxFiles?: number;
};

export default function ImageDropzone({ onFilesChangeAction, maxFiles = 6 }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  function handleFiles(filesList: FileList | null) {
    if (!filesList) return;
    const files = Array.from(filesList).slice(0, maxFiles);

    onFilesChangeAction(files); // fixed usage

    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  function openPicker() {
    inputRef.current?.click();
  }

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={openPicker}
        className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center cursor-pointer"
      >
        <p className="text-sm text-gray-600">Drag & drop or click to upload (max {maxFiles})</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {previews.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {previews.map((src, i) => (
            <div key={i} className="w-full h-24 rounded-md overflow-hidden bg-gray-100">
              <img src={src} alt={`preview-${i}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
