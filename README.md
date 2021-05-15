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
git clone https://github.com/SergeyMMedvedev/API_Virtual_Machines.git
```
Установить зависимости:
```
cd apivirtualmachines/
npm install
```

Создать файд .env в папке apivirtualmachines
```
cd ..
touch apivirtualmachines/.env
```
И указать перечисленные ниже константы.
Для простоты можно копировать содержимое файла env-example.txt и вставить в .env. Таким образом в .env будет указано:
```
SUPERUSER_NAME = Admin123
SUPERUSER_PASSWORD = Admin123
SUPERUSER_SATUS = "1"

USER2_NAME = username2
USER2_PASSWORD = username2
USER2_SATUS = "2"

USER3_NAME = username3
USER3_PASSWORD = username3
USER3_SATUS = "3"

PORT = 3000
NODE_ENV = production
PASSPORT_SECRET_KEY = jwtasdfasfasdfasdfasdfasfasdf
DB_SCHEMA = postgres
DB_USER = postgres
DB_PASSWORD = postgres
DB_HOST = postgres
POSTGRES_USER = postgres
POSTGRES_PASSWORD= postgres
```

Запустить докер контейнеры:
```
docker-compose up -d
```
Выполнить миграции:
```
docker-compose run apivirtualmachines npm run migrate
```
Создать начальных пользователей (имена и пароли будут взяты из .env):
```
docker-compose run apivirtualmachines npm run create-users
```

## Начало работы

После выполнения команды docker-compose run apivirtualmachines npm run create-users в
базе данных будут созданы 3 пользователя:
```
{
    "id": 1,
    "name": "Admin123",
    "password": "Admin123",
    "status": "1",
},

{
    "id": 2,
    "name": "username2",
    "password": "username2",
    "status": "2",
},

{
    "id": 3,
    "name": "username3",
    "password": "username3",
    "status": "3",
}
```
Имена и пароли берутся из файла .env.
Создание начальных пользователей необходимо, т.к. не существующий в базе данных пользователь не может самостоятельно зарегистрироваться. Регистрация новых пользователей доступна только авторизованному пользователю со статусом "1".

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
        "orderNumber": 2,
        "vCPU": 2,
        "vRAM": 3,
        "vHDD": 80,
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
        "createdAt": "2021-05-11T22:39:24.533Z",
    }
}
```














