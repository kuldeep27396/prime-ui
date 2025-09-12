import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, X } from "lucide-react"

export interface MobileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  clearable?: boolean
  onClear?: () => void
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  touchOptimized?: boolean
}

const MobileInput = React.forwardRef<HTMLInputElement, MobileInputProps>(
  ({ 
    className, 
    type, 
    label, 
    error, 
    clearable = false,
    onClear,
    leftIcon,
    rightIcon,
    touchOptimized = true,
    value,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    const handleClear = () => {
      if (onClear) {
        onClear()
      }
    }

    return (
      <div className="w-full">
        {label && (
          <label className={cn(
            "block text-sm font-medium text-gray-700 mb-2",
            touchOptimized && "touch:text-base"
          )}>
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            type={inputType}
            className={cn(
              "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              touchOptimized && "touch:h-12 touch:text-base touch:px-4",
              leftIcon && "pl-10",
              (rightIcon || clearable || isPassword) && "pr-10",
              error && "border-red-500 focus-visible:ring-red-500",
              isFocused && "ring-2 ring-blue-500 border-blue-500",
              className
            )}
            ref={ref}
            value={value}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          />
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {clearable && value && (
              <button
                type="button"
                onClick={handleClear}
                className={cn(
                  "text-gray-400 hover:text-gray-600 transition-colors",
                  touchOptimized && "touch:p-1"
                )}
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  "text-gray-400 hover:text-gray-600 transition-colors",
                  touchOptimized && "touch:p-1"
                )}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}
            
            {rightIcon && !clearable && !isPassword && (
              <div className="text-gray-400">
                {rightIcon}
              </div>
            )}
          </div>
        </div>
        
        {error && (
          <p className={cn(
            "mt-1 text-sm text-red-600",
            touchOptimized && "touch:text-base"
          )}>
            {error}
          </p>
        )}
      </div>
    )
  }
)
MobileInput.displayName = "MobileInput"

export { MobileInput }