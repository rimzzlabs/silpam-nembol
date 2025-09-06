// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/modules/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/auth/error", request.url));
  }

  // Exchange the code for a session
  const { data: sessionData, error: sessionError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (sessionError || !sessionData?.user) {
    return NextResponse.redirect(new URL("/auth/error", request.url));
  }

  const userId = sessionData.user.id;

  // Fetch user role (adjust table + column names)
  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (roleError || !roleData) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Redirect based on role
  if (roleData.role === "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  } else {
    return NextResponse.redirect(new URL("/user", request.url));
  }
}
