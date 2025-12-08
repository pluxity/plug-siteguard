import React from 'react';
import { AppSideMenu } from './';
import { Link, useLocation } from 'react-router-dom';
import { useWeatherData } from '@/hooks/weather/useWeatherData';
import { formatDate } from '@/services';
import { MAIN_MENU_ITEMS, MenuItem } from '../../constants';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@plug-siteguard/ui';

const findMenuPath = (items: MenuItem[], targetPath: string, path: MenuItem[] = []): MenuItem[] | null => {
    for (const item of items) {
        const currentPath = [...path, item];
        
        if (item.path === targetPath) {
            return currentPath;
        }
        
        if (item.children) {
            const found = findMenuPath(item.children, targetPath, currentPath);
            if (found) return found;
        }
    }
    return null;
};

const ContentLayout: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => {
    const { data, loading, error } = useWeatherData();
    const location = useLocation();
    const menuPath = findMenuPath(MAIN_MENU_ITEMS, location.pathname) || [];

    return (
        <div className="relative h-screen overflow-hidden bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200">
        <AppSideMenu />
        <main className="ml-[20rem] h-screen p-5 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        {menuPath.length > 0 ? (
                            menuPath.map((item, index) => (
                                <React.Fragment key={item.path || item.title}>
                                    {index > 0 && <BreadcrumbSeparator className="[&>svg]:size-8 text-foreground" />}
                                    <BreadcrumbItem>
                                        {index === menuPath.length - 1 ? (
                                            <BreadcrumbPage className="text-2xl font-semibold">
                                                {item.title}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink className="text-2xl font-semibold text-foreground" asChild>
                                                <Link to={item.path || '#'}>{item.title}</Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                </React.Fragment>
                            ))
                        ) : (
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-2xl font-semibold">
                                    {title}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        )}
                    </BreadcrumbList>
                </Breadcrumb>
                {loading ? (
                    <div className="text-gray-500 text-xs">날씨 정보를 불러오는 중...</div>
                ) : error || !data ? (
                    <div className="text-red-500 text-xs">날씨 정보를 불러올 수 없습니다.</div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="text-gray-700 text-xs font-bold mr-3">{formatDate(data.raw.dt)}</span>
                        <img
                            src={`${import.meta.env.BASE_URL}assets/icons/${data.weatherIcon}.svg`}
                            alt={data.weatherDescription}
                            className="w-6 h-6"
                        />
                        <span className="text-gray-700 text-xs">{data.currentTemp}°C</span>
                        <span className="text-gray-500"> | </span>
                        <span className="text-gray-700 text-xs">습도 : {data.humidity}%</span>
                        <span className="text-gray-500"> | </span>
                        <span className="text-gray-700 text-xs">바람 : {data.windDirection} {data.windSpeed}m/s</span>
                    </div>
                )}  
            </div>
            <div className="bg-white rounded-lg overflow-hidden h-[calc(100vh-5.5rem)] w-full border border-gray-200 shadow-sm">
                {children}
            </div>
        </main>
        </div>
    );
};

export default ContentLayout;
