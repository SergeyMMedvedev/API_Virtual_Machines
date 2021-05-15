const supertest = require('supertest');
const app = require('../app.js');
const db = require('../database');
const request = supertest(app);
const bcrypt = require('bcrypt');
require('dotenv').config();
const api = require('../routes/users');

beforeAll(async () => {
    await db.sequelize.sync({ force: true });
});

describe('Создаются пользователи в базе данных', () => {
    test(`Создается пользователь 1: { name: 'Admin123', password: 'Admin123', status: '1' }`, async () => {
        expect.assertions(1);
        hash = await bcrypt.hash('Admin123', 10);
        const user = await db.User.create({
            name: 'Admin123',
            password: hash,
            status: '1',
        });
        expect(user.id).toEqual(1);
    });

    test(`Создается пользователь 2: { name: 'username2', password: 'username2', status: '2' }`, async () => {
        expect.assertions(1);
        hash = await bcrypt.hash('username2', 10);
        const user = await db.User.create({
            name: 'username2',
            password: hash,
            status: '2',
        });
        expect(user.id).toEqual(2);
    });

    test(`Создается пользователь 3: { name: 'username3', password: 'username3', status: '3' }`, async () => {
        expect.assertions(1);
        hash = await bcrypt.hash('username3', 10);
        const user = await db.User.create({
            name: 'username3',
            password: hash,
            status: '3',
        });
        expect(user.id).toEqual(3);
    });
});




function randomString(i) {
    var rnd = '';
    while (rnd.length < i)
        rnd += Math.random().toString(36).substring(2);
    return rnd.substring(0, i);
};

describe('Доступ к главной странице', () => {
    it(`GET "/" должен возвращать "Welcome to API home page!" и корректный статус`, () => request.get('/').then((response) => {
        expect(response.status).toBe(200);
        expect(response.body.message.text).toBe("Welcome to API home page!");
    }));
});

describe('Авторизация', () => {
    it('POST "/login": Пользователь 1 может выполинть вход', () =>
        request
            .post('/login')
            .send({
                "name": "Admin123",
                "password": "Admin123"
            })
            .set({ 'content-type': 'application/json' })
            .then((response) => {
                expect(response.status).toBe(200);
                expect(response.headers['content-type']).toMatch('application/json');
                expect(response.body.message).toBe('You were authenticated & logged in!');
            }));
    it('POST "/login": Имя должно содрежать минимум 2 символа', () =>
        request
            .post('/login')
            .send({
                "name": "a",
                "password": "Admin123"
            })
            .set({ 'content-type': 'application/json' })
            .then((response) => {
                expect(response.status).toBe(400);
                expect(response.headers['content-type']).toMatch('application/json');
                expect(response.body.message).toBe('celebrate request validation failed');
                expect(response.body.validation.body.message).toBe('name field must contain at least two characters');
            }));

    it('POST "/login": Имя должно содрежать максимум 50 символов', () =>
        request
            .post('/login')
            .send({
                "name": "0123456789 0123456789 0123456789 0123456789 0123456789 0123456789",
                "password": "Admin123"
            })
            .set({ 'content-type': 'application/json' })
            .then((response) => {
                expect(response.status).toBe(400);
                expect(response.headers['content-type']).toMatch('application/json');
                expect(response.body.message).toBe('celebrate request validation failed');
                expect(response.body.validation.body.message).toBe('name field must be no more than 50 characters');
            }));


    it('POST "/login": Имя не может состоянть из одних пробелов', () =>
        request
            .post('/login')
            .send({
                "name": '       ',
                "password": "Admin123"
            })
            .set({ 'content-type': 'application/json' })
            .then((response) => {
                expect(response.status).toBe(400);
                expect(response.headers['content-type']).toMatch('application/json');
                expect(response.body.message).toBe('celebrate request validation failed');
                expect(response.body.validation.body.message).toBe("\"name\" is not allowed to be empty");
            }));

    it('POST "/login": Пароль минимум 6 символов', () =>
        request
            .post('/login')
            .send({
                "name": "Admin123",
                "password": "a"
            })
            .set({ 'content-type': 'application/json' })
            .then((response) => {
                expect(response.status).toBe(400);
                expect(response.headers['content-type']).toMatch('application/json');
                expect(response.body.message).toBe('celebrate request validation failed');
                expect(response.body.validation.body.message).toBe('password field must contain at least 6 characters');
            }));


    it('POST "/login": Ошибка при вводе несоответствующего имени', () =>
        request
            .post('/login')
            .send({
                "name": randomString(10),
                "password": "Admin123"
            })
            .set({ 'content-type': 'application/json' })
            .then((response) => {
                expect(response.status).toBe(401);
                expect(response.headers['content-type']).toMatch('application/json');
                expect(response.body.message).toBe('Incorrect name or password');
            }));

    it('POST "/login": Ошибка при вводе несоответствующего пароля', () =>
        request
            .post('/login')
            .send({
                "name": "Admin123",
                "password": randomString(10)
            })
            .set({ 'content-type': 'application/json' })
            .then((response) => {
                expect(response.status).toBe(401);
                expect(response.headers['content-type']).toMatch('application/json');
                expect(response.body.message).toBe('Incorrect name or password');
            }));

    it('GET "/logout": Пользователь может выйти из системы', () =>
        request
            .get('/logout')
            .then((response) => {
                expect(response.status).toBe(200);
                expect(response.headers['content-type']).toMatch('application/json');
                expect(response.body.message).toBe('logout success');
            }));
});


describe('Защита авторизацией', () => {
    it(`POST "/users": регистрация пользователя защищена`, async () => {
        response = await request
            .post('/users')
            .send({
                "name": "newUser2",
                "password": "newUser2",
                "status": "3"
            })
        expect(response.status).toBe(401);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.message).toBe("Authorization required");
    });

    it(`POST "/orders": создание заказа защищено`, async () => {
        response = await request
            .post('/orders')
            .send({
                "vCPU": 2,
                "vRAM": 1,
                "vHDD": 123
            })
        expect(response.status).toBe(401);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.message).toBe("Authorization required");
    });

    it(`GET "/orders/:id/status": получение информации о состоянии заказа ВМ защищено`, async () => {
        response = await request
            .get('/orders/1/status')
        expect(response.status).toBe(401);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.message).toBe("Authorization required");
    });

    it(`GET "/orders/:id": получение описания заказа защищено`, async () => {
        response = await request
            .get('/orders/1')
        expect(response.status).toBe(401);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.message).toBe("Authorization required");
    });

    it(`GET "/orders": получение описания всех заказов пользователя защищено`, async () => {
        response = await request
            .get('/orders')
        expect(response.status).toBe(401);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.message).toBe("Authorization required");
    });
});


describe('Регистрация нового пользователя', () => {
    let session = null;
    beforeEach(async () => {
        const response = await request
            .post('/login')
            .send({
                "name": "Admin123",
                "password": "Admin123"
            })
            .set({ 'content-type': 'application/json' })
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.message).toBe('You were authenticated & logged in!');
        session = response
            .headers['set-cookie'][0]
            .split(',')
            .map(item => item.split(';')[0])
            .join(';')
    });

    it(`POST "/users": Пользователь 1 может создать нового пользователя `, async () => {
        response = await request
            .post('/users')
            .send({
                "name": "newUser",
                "password": "newUser",
                "status": "3"
            })
            .set('Cookie', session)
        expect(response.status).toBe(201);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.data.name).toBe('newUser');
        expect(response.body.data.status).toBe('3');
    });

    it(`POST "/users": При создании пользователя имя должно быть уникально`, async () => {
        response = await request
            .post('/users')
            .send({
                "name": "newUser",
                "password": "newUser",
                "status": "3"
            })
            .set('Cookie', session)

        expect(response.status).toBe(409);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.message).toBe("A user with this name already exists");
    });

    it(`POST "/users": При создании пользователя имя обязательно`, async () => {
        response = await request
            .post('/users')
            .send({
                "name": "",
                "password": "newUser",
                "status": "3"
            })
            .set('Cookie', session)

        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.validation.body.message).toBe("\"name\" is not allowed to be empty");
    });

    it(`POST "/users": При создании пользователя пароль обязателен`, async () => {
        response = await request
            .post('/users')
            .send({
                "name": "newUser2",
                "password": "",
                "status": "3"
            })
            .set('Cookie', session)

        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.validation.body.message).toBe("\"password\" is not allowed to be empty");
    });

    it(`POST "/users": При создании пользователя статус обязателен`, async () => {
        response = await request
            .post('/users')
            .send({
                "name": "newUser2",
                "password": "newUser2",
                "status": ""
            })
            .set('Cookie', session)

        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.validation.body.message).toBe("\"status\" is not allowed to be empty");
    });

    it(`POST "/users": При создании пользователя имя должно содержать не менее 2 символов`, async () => {
        response = await request
            .post('/users')
            .send({
                "name": "n",
                "password": "newUser2",
                "status": "3"
            })
            .set('Cookie', session)

        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.validation.body.message).toBe("name field must contain at least two characters");
    });

    it(`POST "/users": При создании пользователя имя должно содержать не более 50 символов`, async () => {
        response = await request
            .post('/users')
            .send({
                "name": "012345678901234567890123456789012345678901234567890123456789",
                "password": "newUser2",
                "status": "3"
            })
            .set('Cookie', session)

        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.validation.body.message).toBe("name field must be no more than 50 characters");
    });

    it(`POST "/users": При создании пользователя имя не должно содержать только пробелы`, async () => {
        response = await request
            .post('/users')
            .send({
                "name": "    ",
                "password": "newUser2",
                "status": "3"
            })
            .set('Cookie', session)

        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.validation.body.message).toBe("\"name\" is not allowed to be empty");
    });

    it(`POST "/users": При создании пользователя пароль должен содержать не менее 6 символов`, async () => {
        response = await request
            .post('/users')
            .send({
                "name": "newUser2",
                "password": "n",
                "status": "3"
            })
            .set('Cookie', session)

        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.validation.body.message).toBe("password field must contain at least 6 characters");
    });

    it(`POST "/users": При создании пользователя пароль должен содержать не более 80 символов`, async () => {
        response = await request
            .post('/users')
            .send({
                "name": "newUser2",
                "password": "012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789",
                "status": "3"
            })
            .set('Cookie', session)

        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.validation.body.message).toBe("password field must be no more than 80 characters");
    });

    it(`POST "/users": При создании пользователя статус может принимать только значения "1", "2" и "3"`, async () => {
        response = await request
            .post('/users')
            .send({
                "name": "newUser2",
                "password": "newUser2",
                "status": "4"
            })
            .set('Cookie', session)

        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.validation.body.message).toBe("Invalid user status. Valid values: 1, 2, 3");
    });
});














describe('Создание заказа', () => {
    let session = null;
    beforeEach(async () => {
        const response = await request
            .post('/login')
            .send({
                "name": "Admin123",
                "password": "Admin123"
            })
            .set({ 'content-type': 'application/json' })
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.message).toBe('You were authenticated & logged in!');
        session = response
            .headers['set-cookie'][0]
            .split(',')
            .map(item => item.split(';')[0])
            .join(';')
    });

    it(`POST "/orders": Пользователь 1 может создать заказ ВМ `, async () => {
        response = await request
            .post('/orders')
            .send({
                "vCPU": 2,
                "vRAM": 2,
                "vHDD": 2
            })
            .set('Cookie', session)
        expect(response.status).toBe(201);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.data.orderNumber).toBe(1);
        expect(response.body.data.vCPU).toBe(2);
        expect(response.body.data.vRAM).toBe(2);
        expect(response.body.data.vHDD).toBe(2);
    });

    it(`POST "/orders": При создании заказа vCPU обязательно `, async () => {
        response = await request
            .post('/orders')
            .send({
                "vRAM": 2,
                "vHDD": 2
            })
            .set('Cookie', session)
        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.validation.body.message).toBe("vCPU field required");
    });

    it(`POST "/orders": При создании заказа vRAM обязательно `, async () => {
        response = await request
            .post('/orders')
            .send({
                "vCPU": 2,
                "vHDD": 2
            })
            .set('Cookie', session)
        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.validation.body.message).toBe("vRAM field required");
    });

    it(`POST "/orders": При создании заказа vHDD обязательно `, async () => {
        response = await request
            .post('/orders')
            .send({
                "vCPU": 2,
                "vRAM": 2
            })
            .set('Cookie', session)
        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.validation.body.message).toBe("vHDD field required");
    });

    it(`POST "/orders": При создании заказа vCPU принимает только целые положительные числа `, async () => {
        response = await request
            .post('/orders')
            .send({
                "vCPU": "a",
                "vRAM": 2,
                "vHDD": 2
            })
            .set('Cookie', session)
        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.validation.body.message).toBe("\"vCPU\" must be a number");
    });

    it(`POST "/orders": При создании заказа vCPU принимает положительные числа не менне 2`, async () => {
        response = await request
            .post('/orders')
            .send({
                "vCPU": 1,
                "vRAM": 2,
                "vHDD": 2
            })
            .set('Cookie', session)
        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.validation.body.message).toBe("the number of vCPUs must be at least 2");
    });

    it(`POST "/orders": При создании заказа vCPU принимает положительные числа не более 80`, async () => {
        response = await request
            .post('/orders')
            .send({
                "vCPU": 81,
                "vRAM": 2,
                "vHDD": 2
            })
            .set('Cookie', session)
        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.validation.body.message).toBe("the number of vCPUs must be no more than 80");
    });




    it(`POST "/orders": При создании заказа vRAM принимает только целые положительные числа `, async () => {
        response = await request
            .post('/orders')
            .send({
                "vCPU": 2,
                "vRAM": "sdf",
                "vHDD": 2
            })
            .set('Cookie', session)
        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.validation.body.message).toBe("\"vRAM\" must be a number");
    });

    it(`POST "/orders": При создании заказа vRAM принимает положительные числа не менне 2`, async () => {
        response = await request
            .post('/orders')
            .send({
                "vCPU": 2,
                "vRAM": 1,
                "vHDD": 2
            })
            .set('Cookie', session)
        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.validation.body.message).toBe("the number of vRAMs must be at least 2");
    });

    it(`POST "/orders": При создании заказа vRAM принимает положительные числа не более 640`, async () => {
        response = await request
            .post('/orders')
            .send({
                "vCPU": 2,
                "vRAM": 641,
                "vHDD": 2
            })
            .set('Cookie', session)
        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.validation.body.message).toBe("the number of vRAMs must be no more than 640");
    });



    it(`POST "/orders": При создании заказа vHDD принимает только целые положительные числа `, async () => {
        response = await request
            .post('/orders')
            .send({
                "vCPU": 2,
                "vRAM": 2,
                "vHDD": "sdfas"
            })
            .set('Cookie', session)
        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.validation.body.message).toBe("\"vHDD\" must be a number");
    });

    it(`POST "/orders": При создании заказа vHDD принимает положительные числа не менне 1`, async () => {
        response = await request
            .post('/orders')
            .send({
                "vCPU": 2,
                "vRAM": 2,
                "vHDD": 0
            })
            .set('Cookie', session)
        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.validation.body.message).toBe("the number of vHDDs must be at least 1");
    });

    it(`POST "/orders": При создании заказа vHDD принимает положительные числа не более 8192`, async () => {
        response = await request
            .post('/orders')
            .send({
                "vCPU": 2,
                "vRAM": 2,
                "vHDD": 8193
            })
            .set('Cookie', session)
        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.validation.body.message).toBe("the number of vHDDs must be no more than 8192");
    });

    it(`POST "/orders": При создании заказа не принимаются отрицательные или дробные числа`, async () => {
        response = await request
            .post('/orders')
            .send({
                "vCPU": 2.5,
                "vRAM": 2.5,
                "vHDD": -2,
            })
            .set('Cookie', session)
        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.validation.body.message).toBe("\"vCPU\" must be an integer");
    });

});






















describe('Получение данных о заказе', () => {
    let session = null;
    beforeEach(async () => {
        const response = await request
            .post('/login')
            .send({
                "name": "Admin123",
                "password": "Admin123"
            })
            .set({ 'content-type': 'application/json' })
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.message).toBe('You were authenticated & logged in!');
        session = response
            .headers['set-cookie'][0]
            .split(',')
            .map(item => item.split(';')[0])
            .join(';')
    });

    it(`POST "/orders": Пользователь 1 создает второй заказ `, async () => {
        response = await request
            .post('/orders')
            .send({
                "vCPU": 3,
                "vRAM": 3,
                "vHDD": 3
            })
            .set('Cookie', session)
        expect(response.status).toBe(201);
    });

    it(`POST "/orders": Пользователь 3 создает  заказ `, async () => {
        let response = await request
            .post('/login')
            .send({
                "name": "username3",
                "password": "username3"
            })
            .set({ 'content-type': 'application/json' })
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.message).toBe('You were authenticated & logged in!');
        session = response
            .headers['set-cookie'][0]
            .split(',')
            .map(item => item.split(';')[0])
            .join(';')

        response = await request
            .post('/orders')
            .send({
                "vCPU": 3,
                "vRAM": 3,
                "vHDD": 3
            })
            .set('Cookie', session)
        expect(response.status).toBe(201);
    });

    it(`GET "/orders": Пользователь 1 может получить информацию о своих заказах`, async () => {
        response = await request
            .get('/orders')
            .set('Cookie', session)
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.data[0].orderNumber).toBe(1);
        expect(response.body.data[1].orderNumber).toBe(2);
        expect(response.body.data.length).toBe(2);
    });

    it(`GET "/orders/:id": Пользователь 1 может получить информацию об одном заказе`, async () => {
        response = await request
            .get('/orders/2')
            .set('Cookie', session)
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.data.orderNumber).toBe(2);
        expect(response.body.data.vCPU).toBe(3);
        expect(response.body.data.vRAM).toBe(3);
        expect(response.body.data.vHDD).toBe(3);
    });

    it(`GET "/orders/:id": Пользователь 1 не может получить информацию о чужом заказе`, async () => {
        response = await request
            .get('/orders/3')
            .set('Cookie', session)
        expect(response.status).toBe(403);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.message).toBe("You do not have an order with the specified number");
    });

    it(`GET "/orders/:id": Пользователь 1 не может получить информацию о несуществующем заказе`, async () => {
        response = await request
            .get('/orders/4')
            .set('Cookie', session)
        expect(response.status).toBe(404);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.message).toBe("Order not found");
    });

    it(`GET "/orders/:id": Для получения информации о заказе можно передавать только целое положительное число`, async () => {
        response = await request
            .get('/orders/asd')
            .set('Cookie', session)
        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.validation.params.message).toBe("\"id\" must be a number");
    });

    it(`GET "/orders/:id/status": Пользователь 1 может получить информацию о статусе заказа`, async () => {
        response = await request
            .get('/orders/1/status')
            .set('Cookie', session)
        console.log(response.body)
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.data.orderNumber).toBe(1);
        expect(response.body.data.status).toBe("in progress");
    });
});

describe('Ограничения прав пользователя со статусом 2', () => {
    let session = null;
    beforeEach(async () => {
        const response = await request
            .post('/login')
            .send({
                "name": "username2",
                "password": "username2"
            })
            .set({ 'content-type': 'application/json' })
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.message).toBe('You were authenticated & logged in!');
        session = response
            .headers['set-cookie'][0]
            .split(',')
            .map(item => item.split(';')[0])
            .join(';')
    });




    it(`POST "/users": Пользователь 2 не может регистрировать пользователей`, async () => {
        response = await request
            .post('/users')
            .send({
                "name": "newUser2",
                "password": "newUser2",
                "status": "3"
            })
            .set('Cookie', session)
        expect(response.status).toBe(403);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.message).toBe("Your status does not allow you to perform an action");
    });

    it(`POST "/orders": Пользователь 2 не может создавать заказы`, async () => {
        response = await request
            .post('/orders')
            .send({
                "vCPU": 2,
                "vRAM": 1,
                "vHDD": 123
            })
            .set('Cookie', session)
        expect(response.status).toBe(403);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.message).toBe("Your status does not allow you to perform an action");
    });

    it(`GET "/orders/:id/status": Пользователь 2 не может получать статус заказов`, async () => {
        response = await request
            .get('/orders/1/status')
            .set('Cookie', session)
        expect(response.status).toBe(403);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.message).toBe("Your status does not allow you to perform an action");
    });

    it(`GET "/orders/:id": Пользователь 2 не может получат описания заказа`, async () => {
        response = await request
            .get('/orders/1')
            .set('Cookie', session)
        expect(response.status).toBe(403);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.message).toBe("Your status does not allow you to perform an action");
    });

    it(`GET "/orders": Пользователь 2 не может получат описания заказов`, async () => {
        response = await request
            .get('/orders')
            .set('Cookie', session)
        expect(response.status).toBe(403);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.message).toBe("Your status does not allow you to perform an action");
    });

    it(`GET "/logout": Пользователь 2 может выйти`, async () => {
        response = await request
            .get('/logout')
            .set('Cookie', session)
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.message).toBe("logout success");
    });










});








describe('Ограничения прав пользователя со статусом 3', () => {
    let session = null;
    beforeEach(async () => {
        const response = await request
            .post('/login')
            .send({
                "name": "username3",
                "password": "username3"
            })
            .set({ 'content-type': 'application/json' })
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.message).toBe('You were authenticated & logged in!');
        session = response
            .headers['set-cookie'][0]
            .split(',')
            .map(item => item.split(';')[0])
            .join(';')
    });

    it(`POST "/users": Пользователь 3 не может регистрировать пользователей`, async () => {
        response = await request
            .post('/users')
            .send({
                "name": "newUser2",
                "password": "newUser2",
                "status": "3"
            })
            .set('Cookie', session)
        expect(response.status).toBe(403);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.message).toBe("Your status does not allow you to perform an action");
    });
});




afterAll(async () => {
    await db.sequelize.close();
});


