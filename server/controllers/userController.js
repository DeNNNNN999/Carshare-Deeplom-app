const { User, UserDocument } = require('../models');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const mkdir = promisify(fs.mkdir);

// Получение профиля текущего пользователя
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Ошибка при получении профиля пользователя:', error);
    res.status(500).json({ message: 'Ошибка при получении профиля пользователя' });
  }
};

// Редактирование профиля
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, birthDate } = req.body;
    
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Обновление данных пользователя
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phone = phone || user.phone;
    user.birthDate = birthDate || user.birthDate;

    await user.save();

    res.status(200).json({ 
      message: 'Профиль успешно обновлен',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        birthDate: user.birthDate,
        role: user.role,
        isVerified: user.isVerified,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    res.status(500).json({ message: 'Ошибка при обновлении профиля' });
  }
};

// Загрузка документов
const uploadDocuments = async (req, res) => {
  try {
    // В реальном приложении здесь должен быть middleware для загрузки файлов
    // Например, с использованием multer
    
    const { documentType, documentNumber } = req.body;
    const userId = req.user.id;
    
    // Проверка наличия файла в запросе
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не предоставлен' });
    }

    // Проверка параметров
    if (!documentType || !documentNumber) {
      return res.status(400).json({ message: 'Не указан тип или номер документа' });
    }

    // Создание директории для хранения файлов, если она не существует
    const uploadDir = path.join(__dirname, '../uploads', userId.toString());
    await mkdir(uploadDir, { recursive: true });

    // Генерация имени файла
    const filename = `${documentType}_${Date.now()}${path.extname(req.file.originalname)}`;
    const filePath = path.join(uploadDir, filename);

    // Сохранение файла (в реальном приложении это делает multer)
    // fs.writeFileSync(filePath, req.file.buffer);

    // Создание записи о документе в базе данных
    const document = await UserDocument.create({
      userId,
      documentType,
      documentNumber,
      documentPath: `/uploads/${userId}/${filename}`
    });

    res.status(201).json({ 
      message: 'Документ успешно загружен',
      document: {
        id: document.id,
        documentType: document.documentType,
        documentNumber: document.documentNumber,
        isVerified: document.isVerified
      }
    });
  } catch (error) {
    console.error('Ошибка при загрузке документа:', error);
    res.status(500).json({ message: 'Ошибка при загрузке документа' });
  }
};

// Получение документов пользователя
const getDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const documents = await UserDocument.findAll({
      where: { userId },
      attributes: ['id', 'documentType', 'documentNumber', 'isVerified', 'verificationDate', 'rejectionReason', 'createdAt']
    });

    res.status(200).json({ documents });
  } catch (error) {
    console.error('Ошибка при получении документов:', error);
    res.status(500).json({ message: 'Ошибка при получении документов' });
  }
};

// [ADMIN] Получение списка всех пользователей
const getAllUsers = async (req, res) => {
  try {
    // Пагинация
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Фильтрация
    const status = req.query.status;
    const role = req.query.role;
    const search = req.query.search;
    
    const whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (role) {
      whereClause.role = role;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      users: rows
    });
  } catch (error) {
    console.error('Ошибка при получении списка пользователей:', error);
    res.status(500).json({ message: 'Ошибка при получении списка пользователей' });
  }
};

// [ADMIN] Получение информации о конкретном пользователе
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: UserDocument,
        as: 'documents',
        attributes: ['id', 'documentType', 'documentNumber', 'isVerified', 'verificationDate', 'rejectionReason', 'createdAt']
      }]
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Ошибка при получении информации о пользователе:', error);
    res.status(500).json({ message: 'Ошибка при получении информации о пользователе' });
  }
};

// [ADMIN] Обновление информации о пользователе
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, role, isVerified, status } = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Обновление данных пользователя
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (isVerified !== undefined) user.isVerified = isVerified;
    if (status) user.status = status;

    await user.save();

    res.status(200).json({ 
      message: 'Информация о пользователе успешно обновлена',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Ошибка при обновлении информации о пользователе:', error);
    res.status(500).json({ message: 'Ошибка при обновлении информации о пользователе' });
  }
};

// [ADMIN] Блокировка/разблокировка пользователя
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['active', 'blocked', 'deleted'].includes(status)) {
      return res.status(400).json({ message: 'Неверный статус пользователя' });
    }
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.status = status;
    await user.save();

    res.status(200).json({ 
      message: `Статус пользователя изменен на "${status}"`,
      user: {
        id: user.id,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Ошибка при обновлении статуса пользователя:', error);
    res.status(500).json({ message: 'Ошибка при обновлении статуса пользователя' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadDocuments,
  getDocuments,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserStatus
};
