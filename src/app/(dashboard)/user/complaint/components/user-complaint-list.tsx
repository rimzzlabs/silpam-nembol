"use client";

import { useSession } from "@/modules/auth/hooks";
import { useComplaints } from "@/modules/complaint/hooks";
import { parseComplaints } from "@/modules/complaint/utils";
import type { Tables } from "@/modules/supabase/types";
import { UserComplaintListItem } from "./user-complaint-list-item";

export function UserComplaintList(props: {
  initialData: PaginatedResult<Tables<"pengaduan">>;
}) {
  let session = useSession();
  let userId = session.data?.id;
  let complaintsQuery = useComplaints({
    userId,
    initialData: props.initialData,
  });

  let complaints = parseComplaints(complaintsQuery.data?.result);

  if (complaints.length < 1) {
    return (
      <div className="h-[calc(100vh-12rem)] grid place-items-center text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Anda belum membuat pengaduan
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr)))] gap-3">
      {complaints.map((complaint) => (
        <UserComplaintListItem key={complaint.id} {...complaint} />
      ))}
    </div>
  );
}
