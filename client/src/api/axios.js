import axios from 'axios';

// Создаем экземпляр axios с базовым URL
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена к запросам
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерцептор для обработки ответов
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Логируем все ошибки для дебага
    console.error('Ошибка запроса:', {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    // Обработка прерывания запроса (таймаута)
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      // Ошибка сети или таймаут
      console.error('Ошибка сети или таймаут:', error.message);
      return Promise.reject(error);
    }
    
    // Если ошибка 401 (неавторизованный) и не пытаемся обновить токен
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Пытаемся обновить токен
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // Нет refresh токена, выходим из аккаунта
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Запрос на обновление токена
        const response = await axios.post('/api/auth/refresh-token', {
          token: refreshToken,
        });
        
        if (response.data?.token) {
          // Сохраняем новый токен
          localStorage.setItem('token', response.data.token);
          
          // Повторяем оригинальный запрос с новым токеном
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Не удалось обновить токен, выходим из аккаунта
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Обработка ошибок сервера
    if (error.response?.status === 500) {
      console.error('Ошибка сервера:', error.response.data);
    }
    
    // Обработка ошибки 403 (Доступ запрещен)
    if (error.response?.status === 403) {
      console.error('Ошибка доступа:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default api;
