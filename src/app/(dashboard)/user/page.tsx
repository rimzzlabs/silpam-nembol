import { createClient } from "@/modules/supabase/server";
import { redirect } from "next/navigation";
import { UserCards } from "./components/user-cards";
import { UserComplaintList } from "./components/user-complaint-list";

import { A, F, O, pipe } from "@mobily/ts-belt";
import { toInt } from "radash";

export default async function User(props: TPageProps) {
  let supabase = await createClient();
  let userQuery = await supabase.auth.getUser();
  let params = await props.searchParams;

  if (userQuery.error) {
    redirect("/auth/signin");
  }

  let page = toInt(params.page, 1);
  let limit = toInt(params.limit, 10);

  let from = (page - 1) * limit;
  let to = from + limit - 1;

  let _complaintsQuery = supabase
    .from("pengaduan")
    .select("*", { count: "exact" })
    .eq("user_id", userQuery.data.user.id)
    .range(from, to);

  let _complaintCountsQuery = supabase
    .from("pengaduan")
    .select("status", { count: "exact" })
    .eq("user_id", userQuery.data.user.id);

  let [complaintsQuery, complaintCountsQuery] = await Promise.all([
    _complaintsQuery,
    _complaintCountsQuery,
  ]);

  let complaints = pipe(
    complaintsQuery.data,
    O.fromNullable,
    O.mapWithDefault([], F.identity),
    F.toMutable,
  );

  let counts = pipe(
    complaintCountsQuery.data,
    O.fromNullable,
    O.mapWithDefault([], F.identity),
    F.toMutable,
  );

  let created = pipe(
    counts,
    A.filter((d) => d.status === "diajukan"),
    A.length,
  );
  let processed = pipe(
    counts,
    A.filter((d) => d.status === "diproses"),
    A.length,
  );
  let completed = pipe(
    counts,
    A.filter((d) => d.status === "selesai"),
    A.length,
  );

  return (
    <section className="grid gap-5">
      <h1 className="text-2xl font-bold">Dashboard </h1>
      <UserCards
        completed={completed}
        processed={processed}
        created={created}
        total={complaintsQuery?.count ?? 0}
      />

      <UserComplaintList
        initialData={{
          limit,
          page,
          result: complaints,
          total: complaintsQuery?.count ?? 0,
        }}
      />
    </section>
  );
}
