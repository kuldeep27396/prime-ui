import * as React from "react"
import { cn } from "@/lib/utils"

const MobileCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'compact' | 'list'
    touchOptimized?: boolean
  }
>(({ className, variant = 'default', touchOptimized = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      {
        'p-6': variant === 'default',
        'p-4': variant === 'compact',
        'p-3': variant === 'list',
      },
      touchOptimized && "touch:p-6 active:scale-[0.98] transition-transform",
      className
    )}
    {...props}
  />
))
MobileCard.displayName = "MobileCard"

const MobileCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'compact'
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5",
      {
        'pb-6': variant === 'default',
        'pb-4': variant === 'compact',
      },
      className
    )}
    {...props}
  />
))
MobileCardHeader.displayName = "MobileCardHeader"

const MobileCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    size?: 'sm' | 'md' | 'lg'
  }
>(({ className, size = 'md', ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-semibold leading-none tracking-tight",
      {
        'text-lg': size === 'sm',
        'text-xl': size === 'md',
        'text-2xl': size === 'lg',
      },
      className
    )}
    {...props}
  />
))
MobileCardTitle.displayName = "MobileCardTitle"

const MobileCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    size?: 'sm' | 'md'
  }
>(({ className, size = 'md', ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-muted-foreground",
      {
        'text-sm': size === 'sm',
        'text-base': size === 'md',
      },
      className
    )}
    {...props}
  />
))
MobileCardDescription.displayName = "MobileCardDescription"

const MobileCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
MobileCardContent.displayName = "MobileCardContent"

const MobileCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'compact'
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center",
      {
        'pt-6': variant === 'default',
        'pt-4': variant === 'compact',
      },
      className
    )}
    {...props}
  />
))
MobileCardFooter.displayName = "MobileCardFooter"

export { 
  MobileCard, 
  MobileCardHeader, 
  MobileCardFooter, 
  MobileCardTitle, 
  MobileCardDescription, 
  MobileCardContent 
}