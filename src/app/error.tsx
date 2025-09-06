"use client";

import { Title } from "@/components/title";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function ErrorPage(props: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(props.error);
  }, [props.error]);

  return (
    <div className="flex flex-col items-center justify-center text-center h-[calc(100vh-8rem)]">
      <Title>Telah terjadi kesalahan pada sistem</Title>
      <p className="font-medium text-muted-foreground pt-1 pb-3 max-w-xl mx-auto">
        {props.error.message}
      </p>

      <Button onClick={() => props.reset()}>Coba lagi</Button>
    </div>
  );
}
