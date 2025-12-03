import * as React from "react"
import { cn } from "../../lib/utils"
import { TreeViewProps, TreeItemProps } from "./tree-view.types";
import { Checkbox } from "../../atoms/checkbox";

const collectChildValues = (children: React.ReactNode): string[] => {
    const values: string[] = []
    React.Children.forEach(children, child => {
        if (React.isValidElement<TreeItemProps>(child)) {
            values.push(child.props.value)
            if (child.props.children) {
                values.push(...collectChildValues(child.props.children))
            }
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


const TreeView = React.forwardRef<HTMLDivElement, TreeViewProps>(({
    className,
    defaultExpanded = [],
    expanded,
    onExpandedChange,
    defaultSelected,
    selected,
    onSelectedChange,
    children,
    checkable,
    checked,
    defaultChecked,
    onCheckedChange,
    ...props
}, ref) => {

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
    
    return (
        <TreeViewContext.Provider value={{
            expanded: currentExpanded,
            selected: currentSelected,
            onExpand: handleToggleExpand,
            onSelect: handleSelect,
            checkable,
            checkedValues: currentChecked,
            onCheckWithChildren: handleCheckWithChildren,
        }}>
            <div  
                ref={ref} 
                role="tree"
                className={cn("flex flex-col gap-2 border border-gray-200 rounded-md p-3", className)} 
                {...props}
            >
                {children}

            </div>
        </TreeViewContext.Provider>
    )
});

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
    ...props
}, ref) => {
    const { expanded, selected, onExpand, onSelect, checkable, checkedValues, onCheckWithChildren } = useTreeView();

    const isExpanded = expanded?.includes(value) ?? false;
    const isSelected = selected === value;
    const hasChildren = React.Children.count(children) > 0;
    const childValues = hasChildren ? collectChildValues(children) : [];
    
    const isChecked = checkedValues?.includes(value) ?? false;
    const checkedChildCount = childValues.filter(v => checkedValues?.includes(v)).length;
    const allChildrenChecked = hasChildren && checkedChildCount === childValues.length;
    const isIndeterminate = hasChildren && checkedChildCount > 0;
    const isNodeChecked = isChecked;

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
                "flex flex-col gap-2 cursor-pointer outline-none rounded-md",
                "focus:ring-1 focus:ring-gray-200 focus:ring-offset-1",
                isSelected && "bg-primary-100/50 dark:bg-primary-800/50",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )} 
            style={depthStyle}
            {...props}
        >
            <div 
                onClick={handleClick}
                className={cn(
                    "flex items-center gap-2 px-2 py-1.5 transition-colors",
                    contentClassName
                )}
            >
                {checkable && (
                    <Checkbox
                        checked={
                            hasChildren 
                                ? (isIndeterminate ? "indeterminate" : allChildrenChecked)
                                : isNodeChecked
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
                        {icon && <span>{icon}</span>}
                        <span>{label}</span>
                    </>
                )}
            </div>
            {hasChildren && isExpanded && (
                <div role="group" className="pl-4">
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

export { TreeView, TreeItem };