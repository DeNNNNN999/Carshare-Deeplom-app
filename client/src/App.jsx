import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Layouts
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'
import AdminLayout from './layouts/AdminLayout'
import ManagerLayout from './layouts/ManagerLayout'

// Public Pages
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import SearchCarsPage from './pages/SearchCarsPage'
import CarDetailsPage from './pages/CarDetailsPage'
import TariffPage from './pages/TariffPage'
import ContactPage from './pages/ContactPage'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import VerifyEmailPage from './pages/auth/VerifyEmailPage'

// User Dashboard Pages
import DashboardPage from './pages/dashboard/DashboardPage'
import ProfilePage from './pages/dashboard/ProfilePage'
import BookingsPage from './pages/dashboard/BookingsPage'
import BookingDetailsPage from './pages/dashboard/BookingDetailsPage'
import CreateBookingPage from './pages/dashboard/CreateBookingPage'
import PaymentsPage from './pages/dashboard/PaymentsPage'
import ReviewsPage from './pages/dashboard/ReviewsPage'

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import UserManagementPage from './pages/admin/UserManagementPage'
import CarManagementPage from './pages/admin/CarManagementPage'
import BookingManagementPage from './pages/admin/BookingManagementPage'
import TariffManagementPage from './pages/admin/TariffManagementPage'
import PromotionManagementPage from './pages/admin/PromotionManagementPage'
import StatisticsPage from './pages/admin/StatisticsPage'

// Guard Components
import ProtectedRoute from './components/guards/ProtectedRoute'
import AdminRoute from './components/guards/AdminRoute'
import ManagerRoute from './components/guards/ManagerRoute'

// Not Found Page
import NotFoundPage from './pages/NotFoundPage'

// Icons Test Page
import IconsTest from './pages/IconsTest'
import ManagerDashboardPage from './pages/manager/ManagerDashboardPage'
import PaymentConfirmationPage from './pages/manager/PaymentConfirmationPage'
import ManagerBookingManagementPage from './pages/manager/BookingManagementPage'

function App() {
  const { checkAuth } = useAuth()
  const location = useLocation()

  // Проверка аутентификации при загрузке приложения
  useEffect(() => {
    checkAuth()
  }, [])

  // Прокрутка в начало страницы при навигации
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <Routes>
      {/* Публичные маршруты */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/search" element={<SearchCarsPage />} />
        <Route path="/cars/:id" element={<CarDetailsPage />} />
        <Route path="/tariffs" element={<TariffPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Маршруты аутентификации */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      </Route>

      {/* Защищенные маршруты (требуется авторизация) */}
      <Route 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/bookings/new" element={<CreateBookingPage />} />
        {/* Дополнительный маршрут для поддержки URL в единственном числе */}
        <Route path="/booking/new" element={<CreateBookingPage />} />
        <Route path="/bookings/:id" element={<BookingDetailsPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
      </Route>

      {/* Маршруты администратора */}
      <Route 
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/cars" element={<CarManagementPage />} />
        <Route path="/admin/bookings" element={<BookingManagementPage />} />
        <Route path="/admin/tariffs" element={<TariffManagementPage />} />
        <Route path="/admin/promotions" element={<PromotionManagementPage />} />
        <Route path="/admin/statistics" element={<StatisticsPage />} />
      </Route>

      {/* Маршруты менеджера */}
      <Route 
        element={
          <ManagerRoute>
            <ManagerLayout />
          </ManagerRoute>
        }
      >
        <Route path="/manager" element={<ManagerDashboardPage />} />
        <Route path="/manager/cars" element={<CarManagementPage />} />
        <Route path="/manager/bookings" element={<ManagerBookingManagementPage />} />
        <Route path="/manager/payments" element={<PaymentConfirmationPage />} />
      </Route>

      {/* Тестовая страница для иконок */}
      <Route path="/icons-test" element={<IconsTest />} />

      {/* 404 страница */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
