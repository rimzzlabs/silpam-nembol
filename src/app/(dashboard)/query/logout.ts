import { useMutation } from "@tanstack/react-query";
import { logoutAction } from "../actions/logout";

export function useLogout() {
  return useMutation({
    mutationFn: () => logoutAction(),
  });
}
