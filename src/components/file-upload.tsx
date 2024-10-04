"use client";

import type { Endpoints } from "@/app/api/uploadthing/core";

import { X } from "lucide-react";
import Image from "next/image";

import { UploadDropzone } from "@/utils/uploadthing";
import { cn } from "@/lib/utils";

type FileUploadProps = {
  size?: "icon" | "small" | "large";
  endpoint: Endpoints;
  value: string;
  onChange: (...event: unknown[]) => void;
};

export const FileUpload = ({
  size,
  endpoint,
  onChange,
  value,
}: FileUploadProps) => {
  if (value) {
    return (
      <div
        className={cn(
          "relative",
          size === "small" && "flex justify-center h-[258px]",
          size === "icon" && "flex justify-center items-center h-48"
        )}
      >
        <Image
          fill
          src={value}
          alt="Upload"
          className={cn("h-full rounded-md m-auto", size === "icon" && "!w-48")}
        />
        <button className="h-4 w-4" onClick={() => onChange("")}>
          <X
            className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm"
            type="button"
          />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      className="ut-button:bg-primary focus-within:ut-button:ring-black ut-button:ut-readying:bg-neutral-400 ut-button:ut-uploading:bg-neutral-400 after:ut-button:ut-uploading:bg-primary"
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.url);
      }}
      onUploadError={(error: Error) => console.log(error)}
    />
  );
};
