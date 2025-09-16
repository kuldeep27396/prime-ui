import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105",
        secondary: "bg-gradient-to-r from-slate-50 to-slate-100 text-slate-900 hover:from-slate-100 hover:to-slate-200 border border-slate-200 shadow-sm hover:shadow-md",
        outline: "border-2 border-slate-300 bg-white/80 backdrop-blur-sm hover:bg-slate-50/90 hover:border-slate-400 text-slate-700 shadow-sm hover:shadow-md",
        ghost: "hover:bg-slate-100/80 text-slate-700 hover:text-slate-900 backdrop-blur-sm",
        success: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transform hover:scale-105",
        warning: "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-lg hover:shadow-xl hover:shadow-amber-500/25 transform hover:scale-105",
        danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl hover:shadow-red-500/25 transform hover:scale-105",
        glass: "bg-white/20 backdrop-blur-md border border-white/30 text-slate-700 hover:bg-white/30 shadow-lg hover:shadow-xl",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        default: "h-11 px-6",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

const Button = forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }