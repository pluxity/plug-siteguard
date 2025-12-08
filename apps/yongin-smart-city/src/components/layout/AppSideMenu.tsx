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
import { MAIN_MENU_ITEMS, MenuItem } from '../../constants';

export default function AppSideMenu() {
  const location = useLocation();

  const [openMenu, setOpenMenu] = React.useState<string | null>(() => {
    const activeParent = MAIN_MENU_ITEMS.find((item) =>
      item.children?.some((child) => child.path === location.pathname)
    );
    return activeParent?.title || null;
  });

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
    (item: MenuItem) => {
      const Icon = item.icon;
      const hasChildren = item.children && item.children.length > 0;

      if (hasChildren) {
        const isOpen = openMenu === item.title;

        const handleToggle = () => {
          setOpenMenu(isOpen ? null : item.title);
        };

        return (
          <div key={item.title}>
            <button
              type="button"
              onClick={handleToggle}
              data-state={isOpen ? 'open' : 'closed'}
              className="flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm transition-colors 
                hover:bg-gray-100 
                data-[state=open]:bg-primary-50 
                data-[state=open]:text-primary-700 
                data-[state=open]:font-medium"
            >
              <Icon className="size-4" />
              <span>{item.title}</span>
            </button>
            {isOpen && (
              <div className="ml-4 mt-1 space-y-0.5 pl-2">
                {item.children?.map((child) => {
                  const isChildActive = child.path && isActive(child.path);
                  return (
                    <Link
                      key={child.title}
                      to={child.path || '#'}
                      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                        isChildActive
                          ? 'text-primary-700 font-medium'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span 
                        className={`size-2 border-l-2 border-b-2 rounded-bl-sm ${
                          isChildActive ? 'border-primary-700' : 'border-gray-300'
                        }`} 
                      />
                      <span>{child.title}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      return (
        <Link
          key={item.title}
          to={item.path || '#'}
          onClick={() => setOpenMenu(null)}
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
            item.path && isActive(item.path) && !openMenu
              ? 'bg-primary-50 text-primary-700 font-medium'
              : 'hover:bg-gray-100'
          }`}
        >
          <Icon className="size-4" />
          <span>{item.title}</span>
        </Link>
      );
    },
    [isActive, openMenu]
  );

  return (
    <div className="fixed top-0 left-0 h-screen z-50 py-4 pl-4">
      <SideMenu defaultOpen={true} collapsible={false} className="flex flex-col gap-3 h-full">
        {({ open }) => (
          <>
            <SideMenuTrigger open={open} showChevron={false} className="h-10 shadow-md p-4">
              <img src={`${import.meta.env.BASE_URL}assets/images/ci.png`} alt="HOBAN CI" className="h-5 aspect-[504/87]" />
              <span className="font-semibold text-md">용인 플랫폼 시티</span>
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
