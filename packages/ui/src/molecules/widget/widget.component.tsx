import * as React from "react"
import { cn } from "../../lib/utils"
import { WidgetProps } from "./widget.types"
import { GridLayoutContext } from "../../templates/grid-layout/grid-layout.component"
import { useWidgetDragDrop } from "../../templates/grid-layout/grid-layout.hooks"

export const Widget = React.forwardRef<HTMLDivElement, WidgetProps>(
  (
    {
      id,
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
    // GridLayout 템플릿 모드 컨텍스트
    const gridLayoutContext = React.useContext(GridLayoutContext)

    // Drag & Drop 훅
    const {
      isDraggable,
      isDragging,
      isDropTarget,
      isCtrlPressed,
      dragHandleProps,
      dropTargetProps,
    } = useWidgetDragDrop(id || "")

    // 템플릿 모드에서 셀 정보 가져오기
    const cell = id ? gridLayoutContext?.getCellForWidget(id) : undefined

    // 그리드 스타일 계산
    const gridStyle: React.CSSProperties = cell
      ? {
          gridColumn: `${cell.colStart} / span ${cell.colSpan}`,
          gridRow: `${cell.rowStart} / span ${cell.rowSpan}`,
          ...style,
        }
      : {
          gridColumn: `span ${colSpan}`,
          gridRow: `span ${rowSpan}`,
          ...style,
        }

    // editable 모드에서 Ctrl 키 누르면 시각적 표시
    const showDragHint = gridLayoutContext && isCtrlPressed && !isDragging

    return (
      <div
        ref={ref}
        className={cn(
          "bg-transparent rounded-lg overflow-hidden transition-all duration-200 h-full flex flex-col",
          border && "border shadow-sm",
          isDraggable && "cursor-grab",
          isDragging && "opacity-50 cursor-grabbing ring-2 ring-primary-500 scale-[0.98]",
          isDropTarget && "ring-2 ring-primary-400 bg-primary-50/30 scale-[1.02]",
          showDragHint && "ring-2 ring-dashed ring-gray-400 cursor-grab",
          className
        )}
        style={gridStyle}
        {...dropTargetProps}
        {...dragHandleProps}
        {...props}
      >
        {title && (
          <div
            className={cn(
              "px-4 pt-3 bg-gray-50/50 flex-shrink-0",
              border,
              headerClassName
            )}
          >
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
          </div>
        )}
        <div className={cn("p-4 flex-1 min-h-0", contentClassName)}>
          {children}
        </div>
      </div>
    )
  }
)

Widget.displayName = "Widget"
