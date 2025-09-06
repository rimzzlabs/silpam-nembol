import { ComplaintBackButton } from "@/components/complaint/complaint-back-button";
import { ComplaintContent } from "@/components/complaint/complaint-content";
import { ComplaintPhoto } from "@/components/complaint/complaint-photo";
import { ComplaintReply } from "@/components/complaint/complaint-reply";
import { ComplaintTimeline } from "@/components/complaint/complaint-timeline";
import { getServerComplaint } from "@/modules/complaint/query";
import { notFound, redirect } from "next/navigation";
import { toInt } from "radash";
import { Fragment } from "react";

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
          <ComplaintBackButton pathname="/user/complaint" />
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
