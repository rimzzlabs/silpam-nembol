import { toInt } from "radash";
import { createClient } from "../supabase/server";

export async function getServerComplaints(options: QueryOptions) {
  let supabase = await createClient();

  let page = toInt(options?.page, 1);
  let limit = toInt(options?.limit, 10);

  let from = (page - 1) * limit;
  let to = from + limit - 1;

  return await supabase
    .from("pengaduan")
    .select("*", { count: "exact" })
    .eq("user_id", options?.userId)
    .order("created_at", { ascending: false })
    .range(from, to);
}

export async function getServerComplaintCounters(options: QueryOptions) {
  let supabase = await createClient();

  return await supabase
    .from("pengaduan")
    .select("status", { count: "exact" })
    .eq("user_id", options?.userId);
}
