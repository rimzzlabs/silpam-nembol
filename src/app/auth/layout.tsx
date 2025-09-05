import { Megaphone } from "lucide-react";
import type { PropsWithChildren } from "react";

export default function Layout(props: PropsWithChildren) {
  return (
    <main className="grid xl:grid-cols-3 min-h-screen">
      <section className="bg-muted items-center justify-center hidden xl:flex flex-col">
        <Megaphone className="size-10 stroke-muted-foreground" />
        <p className="font-semibold text-muted-foreground text-center text-balance pt-4">
          Sistem Informasi Layanan Pengaduan Masyarakat Desa Nembol
        </p>
      </section>

      <section className="xl:col-span-2">{props.children}</section>
    </main>
  );
}
