"use server";

import { createClient } from "@/modules/supabase/server";
import type { SignUpSchema } from "../zod-schema";
import { failedAction, successAction } from "@/lib/action";
import { revalidatePath } from "next/cache";

export async function signup(payload: SignUpSchema) {
  let supabase = await createClient();

  let signUpQuery = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
  });

  if (signUpQuery.error) return failedAction("Gagal membuat akun");

  let profileQuery = await supabase
    .from("profiles")
    .insert({ nama: payload.name, alamat: payload.address });

  if (profileQuery.error) return failedAction("Gagal membuat akun");

  let signInQurey = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  if (signInQurey.error) return failedAction("Gagal membuat akun");

  revalidatePath("/", "layout");
  return successAction({ message: "Berhasil membuat akun" });
}
