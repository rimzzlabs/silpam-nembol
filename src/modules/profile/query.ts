import { useQuery } from "@tanstack/react-query";
import { createClient } from "../supabase/client";
import { useSession } from "../auth/hooks";

export function useProfile() {
  let supabase = createClient();
  let session = useSession();
  let sessionUserId = session.data?.user.id;

  return useQuery({
    enabled: Boolean(sessionUserId),
    queryKey: ["get-profile", sessionUserId] as const,
    queryFn: async (ctx) => {
      let [, userId] = ctx.queryKey;
      if (!userId) throw new Error("Missing user id");

      return await supabase
        .from("profiles")
        .select("*")
        .throwOnError()
        .eq("id", userId)
        .single();
    },
  });
}
