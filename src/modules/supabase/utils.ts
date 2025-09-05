import { createClient } from "./server";
import { uid } from "radash";

export async function uploadFile(options: { file: File; userId: string }) {
  let supabase = await createClient();
  let cleanFileName = options.file.name.replace(/\s+/g, "_");
  let fileName = `${options.userId}/${uid(16)}_${cleanFileName}`;

  let res = await supabase.storage
    .from("pengaduan-foto")
    .upload(fileName, options.file);

  if (res.error) return null;

  let urlQuery = supabase.storage
    .from("pengaduan-foto")
    .getPublicUrl(res.data.path);

  return { publicUrl: urlQuery.data.publicUrl, fullPath: res.data.path };
}

export async function deleteFile(fullPath: string) {
  let supabase = await createClient();
  return await supabase.storage.from("pengaduan-foto").remove([fullPath]);
}
