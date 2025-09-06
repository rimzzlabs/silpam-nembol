"use client";

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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { withSonnerPromise } from "@/lib/sonner";
import { useProcessComplaint } from "@/modules/complaint/hooks";
import { useIsMutating } from "@tanstack/react-query";
import { Repeat } from "lucide-react";

export function ProcessComplaintButton(props: {
  complaintId: number;
  status: string;
}) {
  let processComplaint = useProcessComplaint();
  let isRejecting = useIsMutating({ mutationKey: ["reject-complaint"] });

  let isPending = Boolean(processComplaint.isPending || isRejecting);

  let onClickProcess = withSonnerPromise(
    async () => {
      await processComplaint.mutateAsync(props.complaintId);
    },
    {
      loading: "Mengubah status aduan, harap tunggu...",
      success: "Status aduan berhasil diperbarui",
      error: "Status aduan gagal diperbarui, harap coba lagi nanti",
    },
  );

  if (props.status !== "diajukan") return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={isPending} size="sm">
          <Repeat className="size-4" />
          Proses aduan
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Proses aduan warga</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah anda yakin ingin memproses aduan ini?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Batalkan</AlertDialogCancel>
          <AlertDialogAction onClick={onClickProcess}>
            Ya, proses aduan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
