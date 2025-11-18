import * as React from 'react';
import { ChevronRight, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../atoms/button';

interface SidebarContextValue {
  isOpen: boolean;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  toggleCollapse: () => void;
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(
  undefined
);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  defaultCollapsed?: boolean;
}

export function SidebarProvider({
  children,
  defaultOpen = true,
  defaultCollapsed = false,
}: SidebarProviderProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const toggleSidebar = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const toggleCollapse = React.useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <SidebarContext.Provider
      value={{ isOpen, isCollapsed, toggleSidebar, toggleCollapse }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'left' | 'right';
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, side = 'left', children, ...props }, ref) => {
    const { isOpen, isCollapsed } = useSidebar();

    return (
      <aside
        ref={ref}
        data-state={isOpen ? 'open' : 'closed'}
        data-collapsed={isCollapsed ? 'true' : 'false'}
        className={cn(
          'relative flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-300',
          isCollapsed ? 'w-16' : 'w-64',
          !isOpen && 'translate-x-[-100%]',
          side === 'right' && 'border-r-0 border-l',
          className
        )}
        {...props}
      >
        {children}
      </aside>
    );
  }
);
Sidebar.displayName = 'Sidebar';

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-16 items-center border-b border-gray-200 px-4',
      className
    )}
    {...props}
  />
));
SidebarHeader.displayName = 'SidebarHeader';

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex-1 overflow-auto py-4', className)}
    {...props}
  />
));
SidebarContent.displayName = 'SidebarContent';

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-16 items-center border-t border-gray-200 px-4',
      className
    )}
    {...props}
  />
));
SidebarFooter.displayName = 'SidebarFooter';

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-3 py-2', className)} {...props} />
));
SidebarGroup.displayName = 'SidebarGroup';

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed } = useSidebar();

  return (
    <div
      ref={ref}
      className={cn(
        'px-2 py-1.5 text-xs font-semibold text-gray-500',
        isCollapsed && 'sr-only',
        className
      )}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-1', className)} {...props} />
));
SidebarGroupContent.displayName = 'SidebarGroupContent';

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
  icon?: React.ReactNode;
}

const SidebarMenuItem = React.forwardRef<HTMLDivElement, SidebarMenuItemProps>(
  ({ className, isActive, icon, children, ...props }, ref) => {
    const { isCollapsed } = useSidebar();

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer',
          isActive
            ? 'bg-primary-50 text-primary-900'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
          className
        )}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {!isCollapsed && <span className="flex-1">{children}</span>}
      </div>
    );
  }
);
SidebarMenuItem.displayName = 'SidebarMenuItem';

interface SidebarMenuSubItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
}

const SidebarMenuSubItem = React.forwardRef<
  HTMLDivElement,
  SidebarMenuSubItemProps
>(({ className, isActive, children, ...props }, ref) => {
  const { isCollapsed } = useSidebar();

  if (isCollapsed) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'ml-6 flex items-center rounded-md px-3 py-1.5 text-sm transition-colors cursor-pointer',
        isActive
          ? 'text-primary-900 font-medium'
          : 'text-gray-600 hover:text-gray-900',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem';

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className={cn(className)}
      {...props}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
});
SidebarTrigger.displayName = 'SidebarTrigger';

const SidebarCollapseTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => {
  const { toggleCollapse, isCollapsed } = useSidebar();

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      onClick={toggleCollapse}
      className={cn('absolute right-2 top-4', className)}
      {...props}
    >
      <ChevronRight
        className={cn(
          'h-4 w-4 transition-transform',
          isCollapsed && 'rotate-180'
        )}
      />
      <span className="sr-only">Collapse Sidebar</span>
    </Button>
  );
});
SidebarCollapseTrigger.displayName = 'SidebarCollapseTrigger';

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuSubItem,
  SidebarTrigger,
  SidebarCollapseTrigger,
};
