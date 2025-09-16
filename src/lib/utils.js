import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(input) {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function formatTime(input) {
  const date = new Date(input)
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export function absoluteUrl(path) {
  return `${process.env.VITE_APP_URL || 'http://localhost:5173'}${path}`
}

export function truncate(str, length) {
  return str.length > length ? `${str.substring(0, length)}...` : str
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}