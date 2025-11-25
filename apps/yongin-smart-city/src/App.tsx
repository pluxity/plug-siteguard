import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { DashboardLayout, ProtectedRoute } from './components';
import { useWebRTCStore } from './lib/webrtc';
import { BimPage, CctvPage, Dashboard, EnvironmentPage, EventsPage, MapPage } from './pages';

function App() {
  const initialized = useWebRTCStore((state) => state.initialized);
  const initialize = useWebRTCStore((state) => state.initialize);
  const cleanup = useWebRTCStore((state) => state.cleanup);

  useEffect(() => {
    initialize();
    return () => cleanup();
  }, [initialize, cleanup]);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-lg">연결 중...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
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
              <DashboardLayout>
                <MapPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bim"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <BimPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cctv"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CctvPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/environment"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <EnvironmentPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <EventsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
