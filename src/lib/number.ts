import { O, pipe } from "@mobily/ts-belt";

export function formatNumber(
  options?: Intl.NumberFormatOptions & { locale?: string },
) {
  let fmt = new Intl.NumberFormat(options?.locale ?? "en", options);

  return (n?: number | null) => {
    return pipe(O.fromNullable(n), O.getWithDefault(0), fmt.format);
  };
}
