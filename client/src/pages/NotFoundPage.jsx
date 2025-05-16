import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-9xl font-bold text-primary-500">404</h1>
      <div className="absolute rotate-12 rounded-full bg-primary-100 px-2 text-sm text-primary-800">
        Страница не найдена
      </div>
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Упс! Вы потерялись.</h2>
        <p className="text-gray-600 mb-8">
          Запрашиваемая страница не существует или была перемещена.
        </p>
        <Link to="/" className="btn btn-primary">
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
