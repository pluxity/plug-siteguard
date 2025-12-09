import * as React from "react"

export interface TreeItemData {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: TreeItemData[];
  renderItem?: (props: TreeItemRenderProps) => React.ReactNode;
}

export interface TreeViewProps {
  className?: string;
  defaultExpanded?: string[];
  expanded?: string[];
  onExpandedChange?: (expanded: string[]) => void;
  defaultSelected?: string;
  selected?: string;
  onSelectedChange?: (selected: string) => void;
  checkable?: boolean;
  checked?: string[];
  defaultChecked?: string[];
  onCheckedChange?: (checked: string[]) => void;
  ref?: React.RefObject<HTMLDivElement>;
  items: TreeItemData[];
  showExpandIcon?: boolean;
}

export interface TreeItemProps {
  className?: string;
  contentClassName?: string;
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  depth?: number;
  children?: React.ReactNode;
  childValues?: string[];
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
  isChecked?: boolean;
  isIndeterminate?: boolean;
}