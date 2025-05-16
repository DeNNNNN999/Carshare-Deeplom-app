const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, admin } = require('../middleware');
const multer = require('multer');

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const userId = req.user.id;
    const uploadDir = path.join(__dirname, '../uploads', userId.toString());
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Получение профиля текущего пользователя
router.get('/profile', auth, userController.getProfile);

// Редактирование профиля
router.put('/profile', auth, userController.updateProfile);

// Загрузка документов
router.post('/documents', auth, upload.single('document'), userController.uploadDocuments);

// Получение документов пользователя
router.get('/documents', auth, userController.getDocuments);

// [ADMIN] Получение списка всех пользователей
router.get('/', [auth, admin], userController.getAllUsers);

// [ADMIN] Получение информации о конкретном пользователе
router.get('/:id', [auth, admin], userController.getUserById);

// [ADMIN] Обновление информации о пользователе
router.put('/:id', [auth, admin], userController.updateUser);

// [ADMIN] Блокировка/разблокировка пользователя
router.put('/:id/status', [auth, admin], userController.updateUserStatus);

module.exports = router;
