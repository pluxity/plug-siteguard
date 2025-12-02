import * as React from "react"

export interface TreeViewProps {
  children: React.ReactNode;
  className?: string;
  defaultExpanded?: string[];
  expanded?: string[];
  onExpandedChange?: (expanded: string[]) => void;
  defaultSelected?: string;
  selected?: string;
  onSelectedChange?: (selected: string) => void;
}

export interface TreeItemProps {
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  depth?: number;
  renderItem?: (props: TreeItemRenderProps) => React.ReactNode;
}

export interface TreeItemRenderProps {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  isExpanded: boolean;
  isSelected: boolean;
  hasChildren: boolean;
  disabled?: boolean;
  depth: number;
}