import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from 'react-icons/fi';
import anime from 'animejs';

const RegisterPage = () => {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Валидация формы с Formik + Yup
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(50, 'Имя не должно превышать 50 символов')
        .required('Имя обязательно'),
      lastName: Yup.string()
        .max(50, 'Фамилия не должна превышать 50 символов')
        .required('Фамилия обязательна'),
      email: Yup.string()
        .email('Некорректный email адрес')
        .required('Email обязателен'),
      phone: Yup.string()
        .matches(/^[+]?[0-9\s().\-]{10,18}$/, 'Некорректный номер телефона')
        .required('Телефон обязателен'),
      password: Yup.string()
        .min(8, 'Пароль должен содержать минимум 8 символов')
        .required('Пароль обязателен'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
        .required('Подтверждение пароля обязательно'),
      agreeToTerms: Yup.boolean()
        .oneOf([true], 'Вы должны согласиться с условиями')
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Анимация кнопки при отправке
      anime({
        targets: '.register-button',
        scale: [1, 0.95, 1],
        duration: 300,
        easing: 'easeOutQuad'
      });
      
      try {
        // Подготовка данных для отправки (без confirmPassword и agreeToTerms)
        const { confirmPassword, agreeToTerms, ...userData } = values;
        
        // Регистрация пользователя
        await register(userData);
        
        // Успешная регистрация
        setSuccess('Регистрация успешна. Пожалуйста, проверьте вашу почту для подтверждения аккаунта.');
        formik.resetForm();
      } catch (err) {
        setError(err.response?.data?.message || 'Ошибка при регистрации');
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <div className="p-6 md:px-8 md:py-8">
      <div className="text-center mb-8">
        <Link to="/" className="text-2xl font-bold text-primary-700">CarShare</Link>
        <h1 className="text-2xl font-bold mt-4 mb-2">Регистрация</h1>
        <p className="text-gray-600">Создайте аккаунт для использования сервиса</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="form-group">
            <label htmlFor="firstName" className="label">
              Имя
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-500" />
              </div>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Иван"
                className={`input w-full pl-10 ${
                  formik.touched.firstName && formik.errors.firstName ? 'border-red-500' : ''
                }`}
                {...formik.getFieldProps('firstName')}
              />
            </div>
            {formik.touched.firstName && formik.errors.firstName ? (
              <div className="error-message">{formik.errors.firstName}</div>
            ) : null}
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName" className="label">
              Фамилия
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-500" />
              </div>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Иванов"
                className={`input w-full pl-10 ${
                  formik.touched.lastName && formik.errors.lastName ? 'border-red-500' : ''
                }`}
                {...formik.getFieldProps('lastName')}
              />
            </div>
            {formik.touched.lastName && formik.errors.lastName ? (
              <div className="error-message">{formik.errors.lastName}</div>
            ) : null}
          </div>
        </div>
        
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
          <label htmlFor="phone" className="label">
            Телефон
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiPhone className="text-gray-500" />
            </div>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+7 (999) 123-45-67"
              className={`input w-full pl-10 ${
                formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''
              }`}
              {...formik.getFieldProps('phone')}
            />
          </div>
          {formik.touched.phone && formik.errors.phone ? (
            <div className="error-message">{formik.errors.phone}</div>
          ) : null}
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="label">
            Пароль
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-500" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Минимум 8 символов"
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
              placeholder="Повторите пароль"
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
        
        <div className="mb-6">
          <label className="flex items-start">
            <input
              type="checkbox"
              name="agreeToTerms"
              className="mt-1 mr-2"
              {...formik.getFieldProps('agreeToTerms')}
            />
            <span className="text-sm text-gray-700">
              Я соглашаюсь с <Link to="/terms" className="text-primary-600 hover:text-primary-800">условиями использования</Link> и <Link to="/privacy" className="text-primary-600 hover:text-primary-800">политикой конфиденциальности</Link>
            </span>
          </label>
          {formik.touched.agreeToTerms && formik.errors.agreeToTerms ? (
            <div className="error-message">{formik.errors.agreeToTerms}</div>
          ) : null}
        </div>
        
        <button
          type="submit"
          className="register-button btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Регистрация...
            </span>
          ) : (
            'Зарегистрироваться'
          )}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-800 font-medium">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
