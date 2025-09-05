"use server";

import { failedAction, successAction } from "@/lib/action";
import { createClient } from "@/modules/supabase/server";

export async function logoutAction() {
  let supabase = await createClient();
  let res = await supabase.auth.signOut({ scope: "global" });

  if (res.error) return failedAction(res.error.message);

  return successAction({ message: "Berhasil logout" });
}
