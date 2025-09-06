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
import { useResolveComplaint } from "@/modules/complaint/hooks";
import {
  resolveComplaint,
  type ResolveComplaint,
} from "@/modules/complaint/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsMutating } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export function ResolveComplaintButton(props: {
  complaintId: number;
  status: string;
}) {
  let router = useRouter();
  let resolveMutation = useResolveComplaint();
  let isRejecting = useIsMutating({ mutationKey: ["reject-complaint"] });

  let isPending = Boolean(resolveMutation.isPending || isRejecting);

  let form = useForm<ResolveComplaint>({
    defaultValues: { id: props.complaintId, remarks: "" },
    resolver: zodResolver(resolveComplaint),
  });

  let onSubmit = form.handleSubmit(
    withSonnerPromise(
      async (values) => {
        await resolveMutation.mutateAsync(values);
        form.reset();
        router.refresh();
      },
      {
        loading: "Mengubah status aduan, harap tunggu...",
        success: "Status aduan berhasil diperbarui",
        error: "Status aduan gagal diperbarui, harap coba lagi nanti",
      },
    ),
  );

  if (props.status !== "diproses") return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={isPending} size="sm">
          <Check className="size-4" />
          Tanggapi aduan
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tanggapi aduan warga</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah anda yakin ingin mengubah status aduan ini? Anda akan
            menanggapi aduan warga dan menandai aduan ini sebagai{" "}
            <strong>selesai</strong>
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
              <AlertDialogCancel disabled={isPending}>
                Batalkan
              </AlertDialogCancel>
              <Button disabled={form.formState.isSubmitting || isPending}>
                Ya, tanggapi aduan
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
