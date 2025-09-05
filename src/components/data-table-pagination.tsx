import { match } from "ts-pattern";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

import { usePagination } from "@/hooks/use-pagination";

import { toInt } from "radash";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface DataTablePaginationProps {
  pages: number;
}

/**
 * use [page] query param to retrieve the current page
 * @param props
 * @returns
 */
export function DataTablePagination(props: DataTablePaginationProps) {
  let router = useRouter();
  let pathname = usePathname();
  let params = useSearchParams();

  let page = toInt(params.get("page"), 1);

  let paginations = usePagination({
    page,
    pages: props.pages,
  });

  let changePage = (page: number) => {
    let urlSearchParams = new URLSearchParams(params.toString());
    urlSearchParams.set("page", String(page));
    router.push(`${pathname}?${urlSearchParams.toString()}`);
  };

  return (
    <Pagination>
      <PaginationContent>
        {paginations.map((pagination) =>
          match(pagination)
            .with({ type: "hidden" }, () => null)
            .with({ type: "elipsis" }, (item) => (
              <PaginationItem key={item.value}>
                <PaginationEllipsis size="default" />
              </PaginationItem>
            ))
            .with({ type: "prev" }, (item) => (
              <PaginationItem key={item.value}>
                <PaginationPrevious
                  size="default"
                  disabled={page === 1}
                  onClick={() => changePage(page - 1)}
                />
              </PaginationItem>
            ))
            .with({ type: "next" }, (item) => (
              <PaginationItem key={item.value}>
                <PaginationNext
                  size="default"
                  disabled={page === props.pages}
                  onClick={() => changePage(page + 1)}
                />
              </PaginationItem>
            ))
            .with({ type: "page" }, (item) => (
              <PaginationItem key={item.value}>
                <PaginationLink
                  size="default"
                  className={cn("px-3.5 w-auto", item.value < 10 && "px-4")}
                  isActive={page === item.value}
                  onClick={() => changePage(item.value)}
                >
                  {item.value}
                </PaginationLink>
              </PaginationItem>
            ))
            .exhaustive(),
        )}
      </PaginationContent>
    </Pagination>
  );
}
