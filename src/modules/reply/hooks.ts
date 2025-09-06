import { useQuery } from "@tanstack/react-query";
import { createClient } from "../supabase/client";

export function useReply(complaintId: number) {
  let supabase = createClient();

  return useQuery({
    queryKey: ["get-replies", complaintId] as const,
    queryFn: async (ctx) => {
      let [, complaintId] = ctx.queryKey;

      let res = await supabase
        .from("tanggapan")
        .select("id, isi_tanggapan, created_at, updated_at")
        .eq("pengaduan_id", complaintId)
        .abortSignal(ctx.signal)
        .throwOnError()
        .maybeSingle();

      return res.data;
    },
  });
}
