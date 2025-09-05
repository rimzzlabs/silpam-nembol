import { A, F, O, pipe } from "@mobily/ts-belt";
import type { Tables } from "../supabase/types";

export function parseComplaintCounters(
  complaints: Array<Pick<Tables<"pengaduan">, "status">>,
) {
  return {
    created: pipe(
      complaints,
      A.filter((d) => d.status === "diajukan"),
      A.length,
    ),
    processed: pipe(
      complaints,
      A.filter((d) => d.status === "diproses"),
      A.length,
    ),
    completed: pipe(
      complaints,
      A.filter((d) => d.status === "selesai"),
      A.length,
    ),
  };
}

export function parseComplaints(
  complaints?: Array<Tables<"pengaduan">> | null,
) {
  return pipe(complaints, O.fromNullable, O.mapWithDefault([], F.identity));
}
