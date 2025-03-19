import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const capitalize = (str: string) =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

export const getTimeRemaining = (endDatetime: string) => {
  const endDate = new Date(endDatetime);
  const now = new Date();

  if (now > endDate) {
    return "Ended";
  }

  return formatDistanceToNow(endDate, { addSuffix: true });
};

export const getStartDateTime = (startDatetime: string) => {
  const startDate = new Date(startDatetime);
  return formatDistanceToNow(startDate, { addSuffix: true });
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const calculateAge = (birthdate?: string): string => {
  if (!birthdate) return "Unknown";

  const birthDate = new Date(birthdate);
  const now = new Date();

  let yearDiff = now.getFullYear() - birthDate.getFullYear();
  let monthDiff = now.getMonth() - birthDate.getMonth();

  if (monthDiff < 0) {
    yearDiff -= 1;
    monthDiff += 12;
  }

  return `${yearDiff} years ${monthDiff} months`;
};
