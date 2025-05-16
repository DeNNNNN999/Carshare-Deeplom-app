import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiMenu, FiX, FiUser, FiLogIn } from 'react-icons/fi';
import anime from 'animejs';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Функция для проверки скролла
  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  // Добавление обработчика события скролла
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Переключение состояния меню
  const toggleMenu = () => {
    setIsOpen(!isOpen);

    // Анимация меню
    if (!isOpen) {
      anime({
        targets: '#mobile-menu',
        opacity: [0, 1],
        translateY: [-20, 0],
        easing: 'easeOutExpo',
        duration: 300,
        delay: anime.stagger(50)
      });
    }
  };

  return (
    <header 
      className={`fixed w-full z-10 transition-all duration-300 ${
        scrolled || isOpen ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Логотип */}
          <Link 
            to="/" 
            className={`text-2xl font-bold ${
              scrolled || isOpen ? 'text-primary-700' : 'text-white'
            }`}
          >
            CarShare
          </Link>

          {/* Навигация для декстопа */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/search" 
              className={`${
                scrolled ? 'text-gray-800 hover:text-primary-600' : 'text-white hover:text-primary-200'
              } font-medium`}
            >
              Найти автомобиль
            </Link>
            <Link 
              to="/tariffs" 
              className={`${
                scrolled ? 'text-gray-800 hover:text-primary-600' : 'text-white hover:text-primary-200'
              } font-medium`}
            >
              Тарифы
            </Link>
            <Link 
              to="/about" 
              className={`${
                scrolled ? 'text-gray-800 hover:text-primary-600' : 'text-white hover:text-primary-200'
              } font-medium`}
            >
              О нас
            </Link>
            <Link 
              to="/contact" 
              className={`${
                scrolled ? 'text-gray-800 hover:text-primary-600' : 'text-white hover:text-primary-200'
              } font-medium`}
            >
              Контакты
            </Link>
            
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard" 
                  className="btn btn-primary"
                >
                  <FiUser className="mr-2" />
                  Личный кабинет
                </Link>
                <button 
                  onClick={logout}
                  className={`font-medium ${
                    scrolled ? 'text-gray-800 hover:text-primary-600' : 'text-white hover:text-primary-200'
                  }`}
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className={`font-medium ${
                    scrolled ? 'text-gray-800 hover:text-primary-600' : 'text-white hover:text-primary-200'
                  }`}
                >
                  Войти
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </nav>

          {/* Кнопка мобильного меню */}
          <button 
            className="md:hidden text-2xl" 
            onClick={toggleMenu}
          >
            {isOpen ? (
              <FiX className={scrolled || isOpen ? 'text-gray-800' : 'text-white'} />
            ) : (
              <FiMenu className={scrolled || isOpen ? 'text-gray-800' : 'text-white'} />
            )}
          </button>
        </div>

        {/* Мобильное меню */}
        {isOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden mt-4 bg-white rounded-md shadow-lg p-4"
          >
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/search" 
                className="text-gray-800 hover:text-primary-600 font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Найти автомобиль
              </Link>
              <Link 
                to="/tariffs" 
                className="text-gray-800 hover:text-primary-600 font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Тарифы
              </Link>
              <Link 
                to="/about" 
                className="text-gray-800 hover:text-primary-600 font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                О нас
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-800 hover:text-primary-600 font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Контакты
              </Link>
              
              <div className="border-t border-gray-200 pt-3">
                {currentUser ? (
                  <div className="flex flex-col space-y-3">
                    <Link 
                      to="/dashboard" 
                      className="btn btn-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      <FiUser className="mr-2" />
                      Личный кабинет
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="text-gray-800 hover:text-primary-600 font-medium py-2"
                    >
                      Выйти
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link 
                      to="/login" 
                      className="flex items-center text-gray-800 hover:text-primary-600 font-medium py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <FiLogIn className="mr-2" />
                      Войти
                    </Link>
                    <Link 
                      to="/register" 
                      className="btn btn-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      Регистрация
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
