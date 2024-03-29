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

При локальном запуске проекта для выполнения указанных операций используются следующие эндпоинты:

- GET http://localhost:3000/api/v1 - стартовая страница
- POST http://localhost:3000/api/v1/users - регистрация пользователя
- POST http://localhost:3000/api/v1/login - авторизация пользователя (вход)
- GET http://localhost:3000/api/v1/logout - выход пользователя
- POST http://localhost:3000/api/v1/orders - размещение заказа на создание ВМ
- GET http://localhost:3000/api/v1/orders/:id/status - получение информации о статусе заказа ВМ
- GET http://localhost:3000/api/v1/orders/:id - получение описания заказа пользователя
- GET http://localhost:3000/api/v1/orders - получение описания всех заказов пользователя

Также указанные эдпоинты доступны по адресам:

- GET https://apivirtualmachines2.students.nomoredomains.icu/api/v1 - стартовая страница
- POST https://apivirtualmachines2.students.nomoredomains.icu/api/v1/users - регистрация пользователя
- POST https://apivirtualmachines2.students.nomoredomains.icu/api/v1/login - авторизация пользователя (вход)
- GET https://apivirtualmachines2.students.nomoredomains.icu/api/v1/logout - выход пользователя
- POST https://apivirtualmachines2.students.nomoredomains.icu/api/v1/orders - размещение заказа на создание ВМ
- GET https://apivirtualmachines2.students.nomoredomains.icu/api/v1/orders/:id/status - получение информации о статусе заказа ВМ
- GET https://apivirtualmachines2.students.nomoredomains.icu/api/v1/orders/:id - получение описания заказа пользователя
- GET https://apivirtualmachines2.students.nomoredomains.icu/api/v1/orders - получение описания всех заказов пользователя


## Запуск приложнеия
Для начала необоходимо установить Docker на свой компьютер и клонировать проект API_Virtual_Machines.

Клонировать проект:
```
git clone https://github.com/SergeyMMedvedev/API_Virtual_Machines.git

Папка с проектом называется API_Virtual_Machines.
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
SUPERUSER_NAME=Admin123
SUPERUSER_PASSWORD=Admin123
SUPERUSER_SATUS=1

USER2_NAME=username2
USER2_PASSWORD=username2
USER2_SATUS=2

USER3_NAME=username3
USER3_PASSWORD=username3
USER3_SATUS=3

PORT=3000

PASSPORT_SECRET_KEY=jwtasdfasfasdfasdfasdfasfasdf

DB_SCHEMA=postgres
DB_USER=postgres
DB_PASSWORD=postgres
DB_PORT=5432


POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
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

POST  - http://localhost:3000/api/v1/users

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

POST http://localhost:3000/api/v1/login

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

GET http://localhost:3000/api/v1/logout

Пример ответа:
```
{
    "message": "logout success"
}
```

### 4. Размещение заказа на создание ВМ

Права доступа: **статус "1" и "3"**.

POST http://localhost:3000/api/v1/orders 

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

GET http://localhost:3000/api/v1/orders/1/status

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

GET http://localhost:3000/api/v1/orders/:id

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

### 7. Получение описания всех заказов пользователя

Права доступа: **статус "1" и "3"**.

GET http://localhost:3000/api/v1/orders

Пример ответа:
```
{
    "data": [
        {
            "orderNumber": 1,
            "vCPU": 2,
            "vRAM": 2,
            "vHDD": 1,
            "createdAt": "2021-05-17T11:00:06.937Z"
        },
        {
            "orderNumber": 2,
            "vCPU": 2,
            "vRAM": 2,
            "vHDD": 1,
            "createdAt": "2021-05-17T11:00:15.847Z"
        },
        {
            "orderNumber": 3,
            "vCPU": 2,
            "vRAM": 2,
            "vHDD": 1,
            "createdAt": "2021-05-17T11:00:20.215Z"
        },
        {
            "orderNumber": 4,
            "vCPU": 2,
            "vRAM": 2,
            "vHDD": 1,
            "createdAt": "2021-05-17T11:14:15.132Z"
        }
    ]
}
```

## Тесты

Для запуска тестов необходимо создать отдельную юазу данных для тестов. 
Для этого выполнить следующие команды:
```
psql -d postgres -U postgres

ввести пароль:
password: postgres      (POSTGRES_PASSWORD из файла .env)
CREATE DATABASE test;

выйти из psql:
ctrl + c или ввести quit
```
Запуск тестов:

```
docker-compose run apivirtualmachines npm run test
```

Тесты осуществляют следующие проверки:

  * Создаются пользователи в базе данных

    √ Создается пользователь 1: { name: 'Admin123', password: 'Admin123', status: '1' } (82 ms)

    √ Создается пользователь 2: { name: 'username2', password: 'username2', status: '2' } (72 ms)

    √ Создается пользователь 3: { name: 'username3', password: 'username3', status: '3' } (73 ms)

  * Доступ к главной странице

    √ GET "/" должен возвращать "Welcome to API home page!" и корректный статус (28 ms)

  * Авторизация

    √ POST "/login": Пользователь 1 может выполинть вход (100 ms)

    √ POST "/login": Имя должно содрежать минимум 2 символа (14 ms)

    √ POST "/login": Имя должно содрежать максимум 50 символов (13 ms)

    √ POST "/login": Имя не может состоянть из одних пробелов (11 ms)

    √ POST "/login": Пароль минимум 6 символов (11 ms)

    √ POST "/login": Ошибка при вводе несоответствующего имени (14 ms)

    √ POST "/login": Ошибка при вводе несоответствующего пароля (81 ms)

    √ GET "/logout": Пользователь может выйти из системы (11 ms)

  * Защита авторизацией

    √ POST "/users": регистрация пользователя защищена (10 ms)

    √ POST "/orders": создание заказа защищено (11 ms)

    √ GET "/orders/:id/status": получение информации о состоянии заказа ВМ защищено (9 ms)

    √ GET "/orders/:id": получение описания заказа защищено (9 ms)

    √ GET "/orders": получение описания всех заказов пользователя защищено (10 ms)

  * Регистрация нового пользователя

    √ POST "/users": Пользователь 1 может создать нового пользователя  (173 ms)

    √ POST "/users": При создании пользователя имя должно быть уникально (96 ms)

    √ POST "/users": При создании пользователя имя обязательно (92 ms)

    √ POST "/users": При создании пользователя пароль обязателен (95 ms)

    √ POST "/users": При создании пользователя статус обязателен (93 ms)

    √ POST "/users": При создании пользователя имя должно содержать не менее 2 символов (93 ms)

    √ POST "/users": При создании пользователя имя должно содержать не более 50 символов (92 ms)

    √ POST "/users": При создании пользователя имя не должно содержать только пробелы (92 ms)

    √ POST "/users": При создании пользователя пароль должен содержать не менее 6 символов (92 ms)

    √ POST "/users": При создании пользователя пароль должен содержать не более 80 символов (94 ms)

    √ POST "/users": При создании пользователя статус может принимать только значения "1", "2" и "3" (92 ms)

  * Создание заказа

    √ POST "/orders": Пользователь 1 может создать заказ ВМ  (98 ms)

    √ POST "/orders": При создании заказа vCPU обязательно  (91 ms)

    √ POST "/orders": При создании заказа vRAM обязательно  (93 ms)

    √ POST "/orders": При создании заказа vHDD обязательно  (94 ms)

    √ POST "/orders": При создании заказа vCPU принимает только целые положительные числа  (92 ms)

    √ POST "/orders": При создании заказа vCPU принимает положительные числа не менне 2 (93 ms)

    √ POST "/orders": При создании заказа vCPU принимает положительные числа не более 80 (96 ms)

    √ POST "/orders": При создании заказа vRAM принимает только целые положительные числа  (93 ms)

    √ POST "/orders": При создании заказа vRAM принимает положительные числа не менне 2 (96 ms)

    √ POST "/orders": При создании заказа vRAM принимает положительные числа не более 640 (96 ms)

    √ POST "/orders": При создании заказа vHDD принимает только целые положительные числа  (91 ms)

    √ POST "/orders": При создании заказа vHDD принимает положительные числа не менне 1 (93 ms)

    √ POST "/orders": При создании заказа vHDD принимает положительные числа не более 8192 (98 ms)

    √ POST "/orders": При создании заказа не принимаются отрицательные или дробные числа (90 ms)

  * Получение данных о заказе

    √ POST "/orders": Пользователь 1 создает второй заказ  (93 ms)

    √ POST "/orders": Пользователь 3 создает  заказ  (176 ms)

    √ GET "/orders": Пользователь 1 может получить информацию о своих заказах (97 ms)

    √ GET "/orders/:id": Пользователь 1 может получить информацию об одном заказе (94 ms)

    √ GET "/orders/:id": Пользователь 1 не может получить информацию о чужом заказе (92 ms)

    √ GET "/orders/:id": Пользователь 1 не может получить информацию о несуществующем заказе (94 ms)
    
    √ GET "/orders/:id": Для получения информации о заказе можно передавать только целое положительное число (93 ms)

    √ GET "/orders/:id/status": Пользователь 1 может получить информацию о статусе заказа (96 ms)

  * Ограничения прав пользователя со статусом 2

    √ POST "/users": Пользователь 2 не может регистрировать пользователей (97 ms)

    √ POST "/orders": Пользователь 2 не может создавать заказы (94 ms)

    √ GET "/orders/:id/status": Пользователь 2 не может получать статус заказов (91 ms)

    √ GET "/orders/:id": Пользователь 2 не может получат описания заказа (91 ms)

    √ GET "/orders": Пользователь 2 не может получат описания заказов (94 ms)

    √ GET "/logout": Пользователь 2 может выйти (97 ms)

  * Ограничения прав пользователя со статусом 3

    √ POST "/users": Пользователь 3 не может регистрировать пользователей (93 ms)













