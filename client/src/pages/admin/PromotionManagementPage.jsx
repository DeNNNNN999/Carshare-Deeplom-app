import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { promotionService } from '../../api/services';
import { FiEdit, FiToggleLeft, FiToggleRight, FiPlus, FiDollarSign, FiCalendar, FiTag } from 'react-icons/fi';
import moment from 'moment';

const PromotionManagementPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const response = await promotionService.getActivePromotions();
      setPromotions(response.data.promotions || []);
    } catch (err) {
      setError('Не удалось загрузить акции. Пожалуйста, попробуйте позже.');
      console.error('Error fetching promotions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (promotionId, currentStatus) => {
    try {
      await promotionService.updatePromotionStatus(promotionId, !currentStatus);
      // Обновляем список акций
      fetchPromotions();
    } catch (err) {
      alert(err.response?.data?.message || 'Не удалось изменить статус акции');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление акциями</h1>
        <Link to="/admin/promotions/new" className="btn btn-primary flex items-center">
          <FiPlus className="mr-2" />
          Добавить акцию
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-10 w-10 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <>
          {promotions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {promotions.map((promotion) => (
                <div 
                  key={promotion.id} 
                  className={`bg-white shadow rounded-lg overflow-hidden ${!promotion.isActive ? 'opacity-70' : ''}`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold">
                        {promotion.name}
                      </h3>
                      <button
                        onClick={() => handleToggleStatus(promotion.id, promotion.isActive)}
                        className={`p-1 rounded-full ${promotion.isActive ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'}`}
                        title={promotion.isActive ? 'Деактивировать' : 'Активировать'}
                      >
                        {promotion.isActive ? <FiToggleRight className="h-6 w-6" /> : <FiToggleLeft className="h-6 w-6" />}
                      </button>
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      {promotion.description}
                    </p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center">
                        <FiTag className="text-gray-500 mr-2" />
                        <div>
                          <div className="text-sm text-gray-600">Промокод</div>
                          <div className="font-medium">{promotion.code}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <FiDollarSign className="text-gray-500 mr-2" />
                        <div>
                          <div className="text-sm text-gray-600">Размер скидки</div>
                          <div>{promotion.discountPercent}%</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <FiCalendar className="text-gray-500 mr-2" />
                        <div>
                          <div className="text-sm text-gray-600">Период действия</div>
                          <div>{moment(promotion.startDate).format('DD.MM.YYYY')} — {moment(promotion.endDate).format('DD.MM.YYYY')}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t">
                      <div className="text-sm text-gray-600">
                        {moment().isBefore(promotion.startDate) ? (
                          <span className="text-blue-600">Начнется {moment(promotion.startDate).fromNow()}</span>
                        ) : moment().isAfter(promotion.endDate) ? (
                          <span className="text-red-600">Завершена {moment(promotion.endDate).fromNow()}</span>
                        ) : (
                          <span className="text-green-600">Активна до {moment(promotion.endDate).format('DD.MM.YYYY')}</span>
                        )}
                      </div>
                      
                      <Link 
                        to={`/admin/promotions/${promotion.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        <FiEdit className="mr-1" />
                        Редактировать
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <div className="text-gray-500 mb-4">Акции не найдены</div>
              <Link to="/admin/promotions/new" className="btn btn-primary">
                Добавить акцию
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PromotionManagementPage;
