import { getServerProfile } from "@/modules/auth/query";
import { redirect } from "next/navigation";

export default async function New() {
  let user = await getServerProfile();

  if (!user) redirect("/auth/signin");

  if (user.role === "user") redirect("/user/complaint/new");

  if (user.role === "admin") redirect("/admin");

  redirect("/auth/signin");
}
