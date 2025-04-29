import { toZonedTime, getTimezoneOffset } from "date-fns-tz";

function zonedTimeToUtc(date: Date | string | number, timeZone: string): Date {
  const zonedDate = toZonedTime(date, timeZone);
  const offset = getTimezoneOffset(timeZone, zonedDate);
  const utcTimestamp = zonedDate.getTime() - offset;
  return new Date(utcTimestamp);
}

export default zonedTimeToUtc;
