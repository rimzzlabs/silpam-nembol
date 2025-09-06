"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type SignUpSchema, signUpSchema } from "@/modules/auth/zod-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { withSonnerPromise } from "@/lib/sonner";
import { Input, InputPassword } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { signupAction } from "@/modules/auth/actions/signup";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function SignUpForm() {
  let router = useRouter();
  let [isPending, startTransition] = useTransition();

  let form = useForm<SignUpSchema>({
    defaultValues: { email: "", password: "", address: "", name: "" },
    resolver: zodResolver(signUpSchema),
  });

  let onSubmit = form.handleSubmit(
    withSonnerPromise(
      async (values) => {
        let res = await signupAction(values);
        if (res.error) throw new Error(res.message);

        form.reset();
        startTransition(() => {
          router.replace("/auth/signin");
        });
      },
      {
        loading: "Mendaftarkan akun baru anda...",
        success:
          "Akun berhasil didaftarkan, silakan cek email dan verifikasi akun anda",
        error: "Gagal mendaftarkan akun",
      },
    ),
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="w-full grid gap-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Nama lengkap anda" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat email</FormLabel>
              <FormControl>
                <Input placeholder="Alamat email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <InputPassword placeholder="Kata sandi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat tempat tinggal</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Alamat tempat tinggal"
                  className="max-h-40 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isPending || form.formState.isSubmitting}>
          Daftar
        </Button>
      </form>
    </Form>
  );
}
