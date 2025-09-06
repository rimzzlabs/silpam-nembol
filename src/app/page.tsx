import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FilePlusIcon } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <section className="pt-40">
      <header className="w-11/12 max-w-2xl mx-auto text-center">
        <Card className="py-3">
          <CardContent className="px-3">
            <Image
              priority
              src="/preview.png"
              alt="preview aduan"
              width={1280}
              height={720}
            />
          </CardContent>
        </Card>

        <h1 className="text-3xl font-bold xl:text-4xl py-3">
          SILPAM Desa Nembol
        </h1>
        <p className="font-medium text-muted-foreground pb-6">
          Sistem Informasi Layanan Pengaduan Desa Nembol
        </p>

        <ButtonLink href="/new">
          <FilePlusIcon className="size-4" />
          Buat Aduan
        </ButtonLink>
      </header>
    </section>
  );
}
