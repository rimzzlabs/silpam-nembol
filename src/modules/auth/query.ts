import { createClient } from "../supabase/server";

export async function getServerSession() {
  let supabase = await createClient();

  let session = await supabase.auth.getSession();
  if (session.error) return null;

  return session.data.session;
}
