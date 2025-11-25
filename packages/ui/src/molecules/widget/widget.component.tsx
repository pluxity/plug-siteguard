import * as React from "react"
import { cn } from "../../lib/utils"
import { WidgetProps } from "./widget.types"

export const Widget = React.forwardRef<HTMLDivElement, WidgetProps>(
  (
    {
      title,
      colSpan = 6,
      rowSpan = 1,
      children,
      headerClassName,
      contentClassName,
      className,
      style,
      border = true,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-transparent rounded-lg overflow-hidden",
          border && "border shadow-sm",
          className
        )}
        style={{
          gridColumn: `span ${colSpan}`,
          gridRow: `span ${rowSpan}`,
          ...style,
        }}
        {...props}
      >
        {title && (
          <div className={cn("px-4 py-3 bg-gray-50/50", border && "border-b", headerClassName)}>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          </div>
        )}
        <div className={cn("p-4", contentClassName)}>{children}</div>
      </div>
    )
  }
)

Widget.displayName = "Widget"
