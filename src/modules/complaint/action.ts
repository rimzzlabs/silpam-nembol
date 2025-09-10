"use server";

import { failedAction, successAction } from "@/lib/action";
import { createClient } from "../supabase/server";
import type { ResolveComplaint } from "./zod-schema";
import { updateComplaint } from "./query";
import { revalidatePath } from "next/cache";
import { A, pipe, S } from "@mobily/ts-belt";

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

export async function removeComplaintAction(id: number) {
  let supabase = await createClient();
  let complaint = await supabase
    .from("pengaduan")
    .select("foto")
    .eq("id", id)
    .maybeSingle();

  if (!complaint.data?.foto) {
    return failedAction("Gagal menghapus foto saat menghapus pengaduan");
  }

  let imagePath = pipe(
    complaint.data.foto,
    S.split("/"),
    A.sliceToEnd(-2),
    A.join("/"),
  );

  await supabase.storage.from("pengaduan-foto").remove([imagePath]);

  let replyQuery = await supabase
    .from("tanggapan")
    .delete()
    .eq("pengaduan_id", id);
  if (replyQuery.error) {
    console.info("replyQuery error: ", replyQuery.error);
    return failedAction("Gagal menghapus tanggapan saat menghapus pengaduan");
  }

  let complaintQuery = await supabase.from("pengaduan").delete().eq("id", id);
  if (complaintQuery.error) {
    console.info("complaintQuery error: ", complaintQuery.error);
    return failedAction("Gagal menghapus pengaduan");
  }

  revalidatePath("/", "layout");

  return successAction({
    message: "Pengaduan berhasil dihapus",
  });
}
