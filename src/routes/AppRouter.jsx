import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import CourseDetailPage from '../pages/CourseDetailPage';
import DashboardPage from '../pages/DashboardPage';
import GuidePage from '../pages/GuidePage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import MyCoursesPage from '../pages/MyCoursesPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/panduan" element={<GuidePage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/beranda" element={<HomePage />} />
          <Route path="/dasbor" element={<DashboardPage />} />
          <Route path="/mata-kuliah" element={<MyCoursesPage />} />
          <Route path="/mata-kuliah/:id" element={<CourseDetailPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;