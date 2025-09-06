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

type UserCardProps = {
  total: number;
  userId?: string;
  completed: number;
  processed: number;
  created: number;
  rejected: number;
};

export function ComplaintCards(props: UserCardProps) {
  let complaintCountsQuery = useComplaintCounters({
    userId: props.userId,
    initialData: props,
  });

  let data = match(complaintCountsQuery.data)
    .with(P.nullish, () => props)
    .otherwise(F.identity);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,12rem),1fr)))] gap-4">
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

      <Card>
        <CardHeader>
          <CardTitle>{data.rejected}</CardTitle>
          <CardDescription>Pengaduan ditolak</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
