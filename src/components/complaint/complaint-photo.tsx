import type { Tables } from "@/modules/supabase/types";
import { ImageOffIcon } from "lucide-react";
import Image from "next/image";

export function ComplaintPhoto(
  props: Pick<Tables<"pengaduan">, "foto" | "judul">,
) {
  return (
    <div className="pt-5">
      {props.foto && (
        <Image
          priority
          width={640}
          height={256}
          alt={props.judul}
          src={props.foto}
          className="rounded-md aspect-video w-full object-cover"
        />
      )}

      {!props.foto && (
        <div className="bg-muted rounded-md gap-2 h-80 text-muted-foreground flex flex-col items-center justify-center text-center">
          <ImageOffIcon className="size-12" />
          <p className="font-medium">Foto tidak tersedia</p>
        </div>
      )}
    </div>
  );
}
