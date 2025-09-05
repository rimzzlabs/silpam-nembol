"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { withSonnerPromise } from "@/lib/sonner";
import {
  createComplaint,
  type CreateComplaint,
} from "@/modules/complaint/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { NewComplaintFormUploader } from "./new-complaint-form-uploader";
import { useCreateComplaint } from "@/modules/complaint/hooks";
import { useRouter } from "next/navigation";

export function NewComplaintForm() {
  let router = useRouter();
  let mutation = useCreateComplaint();

  let form = useForm<CreateComplaint>({
    defaultValues: { title: "", content: "", location: "", imageUrl: "" },
    resolver: zodResolver(createComplaint),
  });

  let onSubmit = form.handleSubmit(
    withSonnerPromise(
      async (values) => {
        await mutation.mutateAsync(values);
        form.reset();
        router.push("/user/complaint");
      },
      {
        success: "Aduan berhasil dibuat",
        loading: "Membuat aduan baru, harap tunggu...",
        error: "Aduan gagal dibuat, harap coba lagi nanti",
      },
    ),
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="grid gap-5 max-w-md">
        <NewComplaintFormUploader />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul aduan</FormLabel>
              <FormControl>
                <Input placeholder="Judul aduan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konten aduan</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Konten aduan"
                  className="max-h-40 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lokasi aduan</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Lokasi aduan"
                  className="max-h-40 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button disabled={form.formState.isSubmitting}>Buat aduan</Button>
        </div>
      </form>
    </Form>
  );
}
