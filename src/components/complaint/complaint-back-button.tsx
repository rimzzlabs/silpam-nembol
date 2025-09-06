import Link from "next/link";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";

export function ComplaintBackButton(props: { pathname: string }) {
  return (
    <Button size="sm" variant="link" className="px-0 max-w-max" asChild>
      <Link href={props.pathname}>
        <ChevronLeft className="size-4" />
        Kembali
      </Link>
    </Button>
  );
}
