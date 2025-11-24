import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCurrentDay(): number {
  const now = new Date()
  const month = now.getMonth()
  const date = now.getDate()

  // Only valid during December (month 11)
  if (month === 11 && date >= 1 && date <= 25) {
    return date
  }

  // For testing purposes, return day 1 if not in December
  return 1
}

export function getMonthName(month: number): string {
  const months = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ]
  return months[month]
}
