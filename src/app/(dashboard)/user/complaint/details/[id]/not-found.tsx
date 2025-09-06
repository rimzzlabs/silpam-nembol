import { Title } from "@/components/title";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileTextIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="h-[calc(100vh-8rem)] grid place-items-center">
      <div className="text-center flex flex-col items-center justify-center">
        <FileTextIcon className="size-10 stroke-muted-foreground" />
        <Title>Aduan tidak ditemukan</Title>
        <p className="font-medium text-muted-foreground pt-1 pb-3">
          Sepertinya anda mencari aduan yang tidak ditemukan
        </p>
        <Button asChild>
          <Link href="/admin/complaint">
            <ChevronLeft className="size-4" />
            Kembali ke daftar aduan
          </Link>
        </Button>
      </div>
    </section>
  );
}
