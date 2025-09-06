"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ArrowRight } from "lucide-react";
import type { Tables } from "@/modules/supabase/types";
import { useComplaints } from "@/modules/complaint/hooks";
import { parseComplaints } from "@/modules/complaint/utils";
import { DashboardComplaintListItem } from "./dashboard-complaint-list-item";
import { ScrollArea } from "../ui/scroll-area";

type DashboardComplaintListProps = {
  userId?: string;
  title: string;
  description: string;
  emptyMessage: string;
  prefixComplaintPathname: "/user" | "/admin";
  initialData: PaginatedResult<
    Tables<"pengaduan"> & {
      profiles?: Pick<Tables<"profiles">, "id" | "nama" | "alamat">;
    }
  >;
};

export function DashboardComplaintList(props: DashboardComplaintListProps) {
  let complaintsQuery = useComplaints({
    userId: props.userId,
    initialData: props.initialData,
  });

  let complaints = parseComplaints(complaintsQuery.data?.result);
  let url = `${props.prefixComplaintPathname}/complaint`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>

        <CardAction>
          <Button variant="secondary" asChild>
            <Link href={url}>
              Lihat semua <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[26rem]">
          <div>
            {complaints.length < 1 && (
              <div className="h-96 grid place-items-center">
                <p className="text-sm font-semibold text-center">
                  {props.emptyMessage}
                </p>
              </div>
            )}

            {complaints.length > 0 &&
              complaints.map((complaint) => (
                <DashboardComplaintListItem {...complaint} key={complaint.id} />
              ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
