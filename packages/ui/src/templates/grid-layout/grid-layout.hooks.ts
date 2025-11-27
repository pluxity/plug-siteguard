import * as React from "react"
import {
  GridLayoutState,
  GridTemplate,
  WidgetPlacement,
  LayoutChangeEvent,
} from "./grid-layout.types"

/**
 * 레이아웃 상태에서 위젯 배치 스왑
 */
export function swapWidgetPlacements(
  placements: WidgetPlacement[],
  widgetIdA: string,
  widgetIdB: string
): WidgetPlacement[] {
  const indexA = placements.findIndex((p) => p.widgetId === widgetIdA)
  const indexB = placements.findIndex((p) => p.widgetId === widgetIdB)

  if (indexA === -1 || indexB === -1) {
    console.warn("Cannot swap: widget not found in placements")
    return placements
  }

  const placementA = placements[indexA]
  const placementB = placements[indexB]

  if (!placementA || !placementB) {
    return placements
  }

  const newPlacements = [...placements]
  newPlacements[indexA] = { widgetId: placementA.widgetId, cellId: placementB.cellId }
  newPlacements[indexB] = { widgetId: placementB.widgetId, cellId: placementA.cellId }

  return newPlacements
}

/**
 * 초기 배치 생성 (children에서 위젯 ID 추출)
 */
export function createInitialPlacements(
  template: GridTemplate,
  widgetIds: string[]
): WidgetPlacement[] {
  return template.cells
    .slice(0, widgetIds.length)
    .map((cell, index) => {
      const widgetId = widgetIds[index]
      return widgetId ? { widgetId, cellId: cell.id } : null
    })
    .filter((placement): placement is WidgetPlacement => placement !== null)
}

/**
 * Drag & Drop Context
 */
interface DragDropContextValue {
  editable: boolean
  draggedWidgetId: string | null
  dropTargetWidgetId: string | null
  setDraggedWidgetId: (id: string | null) => void
  setDropTargetWidgetId: (id: string | null) => void
  handleDrop: () => void
}

export const DragDropContext = React.createContext<DragDropContextValue | null>(
  null
)

/**
 * Drag & Drop 상태 관리 훅
 */
export function useDragDropState(
  editable: boolean,
  onSwap: (widgetIdA: string, widgetIdB: string) => void
): DragDropContextValue {
  const [draggedWidgetId, setDraggedWidgetId] = React.useState<string | null>(
    null
  )
  const [dropTargetWidgetId, setDropTargetWidgetId] = React.useState<
    string | null
  >(null)

  const handleDrop = React.useCallback(() => {
    if (draggedWidgetId && dropTargetWidgetId && draggedWidgetId !== dropTargetWidgetId) {
      onSwap(draggedWidgetId, dropTargetWidgetId)
    }
    setDraggedWidgetId(null)
    setDropTargetWidgetId(null)
  }, [draggedWidgetId, dropTargetWidgetId, onSwap])

  return {
    editable,
    draggedWidgetId,
    dropTargetWidgetId,
    setDraggedWidgetId,
    setDropTargetWidgetId,
    handleDrop,
  }
}

/**
 * GridLayout 상태 관리 훅
 */
export function useGridLayoutState(
  template: GridTemplate,
  initialLayout: GridLayoutState | undefined,
  onLayoutChange: ((event: LayoutChangeEvent) => void) | undefined,
  widgetIds: string[]
) {
  // 초기 상태 결정
  const getInitialState = React.useCallback((): GridLayoutState => {
    // 1. initialLayout이 있으면 사용
    if (initialLayout) {
      return initialLayout
    }
    // 2. 새로 생성
    return {
      templateId: template.id,
      placements: createInitialPlacements(template, widgetIds),
    }
  }, [template, initialLayout, widgetIds])

  const [layoutState, setLayoutState] = React.useState<GridLayoutState>(getInitialState)

  // 템플릿 또는 위젯 ID 변경 시 상태 업데이트
  React.useEffect(() => {
    const currentWidgetIds = layoutState.placements.map(p => p.widgetId).sort().join(',')
    const newWidgetIds = widgetIds.sort().join(',')
    const templateChanged = layoutState.templateId !== template.id
    const widgetsChanged = currentWidgetIds !== newWidgetIds

    if (templateChanged || widgetsChanged) {
      const newState: GridLayoutState = {
        templateId: template.id,
        placements: createInitialPlacements(template, widgetIds),
      }
      setLayoutState(newState)

      onLayoutChange?.({
        layout: newState,
        type: templateChanged ? "template-change" : "widget-change",
      })
    }
  }, [template.id, widgetIds, onLayoutChange, layoutState.templateId, layoutState.placements])

  // 위젯 스왑 핸들러
  const handleSwap = React.useCallback(
    (widgetIdA: string, widgetIdB: string) => {
      setLayoutState((prev) => {
        const newPlacements = swapWidgetPlacements(
          prev.placements,
          widgetIdA,
          widgetIdB
        )
        const newState: GridLayoutState = {
          ...prev,
          placements: newPlacements,
        }

        onLayoutChange?.({
          layout: newState,
          type: "swap",
          swappedWidgets: [widgetIdA, widgetIdB],
        })

        return newState
      })
    },
    [onLayoutChange]
  )

  // 레이아웃 리셋
  const resetLayout = React.useCallback(() => {
    const newState: GridLayoutState = {
      templateId: template.id,
      placements: createInitialPlacements(template, widgetIds),
    }
    setLayoutState(newState)

    onLayoutChange?.({
      layout: newState,
      type: "template-change",
    })
  }, [template, widgetIds, onLayoutChange])

  return {
    layoutState,
    handleSwap,
    resetLayout,
  }
}

/**
 * Widget에서 사용할 Drag & Drop 훅
 */
export function useWidgetDragDrop(widgetId: string) {
  const context = React.useContext(DragDropContext)
  const [isCtrlPressed, setIsCtrlPressed] = React.useState(false)

  // Ctrl 키 감지
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        setIsCtrlPressed(true)
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        setIsCtrlPressed(false)
      }
    }
    const handleBlur = () => {
      setIsCtrlPressed(false)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("blur", handleBlur)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("blur", handleBlur)
    }
  }, [])

  if (!context) {
    return {
      isDraggable: false,
      isDragging: false,
      isDropTarget: false,
      isCtrlPressed: false,
      dragHandleProps: {},
      dropTargetProps: {},
    }
  }

  const { editable, draggedWidgetId, dropTargetWidgetId, setDraggedWidgetId, setDropTargetWidgetId, handleDrop } =
    context

  const isDragging = draggedWidgetId === widgetId
  const isDropTarget = dropTargetWidgetId === widgetId

  // editable이면서 Ctrl 키가 눌려있을 때만 드래그 가능
  const canDrag = editable && isCtrlPressed

  const dragHandleProps = canDrag
    ? {
        draggable: true,
        onDragStart: (e: React.DragEvent) => {
          e.dataTransfer.effectAllowed = "move"
          setDraggedWidgetId(widgetId)
        },
        onDragEnd: () => {
          setDraggedWidgetId(null)
          setDropTargetWidgetId(null)
        },
      }
    : {}

  const dropTargetProps = editable
    ? {
        onDragOver: (e: React.DragEvent) => {
          e.preventDefault()
          e.dataTransfer.dropEffect = "move"
          if (draggedWidgetId && draggedWidgetId !== widgetId) {
            setDropTargetWidgetId(widgetId)
          }
        },
        onDragLeave: () => {
          if (dropTargetWidgetId === widgetId) {
            setDropTargetWidgetId(null)
          }
        },
        onDrop: (e: React.DragEvent) => {
          e.preventDefault()
          handleDrop()
        },
      }
    : {}

  return {
    isDraggable: canDrag,
    isDragging,
    isDropTarget,
    isCtrlPressed,
    dragHandleProps,
    dropTargetProps,
  }
}
