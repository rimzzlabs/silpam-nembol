"use server";

import { failedAction, successAction } from "@/lib/action";
import { createClient } from "../supabase/server";
import type { ResolveComplaint } from "./zod-schema";
import { updateComplaint } from "./query";
import { revalidatePath } from "next/cache";

export async function processComplaintAction(complaintId: number) {
  let processed_at = new Date().toISOString();
  let res = await updateComplaint({
    id: complaintId,
    status: "diproses",
    processed_at,
  });

  if (res.error) return failedAction(res.error.message);

  revalidatePath("/", "layout");
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

  revalidatePath("/", "layout");
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

  revalidatePath("/", "layout");
  return successAction({
    message: "Status pengaduan diperbarui menjadi ditolak",
  });
}
