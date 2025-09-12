import * as React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number | string
  children: React.ReactNode
}

const ResponsiveGrid = React.forwardRef<HTMLDivElement, ResponsiveGridProps>(
  ({ className, cols = { default: 1, sm: 2, md: 3, lg: 4 }, gap = 4, children, ...props }, ref) => {
    const gridClasses = cn(
      "grid",
      // Default columns
      cols.default && `grid-cols-${cols.default}`,
      // Responsive columns
      cols.sm && `sm:grid-cols-${cols.sm}`,
      cols.md && `md:grid-cols-${cols.md}`,
      cols.lg && `lg:grid-cols-${cols.lg}`,
      cols.xl && `xl:grid-cols-${cols.xl}`,
      // Gap
      typeof gap === 'number' ? `gap-${gap}` : gap,
      className
    )

    return (
      <div ref={ref} className={gridClasses} {...props}>
        {children}
      </div>
    )
  }
)
ResponsiveGrid.displayName = "ResponsiveGrid"

interface MobileStackProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: number
  divider?: boolean
  children: React.ReactNode
}

const MobileStack = React.forwardRef<HTMLDivElement, MobileStackProps>(
  ({ className, spacing = 4, divider = false, children, ...props }, ref) => {
    const stackClasses = cn(
      "flex flex-col",
      `space-y-${spacing}`,
      className
    )

    const childrenArray = React.Children.toArray(children)

    return (
      <div ref={ref} className={stackClasses} {...props}>
        {divider
          ? childrenArray.map((child, index) => (
              <React.Fragment key={index}>
                {child}
                {index < childrenArray.length - 1 && (
                  <hr className="border-gray-200" />
                )}
              </React.Fragment>
            ))
          : children
        }
      </div>
    )
  }
)
MobileStack.displayName = "MobileStack"

interface FlexWrapProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: number
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  align?: 'start' | 'center' | 'end' | 'stretch'
  children: React.ReactNode
}

const FlexWrap = React.forwardRef<HTMLDivElement, FlexWrapProps>(
  ({ className, gap = 2, justify = 'start', align = 'center', children, ...props }, ref) => {
    const flexClasses = cn(
      "flex flex-wrap",
      `gap-${gap}`,
      {
        'justify-start': justify === 'start',
        'justify-center': justify === 'center',
        'justify-end': justify === 'end',
        'justify-between': justify === 'between',
        'justify-around': justify === 'around',
        'justify-evenly': justify === 'evenly',
      },
      {
        'items-start': align === 'start',
        'items-center': align === 'center',
        'items-end': align === 'end',
        'items-stretch': align === 'stretch',
      },
      className
    )

    return (
      <div ref={ref} className={flexClasses} {...props}>
        {children}
      </div>
    )
  }
)
FlexWrap.displayName = "FlexWrap"

interface MobileContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: boolean
  children: React.ReactNode
}

const MobileContainer = React.forwardRef<HTMLDivElement, MobileContainerProps>(
  ({ className, maxWidth = 'lg', padding = true, children, ...props }, ref) => {
    const containerClasses = cn(
      "mx-auto w-full",
      {
        'max-w-sm': maxWidth === 'sm',
        'max-w-md': maxWidth === 'md',
        'max-w-lg': maxWidth === 'lg',
        'max-w-xl': maxWidth === 'xl',
        'max-w-2xl': maxWidth === '2xl',
        'max-w-full': maxWidth === 'full',
      },
      padding && "px-4 sm:px-6 lg:px-8",
      className
    )

    return (
      <div ref={ref} className={containerClasses} {...props}>
        {children}
      </div>
    )
  }
)
MobileContainer.displayName = "MobileContainer"

export { ResponsiveGrid, MobileStack, FlexWrap, MobileContainer }