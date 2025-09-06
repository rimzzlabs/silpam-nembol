import { formatDate } from "@/lib/date";
import type { Tables } from "@/modules/supabase/types";
import { pipe } from "@mobily/ts-belt";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CheckCircle2, CircleXIcon } from "lucide-react";

export function ComplaintTimeline(props: Tables<"pengaduan">) {
  return (
    <div>
      <h2 className="text-lg font-semibold">Proses Pengaduan</h2>

      <div className="pt-5">
        <div className="border-l-2">
          <div className="relative pl-4">
            <div className="absolute -left-1.5 top-1 flex size-2.5 items-center justify-center rounded-full bg-primary" />
            <p className="text-sm pb-1 font-medium text-muted-foreground">
              Aduan dibuat
            </p>
            <span className="text-xs font-medium text-muted-foreground">
              {pipe(props.created_at, formatDate())}
            </span>
          </div>

          <div className="relative pl-4 mt-8">
            <div className="absolute -left-1.5 top-1 flex size-2.5 items-center justify-center rounded-full bg-yellow-500" />
            <p className="text-sm pb-1 font-medium text-muted-foreground">
              Aduan diproses
            </p>

            <span className="text-xs font-medium text-muted-foreground">
              {props.processed_at
                ? pipe(props.processed_at, formatDate())
                : "-"}
            </span>
          </div>

          {props.rejected_at && (
            <div className="relative pl-4 mt-8">
              <div className="absolute -left-1.5 top-1 flex size-2.5 items-center justify-center rounded-full bg-red-500" />
              <p className="text-sm pb-1 font-medium text-muted-foreground">
                Aduan ditolak
              </p>

              <span className="text-xs font-medium text-muted-foreground">
                {pipe(props.rejected_at, formatDate())}
              </span>
            </div>
          )}

          {props.processed_at && !props.rejected_at && (
            <div className="relative pl-4 mt-8">
              <div className="absolute -left-1.5 top-1 flex size-2.5 items-center justify-center rounded-full bg-emerald-500" />
              <p className="text-sm pb-1 font-medium text-muted-foreground">
                {props.completed_at ? "Aduan Selesai" : "Aduan Ditinjau"}
              </p>

              <span className="text-xs font-medium text-muted-foreground">
                {props.completed_at
                  ? pipe(props.completed_at, formatDate())
                  : "-"}
              </span>
            </div>
          )}
        </div>

        {props.completed_at && (
          <div className="pt-5">
            <Alert variant="success">
              <CheckCircle2 />
              <AlertTitle>Selamat! aduan berhasil terselesaikan</AlertTitle>
              <AlertDescription>
                Aduan ini berhasil di selesaikan, silakan buat aduan baru jika
                terjadi kesalahan
              </AlertDescription>
            </Alert>
          </div>
        )}

        {props.rejected_at && (
          <div className="pt-5">
            <Alert variant="destructive">
              <CircleXIcon />
              <AlertTitle>Perhatian! laporan diangap tidak valid</AlertTitle>
              <AlertDescription>
                Aduan ini dianggap tidak valid dan desa telah menolak aduan
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}
