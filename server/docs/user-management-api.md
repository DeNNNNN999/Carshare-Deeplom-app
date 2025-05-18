# API управления пользователями

## Создание нового пользователя
**Доступ:** Администратор или Менеджер

### Endpoint
`POST /api/users`

### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Body
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "Иван",
  "lastName": "Иванов",
  "phone": "+79001234567",
  "role": "client" // client, manager или admin
}
```

### Ограничения по ролям
- **Администратор** может создавать пользователей с любой ролью (client, manager, admin)
- **Менеджер** может создавать только клиентов (role: "client")

### Ответ успешный (201)
```json
{
  "message": "Пользователь успешно создан",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "Иван",
    "lastName": "Иванов",
    "phone": "+79001234567",
    "role": "client",
    "isVerified": true,
    "status": "active"
  }
}
```

### Ошибки
- 400: Необходимо заполнить все обязательные поля
- 400: Недопустимая роль пользователя
- 400: Пользователь с таким email уже существует
- 403: Менеджер может создавать только клиентов
- 500: Ошибка при создании пользователя

## Получение списка пользователей
**Доступ:** Администратор

### Endpoint
`GET /api/users?page=1&limit=10&search=Иван&role=client&status=active`

### Headers
```
Authorization: Bearer <token>
```

### Query параметры
- `page` (число) - номер страницы (по умолчанию 1)
- `limit` (число) - количество записей на странице (по умолчанию 10)
- `search` (строка) - поиск по имени, фамилии или email
- `role` (строка) - фильтр по роли (client, manager, admin)
- `status` (строка) - фильтр по статусу (active, blocked, deleted)

### Ответ успешный (200)
```json
{
  "totalItems": 50,
  "totalPages": 5,
  "currentPage": 1,
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "firstName": "Иван",
      "lastName": "Иванов",
      "phone": "+79001234567",
      "role": "client",
      "isVerified": true,
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Обновление пользователя
**Доступ:** Администратор

### Endpoint
`PUT /api/users/:id`

### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Body
```json
{
  "firstName": "Петр",
  "lastName": "Петров",
  "phone": "+79007654321",
  "role": "manager",
  "isVerified": true,
  "status": "active"
}
```

### Ответ успешный (200)
```json
{
  "message": "Информация о пользователе успешно обновлена",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "Петр",
    "lastName": "Петров",
    "phone": "+79007654321",
    "role": "manager",
    "isVerified": true,
    "status": "active"
  }
}
```

## Изменение статуса пользователя
**Доступ:** Администратор

### Endpoint
`PUT /api/users/:id/status`

### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Body
```json
{
  "status": "blocked" // active, blocked или deleted
}
```

### Ответ успешный (200)
```json
{
  "message": "Статус пользователя изменен на \"blocked\"",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "status": "blocked"
  }
}
```

## Сброс пароля пользователя
**Доступ:** Администратор

### Endpoint
`PUT /api/users/:id/password`

### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Body
```json
{
  "newPassword": "newPassword123"
}
```

### Ответ успешный (200)
```json
{
  "message": "Пароль пользователя успешно изменен",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "Иван",
    "lastName": "Иванов"
  }
}
```

### Ошибки
- 400: Пароль должен содержать минимум 6 символов
- 404: Пользователь не найден
- 500: Ошибка при сбросе пароля