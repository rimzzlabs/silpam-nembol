"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { withSonnerPromise } from "@/lib/sonner";
import { useRejectComplaint } from "@/modules/complaint/hooks";
import {
  resolveComplaint,
  type ResolveComplaint,
} from "@/modules/complaint/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsMutating } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function RejectComplaintButton(props: {
  complaintId: number;
  status: string;
}) {
  let router = useRouter();
  let mutation = useRejectComplaint();
  let [open, setOpen] = useState(false);
  let isProcessing = useIsMutating({ mutationKey: ["process-complaint"] });
  let isResolving = useIsMutating({ mutationKey: ["resolve-complaint"] });

  let isPending = Boolean(mutation.isPending || isProcessing || isResolving);

  let form = useForm<ResolveComplaint>({
    defaultValues: { id: props.complaintId, remarks: "" },
    resolver: zodResolver(resolveComplaint),
  });

  let onSubmit = form.handleSubmit(
    withSonnerPromise(
      async (values) => {
        await mutation.mutateAsync(values);
        form.reset();
        setOpen(false);
        router.refresh();
      },
      {
        loading: "Mengubah status aduan, harap tunggu...",
        success: "Status aduan berhasil diperbarui",
        error: "Status aduan gagal diperbarui, harap coba lagi nanti",
      },
    ),
  );

  if (props.status === "ditolak" || props.status === "selesai") return null;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isPending} size="sm">
          <XIcon className="size-4" />
          Tolak aduan
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tolak aduan warga</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah anda yakin ingin menolak aduan ini? Anda akan menanggapi
            aduan warga dan menandai aduan ini sebagai <strong>ditolak</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-5">
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Isi tanggapan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tulis tanggapan disini"
                      className="resize-none max-h-36"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel>Batalkan</AlertDialogCancel>
              <Button
                variant="destructive"
                disabled={form.formState.isSubmitting || mutation.isPending}
              >
                Ya, tolak aduan
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
