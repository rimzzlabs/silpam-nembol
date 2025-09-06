import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <Loader2 className="animate-spin size-8" />
      <p className="font-medium text-muted-foreground">Memuat halaman...</p>
    </div>
  );
}
