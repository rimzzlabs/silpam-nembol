"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { match, P } from "ts-pattern";
import { F } from "@mobily/ts-belt";
import { useComplaintCounters } from "@/modules/complaint/hooks";
import { useSession } from "@/modules/auth/hooks";

type UserCardProps = {
  total: number;
  completed: number;
  processed: number;
  created: number;
};

export function UserCards(props: UserCardProps) {
  let session = useSession();
  let userId = session.data?.id;
  let complaintCountsQuery = useComplaintCounters({
    userId,
    initialData: props,
  });

  let data = match(complaintCountsQuery.data)
    .with(P.nullish, () => props)
    .otherwise(F.identity);

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{data.created}</CardTitle>
          <CardDescription>Pengaduan diajukan</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{data.processed}</CardTitle>
          <CardDescription>Pengaduan diproses</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{data.completed}</CardTitle>
          <CardDescription>Pengaduan selesai</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
