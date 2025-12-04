import {
  Home,
  Map,
  Building2,
  Video,
  ChartNoAxesColumn,
  BellRing,
} from 'lucide-react';

export interface MenuItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  children?: MenuItem[];
}

export const MAIN_MENU_ITEMS: MenuItem[] = [
  {
    title: '대시보드',
    icon: Home,
    path: '/',
  },
  {
    title: 'MAP',
    icon: Map,
    path: '/map',
  },
  {
    title: 'BIM',
    icon: Building2,
    path: '/bim',
  },
  {
    title: 'CCTV',
    icon: Video,
    path: '/cctv',
  },
  {
    title: '통계',
    icon: ChartNoAxesColumn,
    path: '/statistics',
  },
  {
    title: '이벤트',
    icon: BellRing,
    path: '/events',
  },
];

export const MENU_ITEMS: MenuItem[] = [...MAIN_MENU_ITEMS];
