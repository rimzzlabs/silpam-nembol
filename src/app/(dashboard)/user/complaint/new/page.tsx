import { Title } from "@/components/title";
import { NewComplaintForm } from "./new-complaint-form";

export default function NewComplaint() {
  return (
    <section className="grid gap-5">
      <Title>Buat aduan baru</Title>
      <NewComplaintForm />
    </section>
  );
}
