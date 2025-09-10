import { createClient } from "@/modules/supabase/client";
import type { Tables } from "@/modules/supabase/types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toInt } from "radash";
import { parseComplaintCounters } from "./utils";
import type { CreateComplaint, ResolveComplaint } from "./zod-schema";
import { useSession } from "../auth/hooks";
import {
  processComplaintAction,
  rejectComplaintAction,
  removeComplaintAction,
  resolveComplaintAction,
} from "./action";

type UseComplaintsOptions = Prettify<
  OptionalPagination & {
    userId?: string;
    initialData?: PaginatedResult<
      Tables<"pengaduan"> & {
        profiles?: Pick<Tables<"profiles">, "id" | "nama" | "alamat">;
      }
    >;
  }
>;

type UseComplaintCounters = {
  userId?: string;
  initialData?: {
    total: number;
    created: number;
    processed: number;
    completed: number;
    rejected: number;
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

      if (!userId) {
        let res = await supabase
          .from("pengaduan")
          .select(
            `*,
          profiles (id, nama, alamat)`,
            { count: "exact" },
          )
          .range(from, to)
          .order("created_at", { ascending: false })
          .abortSignal(ctx.signal)
          .throwOnError();

        return { limit, result: res.data, page, total: res.count ?? 0 };
      }

      let res = await supabase
        .from("pengaduan")
        .select(
          `*,
          profiles (id, nama, alamat)`,
          { count: "exact" },
        )
        .eq("user_id", userId)
        .range(from, to)
        .order("created_at", { ascending: false })
        .abortSignal(ctx.signal)
        .throwOnError();

      return { limit, result: res.data, page, total: res.count ?? 0 };
    },
  });
}

export function useInfiniteComplaints(
  options?: Omit<UseComplaintsOptions, "page">,
) {
  const supabase = createClient();
  const limit = toInt(options?.limit, 10);

  return useInfiniteQuery({
    initialData: options?.initialData
      ? {
          pages: [options?.initialData],
          pageParams: [],
        }
      : undefined,
    queryKey: ["get-infinite-complaints", options?.userId, limit] as const,
    queryFn: async ({ pageParam = 0, queryKey, signal }) => {
      let [, userId] = queryKey;
      let from = pageParam * limit;
      let to = from + limit - 1;

      let base = supabase
        .from("pengaduan")
        .select(
          `*,
           profiles (id, nama, alamat)`,
          { count: "exact" },
        )
        .range(from, to)
        .order("created_at", { ascending: false })
        .abortSignal(signal);

      let res = userId
        ? await base.eq("user_id", userId).throwOnError()
        : await base.throwOnError();

      return {
        result: res.data ?? [],
        total: res.count ?? 0,
        page: pageParam,
        limit,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { page, total, limit } = lastPage;
      const loaded = (page + 1) * limit;
      return loaded < total ? page + 1 : undefined;
    },
  });
}

export function useComplaintCounters(options?: UseComplaintCounters) {
  let supabase = createClient();

  return useQuery({
    initialData: options?.initialData,
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

export function useProcessComplaint() {
  let qc = useQueryClient();

  return useMutation({
    mutationKey: ["process-complaint"],
    mutationFn: async (complaintId: number) => {
      return await processComplaintAction(complaintId);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["get-complaints"] });
    },
  });
}

export function useResolveComplaint() {
  let qc = useQueryClient();

  return useMutation({
    mutationKey: ["resolvle-complaint"],
    mutationFn: async (payload: ResolveComplaint) => {
      return await resolveComplaintAction(payload);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["get-replies"] });
      qc.invalidateQueries({ queryKey: ["get-complaints"] });
    },
  });
}

export function useRejectComplaint() {
  let qc = useQueryClient();

  return useMutation({
    mutationKey: ["reject-complaint"],
    mutationFn: async (payload: ResolveComplaint) => {
      return await rejectComplaintAction(payload);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["get-replies"] });
      qc.invalidateQueries({ queryKey: ["get-complaints"] });
    },
  });
}

export function useRemoveComplaint() {
  let qc = useQueryClient();

  return useMutation({
    mutationFn: async (complaintId: number) => {
      return await removeComplaintAction(complaintId);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["get-complaints"] });
      qc.invalidateQueries({ queryKey: ["get-infinite-complaints"] });
    },
  });
}
