"use client";

import { useComplaints } from "@/modules/complaint/hooks";
import { parseComplaints } from "@/modules/complaint/utils";
import type { Tables } from "@/modules/supabase/types";
import { AdminComplaintListItem } from "./admin-complaint-list-item";

export function AdminComplaintList(props: {
  initialData: PaginatedResult<Tables<"pengaduan">>;
}) {
  let complaintsQuery = useComplaints({
    initialData: props.initialData,
  });

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
        <AdminComplaintListItem key={complaint.id} {...complaint} />
      ))}
    </div>
  );
}
