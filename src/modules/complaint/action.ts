"use server";

import { failedAction, successAction } from "@/lib/action";
import { getServerSession } from "../auth/query";
import { createClient } from "../supabase/server";
import type { CreateComplaint } from "./zod-schema";

export async function createServerComplaint(payload: CreateComplaint) {
  let supabase = await createClient();
  let session = await getServerSession();

  if (!session) return failedAction("Unathorized");
  let userId = session.user.id;

  let res = await supabase
    .from("pengaduan")
    .insert({
      judul: payload.title,
      konten: payload.content,
      lokasi: payload.location,
      user_id: userId,
      foto: payload?.imageUrl,
    })
    .overrideTypes<{ id: number }, { merge: false }>();

  if (res.error) return failedAction(res.error.message);

  return successAction({ id: res.data?.id });
}
