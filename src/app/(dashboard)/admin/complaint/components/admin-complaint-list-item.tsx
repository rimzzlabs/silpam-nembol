import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/date";
import { trimParagraph } from "@/lib/string";
import type { Tables } from "@/modules/supabase/types";
import { pipe } from "@mobily/ts-belt";
import { Calendar, EyeIcon, MapPin } from "lucide-react";
import Link from "next/link";

export function AdminComplaintListItem(props: Tables<"pengaduan">) {
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
            <Link href={`/admin/complaint/details/${props.id}`}>
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
