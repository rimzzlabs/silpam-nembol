"use client";

import { useInfiniteComplaints } from "@/modules/complaint/hooks";
import { parseInfiniteComplaints } from "@/modules/complaint/utils";
import type { Tables } from "@/modules/supabase/types";
import { ComplaintListItem } from "./complaint-list-item";
import { parseAsInteger, useQueryState } from "nuqs";
import { Button } from "../ui/button";
import { ChevronsDown } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { match, P } from "ts-pattern";

type ComplaintListProps = {
  initialData: PaginatedResult<
    Tables<"pengaduan"> & {
      profiles?: Pick<Tables<"profiles">, "id" | "nama" | "alamat">;
    }
  >;
  prefixDetailPathname: "/user" | "/admin";
  emptyMessage: string;
};

export function ComplaintList(props: ComplaintListProps) {
  let [limit] = useQueryState("page", parseAsInteger.withDefault(9));

  let complaintsQuery = useInfiniteComplaints({
    initialData: props.initialData,
    limit,
  });

  let complaints = parseInfiniteComplaints(complaintsQuery.data?.pages);

  let disableLoadMore =
    complaintsQuery.isFetchingNextPage ||
    complaintsQuery.isPending ||
    !complaintsQuery.hasNextPage;

  let loadMoreLabel = match([
    complaintsQuery.isFetchingNextPage,
    complaintsQuery.hasNextPage,
  ])
    .with([true, P._], () => "Sedang memuat")
    .with([P._, true], () => "Muat lebih banyak")
    .otherwise(() => "Sudah memuat semua");

  let onFetchNextPage = async () => {
    await complaintsQuery.fetchNextPage();
  };

  if (complaints.length < 1) {
    return (
      <div className="h-[calc(100vh-12rem)] grid place-items-center text-center">
        <p className="text-sm font-medium text-muted-foreground max-w-sm">
          {props.emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="pt-4">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr)))] gap-3">
          {complaints.map((complaint) => (
            <ComplaintListItem
              {...complaint}
              key={complaint.id}
              prefixDetailPathname={props.prefixDetailPathname}
            />
          ))}
        </div>

        <div className="flex items-center justify-center py-10">
          <Button
            variant="secondary"
            onClick={onFetchNextPage}
            disabled={disableLoadMore}
          >
            <ChevronsDown className="size-4" /> {loadMoreLabel}
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
