import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi';
import anime from 'animejs';

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  
  // Анимация при загрузке страницы
  useEffect(() => {
    anime({
      targets: '.contact-section',
      opacity: [0, 1],
      translateY: [30, 0],
      delay: anime.stagger(200),
      easing: 'easeOutQuad',
      duration: 600
    });
  }, []);
  
  // Валидация формы
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Пожалуйста, введите ваше имя'),
      email: Yup.string()
        .email('Некорректный email адрес')
        .required('Пожалуйста, введите ваш email'),
      phone: Yup.string()
        .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Некорректный номер телефона'),
      subject: Yup.string()
        .required('Пожалуйста, укажите тему сообщения'),
      message: Yup.string()
        .required('Пожалуйста, введите ваше сообщение')
        .min(10, 'Сообщение должно содержать не менее 10 символов')
    }),
    onSubmit: (values) => {
      // В реальном приложении здесь был бы запрос к API
      console.log('Отправка формы:', values);
      
      // Анимация кнопки отправки
      anime({
        targets: '.submit-button',
        scale: [1, 0.95, 1],
        duration: 300,
        easing: 'easeOutQuad'
      });
      
      // Имитация отправки запроса
      setTimeout(() => {
        setSubmitted(true);
        formik.resetForm();
      }, 1000);
    }
  });
  
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center max-w-3xl mx-auto mb-16 contact-section">
          <h1 className="text-4xl font-bold mb-6">Свяжитесь с нами</h1>
          <p className="text-xl text-gray-600">
            У вас есть вопросы или предложения? Напишите нам, и мы обязательно свяжемся с вами в ближайшее время.
          </p>
        </div>
        
        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Контактная информация */}
          <div className="lg:col-span-1 contact-section">
            <div className="bg-white rounded-lg shadow-md p-6 h-full">
              <h2 className="text-2xl font-bold mb-6">Контакты</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <FiMapPin className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Адрес</h3>
                    <p className="text-gray-600">
                      Россия, г. Москва<br />
                      ул. Примерная, д. 123<br />
                      123456
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <FiPhone className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Телефон</h3>
                    <p className="text-gray-600">
                      <a href="tel:+78001234567" className="hover:text-primary-600">+7 (800) 123-45-67</a>
                      <br />
                      <span className="text-sm">(Ежедневно с 8:00 до 22:00)</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <FiMail className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Email</h3>
                    <p className="text-gray-600">
                      <a href="mailto:info@carshare.ru" className="hover:text-primary-600">info@carshare.ru</a>
                      <br />
                      <a href="mailto:support@carshare.ru" className="hover:text-primary-600">support@carshare.ru</a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <FiClock className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Часы работы</h3>
                    <p className="text-gray-600">
                      <span className="font-medium">Офис:</span><br />
                      Пн-Пт: 9:00 - 18:00<br />
                      <span className="font-medium">Поддержка:</span><br />
                      Ежедневно: 24/7
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Форма обратной связи */}
          <div className="lg:col-span-2 contact-section">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Напишите нам</h2>
              
              {submitted ? (
                <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-8 rounded mb-6 text-center">
                  <div className="flex justify-center mb-4">
                    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Сообщение отправлено!</h3>
                  <p className="mb-4">
                    Благодарим за обращение. Мы ответим вам в ближайшее время.
                  </p>
                  <button 
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setSubmitted(false)}
                  >
                    Отправить еще сообщение
                  </button>
                </div>
              ) : (
                <form onSubmit={formik.handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label htmlFor="name" className="label">
                        Имя <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        className={`input w-full ${
                          formik.touched.name && formik.errors.name ? 'border-red-500' : ''
                        }`}
                        placeholder="Введите ваше имя"
                        {...formik.getFieldProps('name')}
                      />
                      {formik.touched.name && formik.errors.name ? (
                        <div className="error-message">{formik.errors.name}</div>
                      ) : null}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email" className="label">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        className={`input w-full ${
                          formik.touched.email && formik.errors.email ? 'border-red-500' : ''
                        }`}
                        placeholder="Введите ваш email"
                        {...formik.getFieldProps('email')}
                      />
                      {formik.touched.email && formik.errors.email ? (
                        <div className="error-message">{formik.errors.email}</div>
                      ) : null}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone" className="label">
                        Телефон
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        className={`input w-full ${
                          formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''
                        }`}
                        placeholder="+7 (___) ___-__-__"
                        {...formik.getFieldProps('phone')}
                      />
                      {formik.touched.phone && formik.errors.phone ? (
                        <div className="error-message">{formik.errors.phone}</div>
                      ) : null}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="subject" className="label">
                        Тема <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="subject"
                        className={`input w-full ${
                          formik.touched.subject && formik.errors.subject ? 'border-red-500' : ''
                        }`}
                        {...formik.getFieldProps('subject')}
                      >
                        <option value="">Выберите тему</option>
                        <option value="Общие вопросы">Общие вопросы</option>
                        <option value="Аренда">Аренда</option>
                        <option value="Техническая поддержка">Техническая поддержка</option>
                        <option value="Сотрудничество">Сотрудничество</option>
                        <option value="Отзыв">Отзыв</option>
                        <option value="Другое">Другое</option>
                      </select>
                      {formik.touched.subject && formik.errors.subject ? (
                        <div className="error-message">{formik.errors.subject}</div>
                      ) : null}
                    </div>
                  </div>
                  
                  <div className="form-group mt-4">
                    <label htmlFor="message" className="label">
                      Сообщение <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows="6"
                      className={`input w-full ${
                        formik.touched.message && formik.errors.message ? 'border-red-500' : ''
                      }`}
                      placeholder="Введите ваше сообщение..."
                      {...formik.getFieldProps('message')}
                    ></textarea>
                    {formik.touched.message && formik.errors.message ? (
                      <div className="error-message">{formik.errors.message}</div>
                    ) : null}
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="submit-button btn btn-primary w-full sm:w-auto flex items-center justify-center"
                      disabled={formik.isSubmitting}
                    >
                      <FiSend className="mr-2" />
                      {formik.isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        
        {/* Карта */}
        <div className="contact-section">
          <h2 className="text-2xl font-bold mb-6 text-center">Мы на карте</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2245.2949847512154!2d37.61469431580633!3d55.75464998055755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b54a5a738fa901%3A0x7c347d506b52311a!2z0JrRgNCw0YHQvdCw0Y8g0L_Qu9C-0YnQsNC00YwsINCc0L7RgdC60LLQsCwg0KDQvtGB0YHQuNGP!5e0!3m2!1sru!2sru!4v1651747552489!5m2!1sru!2sru" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Карта местоположения офиса компании"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
