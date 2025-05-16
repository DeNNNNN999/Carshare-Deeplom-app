import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import jwt_decode from 'jwt-decode';
import { authService } from '../api/services';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Проверка аутентификации при загрузке приложения
  const checkAuth = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }
    
    try {
      // Проверяем токен на истечение срока действия
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        // Токен истек, пытаемся обновить
        const response = await authService.checkAuth();
        if (response.data?.token) {
          localStorage.setItem('token', response.data.token);
          setCurrentUser(response.data.user);
        } else {
          // Не удалось обновить токен
          logout();
        }
      } else {
        // Токен действителен, получаем данные профиля
        const response = await authService.checkAuth();
        setCurrentUser(response.data.user);
      }
    } catch (error) {
      console.error('Ошибка при проверке аутентификации:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Регистрация пользователя
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      toast.success(response.data.message || 'Регистрация успешна. Проверьте вашу почту для подтверждения аккаунта.');
      navigate('/login');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка при регистрации');
      throw error;
    }
  };

  // Авторизация пользователя
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('token', response.data.token);
      setCurrentUser(response.data.user);
      toast.success('Вы успешно вошли в систему');
      navigate('/dashboard');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка при входе в систему');
      throw error;
    }
  };

  // Выход из системы
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    } finally {
      localStorage.removeItem('token');
      setCurrentUser(null);
      navigate('/');
      toast.success('Вы успешно вышли из системы');
    }
  };

  // Сброс пароля
  const forgotPassword = async (email) => {
    try {
      const response = await authService.forgotPassword(email);
      toast.success(response.data.message || 'Инструкции по сбросу пароля отправлены на вашу почту');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка при запросе сброса пароля');
      throw error;
    }
  };

  // Установка нового пароля
  const resetPassword = async (token, password) => {
    try {
      const response = await authService.resetPassword(token, password);
      toast.success(response.data.message || 'Пароль успешно изменен');
      navigate('/login');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка при сбросе пароля');
      throw error;
    }
  };

  // Верификация email
  const verifyEmail = async (token) => {
    try {
      const response = await authService.verifyEmail(token);
      toast.success(response.data.message || 'Email успешно подтвержден');
      navigate('/login');
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка при подтверждении email');
      throw error;
    }
  };

  // Проверка роли пользователя
  const hasRole = (role) => {
    return currentUser?.role === role;
  };

  // Проверка, является ли пользователь администратором
  const isAdmin = () => {
    return hasRole('admin');
  };

  // Проверка, является ли пользователь менеджером
  const isManager = () => {
    return hasRole('manager') || hasRole('admin');
  };

  const value = {
    currentUser,
    loading,
    checkAuth,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    hasRole,
    isAdmin,
    isManager
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
