import { createClient } from "@/modules/supabase/server";
import { redirect } from "next/navigation";

import { F, O, pipe } from "@mobily/ts-belt";
import { toInt } from "radash";
import { ComplaintCards } from "@/components/complaint/complaint-cards";
import { DashboardComplaintList } from "@/components/complaint/dashboard-complaint-list";
import {
  parseComplaintCounters,
  parseComplaints,
} from "@/modules/complaint/utils";

export default async function User(props: TPageProps) {
  let supabase = await createClient();
  let userQuery = await supabase.auth.getUser();
  let params = await props.searchParams;

  if (userQuery.error) redirect("/auth/signin");

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

  let complaints = parseComplaints(complaintsQuery.data);

  let counts = pipe(
    complaintCountsQuery.data,
    O.fromNullable,
    O.mapWithDefault([], F.identity),
    F.toMutable,
  );

  let counters = parseComplaintCounters(counts);

  return (
    <section className="grid gap-5">
      <h1 className="text-2xl font-bold">Dashboard </h1>
      <ComplaintCards
        {...counters}
        userId={userQuery.data.user.id}
        total={complaintsQuery.count ?? 0}
      />

      <DashboardComplaintList
        title="Aduan saya"
        emptyMessage="Anda belum membuat pengaduan"
        description="Berikut adalah 10 aduan terbaru yang Anda buat"
        prefixComplaintPathname="/user"
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
