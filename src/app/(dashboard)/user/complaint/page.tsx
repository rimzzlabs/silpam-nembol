import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { UserComplaintList } from "./components/user-complaint-list";
import { toInt } from "radash";
import { getServerComplaints } from "@/modules/complaint/query";
import { getServerSession } from "@/modules/auth/query";
import { redirect } from "next/navigation";
import { parseComplaints } from "@/modules/complaint/utils";

export default async function Complaint(props: TPageProps) {
  let params = await props.searchParams;
  let session = await getServerSession();

  if (!session) redirect("/auth/signin");

  let page = toInt(params.page, 1);
  let limit = toInt(params.limit, 10);

  let res = await getServerComplaints({ page, limit, userId: session.user.id });
  let result = parseComplaints(res.data);
  let total = res.count ?? 0;

  return (
    <section className="grid gap-5">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Daftar aduan saya</h1>

        <Button asChild>
          <Link href="/user/complaint/new">
            <PlusIcon className="size-4" />
            Buat aduan
          </Link>
        </Button>
      </div>

      <UserComplaintList initialData={{ limit, page, result, total }} />
    </section>
  );
}
