import * as React from "react"
import { cn } from "../../lib/utils"
import { GridLayoutProps, GridCell, GridTemplate } from "./grid-layout.types"
import {
  DragDropContext,
  useDragDropState,
  useGridLayoutState,
} from "./grid-layout.hooks"

/**
 * 템플릿 모드용 GridLayoutContext
 */
interface GridLayoutContextValue {
  template: GridTemplate | null
  placements: { widgetId: string; cellId: string }[]
  getCellForWidget: (widgetId: string) => GridCell | undefined
}

export const GridLayoutContext =
  React.createContext<GridLayoutContextValue | null>(null)

/**
 * children에서 위젯 ID 추출
 */
function extractWidgetIds(children: React.ReactNode): string[] {
  const ids: string[] = []
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const props = child.props as { id?: string }
      if (props.id) {
        ids.push(props.id)
      }
    }
  })
  return ids
}

/**
 * GridLayout Component
 *
 * 기존 API 호환:
 * - columns, gap props로 단순 그리드 레이아웃
 *
 * 확장 API:
 * - template prop으로 템플릿 기반 레이아웃
 * - editable prop으로 Drag & Drop Swap 활성화
 * - onLayoutChange, initialLayout으로 상태 관리
 */
export const GridLayout = React.forwardRef<HTMLDivElement, GridLayoutProps>(
  (
    {
      children,
      columns = 12,
      gap = 16,
      template,
      editable = false,
      onLayoutChange,
      initialLayout,
      className,
      ...props
    },
    ref
  ) => {
    // 템플릿 모드 여부
    const isTemplateMode = !!template

    // 위젯 ID 추출
    const widgetIds = React.useMemo(
      () => extractWidgetIds(children),
      [children]
    )

    // 레이아웃 상태 관리 (템플릿 모드에서만)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { layoutState, handleSwap, resetLayout: _resetLayout } = useGridLayoutState(
      template || { id: "", name: "", columns: 0, rows: 0, cells: [] },
      initialLayout,
      onLayoutChange,
      widgetIds
    )

    // Drag & Drop 상태 관리
    const dragDropState = useDragDropState(editable, handleSwap)

    // 위젯 ID로 셀 찾기
    const getCellForWidget = React.useCallback(
      (widgetId: string): GridCell | undefined => {
        if (!template) return undefined
        const placement = layoutState.placements.find(
          (p) => p.widgetId === widgetId
        )
        if (!placement) return undefined
        return template.cells.find((c) => c.id === placement.cellId)
      },
      [template, layoutState.placements]
    )

    // Context 값
    const gridLayoutContextValue: GridLayoutContextValue = {
      template: template || null,
      placements: layoutState.placements,
      getCellForWidget,
    }

    // 템플릿 모드: 그리드 레이아웃
    if (isTemplateMode && template) {
      return (
        <DragDropContext.Provider value={dragDropState}>
          <GridLayoutContext.Provider value={gridLayoutContextValue}>
            <div
              ref={ref}
              className={cn("h-full overflow-y-auto", className)}
              {...props}
            >
              <div
                className="grid h-full"
                style={{
                  gridTemplateColumns: `repeat(${template.columns}, 1fr)`,
                  gridTemplateRows: `repeat(${template.rows}, 1fr)`,
                  gap: `${gap}px`,
                }}
              >
                {children}
              </div>
            </div>
          </GridLayoutContext.Provider>
        </DragDropContext.Provider>
      )
    }

    // 기존 모드: 단순 그리드
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
