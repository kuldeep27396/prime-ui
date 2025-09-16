import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const inputVariants = cva(
  "flex w-full text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "h-11 rounded-lg border border-slate-300 bg-white/90 backdrop-blur-sm px-3 py-2 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white shadow-sm hover:shadow-md",
        elevated: "h-11 rounded-lg border-2 border-slate-200 bg-white px-3 py-2 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-lg hover:shadow-xl",
        glass: "h-11 rounded-lg border border-white/20 bg-white/80 backdrop-blur-md px-3 py-2 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white/90 shadow-lg hover:shadow-xl",
        minimal: "h-11 border-0 border-b-2 border-slate-200 bg-transparent px-0 py-2 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 rounded-none",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        default: "h-11 px-3",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Input = forwardRef(({ className, variant, size, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(inputVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

const Textarea = forwardRef(({ className, variant = "default", ...props }, ref) => {
  const baseClasses = variant === "elevated"
    ? "flex min-h-[120px] w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 resize-none disabled:cursor-not-allowed disabled:opacity-50"
    : "flex min-h-[120px] w-full rounded-lg border border-slate-300 bg-white/90 backdrop-blur-sm px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white shadow-sm hover:shadow-md transition-all duration-200 resize-none disabled:cursor-not-allowed disabled:opacity-50"

  return (
    <textarea
      className={cn(baseClasses, className)}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Input, Textarea, inputVariants }