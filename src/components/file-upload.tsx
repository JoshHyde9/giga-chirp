"use client";

import { FileIcon, X } from "lucide-react";
import Image from "next/image";

import { UploadDropzone } from "@/utils/uploadthing";

type FileUploadProps = {
  endpoint: "postUploader";
  value: string;
  onChange: (...event: unknown[]) => void;
};

export const FileUpload = ({ endpoint, onChange, value }: FileUploadProps) => {
  const fileType = value.split(".").pop();

  if (value) {
    return (
      <div className="relative h-[516px]">
        <Image fill src={value} alt="Upload" className="h-full rounded-md" />
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
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.url);
      }}
      onUploadError={(error: Error) => console.log(error)}
    />
  );
};