import { TimeBasedCache } from "@/lib/memchache";
import { NextResponse, type NextRequest } from "next/server";
import type { Tables } from "./types";
import { createClient } from "./server";

let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

let cache = new TimeBasedCache<string, Tables<"profiles"> & { role: string }>(
  1000 * 60 * 10 /* 10 minutes */,
);

function isAdmin(role: string) {
  return role === "admin";
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!supabaseAnonKey || !supabaseUrl) {
    throw new Error("Missing Supabase credentials");
  }

  let supabase = await createClient();

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: Don't remove getClaims()
  let { data } = await supabase.auth.getClaims();

  let claims = data?.claims;
  let pathname = request.nextUrl.pathname;
  let isAuthPage = pathname.startsWith("/auth");

  if (!claims && !isAuthPage) {
    // no user, potentially respond by redirecting the user to the login page
    let url = request.nextUrl.clone();
    url.pathname = "/auth/signin";
    cache.clear();
    return NextResponse.redirect(url);
  }

  let sessionId = claims?.session_id ?? "";
  let user = cache.get(sessionId);

  if (!user) {
    let userQuery = await supabase.auth.getUser();

    if (userQuery.error) return supabaseResponse;

    let _roleQuery = supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userQuery.data.user.id)
      .maybeSingle();
    let _profile = supabase
      .from("profiles")
      .select("*")
      .eq("id", userQuery.data.user.id)
      .maybeSingle();

    let [roleQuery, profileQuery] = await Promise.all([_roleQuery, _profile]);

    if (!roleQuery.data?.role || !profileQuery.data) return supabaseResponse;

    cache.set(sessionId, { ...profileQuery.data, role: roleQuery.data.role });
    user = { ...profileQuery.data, role: roleQuery.data.role };
    return supabaseResponse;
  }

  const isUserAdmin = isAdmin(user.role);

  if (isAuthPage) {
    let url = request.nextUrl.clone();
    let newPathname = isAdmin(user.role) ? "/admin" : "/user";
    url.pathname = newPathname;
    return NextResponse.redirect(url);
  }

  let isAdminPage = pathname.startsWith("/admin");
  let isUserPage = pathname.startsWith("/user");

  if (isUserAdmin && isUserPage) {
    let url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  if (!isUserAdmin && isAdminPage) {
    let url = request.nextUrl.clone();
    url.pathname = "/user";
    return NextResponse.redirect(url);
  }
  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    let myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
