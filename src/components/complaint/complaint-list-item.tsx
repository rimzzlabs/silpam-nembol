"use client";

import type { Tables } from "@/modules/supabase/types";
import { trimParagraph } from "@/lib/string";
import { Calendar, EyeIcon, MapPin, Trash2Icon, User2 } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useRemoveComplaint } from "@/modules/complaint/hooks";
import { withSonnerPromise } from "@/lib/sonner";

type ComplaintListItemProps = Prettify<
  Tables<"pengaduan"> & {
    profiles?: Pick<Tables<"profiles">, "id" | "nama" | "alamat">;
  } & {
    prefixDetailPathname: `/user` | `/admin`;
  }
>;

export function ComplaintListItem(props: ComplaintListItemProps) {
  let removeComplaint = useRemoveComplaint();

  let variant = match<string, BadgeVariants>(props.status)
    .with("diproses", () => "warning")
    .with("selesai", () => "success")
    .with("ditolak", () => "destructive")
    .otherwise(() => "default");

  let detailUrl = `${props.prefixDetailPathname}/complaint/details/${props.id}`;

  let onClickRemove = withSonnerPromise(
    async () => await removeComplaint.mutateAsync(props.id),
    {
      loading: "Menghapus aduan, harap tunggu...",
      success: "Aduan berhasil dihapus",
      error: "Aduan gagal dihapus, harap coba lagi nanti",
    },
  );

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

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={removeComplaint.isPending}
                variant="destructive"
                size="sm"
                className="size-8 p-0"
              >
                <span className="sr-only">Hapus aduan</span>
                <Trash2Icon className="size-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Apakah kamu yakin ingin menghapus aduan ini?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  Aduan ini akan dihapus secara permanen dan tidak dapat
                  dikembalikan.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <Button variant="destructive" asChild>
                  <AlertDialogAction onClick={onClickRemove}>
                    Ya, hapus aduan
                  </AlertDialogAction>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
