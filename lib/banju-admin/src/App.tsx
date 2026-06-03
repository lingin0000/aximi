import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AdminLayout from './components/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PoemListPage from './pages/PoemListPage';
import PoemEditPage from './pages/PoemEditPage';
import UserListPage from './pages/UserListPage';
import { useAuthStore } from './store/useAuthStore';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#2C5F2D',
          borderRadius: 6,
        },
      }}
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="poems" element={<PoemListPage />} />
          <Route path="poems/new" element={<PoemEditPage />} />
          <Route path="poems/:id/edit" element={<PoemEditPage />} />
          <Route path="users" element={<UserListPage />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
}
