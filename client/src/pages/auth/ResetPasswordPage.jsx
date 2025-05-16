import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { authService } from '../../api/services';
import anime from 'animejs';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(true);

  // Проверка валидности токена при загрузке страницы
  useEffect(() => {
    const validateToken = async () => {
      try {
        // Здесь можно вызвать API для проверки токена, если такой метод есть
        // Например: await authService.checkResetToken(token);
        
        // Для демонстрации просто эмулируем проверку токена
        // В реальном проекте здесь было бы обращение к API
        setTokenValid(!!token && token.length > 10);
      } catch (err) {
        setTokenValid(false);
        setError('Ссылка для сброса пароля недействительна или истек срок ее действия');
      }
    };
    
    validateToken();
  }, [token]);

  // Валидация формы с Formik + Yup
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, 'Пароль должен содержать минимум 8 символов')
        .required('Пароль обязателен')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          'Пароль должен содержать как минимум одну заглавную букву, одну строчную букву и одну цифру'
        ),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
        .required('Подтверждение пароля обязательно')
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      
      // Анимация кнопки при отправке
      anime({
        targets: '.reset-button',
        scale: [1, 0.95, 1],
        duration: 300,
        easing: 'easeOutQuad'
      });
      
      try {
        await authService.resetPassword(token, values.password);
        // Перенаправление на страницу входа с сообщением об успешном сбросе
        navigate('/login', { state: { message: 'Пароль успешно изменен. Теперь вы можете войти с новым паролем.' } });
      } catch (err) {
        setError(err.response?.data?.message || 'Ошибка при сбросе пароля');
      } finally {
        setLoading(false);
      }
    }
  });

  if (!tokenValid) {
    return (
      <div className="p-6 md:px-8 md:py-8">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-primary-700">CarShare</Link>
          <h1 className="text-2xl font-bold mt-4 mb-2">Ошибка сброса пароля</h1>
        </div>
        
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-4 rounded mb-6">
          <p>Ссылка для сброса пароля недействительна или истек срок ее действия.</p>
          <p className="mt-2">Пожалуйста, запросите новую ссылку для сброса пароля.</p>
        </div>
        
        <div className="text-center">
          <Link to="/forgot-password" className="btn btn-primary">
            Запросить новую ссылку
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:px-8 md:py-8">
      <div className="text-center mb-8">
        <Link to="/" className="text-2xl font-bold text-primary-700">CarShare</Link>
        <h1 className="text-2xl font-bold mt-4 mb-2">Сброс пароля</h1>
        <p className="text-gray-600">Создайте новый пароль для вашего аккаунта</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="password" className="label">
            Новый пароль
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-500" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Введите новый пароль"
              className={`input w-full pl-10 ${
                formik.touched.password && formik.errors.password ? 'border-red-500' : ''
              }`}
              {...formik.getFieldProps('password')}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FiEyeOff className="text-gray-500" />
              ) : (
                <FiEye className="text-gray-500" />
              )}
            </button>
          </div>
          {formik.touched.password && formik.errors.password ? (
            <div className="error-message">{formik.errors.password}</div>
          ) : null}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword" className="label">
            Подтверждение пароля
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-500" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Подтвердите новый пароль"
              className={`input w-full pl-10 ${
                formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : ''
              }`}
              {...formik.getFieldProps('confirmPassword')}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <FiEyeOff className="text-gray-500" />
              ) : (
                <FiEye className="text-gray-500" />
              )}
            </button>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="error-message">{formik.errors.confirmPassword}</div>
          ) : null}
        </div>
        
        <button
          type="submit"
          className="reset-button btn btn-primary w-full mb-4"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Сброс пароля...
            </span>
          ) : (
            'Изменить пароль'
          )}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Вспомнили пароль?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-800 font-medium">
            Вернуться к входу
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
