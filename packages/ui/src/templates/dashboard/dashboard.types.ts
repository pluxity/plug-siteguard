import * as React from "react"

export interface DashboardProps extends React.ComponentProps<"div"> {
  sidebarWidth?: string | number
  contentWidth?: string | number
  gap?: number
  minSidebarWidth?: number
  minContentWidth?: number
}

export interface DashboardSidebarProps extends React.ComponentProps<"aside"> {
  className?: string
  children: React.ReactNode
}

export interface DashboardSidebarHeaderProps extends React.ComponentProps<"header"> {
  className?: string
  children: React.ReactNode
}

export interface DashboardSidebarBodyProps extends React.ComponentProps<"div"> {
  className?: string
  children: React.ReactNode
}

export interface DashboardContentProps extends React.ComponentProps<"main"> {
  className?: string
  children: React.ReactNode
}

export interface DashboardContentHeaderProps extends React.ComponentProps<"header"> {
  className?: string
  children: React.ReactNode
}

export interface DashboardContentBodyProps extends React.ComponentProps<"div"> {
  className?: string
  children: React.ReactNode
}

