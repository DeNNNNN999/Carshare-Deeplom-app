import { useState, useEffect } from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';

const ServerErrorNotification = ({ error, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Автоматическое скрытие уведомления через 10 секунд
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Обработчик закрытия уведомления
  const handleClose = () => {
    setIsVisible(false);
    
    // Задержка для анимации
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  if (!isVisible) return null;
  
  return (
    <div 
      className={`fixed top-4 right-4 z-50 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 shadow-lg rounded-md transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ maxWidth: '400px' }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FiAlertCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">Проблема с сервером</h3>
          <div className="mt-1 text-sm">
            {error || 'Произошла ошибка при обработке запроса. Пожалуйста, попробуйте позже.'}
          </div>
          <div className="mt-2 text-xs text-red-600">
            <button 
              onClick={() => window.location.reload()} 
              className="font-medium underline"
            >
              Обновить страницу
            </button>
          </div>
        </div>
        <button 
          className="flex-shrink-0 ml-2 text-red-500 hover:text-red-700 focus:outline-none"
          onClick={handleClose}
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ServerErrorNotification;
