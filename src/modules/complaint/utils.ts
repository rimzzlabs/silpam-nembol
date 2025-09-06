import { A, F, O, pipe } from "@mobily/ts-belt";
import type { Tables } from "../supabase/types";

export function parseComplaintCounters(
  complaints: Array<Pick<Tables<"pengaduan">, "status">>,
) {
  return {
    created: pipe(complaints, A.length),
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
    rejected: pipe(
      complaints,
      A.filter((d) => d.status === "ditolak"),
      A.length,
    ),
  };
}

export function parseComplaints(
  complaints?: Array<
    Tables<"pengaduan"> & {
      profiles?: Pick<Tables<"profiles">, "id" | "nama" | "alamat">;
    }
  > | null,
) {
  return pipe(
    complaints,
    O.fromNullable,
    O.mapWithDefault([], F.identity),
    A.sort((complaintA, complaintB) =>
      new Date(complaintB.created_at) > new Date(complaintA.created_at)
        ? 1
        : -1,
    ),
    F.toMutable,
  );
}
export function parseInfiniteComplaints(
  pages?: {
    result: Array<
      Tables<"pengaduan"> & {
        profiles?: Pick<Tables<"profiles">, "id" | "nama" | "alamat">;
      }
    >;
    total: number;
    page: number;
    limit: number;
  }[],
) {
  return pipe(
    pages,
    O.fromNullable,
    O.mapWithDefault([], F.identity),
    A.flatMap((d) => d.result),
    O.mapWithDefault([], F.identity),
    F.toMutable,
  );
}
