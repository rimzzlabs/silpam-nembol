import { ComplaintCards } from "@/components/complaint/complaint-cards";
import { DashboardComplaintList } from "@/components/complaint/dashboard-complaint-list";
import { getServerComplaints } from "@/modules/complaint/query";
import {
  parseComplaintCounters,
  parseComplaints,
} from "@/modules/complaint/utils";
import { createClient } from "@/modules/supabase/server";
import { F, O, pipe } from "@mobily/ts-belt";
import { redirect } from "next/navigation";
import { toInt } from "radash";

export default async function Admin(props: TPageProps) {
  let supabase = await createClient();
  let userQuery = await supabase.auth.getUser();
  let params = await props.searchParams;

  if (userQuery.error) redirect("/auth/signin");

  let page = toInt(params.page, 1);
  let limit = toInt(params.limit, 9);

  let _complaintsQuery = getServerComplaints({ page, limit });

  let _complaintCountsQuery = supabase
    .from("pengaduan")
    .select("status", { count: "exact" });

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
      <ComplaintCards {...counters} total={complaintsQuery.count ?? 0} />

      <DashboardComplaintList
        title="Aduan terbaru"
        emptyMessage="Belum ada aduan dari warga"
        description="Berikut adalah 10 aduan terbaru yang warga buat"
        prefixComplaintPathname="/admin"
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
