"use server";

import { failedAction, successAction } from "@/lib/action";
import { getServerSession } from "../auth/query";
import { deleteFile, uploadFile } from "./utils";

export async function uploadImage(fd: FormData) {
  let file = fd.get("file") as File | null;
  if (!file) return failedAction("File not found");

  let session = await getServerSession();
  if (!session) return failedAction("Session not found");

  let userId = session.user.id;

  let res = await uploadFile({ file, userId });

  if (!res) return failedAction("Upload failed");

  return successAction({ publicUrl: res.publicUrl, filePath: res.fullPath });
}

export async function deleteImage(fullPath: string) {
  return await deleteFile(fullPath);
}
