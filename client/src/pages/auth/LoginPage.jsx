import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import anime from 'animejs';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Валидация формы с Formik + Yup
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Некорректный email адрес')
        .required('Email обязателен'),
      password: Yup.string()
        .required('Пароль обязателен')
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      
      // Анимация кнопки при отправке
      anime({
        targets: '.login-button',
        scale: [1, 0.95, 1],
        duration: 300,
        easing: 'easeOutQuad'
      });
      
      try {
        await login(values);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Ошибка при входе в систему');
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <div className="p-6 md:px-8 md:py-8">
      <div className="text-center mb-8">
        <Link to="/" className="text-2xl font-bold text-primary-700">CarShare</Link>
        <h1 className="text-2xl font-bold mt-4 mb-2">Вход в систему</h1>
        <p className="text-gray-600">Войдите в свой аккаунт чтобы продолжить</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="label">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-gray-500" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              className={`input w-full pl-10 ${
                formik.touched.email && formik.errors.email ? 'border-red-500' : ''
              }`}
              {...formik.getFieldProps('email')}
            />
          </div>
          {formik.touched.email && formik.errors.email ? (
            <div className="error-message">{formik.errors.email}</div>
          ) : null}
        </div>
        
        <div className="form-group">
          <div className="flex justify-between">
            <label htmlFor="password" className="label">
              Пароль
            </label>
            <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-800">
              Забыли пароль?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-500" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Ваш пароль"
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
        
        <div className="mb-6">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm text-gray-700">Запомнить меня</span>
          </label>
        </div>
        
        <button
          type="submit"
          className="login-button btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Вход...
            </span>
          ) : (
            'Войти'
          )}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Еще нет аккаунта?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-800 font-medium">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
