import { Badge, type BadgeVariants } from "@/components/ui/badge";
import { formatDate } from "@/lib/date";
import { trimParagraph } from "@/lib/string";
import type { Tables } from "@/modules/supabase/types";
import { pipe } from "@mobily/ts-belt";
import { Calendar, Loader, MapPin } from "lucide-react";
import { title } from "radash";
import { match } from "ts-pattern";

export function UserComplaintListItem(props: Tables<"pengaduan">) {
  let variant = match<string, BadgeVariants>(props.status)
    .with("diproses", () => "warning")
    .with("selesai", () => "success")
    .otherwise(() => "default");

  return (
    <div className="border-b last-of-type:border-b-0 py-3 flex flex-col lg:flex-row gap-4">
      <div>
        <h3 className="font-semibold pb-1">{props.judul}</h3>

        <p className="text-sm font-medium text-muted-foreground pb-2 max-w-xl text-balance">
          {trimParagraph(props.konten, 160)}
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <div className="inline-flex items-center gap-2">
          <Loader className="size-4" />

          <Badge variant={variant}>{title(props.status)}</Badge>
        </div>

        <div className="inline-flex items-center gap-2">
          <Calendar className="size-4" />

          <span className="text-sm font-medium">
            {pipe(props.created_at, formatDate())}
          </span>
        </div>

        <div className="inline-flex items-center gap-2">
          <MapPin className="size-4" />

          <span className="text-sm font-medium">{props.lokasi}</span>
        </div>
      </div>
    </div>
  );
}
