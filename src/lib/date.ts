import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { id } from "date-fns/locale";

/**
 *
 * @param token default to `"dd MMM yyyy"`
 * @returns
 */
export function formatDate(token = "d MMM yyyy, HH:mm") {
  return (dateValue: Date | number | string) => {
    let tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return format(toZonedTime(dateValue, tz), token, { locale: id });
  };
}
