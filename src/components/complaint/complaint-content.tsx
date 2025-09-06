import type { Tables } from "@/modules/supabase/types";
import { CalendarIcon, MapPin } from "lucide-react";
import { pipe } from "@mobily/ts-belt";
import { formatDate } from "@/lib/date";

export function ComplaintContent(
  props: Pick<
    Tables<"pengaduan">,
    "created_at" | "judul" | "konten" | "lokasi"
  >,
) {
  return (
    <article>
      <h1 className="text-2xl font-bold pt-2 pb-4">{props.judul}</h1>

      <div className="inline-flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-5 pb-8">
        <div className="inline-flex items-center gap-2">
          <CalendarIcon className="size-4 stroke-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {pipe(props.created_at, formatDate())}
          </span>
        </div>

        <div className="inline-flex items-center gap-2">
          <MapPin className="size-4 stroke-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {props.lokasi}
          </span>
        </div>
      </div>

      <div className="max-w-prose">
        <p className="text-muted-foreground font-medium">{props.konten}</p>
      </div>
    </article>
  );
}
