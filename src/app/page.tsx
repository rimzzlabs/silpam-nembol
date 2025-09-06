import { ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClipboardPlus } from "lucide-react";

export default function Home() {
  return (
    <section className="h-screen grid place-items-center">
      <header className="w-11/12 max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold xl:text-4xl">SILPAM Desa Nembol</h1>
        <p>Sistem Informasi Layanan Pengaduan Desa Nembol</p>

        <div className="flex items-center gap-2 text-start pt-6 pb-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl">76</CardTitle>
              <CardDescription>Pengaduan Dibuat</CardDescription>
            </CardHeader>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl">98</CardTitle>
              <CardDescription>Pengaduan Terselesaikan</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <ButtonLink href="/new">
          <ClipboardPlus className="size-4" />
          Buat Pengaduan
        </ButtonLink>
      </header>
    </section>
  );
}
