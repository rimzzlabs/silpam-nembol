import { createClient } from "@/modules/supabase/client";
import type { Tables } from "@/modules/supabase/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toInt } from "radash";
import { parseComplaintCounters } from "./utils";
import type { CreateComplaint } from "./zod-schema";
import { useSession } from "../auth/hooks";

type UseComplaintsOptions = Prettify<
  OptionalPagination & {
    userId?: string;
    initialData?: PaginatedResult<Tables<"pengaduan">>;
  }
>;

type UseComplaintCounters = {
  userId?: string;
  initialData?: {
    total: number;
    created: number;
    processed: number;
    completed: number;
  };
};

export function useComplaints(options?: UseComplaintsOptions) {
  let supabase = createClient();

  let page = toInt(options?.page, 1);
  let limit = toInt(options?.limit, 10);

  let from = (page - 1) * limit;
  let to = from + limit - 1;

  return useQuery({
    initialData: options?.initialData,
    enabled: Boolean(options?.userId),
    queryKey: [
      "get-complaints",
      options?.userId,
      from,
      to,
      limit,
      page,
    ] as const,
    queryFn: async (ctx) => {
      let [, userId, from, to, limit, page] = ctx.queryKey;
      if (!userId) throw new Error("Missing user id");

      let res = await supabase
        .from("pengaduan")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .range(from, to)
        .abortSignal(ctx.signal)
        .throwOnError();

      return { limit, result: res.data, page, total: res.count };
    },
  });
}

export function useComplaintCounters(options?: UseComplaintCounters) {
  let supabase = createClient();

  return useQuery({
    initialData: options?.initialData,
    enabled: Boolean(options?.userId),
    queryKey: ["get-complaint-counters", options?.userId] as const,
    queryFn: async (ctx) => {
      let [, userId] = ctx.queryKey;
      if (!userId) {
        let res = await supabase
          .from("pengaduan")
          .select("status", { count: "exact" })
          .abortSignal(ctx.signal)
          .throwOnError();

        let counters = parseComplaintCounters(res.data);

        return {
          total: res.count,
          ...counters,
        };
      }

      let res = await supabase
        .from("pengaduan")
        .select("status", { count: "exact" })
        .eq("user_id", userId)
        .abortSignal(ctx.signal)
        .throwOnError();

      let total = res.count;
      let counters = parseComplaintCounters(res.data);

      return { total, ...counters };
    },
  });
}

export function useCreateComplaint() {
  let qc = useQueryClient();
  let supabase = createClient();
  let session = useSession();
  let userId = session.data?.id;

  return useMutation({
    mutationFn: async (payload: CreateComplaint) => {
      if (!userId) throw new Error("Unauthorized");

      return await supabase
        .from("pengaduan")
        .insert({
          judul: payload.title,
          konten: payload.content,
          lokasi: payload.location,
          user_id: userId,
          foto: payload?.imageUrl,
        })
        .throwOnError();
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["get-complaints"] });
    },
  });
}
