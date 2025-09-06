import type { Tables } from "@/modules/supabase/types";
import { trimParagraph } from "@/lib/string";
import { Calendar, EyeIcon, MapPin } from "lucide-react";
import { pipe } from "@mobily/ts-belt";
import { formatDate } from "@/lib/date";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

type ComplaintListItemProps = Tables<"pengaduan"> & {
  prefixDetailPathname: `/user` | `/admin`;
};

export function ComplaintListItem(props: ComplaintListItemProps) {
  let detailUrl = `${props.prefixDetailPathname}/complaint/details/${props.id}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="pb-2">{props.judul}</CardTitle>
        <CardDescription className="inline-flex gap-2">
          <Calendar className="size-4" />
          {pipe(props.created_at, formatDate())}
        </CardDescription>

        <CardDescription className="inline-flex gap-2">
          <MapPin className="size-4" />
          {props.lokasi}
        </CardDescription>

        <CardAction>
          <Button asChild size="sm" variant="ghost">
            <Link href={detailUrl}>
              <EyeIcon className="size-4" />
              Lihat
            </Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <p className="text-sm font-medium text-muted-foreground">
          {trimParagraph(props.konten, 130)}
        </p>
      </CardContent>
    </Card>
  );
}
