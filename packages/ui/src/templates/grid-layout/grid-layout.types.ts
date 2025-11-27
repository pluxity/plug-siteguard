import * as React from "react"

/**
 * 그리드 셀 정의 - 각 위젯의 위치와 크기
 */
export interface GridCell {
  /** 셀 고유 ID */
  id: string
  /** 열 시작 위치 (1-based) */
  colStart: number
  /** 열 크기 (span) */
  colSpan: number
  /** 행 시작 위치 (1-based) */
  rowStart: number
  /** 행 크기 (span) */
  rowSpan: number
}

/**
 * 그리드 템플릿 정의
 */
export interface GridTemplate {
  /** 템플릿 고유 ID */
  id: string
  /** 템플릿 이름 */
  name: string
  /** 총 컬럼 수 */
  columns: number
  /** 총 행 수 */
  rows: number
  /** 셀 정의 배열 */
  cells: GridCell[]
}

/**
 * 위젯 ID와 셀 ID 매핑
 */
export interface WidgetPlacement {
  /** 위젯 ID */
  widgetId: string
  /** 배치된 셀 ID */
  cellId: string
}

/**
 * 레이아웃 상태 (저장용)
 */
export interface GridLayoutState {
  /** 사용 중인 템플릿 ID */
  templateId: string
  /** 위젯 배치 정보 */
  placements: WidgetPlacement[]
}

/**
 * 레이아웃 변경 이벤트
 */
export interface LayoutChangeEvent {
  /** 변경된 레이아웃 상태 */
  layout: GridLayoutState
  /** 변경 타입 */
  type: "swap" | "template-change" | "widget-change"
  /** 교환된 위젯 ID (swap인 경우) */
  swappedWidgets?: [string, string]
}

export interface GridLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 위젯 카드들 (children)
   */
  children: React.ReactNode
  /**
   * 그리드 컬럼 수
   * @default 12
   */
  columns?: number
  /**
   * 위젯 간 간격 (px)
   * @default 16
   */
  gap?: number
  /**
   * 사용할 템플릿 (커스텀 템플릿 객체)
   * 템플릿을 지정하면 columns는 무시됨
   */
  template?: GridTemplate
  /**
   * 편집 모드 활성화 (Widget Drag & Drop)
   * @default false
   */
  editable?: boolean
  /**
   * 레이아웃 변경 시 콜백
   */
  onLayoutChange?: (event: LayoutChangeEvent) => void
  /**
   * 초기 레이아웃 상태 (배치 복원용)
   */
  initialLayout?: GridLayoutState
}
