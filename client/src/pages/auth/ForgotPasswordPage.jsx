import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiMail } from 'react-icons/fi';
import { authService } from '../../api/services';
import anime from 'animejs';

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Валидация формы с Formik + Yup
  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Некорректный email адрес')
        .required('Email обязателен')
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      
      // Анимация кнопки при отправке
      anime({
        targets: '.submit-button',
        scale: [1, 0.95, 1],
        duration: 300,
        easing: 'easeOutQuad'
      });
      
      try {
        await authService.forgotPassword(values.email);
        setSuccess(true);
      } catch (err) {
        setError(err.response?.data?.message || 'Ошибка при отправке запроса');
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <div className="p-6 md:px-8 md:py-8">
      <div className="text-center mb-8">
        <Link to="/" className="text-2xl font-bold text-primary-700">CarShare</Link>
        <h1 className="text-2xl font-bold mt-4 mb-2">Восстановление пароля</h1>
        <p className="text-gray-600">
          {success 
            ? 'Инструкции по сбросу пароля отправлены на ваш email' 
            : 'Укажите email, чтобы получить инструкции по сбросу пароля'}
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success ? (
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-4 rounded mb-6">
          <p>Мы отправили инструкции по сбросу пароля на указанный email адрес.</p>
          <p className="mt-2">Пожалуйста, проверьте вашу почту и следуйте инструкциям.</p>
        </div>
      ) : (
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
          
          <button
            type="submit"
            className="submit-button btn btn-primary w-full mb-4"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Отправка...
              </span>
            ) : (
              'Отправить инструкции'
            )}
          </button>
        </form>
      )}
      
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

export default ForgotPasswordPage;
