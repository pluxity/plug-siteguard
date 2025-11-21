import * as React from "react"
import { cn } from "../../lib/utils"
import { GridLayoutProps } from "./grid-layout.types"

export const GridLayout = React.forwardRef<HTMLDivElement, GridLayoutProps>(
  ({ children, columns = 12, gap = 16, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("h-full overflow-y-auto", className)}
        {...props}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: `${gap}px`,
          }}
        >
          {children}
        </div>
      </div>
    )
  }
)

GridLayout.displayName = "GridLayout"
