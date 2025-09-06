import { createClient } from "../supabase/server";

export async function getServerSession() {
  let supabase = await createClient();

  let session = await supabase.auth.getSession();
  if (session.error) return null;

  return session.data.session;
}

export async function getServerProfile() {
  let supabase = await createClient();
  let session = await getServerSession();

  if (!session) return null;

  let userQuery = await supabase
    .from("profiles")
    .select("id, nama, role, alamat, created_at, updated_at")
    .eq("id", session.user.id)
    .maybeSingle();

  if (userQuery.error) return null;

  return userQuery.data;
}
