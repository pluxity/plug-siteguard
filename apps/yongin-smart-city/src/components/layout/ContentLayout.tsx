import React from 'react';
import { AppSideMenu } from './';
import { useWeatherData } from '@/stores';
import { formatDate } from '@/services';

const ContentLayout: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => {
    const { data, loading, error } = useWeatherData();

    return (
        <div className="relative h-screen overflow-hidden bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200">
        <AppSideMenu />
        <main className="ml-[20rem] h-screen p-5 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">{title}</h1>
                {loading ? (
                    <div className="text-gray-500 text-sm">날씨 정보를 불러오는 중...</div>
                ) : error || !data ? (
                    <div className="text-red-500 text-sm">날씨 정보를 불러올 수 없습니다.</div>
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
            <div className="bg-white rounded-lg overflow-hidden h-[calc(100vh-5.5rem)] w-full">
                {children}
            </div>
        </main>
        </div>
    );
};

export default ContentLayout;
