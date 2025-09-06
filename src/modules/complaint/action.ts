"use server";

import { failedAction, successAction } from "@/lib/action";
import { getServerSession } from "../auth/query";
import { createClient } from "../supabase/server";
import type { CreateComplaint, ResolveComplaint } from "./zod-schema";
import { updateComplaint } from "./query";
import { revalidatePath } from "next/cache";

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

export async function processComplaintAction(complaintId: number) {
  let processed_at = new Date().toISOString();
  let res = await updateComplaint({
    id: complaintId,
    status: "diproses",
    processed_at,
  });

  if (res.error) return failedAction(res.error.message);

  revalidatePath("/user/complaint/details/[id]", "page");
  return successAction({
    message: "Status pengaduan diperbarui menjadi diproses",
  });
}

export async function resolveComplaintAction(payload: ResolveComplaint) {
  let supabase = await createClient();
  let user = await supabase.auth.getUser();
  if (user.error) return failedAction(user.error.message);

  let completed_at = new Date().toISOString();
  let res = await updateComplaint({
    id: payload.id,
    status: "selesai",
    completed_at,
  });
  if (res.error) return failedAction(res.error.message);

  let tanggapanQuery = await supabase.from("tanggapan").insert({
    isi_tanggapan: payload.remarks,
    pengaduan_id: payload.id,
    user_id: user.data.user.id,
  });
  if (tanggapanQuery.error) return failedAction(tanggapanQuery.error.message);

  revalidatePath("/user/complaint/details/[id]", "page");
  return successAction({
    message: "Status pengaduan diperbarui menjadi selesai",
  });
}

export async function rejectComplaintAction(payload: ResolveComplaint) {
  let supabase = await createClient();
  let user = await supabase.auth.getUser();
  if (user.error) return failedAction(user.error.message);

  let rejected_at = new Date().toISOString();
  let res = await updateComplaint({
    id: payload.id,
    status: "ditolak",
    rejected_at,
  });
  if (res.error) return failedAction(res.error.message);

  let tanggapanQuery = await supabase.from("tanggapan").insert({
    isi_tanggapan: payload.remarks,
    pengaduan_id: payload.id,
    user_id: user.data.user.id,
  });
  if (tanggapanQuery.error) return failedAction(tanggapanQuery.error.message);

  revalidatePath("/user/complaint/details/[id]", "page");
  return successAction({
    message: "Status pengaduan diperbarui menjadi ditolak",
  });
}
