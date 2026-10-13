import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import MainLayout from '../components/layout/MainLayout';
import CourseDetailPage from '../pages/CourseDetailPage';
import DashboardPage from '../pages/DashboardPage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import MyCoursesPage from '../pages/MyCoursesPage';
import NotFoundPage from '../pages/NotFoundPage';
import SplashPage from '../pages/SplashPage';
import ProtectedRoute from './ProtectedRoute';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
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