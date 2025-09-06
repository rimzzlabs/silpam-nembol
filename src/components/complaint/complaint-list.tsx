"use client";

import { useComplaints } from "@/modules/complaint/hooks";
import { parseComplaints } from "@/modules/complaint/utils";
import type { Tables } from "@/modules/supabase/types";
import { ComplaintListItem } from "./complaint-list-item";

type ComplaintListProps = {
  initialData: PaginatedResult<Tables<"pengaduan">>;
  prefixDetailPathname: "/user" | "/admin";
};

export function ComplaintList(props: ComplaintListProps) {
  let complaintsQuery = useComplaints({ initialData: props.initialData });

  let complaints = parseComplaints(complaintsQuery.data?.result);

  if (complaints.length < 1) {
    return (
      <div className="h-[calc(100vh-8rem)] grid place-items-center text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Belum ada warga yang membuat pengaduan
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr)))] gap-3">
      {complaints.map((complaint) => (
        <ComplaintListItem
          {...complaint}
          key={complaint.id}
          prefixDetailPathname={props.prefixDetailPathname}
        />
      ))}
    </div>
  );
}
