import * as React from 'react';
import { cn } from '../../lib/utils';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarCollapseTrigger,
} from '../../organisms/sidebar';

interface DashboardTemplateProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

export function DashboardTemplate({
  children,
  sidebar,
  header,
  className,
}: DashboardTemplateProps) {
  return (
    <SidebarProvider defaultOpen={true} defaultCollapsed={false}>
      <div className={cn('flex h-screen w-full overflow-hidden', className)}>
        {sidebar}
        <div className="flex flex-1 flex-col overflow-hidden">
          {header && (
            <header className="flex h-16 items-center border-b border-gray-200 bg-white px-4">
              {header}
            </header>
          )}
          <main className="flex-1 overflow-auto bg-gray-50 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

interface DashboardSidebarProps {
  logo?: React.ReactNode;
  navigation?: Array<{
    label: string;
    icon?: React.ReactNode;
    href?: string;
    isActive?: boolean;
    onClick?: () => void;
  }>;
  footer?: React.ReactNode;
}

export function DashboardSidebar({
  logo,
  navigation = [],
  footer,
}: DashboardSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          {logo}
          <SidebarCollapseTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            {navigation.map((item, index) => (
              <SidebarMenuItem
                key={index}
                isActive={item.isActive}
                icon={item.icon}
                onClick={item.onClick}
              >
                {item.label}
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {footer && <SidebarFooter>{footer}</SidebarFooter>}
    </Sidebar>
  );
}

interface DashboardHeaderProps {
  title?: string;
  actions?: React.ReactNode;
  showSidebarTrigger?: boolean;
}

export function DashboardHeader({
  title,
  actions,
  showSidebarTrigger = true,
}: DashboardHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-4">
        {showSidebarTrigger && <SidebarTrigger />}
        {title && <h1 className="text-xl font-semibold text-gray-900">{title}</h1>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

interface DashboardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DashboardContent({
  children,
  className,
  ...props
}: DashboardContentProps) {
  return (
    <div className={cn('space-y-6', className)} {...props}>
      {children}
    </div>
  );
}

interface DashboardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function DashboardSection({
  title,
  description,
  children,
  className,
  ...props
}: DashboardSectionProps) {
  return (
    <section className={cn('space-y-4', className)} {...props}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
