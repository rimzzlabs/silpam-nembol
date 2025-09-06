import type { Tables } from "@/modules/supabase/types";
import { trimParagraph } from "@/lib/string";
import { Calendar, EyeIcon, MapPin, User2 } from "lucide-react";
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
import { Badge, type BadgeVariants } from "../ui/badge";
import { match } from "ts-pattern";
import { title } from "radash";

type ComplaintListItemProps = Prettify<
  Tables<"pengaduan"> & {
    profiles?: Pick<Tables<"profiles">, "id" | "nama" | "alamat">;
  } & {
    prefixDetailPathname: `/user` | `/admin`;
  }
>;

export function ComplaintListItem(props: ComplaintListItemProps) {
  let variant = match<string, BadgeVariants>(props.status)
    .with("diproses", () => "warning")
    .with("selesai", () => "success")
    .with("ditolak", () => "destructive")
    .otherwise(() => "default");

  let detailUrl = `${props.prefixDetailPathname}/complaint/details/${props.id}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="pb-2 text-balance">{props.judul}</CardTitle>
        <Badge variant={variant}>{title(props.status)}</Badge>

        <div className="flex flex-col gap-1 w-full pt-2">
          {props.prefixDetailPathname === "/admin" && props.profiles && (
            <CardDescription className="flex items-center gap-2">
              <User2 className="size-4" />
              <span>{props.profiles.nama}</span>
            </CardDescription>
          )}

          <CardDescription className="flex items-center gap-2">
            <Calendar className="size-4" />
            <span>{pipe(props.created_at, formatDate())}</span>
          </CardDescription>

          <CardDescription className="flex items-center gap-2">
            <MapPin className="size-4" />
            <span>{trimParagraph(props.lokasi, 60)}</span>
          </CardDescription>
        </div>

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
