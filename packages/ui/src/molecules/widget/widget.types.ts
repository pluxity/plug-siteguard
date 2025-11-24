import * as React from "react"

export interface WidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 위젯 타이틀
   */
  title?: string
  /**
   * 위젯이 차지하는 컬럼 수 (그리드 사용 시)
   * @default 6
   */
  colSpan?: number
  /**
   * 위젯이 차지하는 행 수 (그리드 사용 시)
   * @default 1
   */
  rowSpan?: number
  /**
   * 위젯 콘텐츠
   */
  children: React.ReactNode
  /**
   * 타이틀 영역 클래스명
   */
  headerClassName?: string
  /**
   * 콘텐츠 영역 클래스명
   */
  contentClassName?: string
  /**
   * 테두리 표시 여부
   * @default true
   */
  border?: boolean
}
