import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

const NoDataAvailable = ({ 
  message = 'Данные недоступны', 
  description = 'Не удалось загрузить запрашиваемые данные', 
  onRetry 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <div className="flex justify-center mb-4">
        <FiAlertTriangle className="text-yellow-500" size={48} />
      </div>
      <h3 className="text-xl font-bold mb-2">{message}</h3>
      <p className="text-gray-600 mb-4">
        {description}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn btn-primary flex items-center justify-center mx-auto"
        >
          <FiRefreshCw className="mr-2" />
          Попробовать снова
        </button>
      )}
    </div>
  );
};

export default NoDataAvailable;
