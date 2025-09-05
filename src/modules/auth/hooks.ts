import { useQuery } from "@tanstack/react-query";
import { createClient } from "../supabase/client";

export function useSession() {
  let supabase = createClient();

  return useQuery({
    queryKey: ["get-user"],
    queryFn: async () => {
      let res = await supabase.auth.getSession();

      if (res.error) throw new Error(res.error.message);

      return res.data.session?.user;
    },
  });
}
