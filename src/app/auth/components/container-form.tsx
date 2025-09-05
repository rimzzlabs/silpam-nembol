import { ButtonLink } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Fragment, type PropsWithChildren } from "react";

type ContainerFormProps = PropsWithChildren<{
  button?: { label: string; href: string };
  title: string;
  description: string;
}>;

export function ContainerForm(props: ContainerFormProps) {
  return (
    <section className="grid place-items-center h-full">
      <div className="max-w-sm w-full">
        <div className="pb-10 text-center text-balance">
          <h2 className="text-xl xl:text-2xl font-semibold">{props.title}</h2>
          <p className="text-sm font-medium text-muted-foreground">
            {props.description}
          </p>
        </div>

        {props.children}

        {props.button && (
          <Fragment>
            <Separator orientation="horizontal" className="my-5" />

            <div className="flex items-center justify-center">
              <ButtonLink
                variant="link"
                href={props.button?.href}
                className="h-auto py-0"
              >
                {props.button?.label}
              </ButtonLink>
            </div>
          </Fragment>
        )}
      </div>
    </section>
  );
}
