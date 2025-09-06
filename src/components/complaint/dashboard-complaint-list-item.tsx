import type { Tables } from "@/modules/supabase/types";
import { match } from "ts-pattern";
import { Badge, type BadgeVariants } from "../ui/badge";
import { trimParagraph } from "@/lib/string";
import { Calendar, MapPin, User2 } from "lucide-react";
import { title } from "radash";
import { pipe } from "@mobily/ts-belt";
import { formatDate } from "@/lib/date";

export function DashboardComplaintListItem(
  props: Tables<"pengaduan"> & {
    profiles?: Pick<Tables<"profiles">, "id" | "nama" | "alamat">;
  },
) {
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
        <Badge variant={variant}>{title(props.status)}</Badge>

        {props.profiles && (
          <div className="inline-flex items-center gap-2">
            <User2 className="size-4" />

            <span className="text-sm font-medium">{props.profiles.nama}</span>
          </div>
        )}

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
