import { auth } from "@/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const getSession = async () => {
    const session = await auth();
  
    if (!session) throw new UploadThingError("Unauthorised");
  
    return { userId: session.user.id };
  };

export const ourFileRouter = {
  postUploader: f({
    image: { maxFileSize: "32MB" },
    video: { maxFileSize: "512MB" },
  })
    .middleware(async () => await getSession())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
