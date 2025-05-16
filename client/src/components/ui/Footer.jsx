import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Информация о компании */}
          <div>
            <h3 className="text-xl font-bold mb-4">CarShare</h3>
            <p className="text-gray-400 mb-4">
              Современный каршеринг с функцией долгой аренды. Выбирайте автомобиль и арендуйте его на любой срок — от нескольких минут до нескольких месяцев.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiInstagram size={20} />
              </a>
              <a 
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiTwitter size={20} />
              </a>
              <a 
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiFacebook size={20} />
              </a>
            </div>
          </div>

          {/* Навигация */}
          <div>
            <h3 className="text-xl font-bold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-white transition-colors">
                  Поиск автомобилей
                </Link>
              </li>
              <li>
                <Link to="/tariffs" className="text-gray-400 hover:text-white transition-colors">
                  Тарифы
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Тарифы */}
          <div>
            <h3 className="text-xl font-bold mb-4">Тарифы</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/tariffs#minute" className="text-gray-400 hover:text-white transition-colors">
                  Поминутная аренда
                </Link>
              </li>
              <li>
                <Link to="/tariffs#hour" className="text-gray-400 hover:text-white transition-colors">
                  Почасовая аренда
                </Link>
              </li>
              <li>
                <Link to="/tariffs#day" className="text-gray-400 hover:text-white transition-colors">
                  Дневная аренда
                </Link>
              </li>
              <li>
                <Link to="/tariffs#week" className="text-gray-400 hover:text-white transition-colors">
                  Недельная аренда
                </Link>
              </li>
              <li>
                <Link to="/tariffs#month" className="text-gray-400 hover:text-white transition-colors">
                  Месячная аренда
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-xl font-bold mb-4">Контакты</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FiMapPin className="text-primary-400 mt-1 mr-2" />
                <span className="text-gray-400">
                  Москва, ул. Примерная, д. 123
                </span>
              </li>
              <li className="flex items-center">
                <FiPhone className="text-primary-400 mr-2" />
                <a href="tel:+78001234567" className="text-gray-400 hover:text-white transition-colors">
                  8 (800) 123-45-67
                </a>
              </li>
              <li className="flex items-center">
                <FiMail className="text-primary-400 mr-2" />
                <a href="mailto:info@carshare.ru" className="text-gray-400 hover:text-white transition-colors">
                  info@carshare.ru
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Копирайт */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500">
            &copy; {currentYear} CarShare. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
