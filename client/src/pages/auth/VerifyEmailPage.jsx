import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { authService } from '../../api/services';
import { FiCheck, FiAlertTriangle } from 'react-icons/fi';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setLoading(false);
        setError('Неверный токен верификации');
        return;
      }

      try {
        await authService.verifyEmail(token);
        setVerified(true);
        
        // Автоматическое перенаправление на страницу входа через 5 секунд
        const redirectTimer = setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Ваш email успешно подтвержден. Теперь вы можете войти в систему.' } 
          });
        }, 5000);
        
        return () => clearTimeout(redirectTimer);
      } catch (err) {
        setError(err.response?.data?.message || 'Ошибка при верификации email');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="p-6 md:px-8 md:py-8">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-primary-700">CarShare</Link>
          <h1 className="text-2xl font-bold mt-4 mb-2">Проверка Email</h1>
          <p className="text-gray-600">Подождите, идет проверка вашего email...</p>
        </div>
        
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-12 w-12 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="p-6 md:px-8 md:py-8">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-primary-700">CarShare</Link>
          <h1 className="text-2xl font-bold mt-4 mb-2">Email подтвержден</h1>
          <p className="text-gray-600">Ваш email был успешно подтвержден</p>
        </div>
        
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-4 rounded mb-6">
          <div className="flex items-center">
            <FiCheck className="h-5 w-5 mr-2" />
            <div>
              <p className="font-medium">Поздравляем!</p>
              <p>Ваш email успешно подтвержден. Теперь вы можете использовать все функции нашего сервиса.</p>
              <p className="mt-2">Вы будете перенаправлены на страницу входа через несколько секунд...</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link to="/login" className="btn btn-primary">
            Войти в систему
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:px-8 md:py-8">
      <div className="text-center mb-8">
        <Link to="/" className="text-2xl font-bold text-primary-700">CarShare</Link>
        <h1 className="text-2xl font-bold mt-4 mb-2">Ошибка верификации</h1>
        <p className="text-gray-600">Не удалось подтвердить ваш email</p>
      </div>
      
      <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-4 rounded mb-6">
        <div className="flex items-center">
          <FiAlertTriangle className="h-5 w-5 mr-2" />
          <div>
            <p className="font-medium">Произошла ошибка</p>
            <p>{error || 'Ссылка для подтверждения email недействительна или истек срок ее действия.'}</p>
            <p className="mt-2">Пожалуйста, запросите новую ссылку для подтверждения.</p>
          </div>
        </div>
      </div>
      
      <div className="text-center flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-3 sm:justify-center">
        <Link to="/login" className="btn btn-primary">
          Вернуться к входу
        </Link>
        <Link to="/contact" className="btn btn-outline">
          Связаться с поддержкой
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
