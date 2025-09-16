import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80",
        secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
        destructive: "border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80",
        outline: "text-slate-950 border-slate-200 hover:bg-slate-100",
        success: "border-transparent bg-emerald-500 text-white hover:bg-emerald-500/80",
        warning: "border-transparent bg-amber-500 text-white hover:bg-amber-500/80",
        info: "border-transparent bg-blue-500 text-white hover:bg-blue-500/80",
        gradient: "border-transparent bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600",
        glass: "border-white/20 bg-white/20 backdrop-blur-md text-slate-700 hover:bg-white/30",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Badge = forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export { Badge, badgeVariants }