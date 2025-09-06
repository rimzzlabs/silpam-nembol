import { getServerComplaint } from "@/modules/complaint/query";
import { notFound, redirect } from "next/navigation";
import { toInt } from "radash";
import { ComplaintTimeline } from "@/components/complaint/complaint-timeline";
import { ComplaintContent } from "@/components/complaint/complaint-content";
import { ComplaintReply } from "@/components/complaint/complaint-reply";
import { ComplaintBackButton } from "@/components/complaint/complaint-back-button";
import { ProcessComplaintButton } from "./components/process-complaint-button";
import { ResolveComplaintButton } from "./components/resolve-complaint-button";
import { ComplaintPhoto } from "@/components/complaint/complaint-photo";
import { Fragment } from "react";
import { RejectComplaintButton } from "./components/reject-complaint-button";

export default async function DetailsPage(props: TPageProps) {
  let params = await props.params;
  let complaintId = params.id;

  if (!complaintId) redirect("/user/complaint");

  let complaintQuery = await getServerComplaint(toInt(complaintId));

  if (!complaintQuery.data) notFound();

  let complaint = complaintQuery.data;

  return (
    <Fragment>
      <section className="grid xl:grid-cols-5 gap-5 pb-6">
        <div className="xl:col-span-3">
          <div className="flex items-center justify-between">
            <ComplaintBackButton pathname="/admin/complaint" />

            <div className="inline-flex items-center gap-2">
              <RejectComplaintButton
                complaintId={complaint.id}
                status={complaint.status}
              />
              <ProcessComplaintButton
                complaintId={complaint.id}
                status={complaint.status}
              />
              <ResolveComplaintButton
                complaintId={complaint.id}
                status={complaint.status}
              />
            </div>
          </div>

          <ComplaintPhoto foto={complaint.foto} judul={complaint.judul} />

          <ComplaintContent
            created_at={complaint.created_at}
            judul={complaint.judul}
            konten={complaint.konten}
            lokasi={complaint.lokasi}
          />
        </div>

        <div className="xl:col-span-2">
          <ComplaintTimeline {...complaint} />
        </div>
      </section>

      <ComplaintReply complaintId={complaint.id} />
    </Fragment>
  );
}
