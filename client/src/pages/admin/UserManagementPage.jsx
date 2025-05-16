import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../api/services';
import { FiUser, FiEdit, FiTrash, FiLock, FiUnlock, FiPlus, FiSearch, FiFilter, FiX } from 'react-icons/fi';
import moment from 'moment';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    isVerified: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Подготовка параметров для запроса
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      
      const response = await userService.getAllUsers(params);
      setUsers(response.data.users || []);
      setPagination(prev => ({ ...prev, total: response.data.total || 0 }));
    } catch (err) {
      setError('Не удалось загрузить пользователей. Пожалуйста, попробуйте позже.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 })); // Сбрасываем на первую страницу
    fetchUsers();
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      role: '',
      status: '',
      isVerified: ''
    });
    setPagination(prev => ({ ...prev, page: 1 })); // Сбрасываем на первую страницу
    setTimeout(() => {
      fetchUsers();
    }, 0);
  };

  const handleStatusChange = async (userId, newStatus) => {
    if (!window.confirm(`Вы уверены, что хотите изменить статус пользователя на "${newStatus}"?`)) {
      return;
    }
    
    try {
      await userService.updateUserStatus(userId, newStatus);
      // Обновляем список пользователей
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Не удалось изменить статус пользователя');
    }
  };

  const handleDeleteUser = (userId) => {
    alert('Функция удаления пользователя пока не реализована');
  };

  const renderRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">Админ</span>;
      case 'manager':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Менеджер</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Клиент</span>;
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Активен</span>;
      case 'blocked':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Заблокирован</span>;
      case 'deleted':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Удален</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const handleNextPage = () => {
    if (pagination.page * pagination.limit < pagination.total) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление пользователями</h1>
        <div className="flex space-x-2">
          <Link to="/admin/users/new" className="btn btn-primary flex items-center">
            <FiPlus className="mr-2" />
            Добавить пользователя
          </Link>
          <button 
            className="btn btn-outline flex items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter className="mr-2" />
            Фильтры
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Фильтры</h2>
            <button 
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX />
            </button>
          </div>
          
          <form onSubmit={applyFilters}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Поиск
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Имя, Email, Телефон"
                    className="input w-full pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Роль
                </label>
                <select
                  name="role"
                  value={filters.role}
                  onChange={handleFilterChange}
                  className="input w-full"
                >
                  <option value="">Все роли</option>
                  <option value="client">Клиент</option>
                  <option value="manager">Менеджер</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Статус
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="input w-full"
                >
                  <option value="">Все статусы</option>
                  <option value="active">Активен</option>
                  <option value="blocked">Заблокирован</option>
                  <option value="deleted">Удален</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Верификация
                </label>
                <select
                  name="isVerified"
                  value={filters.isVerified}
                  onChange={handleFilterChange}
                  className="input w-full"
                >
                  <option value="">Все</option>
                  <option value="true">Верифицированные</option>
                  <option value="false">Неверифицированные</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4 space-x-2">
              <button 
                type="button" 
                onClick={resetFilters}
                className="btn btn-outline"
              >
                Сбросить
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                Применить
              </button>
            </div>
          </form>
        </div>
      )}
      
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
          {users.length > 0 ? (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Пользователь</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Роль</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Верификация</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата рег.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <FiUser className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                              {user.phone && (
                                <div className="text-sm text-gray-500">
                                  {user.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStatusBadge(user.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.isVerified ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Да</span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Нет</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {moment(user.createdAt).format('DD.MM.YYYY')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <Link 
                            to={`/admin/users/${user.id}`}
                            className="text-primary-600 hover:text-primary-800"
                          >
                            <FiEdit className="inline h-5 w-5" />
                          </Link>
                          {user.status === 'active' ? (
                            <button
                              onClick={() => handleStatusChange(user.id, 'blocked')}
                              className="text-red-600 hover:text-red-800"
                              title="Заблокировать"
                            >
                              <FiLock className="inline h-5 w-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(user.id, 'active')}
                              className="text-green-600 hover:text-green-800"
                              title="Разблокировать"
                            >
                              <FiUnlock className="inline h-5 w-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Пагинация */}
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Показано <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> - <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> из <span className="font-medium">{pagination.total}</span> пользователей
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={handlePrevPage}
                        disabled={pagination.page === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          pagination.page === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Предыдущая</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={handleNextPage}
                        disabled={pagination.page * pagination.limit >= pagination.total}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          pagination.page * pagination.limit >= pagination.total ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Следующая</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <div className="text-gray-500 mb-4">Пользователи не найдены</div>
              {Object.values(filters).some(v => v !== '') && (
                <button
                  onClick={resetFilters}
                  className="btn btn-primary"
                >
                  Сбросить фильтры
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserManagementPage;
