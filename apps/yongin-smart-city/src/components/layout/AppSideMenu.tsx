import React from 'react';
import { LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  SideMenu,
  SideMenuTrigger,
  SideMenuContent,
  SideMenuHeader,
  SideMenuNav,
  Avatar,
  AvatarFallback,
  Button,
} from '@plug-siteguard/ui';
import { MAIN_MENU_ITEMS } from '../../constants';

export default function AppSideMenu() {
  const location = useLocation();

  const currentUser = {
    name: '관리자',
    email: 'admin@example.com',
    role: 'admin' as const,
    avatar: '',
  };

  const isActive = React.useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const renderMenuItem = React.useCallback(
    (item: (typeof MAIN_MENU_ITEMS)[0]) => {
      const Icon = item.icon;

      return (
        <Link
          key={item.title}
          to={item.path || '#'}
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
            item.path && isActive(item.path)
              ? 'bg-primary-50 text-primary-700 font-medium'
              : 'hover:bg-gray-100'
          }`}
        >
          <Icon className="size-4" />
          <span>{item.title}</span>
        </Link>
      );
    },
    [isActive]
  );

  return (
    <div className="fixed top-0 left-0 h-screen z-50 py-4 pl-4">
      <SideMenu defaultOpen={true} collapsible={false} className="flex flex-col gap-3 h-full">
        {({ open }) => (
          <>
            <SideMenuTrigger open={open} showChevron={false} className="h-10 shadow-md p-4">
              <img src="./assets/images/ci.png" alt="HOBAN CI" className="h-5 aspect-[504/87]" />
              <span className="font-semibold text-md">용인 스마트시티</span>
            </SideMenuTrigger>

            <SideMenuContent className="w-72 h-[calc(100vh-5.2rem)] shrink-0 rounded-xl bg-white shadow-xl">
              <SideMenuHeader className="py-2 shrink-0 p-4">
                <div className="flex items-center gap-2">
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary-50 text-primary-600 text-xs font-medium">
                      {currentUser.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left flex-1 min-w-0">
                    <span className="text-xs text-gray-500">{currentUser.role || '일반 사용자'}</span>
                    <span className="text-sm font-semibold truncate">{currentUser.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-gray-600 hover:text-red-600"
                    >
                      <LogOut className="size-4" />
                    </Button>
                  </div>
                </div>
              </SideMenuHeader>

              <SideMenuNav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <div className="space-y-0.5">
                    {MAIN_MENU_ITEMS.map(renderMenuItem)}
                  </div>
                </div>
              </SideMenuNav>
            </SideMenuContent>
          </>
        )}
      </SideMenu>
    </div>
  );
}
