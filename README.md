# API_Virtual_Machines

[![Node.js](https://img.shields.io/badge/-Node.js-464646??style=flat-square&logo=Node.js)](https://nodejs.org/ru/)
[![Express](https://img.shields.io/badge/-Express-464646??style=flat-square&logo=Express)](https://expressjs.com/ru/)
[![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-464646??style=flat-square&logo=PostgreSQL)](https://www.postgresql.org/)

**API_Virtual_Machines** представляет собой API, разработанный с использованием фреймворка Express. Для хранения данных используется СУБД PostgreSQL.

API позволяет: 
 - Регистрировать пользователя
 - Входить пользователю
 - Выходить пользователю
 - Размещать заказ на создание ВМ - номер заказа, кол-во vCPU, vRAM, vHDD заказа
 - Получать информацию о состоянии заказа ВМ - done/in progress. 
 - Получать описание заказа

Для выполнения указанных операций используются следующие эндпоинты:

- POST http://localhost:3000/users - регистрация пользователя
- POST http://localhost:3000/login - авторизация пользователя (вход)
- GET http://localhost:3000/logout - выход пользователя
- POST http://localhost:3000/orders - размещение заказа на создание ВМ
- GET http://localhost:3000/orders/:id/status - получение информации о статусе заказа ВМ
- GET http://localhost:3000/orders/:id - получение описания заказа

## Запуск приложнеия
Для начала необоходимо установить Docker на свой компьютер и клонировать проект API_Virtual_Machines.

Клонировать проект:
```
Git clone https://github.com/SergeyMMedvedev/infra_sp2.git
```
В корне проекта 

## Алгоритм авторизации пользователей
Для аутентификации/авторизации используются сессии (passport и express-session для Node.js).
Когда пользователь вводит логин и пароль, сервер создаёт сессию и сохраняет её. Сессия представляет собой объект с данными о входе в систему. Клиент получает идентификатор сессии, который отправляется на сервер в каждом запросе.
При выходе из аккаунта сервер удаляет сессию, так что пользователю нужно проходить аутентификацию снова.

## Пользовательские роли
1. Пользователь со статусом "1" может выполнять все действия.
2. Пользователь со статусом "2" может выполнять вход/выход.
3. Пользователь со статусом "3" может выполнять вход/выход, операции с заказом.


## Примеры использования эндпоинтов

### 1. Регистрация пользователя
Права доступа: **статус "1"**.

POST  - http://localhost:3000/users

Пример запроса:
```
{
    "name": "User",
    "password": "user123",
    "status": "3"
}
```
Пример ответа:
```
{
    "data": {
        "id": 4,
        "name": "User",
        "status": "3"
    }
}
```

### 2. Вход пользователя
Права доступа: **все**.

POST http://localhost:3000/login

Пример запроса:
```
{
    "name": "Admin123",
    "password": "Admin123"
}
```
Пример ответа:
```
{
    "message": "You were authenticated & logged in!"
}
```
### 3. Выход пользователя

Права доступа: **все**.

GET http://localhost:3000/logout

Пример ответа:
```
{
    "message": "logout success"
}
```

### 4. Размещение заказа на создание ВМ

Права доступа: **статус "1" и "3"**.

POST http://localhost:3000/orders 

Пример запроса:
```
{
    "vCPU": 2,
    "vRAM": 3,
    "vHDD": 80
}
```

Пример ответа:
```
{
    "data": {
        "status": "in progress",
        "orderNumber": 2,
        "vCPU": 2,
        "vRAM": 3,
        "vHDD": 80,
        "UserId": 3,
        "updatedAt": "2021-05-11T22:39:50.584Z",
        "createdAt": "2021-05-11T22:39:50.584Z"
    }
}
```

### 5. Получение информации о статусе заказа ВМ

Права доступа: **статус "1" и "3"**.

GET http://localhost:3000/orders/1/status

Пример ответа:
```
{
    "data": {
        "status": "in progress"
    }
}
```

### 6. Получение описания заказа

Права доступа: **статус "1" и "3"**.

GET http://localhost:3000/orders/:id

Пример ответа:
```
{
    "data": {
        "orderNumber": 1,
        "vCPU": 21,
        "vRAM": 2,
        "vHDD": 8000,
        "status": "in progress",
        "createdAt": "2021-05-11T22:39:24.533Z",
        "updatedAt": "2021-05-11T22:39:24.533Z",
        "UserId": 3
    }
}
```














