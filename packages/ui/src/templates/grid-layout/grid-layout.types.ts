import * as React from "react"

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
}
