import { useQuery } from "@tanstack/react-query";
import { createClient } from "../supabase/client";

export function useSession() {
  let supabase = createClient();

  return useQuery({
    queryKey: ["get-user"],
    queryFn: async () => {
      let sessionQuery = await supabase.auth.getSession();

      if (sessionQuery.error || !sessionQuery.data.session) {
        throw new Error("Unauthorized");
      }

      let roleQuery = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", sessionQuery.data.session.user.id)
        .maybeSingle();

      if (roleQuery.error || !roleQuery.data?.role) {
        throw new Error("Unauthorized");
      }

      return {
        ...sessionQuery.data.session.user,
        userRole: roleQuery.data.role,
      };
    },
  });
}
