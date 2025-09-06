import { toInt } from "radash";
import { getServerComplaints } from "@/modules/complaint/query";
import { getServerSession } from "@/modules/auth/query";
import { redirect } from "next/navigation";
import { parseComplaints } from "@/modules/complaint/utils";
import { ComplaintList } from "@/components/complaint/complaint-list";

export default async function Complaint(props: TPageProps) {
  let params = await props.searchParams;
  let session = await getServerSession();

  if (!session) redirect("/auth/signin");

  let page = toInt(params.page, 1);
  let limit = toInt(params.limit, 9);

  let res = await getServerComplaints({ page, limit });
  let result = parseComplaints(res.data);
  let total = res.count ?? 0;

  return (
    <section className="grid gap-5">
      <h1 className="text-2xl font-bold">Daftar aduan warga</h1>

      <ComplaintList
        prefixDetailPathname="/admin"
        initialData={{ limit, page, result, total }}
      />
    </section>
  );
}
