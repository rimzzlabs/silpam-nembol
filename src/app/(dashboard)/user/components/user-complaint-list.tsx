"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Tables } from "@/modules/supabase/types";
import { F, O, pipe } from "@mobily/ts-belt";
import { UserComplaintListItem } from "./user-complaint-list-item";
import { useComplaints } from "@/modules/complaint/hooks";
import { useSession } from "@/modules/auth/hooks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function UserComplaintList(props: {
  initialData: PaginatedResult<Tables<"pengaduan">>;
}) {
  let session = useSession();

  let userId = session.data?.id;
  let complaintsQuery = useComplaints({
    initialData: props.initialData,
    userId,
  });

  let complaints = pipe(
    complaintsQuery.data?.result,
    O.fromNullable,
    O.mapWithDefault([], F.identity),
    F.toMutable,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaduan Terbaru</CardTitle>
        <CardDescription>
          Berikut adalah 10 pengaduan terbaru yang Anda buat
        </CardDescription>

        <CardAction>
          <Button variant="secondary" asChild>
            <Link href="/user/complaint">
              Lihat semua <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div>
          {complaints.length < 1 && (
            <div className="h-96 grid place-items-center">
              <p className="text-sm font-semibold text-center">
                Anda belum membuat laporan
              </p>
            </div>
          )}

          {complaints.length > 0 &&
            complaints.map((complaint) => (
              <UserComplaintListItem key={complaint.id} {...complaint} />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
