import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { DashboardLayout, ContentLayout, ProtectedRoute } from './components';
import { useWeatherStore } from './stores/weather';
import { BimPage, CctvPage, Dashboard, EventsPage, MapPage, StatisticsPage } from './pages';

function App() {
  const fetchWeather = useWeatherStore((state) => state.fetchWeather);
  const startWeatherUpdates = useWeatherStore((state) => state.startWeatherUpdates);

  useEffect(() => {
    fetchWeather();
    const cleanupWeather = startWeatherUpdates();
    return cleanupWeather;
  }, [fetchWeather, startWeatherUpdates]);

  return (
    <BrowserRouter basename={import.meta.env.VITE_BASE_URL || '/'}>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <ContentLayout title="Map">
                <MapPage />
              </ContentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bim"
          element={
            <ProtectedRoute>
              <ContentLayout title="BIM">
                <BimPage />
              </ContentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cctv"
          element={
            <ProtectedRoute>
              <ContentLayout title="CCTV">
                <CctvPage />
              </ContentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <ProtectedRoute>
              <ContentLayout title="통계">
                <StatisticsPage />
              </ContentLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <ContentLayout title="이벤트">
                <EventsPage />
              </ContentLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
