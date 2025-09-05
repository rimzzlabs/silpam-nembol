"use server";

import { failedAction, successAction } from "@/lib/action";
import type { SignInSchema } from "@/modules/auth/zod-schema";
import { createClient } from "@/modules/supabase/server";
import { revalidatePath } from "next/cache";

export async function signinAction(payload: SignInSchema) {
  let supabase = await createClient();

  let signIn = await supabase.auth.signInWithPassword(payload);

  if (signIn.error) return failedAction(signIn.error.message);

  let userId = signIn.data.user.id;

  let profile = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (profile.error) return failedAction(profile.error.message);

  let role = profile.data.role;

  if (role === "admin") {
    revalidatePath("/admin");
  } else if (role === "user") {
    revalidatePath("/user");
  }

  return successAction({ role, message: "Berhasil Masuk" });
}
