import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Der Server legt fest, welches Türchen heute dran ist (0 = kein Adventstag),
// damit eine falsch gestellte Geräteuhr keinen falschen Tag auslosen kann.
let today = 0

export function setToday(day: number) {
  today = day
}

export function getCurrentDay(): number {
  return today
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
