import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const touchButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 transition-transform",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10 text-base", // Extra large for mobile
        icon: "h-10 w-10",
        "icon-lg": "h-12 w-12", // Larger touch target
        "icon-xl": "h-14 w-14", // Extra large touch target
      },
      touchOptimized: {
        true: "touch:h-12 touch:px-6 touch:text-base min-h-[44px] min-w-[44px]", // iOS/Android recommended minimum
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      touchOptimized: true,
    },
  }
)

export interface TouchButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof touchButtonVariants> {
  asChild?: boolean
  loading?: boolean
  hapticFeedback?: boolean
}

const TouchButton = React.forwardRef<HTMLButtonElement, TouchButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    touchOptimized, 
    asChild = false, 
    loading = false,
    hapticFeedback = false,
    onClick,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Provide haptic feedback on supported devices
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(10); // Short vibration
      }
      
      if (onClick && !disabled && !loading) {
        onClick(e);
      }
    };

    return (
      <Comp
        className={cn(touchButtonVariants({ variant, size, touchOptimized, className }))}
        ref={ref}
        onClick={handleClick}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
TouchButton.displayName = "TouchButton"

export { TouchButton, touchButtonVariants }