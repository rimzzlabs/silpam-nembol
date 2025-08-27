import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

/**
 *
 * @param token default to `"dd MMM yyyy"`
 * @returns
 */
export function formatDate(token = "dd MMM yyyy") {
  return (dateValue: Date | number | string) => {
    let tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return format(toZonedTime(dateValue, tz), token);
  };
}
