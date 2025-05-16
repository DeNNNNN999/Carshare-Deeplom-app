import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reviewService } from '../../api/services';
import { FiStar, FiCalendar, FiEdit, FiTrash } from 'react-icons/fi';
import moment from 'moment';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewService.getUserReviews();
      setReviews(response.data.reviews || []);
    } catch (err) {
      setError('Не удалось загрузить отзывы. Пожалуйста, попробуйте позже.');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (review) => {
    setEditingReview(review);
    setReviewText(review.comment);
    setReviewRating(review.rating);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setReviewText('');
    setReviewRating(5);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    
    if (!editingReview) return;
    
    try {
      // Здесь предполагается, что в API есть метод для обновления отзыва
      // Если его нет в вашем API, то можно имитировать обновление на клиенте
      
      // await reviewService.updateReview(editingReview.id, {
      //   rating: reviewRating,
      //   comment: reviewText
      // });
      
      // В качестве заглушки обновляем отзыв локально
      const updatedReviews = reviews.map(review => 
        review.id === editingReview.id
          ? { ...review, rating: reviewRating, comment: reviewText, updatedAt: new Date().toISOString() }
          : review
      );
      
      setReviews(updatedReviews);
      setEditingReview(null);
      setReviewText('');
      setReviewRating(5);
    } catch (err) {
      alert(err.response?.data?.message || 'Не удалось обновить отзыв');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      return;
    }
    
    try {
      // Здесь предполагается, что в API есть метод для удаления отзыва
      // Если его нет в вашем API, то можно имитировать удаление на клиенте
      
      // await reviewService.deleteReview(reviewId);
      
      // В качестве заглушки удаляем отзыв локально
      const updatedReviews = reviews.filter(review => review.id !== reviewId);
      setReviews(updatedReviews);
    } catch (err) {
      alert(err.response?.data?.message || 'Не удалось удалить отзыв');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Мои отзывы</h1>
      
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
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              {editingReview && editingReview.id === review.id ? (
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Редактирование отзыва</h2>
                  
                  <form onSubmit={handleSubmitEdit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Оценка
                      </label>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setReviewRating(i + 1)}
                            className="mr-1 focus:outline-none"
                          >
                            <svg 
                              className={`w-6 h-6 ${i < reviewRating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                        Комментарий
                      </label>
                      <textarea
                        id="comment"
                        rows="4"
                        className="input w-full"
                        placeholder="Поделитесь вашими впечатлениями"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="btn btn-outline"
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                      >
                        Сохранить
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg 
                              key={i}
                              className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-gray-600">
                          {moment(review.createdAt).format('DD.MM.YYYY')}
                          {review.updatedAt && review.updatedAt !== review.createdAt && 
                            ' (ред. ' + moment(review.updatedAt).format('DD.MM.YYYY') + ')'}
                        </span>
                      </div>
                      <Link 
                        to={`/cars/${review.carId}`}
                        className="mt-1 block text-primary-600 hover:text-primary-800"
                      >
                        {review.car?.brand} {review.car?.model} ({review.car?.year})
                      </Link>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(review)}
                        className="p-1 text-gray-500 hover:text-primary-600"
                        title="Редактировать"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-1 text-gray-500 hover:text-red-600"
                        title="Удалить"
                      >
                        <FiTrash />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-800">{review.comment}</p>
                  
                  <div className="mt-2">
                    <Link
                      to={`/bookings/${review.bookingId}`}
                      className="text-sm text-gray-600 hover:text-primary-600"
                    >
                      Бронирование #{review.bookingId}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="text-gray-500 mb-4">У вас пока нет отзывов</div>
          <p className="mb-4">Вы сможете оставить отзыв после завершения аренды автомобиля</p>
          <Link to="/bookings" className="btn btn-primary">
            Мои бронирования
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
