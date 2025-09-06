"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type SignInSchema, signInSchema } from "@/modules/auth/zod-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { withSonnerPromise } from "@/lib/sonner";
import { Input, InputPassword } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signinAction } from "@/modules/auth/actions/signin";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { O, pipe } from "@mobily/ts-belt";

export function SignInForm() {
  let router = useRouter();
  let [isPending, startTransition] = useTransition();
  let params = useSearchParams();
  let redirectPathname = pipe(
    params.get("from"),
    O.mapWithDefault(null, decodeURIComponent),
  );

  let form = useForm<SignInSchema>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(signInSchema),
  });

  let onSubmit = form.handleSubmit(
    withSonnerPromise(
      async (values) => {
        let res = await signinAction(values);
        if (res.error) throw new Error();

        let isAdmin = res.result.role === "admin";
        if (isAdmin) {
          startTransition(() => {
            router.replace(redirectPathname || "/admin");
          });
          return;
        }

        startTransition(() => {
          router.replace(redirectPathname || "/user");
        });
      },
      {
        loading: "Memuat...",
        success: "Berhasil Masuk",
        error: "Email atau kata sandi anda salah",
      },
    ),
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="w-full grid gap-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat Email</FormLabel>
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

        <Button disabled={form.formState.isSubmitting || isPending}>
          Login
        </Button>
      </form>
    </Form>
  );
}
