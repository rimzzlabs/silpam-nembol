"use server";

import { createClient } from "@/modules/supabase/server";
import type { SignUpSchema } from "../zod-schema";
import { failedAction, successAction } from "@/lib/action";

let siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export async function signupAction(payload: SignUpSchema) {
  if (!siteUrl) throw new Error("Missing siteURL");

  let supabase = await createClient();

  let signUpQuery = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (signUpQuery.error) {
    console.info("signup error: ", signUpQuery.error);
    return failedAction("User dengan email ini sudah terdaftar");
  }

  if (!signUpQuery.data.user) {
    console.info("signup user error: ", signUpQuery.error);
    return failedAction("Gagal membuat akun");
  }

  let profileQuery = await supabase.from("profiles").insert({
    nama: payload.name,
    alamat: payload.address,
    id: signUpQuery.data.user.id,
  });

  if (profileQuery.error) {
    console.info("profile error: ", profileQuery.error);
    return failedAction(profileQuery.error.message);
  }

  return successAction({ message: "Berhasil membuat akun" });
}
