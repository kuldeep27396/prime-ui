import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const cardVariants = cva(
  "rounded-xl transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md",
        elevated: "bg-white p-6 shadow-lg hover:shadow-xl border border-slate-100 transform hover:scale-[1.02] transition-all duration-300",
        glass: "bg-white/80 backdrop-blur-md border border-white/20 p-6 shadow-lg hover:shadow-xl hover:bg-white/90 transition-all duration-300",
        gradient: "p-6 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-white to-slate-50 border border-slate-100",
        interactive: "border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md cursor-pointer hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300 transform hover:scale-[1.01] active:scale-[0.99]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Card = forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant }), className)}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight text-slate-900", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-500", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
}