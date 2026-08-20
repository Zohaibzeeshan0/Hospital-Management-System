import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: string | Date, formatStr: string = "MMM dd, yyyy"): string {
  if (!date) return "-";
  const d = typeof date === "string" ? parseISO(date) : date;
  try {
    return format(d, formatStr);
  } catch {
    return String(date);
  }
}

export function getStatusBadgeClass(status: string): string {
  switch (status.toUpperCase()) {
    case "ACTIVE":
    case "CONFIRMED":
    case "COMPLETED":
    case "PAID":
    case "IN_STOCK":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    case "PENDING":
    case "PENDING_APPROVAL":
    case "UNPAID":
    case "PARTIAL":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    case "CANCELLED":
    case "SUSPENDED":
    case "NO_SHOW":
    case "OUT_OF_STOCK":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    default:
      return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
  }
}
