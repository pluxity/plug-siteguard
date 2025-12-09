import * as React from "react"
import { cn } from "../../lib/utils"
import { TreeViewProps, TreeItemProps, TreeItemData } from "./tree-view.types";
import { Checkbox } from "../../atoms/checkbox";

const collectChildValues = (items: TreeItemData[]): string[] => {
    const values: string[] = []
    items.forEach(item => {
        values.push(item.value)
        if (item.children) {
            values.push(...collectChildValues(item.children))
        }
    })
    return values
}

type TreeViewContextType = {
    expanded?: string[];
    selected?: string;
    onExpand?: (value: string) => void;
    onSelect?: (value: string) => void;
    checkable?: boolean;
    checkedValues?: string[];
    showExpandIcon?: boolean;
    onCheckWithChildren?: (value: string, childValues: string[], isCurrentlyChecked: boolean, isIndeterminate: boolean) => void;
}

const TreeViewContext = React.createContext<TreeViewContextType | null>(null);

const useTreeView = () => {
    const context = React.useContext(TreeViewContext);
    if(!context) {
        throw new Error("useTreeView must be used within a TreeViewProvider");
    }
    return context;
};

const TreeView = ({
    className,
    defaultExpanded = [],
    expanded,
    onExpandedChange,
    defaultSelected,
    selected,
    onSelectedChange,
    checkable,
    checked,
    defaultChecked,
    onCheckedChange,
    items,
    showExpandIcon = false,
    ref,
    ...props
}: TreeViewProps) => {

    const [internalExpanded, setInternalExpanded] = React.useState<string[]>(defaultExpanded);
    const [internalSelected, setInternalSelected] = React.useState<string | undefined>(defaultSelected)
    const [internalChecked, setInternalChecked] = React.useState<string[]>(defaultChecked ?? []);
 
    const currentExpanded = expanded ?? internalExpanded;
    const currentSelected = selected ?? internalSelected;
    const currentChecked = checked ?? internalChecked;

    const handleCheckWithChildren = (value: string, childValues: string[], isCurrentlyChecked: boolean, isIndeterminate: boolean) => {
        let newChecked = [...currentChecked];
        const allValues = [value, ...childValues];

        if (isCurrentlyChecked || isIndeterminate) {
            newChecked = newChecked.filter(v => !allValues.includes(v));
        } else {
            newChecked = [...new Set([...newChecked, ...allValues])];
        }

        if (checked === undefined) {
            setInternalChecked(newChecked);
        }

        onCheckedChange?.(newChecked);
    }

    const handleToggleExpand = (value : string) => {
        let newExpanded = [...currentExpanded];
        if(currentExpanded.includes(value)){
            newExpanded = currentExpanded.filter((v) => v !== value);
        } else {
            newExpanded.push(value);
        }

        if(expanded === undefined){
            setInternalExpanded(newExpanded);
        }

        onExpandedChange?.(newExpanded);
    }

    const handleSelect = (value : string) => {
        if(selected === undefined){
            setInternalSelected(value);
        }
        if(onSelectedChange){
            onSelectedChange(value);
        }
    }

    const renderTreeItems = (items: TreeItemData[], depth = 0) => {
        return items.map((item) => (
            <TreeItem
                key={item.value}
                value={item.value}
                label={item.label}
                disabled={item.disabled}
                icon={item.icon}
                renderItem={item.renderItem}
                depth={depth}
                childValues={item.children ? collectChildValues(item.children) : []}
            >
                {item.children && renderTreeItems(item.children, depth + 1)}
            </TreeItem>
        ));
    };
    
    return (
        <TreeViewContext.Provider value={{
            expanded: currentExpanded,
            selected: currentSelected,
            onExpand: handleToggleExpand,
            onSelect: handleSelect,
            checkable,
            checkedValues: currentChecked,
            onCheckWithChildren: handleCheckWithChildren,
            showExpandIcon,
        }}>
            <div  
                ref={ref} 
                role="tree"
                className={cn("flex flex-col gap-2 border border-gray-200 rounded-md p-3", className)} 
                {...props}
            >
                  {renderTreeItems(items)}
            </div>
        </TreeViewContext.Provider>
    )
};

TreeView.displayName = "TreeView";


const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(({
    className,
    contentClassName,
    value,
    label,
    disabled,
    icon,
    renderItem,
    children,
    depth = 0,
    childValues: propChildValues,
    ...props
}, ref) => {
    const { expanded, selected, onExpand, onSelect, checkable, checkedValues, onCheckWithChildren, showExpandIcon } = useTreeView();

    const isExpanded = expanded?.includes(value) ?? false;
    const isSelected = selected === value;
    const hasChildren = React.Children.count(children) > 0;
    const childValues = propChildValues ?? [];
    
    const isChecked = checkedValues?.includes(value) ?? false;
    const checkedChildCount = childValues.filter(v => checkedValues?.includes(v)).length;
    const allChildrenChecked = hasChildren && checkedChildCount === childValues.length;
    const isIndeterminate = checkedChildCount > 0 && checkedChildCount < childValues.length;

    const renderExpandIconElement = () => {
        if (!showExpandIcon) return null;
        
        if (!hasChildren) {
            return <span className="w-4 h-4 inline-flex" aria-hidden="true" />;
        }
        
        return (
            <span className="w-4 h-4 inline-flex items-center justify-center text-xs text-black-400">
                {isExpanded ? "▼" : "▶"}
            </span>
        );
    };

    const handleCheckedChange = () => {
        if (disabled) return;
        onCheckWithChildren?.(value, childValues, hasChildren ? allChildrenChecked : isChecked, isIndeterminate);
    }

    const handleClick = () => {
        if(disabled) return;
        onSelect?.(value);
        if(hasChildren){
            onExpand?.(value);
        }
    }

    const keydownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.target !== event.currentTarget) return;
        
        switch(event.key){
            case 'Enter':
            case ' ':
                if (disabled) return;
                event.preventDefault();
                if (checkable) {
                    handleCheckedChange();
                } else {
                    handleClick();
                }
                break;
            case 'ArrowRight':
                if(hasChildren && !isExpanded){
                    onExpand?.(value);
                }
                break;
            case 'ArrowLeft':
                if(hasChildren && isExpanded){
                    onExpand?.(value);
                }
                break;
            case 'ArrowDown': {
                event.preventDefault();
                const treeRoot = event.currentTarget.closest('[role="tree"]');
                if (!treeRoot) return;
                const allItems = treeRoot.querySelectorAll('[role="treeitem"]');
                const currentIndex = Array.from(allItems).indexOf(event.currentTarget);
                const nextIndex = currentIndex + 1;
                if(nextIndex < allItems.length){
                    (allItems[nextIndex] as HTMLDivElement).focus();
                }   
                break;
            }
            case 'ArrowUp': {
                event.preventDefault();
                const treeRoot = event.currentTarget.closest('[role="tree"]');
                if (!treeRoot) return;
                const allItems = treeRoot.querySelectorAll('[role="treeitem"]');
                const currentIndex = Array.from(allItems).indexOf(event.currentTarget);
                const prevIndex = currentIndex - 1;
                if(prevIndex >= 0){
                    (allItems[prevIndex] as HTMLElement).focus();
                }
                break;
            }
        }
    }
    
    const INDENTATION_WIDTH = 16;
    const depthStyle = { paddingLeft: `${depth * INDENTATION_WIDTH}px` };
    
    return (
        <div 
            ref={ref} 
            role="treeitem"
            tabIndex={disabled ? -1 : 0}
            aria-expanded={hasChildren ? isExpanded : undefined}
            aria-selected={isSelected}
            aria-disabled={disabled}
            onKeyDown={keydownHandler} 
            className={cn(
                "flex flex-col gap-2 cursor-pointer outline-none",
                "group",
                
                className
            )} 
            style={depthStyle}
            {...props}
        >
            <div 
                onClick={handleClick}
                className={cn(
                    "flex items-center gap-2 px-2 py-1.5 transition-colors",
                    "group-focus-visible:ring-1 group-focus-visible:ring-gray-200 group-focus-visible:ring-offset-1 rounded-md",
                    "hover:bg-[#f4f4f7]",
                    isSelected && "bg-primary-100/50 dark:bg-primary-800/50 text-primary hover:text-black",
                    disabled && "opacity-50 cursor-not-allowed",
                    contentClassName
                )}
            >
                {checkable && (
                    <Checkbox
                    checked={
                        hasChildren
                            ? allChildrenChecked ? true : isIndeterminate ? "indeterminate" : false
                            : isChecked
                    }
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCheckedChange();
                        }}
                        disabled={disabled}
                    />
                )}
                
                {renderItem ? (
                    renderItem({
                        value,
                        label,
                        icon,
                        isExpanded,
                        isSelected,
                        hasChildren,
                        disabled,
                        depth,
                        isChecked: hasChildren ? allChildrenChecked : isChecked,
                        isIndeterminate,
                    })
                ) : (
                    <>
                        {renderExpandIconElement()}
                        {icon && <span>{icon}</span>}
                        <span>{label}</span>
                    </>
                )}
            </div>
            {hasChildren && isExpanded && (
                <div role="group" className="flex flex-col gap-2">
                    {React.Children.map(children, (child) => {
                        if (React.isValidElement<TreeItemProps>(child)) {
                            return React.cloneElement(child, { depth: depth + 1 });
                        }
                        return child;
                    })}
                </div>
            )}
        </div>
    )
})
TreeItem.displayName = "TreeItem";

export { TreeView };