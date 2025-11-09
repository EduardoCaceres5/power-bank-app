import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Cabinets from '@/pages/Cabinets';
import CabinetDetails from '@/pages/CabinetDetails';
import Batteries from '@/pages/Batteries';
import ScreenMaterials from '@/pages/ScreenMaterials';
import ScreenGroups from '@/pages/ScreenGroups';
import ScreenPlans from '@/pages/ScreenPlans';
import Settings from '@/pages/Settings';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="cabinets" element={<Cabinets />} />
            <Route path="cabinets/:cabinetId" element={<CabinetDetails />} />
            <Route path="batteries" element={<Batteries />} />
            <Route path="screen/materials" element={<ScreenMaterials />} />
            <Route path="screen/groups" element={<ScreenGroups />} />
            <Route path="screen/plans" element={<ScreenPlans />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Catch all - redirect to dashboard or login */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
