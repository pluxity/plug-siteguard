import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout, ProtectedRoute } from './components';
import { Dashboard, MapPage, BimPage, CctvPage, EnvironmentPage, EventsPage } from './pages';

function App() {
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
