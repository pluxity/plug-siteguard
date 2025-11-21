import * as React from "react"
import { cn } from "../../lib/utils"
import {
  DashboardProps,
  DashboardSidebarProps,
  DashboardSidebarHeaderProps,
  DashboardSidebarBodyProps,
  DashboardContentProps,
  DashboardContentHeaderProps,
  DashboardContentBodyProps,
} from "./dashboard.types"

const DashboardRoot = React.forwardRef<HTMLDivElement, DashboardProps>(
  (
    {
      sidebarWidth,
      contentWidth,
      gap = 16,
      minSidebarWidth,
      minContentWidth,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const sidebarWidthStyle =
      typeof sidebarWidth === "number" ? `${sidebarWidth}px` : sidebarWidth
    const contentWidthStyle =
      typeof contentWidth === "number" ? `${contentWidth}px` : contentWidth

    const childrenArray = React.Children.toArray(children)
    const sidebarChild = childrenArray.find(
      (child): child is React.ReactElement<DashboardSidebarProps> =>
        React.isValidElement<DashboardSidebarProps>(child) &&
        (child.type === DashboardSidebar ||
          (typeof child.props === "object" &&
            child.props !== null &&
            "data-slot" in child.props &&
            child.props["data-slot"] === "dashboard-sidebar"))
    )
    const contentChild = childrenArray.find(
      (child): child is React.ReactElement<DashboardContentProps> =>
        React.isValidElement<DashboardContentProps>(child) &&
        (child.type === DashboardContent ||
          (typeof child.props === "object" &&
            child.props !== null &&
            "data-slot" in child.props &&
            child.props["data-slot"] === "dashboard-content"))
    )

    let contentMarginLeft: string | undefined = undefined
    if (sidebarWidthStyle) {
      if (typeof sidebarWidth === "number") {
        contentMarginLeft = `${sidebarWidth + gap}px`
      } else if (sidebarWidthStyle.includes("%")) {
        contentMarginLeft = `calc(${sidebarWidthStyle} + ${gap}px)`
      } else if (sidebarWidthStyle.includes("px")) {
        const pxValue = parseInt(sidebarWidthStyle.replace("px", ""))
        if (!isNaN(pxValue)) {
          contentMarginLeft = `${pxValue + gap}px`
        }
      }
    }

    return (
      <div
        ref={ref}
        data-slot="dashboard"
        className={cn("flex h-screen w-full overflow-hidden", className)}
        {...props}
      >
        {sidebarChild &&
          React.cloneElement(sidebarChild, {
            style: {
              width: sidebarWidthStyle,
              minWidth: minSidebarWidth ? `${minSidebarWidth}px` : undefined,
              ...(sidebarChild.props.style as React.CSSProperties | undefined),
            },
          })}
        {contentChild &&
          React.cloneElement(contentChild, {
            style: {
              width: contentWidthStyle || undefined,
              minWidth: minContentWidth ? `${minContentWidth}px` : undefined,
              marginLeft: contentMarginLeft,
              ...(contentChild.props.style as React.CSSProperties | undefined),
            },
          })}
      </div>
    )
  }
)
DashboardRoot.displayName = "Dashboard"

const DashboardSidebar = ({ className, children, ...props }: DashboardSidebarProps) => {
  return (
    <aside
      data-slot="dashboard-sidebar"
      className={cn("flex flex-col flex-shrink-0", className)}
      {...props}
    >
      {children}
    </aside>
  )
}
DashboardSidebar.displayName = "Dashboard.Sidebar"

const DashboardSidebarHeader = ({ className, children, ...props }: DashboardSidebarHeaderProps) => {
  return (
    <header
      data-slot="dashboard-sidebar-header"
      className={cn("flex-shrink-0", className)}
      {...props}
    >
      {children}
    </header>
  )
}
DashboardSidebarHeader.displayName = "Dashboard.Sidebar.Header"

const DashboardSidebarBody = ({ className, children, ...props }: DashboardSidebarBodyProps) => {
  return (
    <div
      data-slot="dashboard-sidebar-body"
      className={cn("flex-1", className)}
      {...props}
    >
      {children}
    </div>
  )
}
DashboardSidebarBody.displayName = "Dashboard.Sidebar.Body"

const DashboardContent = ({ className, children, ...props }: DashboardContentProps) => {
  return (
    <main
      data-slot="dashboard-content"
      className={cn("flex flex-col flex-1 overflow-y-auto", className)}
      {...props}
    >
      {children}
    </main>
  )
}
DashboardContent.displayName = "Dashboard.Content"

const DashboardContentHeader = ({ className, children, ...props }: DashboardContentHeaderProps) => {
  return (
    <header
      data-slot="dashboard-content-header"
      className={cn(className)}
      {...props}
    >
      {children}
    </header>
  )
}
DashboardContentHeader.displayName = "Dashboard.Content.Header"

const DashboardContentBody = React.forwardRef<HTMLDivElement, DashboardContentBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="dashboard-content-body"
        className={cn("flex-1", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
DashboardContentBody.displayName = "Dashboard.Content.Body"

export const Dashboard = Object.assign(DashboardRoot, {
  Sidebar: Object.assign(DashboardSidebar, {
    Header: DashboardSidebarHeader,
    Body: DashboardSidebarBody,
  }),
  Content: Object.assign(DashboardContent, {
    Header: DashboardContentHeader,
    Body: DashboardContentBody,
  }),
})

