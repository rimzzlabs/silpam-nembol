import { toInt } from "radash";
import { createClient } from "../supabase/server";
import type { Tables } from "../supabase/types";

type UpdateComplaintPayload = Prettify<
  Partial<
    Pick<
      Tables<"pengaduan">,
      | "foto"
      | "judul"
      | "konten"
      | "lokasi"
      | "status"
      | "processed_at"
      | "completed_at"
    >
  > & { id: number }
>;

export async function getServerComplaints(options: QueryOptions) {
  let supabase = await createClient();

  let page = toInt(options?.page, 1);
  let limit = toInt(options?.limit, 10);

  let from = (page - 1) * limit;
  let to = from + limit - 1;

  if (!options.userId) {
    return await supabase
      .from("pengaduan")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);
  }

  return await supabase
    .from("pengaduan")
    .select("*", { count: "exact" })
    .eq("user_id", options?.userId)
    .order("created_at", { ascending: false })
    .range(from, to);
}

export async function getServerComplaintCounters(options: QueryOptions) {
  let supabase = await createClient();
  if (!options.userId) {
    return await supabase
      .from("pengaduan")
      .select("status", { count: "exact" });
  }

  return await supabase
    .from("pengaduan")
    .select("status", { count: "exact" })
    .eq("user_id", options?.userId);
}

export async function getServerComplaint(complaintId: number) {
  let supabase = await createClient();
  return await supabase
    .from("pengaduan")
    .select("*")
    .eq("id", complaintId)
    .single();
}

export async function updateComplaint(payload: UpdateComplaintPayload) {
  let supabase = await createClient();

  return await supabase
    .from("pengaduan")
    .update({
      judul: payload.judul,
      konten: payload.konten,
      lokasi: payload.lokasi,
      foto: payload.foto,
      status: payload.status,
      completed_at: payload.completed_at,
      processed_at: payload.processed_at,
    })
    .eq("id", payload.id);
}
