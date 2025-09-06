"use client";

import { useIsClient } from "@/hooks/use-is-client";
import { useReply } from "@/modules/reply/hooks";
import { Loader2, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";

export function ComplaintReply(props: { complaintId: number }) {
  let isClient = useIsClient();
  let replyQuery = useReply(props.complaintId);

  if (!isClient) {
    return (
      <section className="pt-6 max-w-3xl border-t">
        <h2 className="text-xl font-semibold pb-3">Tanggapan aduan</h2>

        <div className="h-80 grid place-items-center">
          <Loader2 className="size-4 animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="pt-6 max-w-3xl border-t w-full pb-10">
      <h2 className="text-xl font-semibold">Tanggapan aduan</h2>

      {replyQuery.isPending && (
        <div className="h-80 grid place-items-center">
          <Loader2 className="size-4 animate-spin" />
        </div>
      )}

      {replyQuery.isError && (
        <div className="h-80 grid place-items-center">
          <p className="font-medium text-muted-foreground">Terjadi kesalahan</p>
          <Button variant="secondary">
            <RefreshCcw className="size-4" /> Coba lagi
          </Button>
        </div>
      )}

      {replyQuery.isSuccess && !replyQuery.data?.isi_tanggapan && (
        <div className="h-80 grid place-items-center text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Belum ada tanggapan dari desa
          </p>
        </div>
      )}

      {replyQuery.isSuccess && replyQuery.data?.isi_tanggapan && (
        <div className="w-full grid">
          <p className="font-semibold text-muted-foreground pb-3 pt-1">
            Tanggapan dari desa:
          </p>
          <p className="text-sm font-medium text-balance">
            &quot;{replyQuery.data.isi_tanggapan}&quot;
          </p>
        </div>
      )}
    </section>
  );
}
