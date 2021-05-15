const supertest = require('supertest');
const app = require('../app.js');
const db = require('../database');
const request = supertest(app);
const bcrypt = require('bcrypt');
require('dotenv').config();
const api = require('../routes/users');

beforeAll(async () => {
    await db.sequelize.sync();
});

const {
    SUPERUSER_NAME,
    SUPERUSER_PASSWORD,
    SUPERUSER_SATUS,

    USER2_NAME,
    USER2_PASSWORD,
    USER2_SATUS,

    USER3_NAME,
    USER3_PASSWORD,
    USER3_SATUS,
} = process.env;


// test(`Создается пользователь {
//     name: 'admin1',
//     password: 'password',
//     status: '1',
// }`, async () => {
//     expect.assertions(1);
//     hash = await bcrypt.hash('password', 10);
//     const user = await db.User.create({
//         name: 'admin1',
//         password: hash,
//         status: '1',
//     });
//     expect(user.id).toEqual(1);
// });

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
    it(`GET "/users/all" `, () => request.get('/users/all').then((response) => {
        expect(response.status).toBe(200);
    }));

    it('POST "/login": Пользователь 1 может выполинть вход', () =>
        request
            .post('/login')
            .send({
                "name": SUPERUSER_NAME,
                "password": SUPERUSER_PASSWORD
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
                "password": SUPERUSER_PASSWORD
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
                "password": SUPERUSER_PASSWORD
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
                "password": SUPERUSER_PASSWORD
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
                "name": SUPERUSER_NAME,
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
                "password": SUPERUSER_PASSWORD
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
                "name": SUPERUSER_NAME,
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

describe('Возможности пользователя со статусом 1', () => {

    let session = null;



    it(`GET "/users/all" `, async () => {
        const response = await request.get('/users/all');
        expect(response.status).toBe(200);
    });

    beforeEach(async () => {
        const response = await request
            .post('/login')
            .send({
                "name": SUPERUSER_NAME,
                "password": SUPERUSER_PASSWORD
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

      it(`GET "/users/all" `, () => request.get('/users/all').then((response) => {
        expect(response.status).toBe(200);
    }));

    it(`POST "/login" `, async () => {

        // await db.User.destroy({ where: { name: 'newUser' } });

        let response = await request.get('/users/all')
        console.log(response.body)

        response = await request
            .post('/users')
            .send({
                "name": "newUser",
                "password": "newUser",
                "status": "3"
            })
            .set('Cookie', session)
        console.log(response.body)
        expect(response.status).toBe(201);
        expect(response.headers['content-type']).toMatch('application/json');
        expect(response.body.data.name).toBe('newUser');
        expect(response.body.data.status).toBe('3');
        await db.User.destroy({ where: { name: 'newUser' } });

        response = await request.get('/users/all')
        console.log(response.body)
    });






    // test('POST "/users": Пользователь 1 может зарегистрировать нового пользователя', async () => {
    //     try {
    //         await request
    //         .post('/login')
    //         .send({
    //             "name": SUPERUSER_NAME,
    //             "password": SUPERUSER_PASSWORD
    //         })
    //         .set({ 'content-type': 'application/json' })
    //         expect(response.status).toBe(400);

    //         const response = await request
    //         .post('/users')
    //         .send({
    //             "name": "newUser",
    //             "password": "newUser",
    //             "status": "3"
    //         })
    //         console.log(response.body)
    //         expect(response.status).toBe(201);
    //         expect(response.headers['content-type']).toMatch('application/json');
    //         expect(response.body.data).toBe('11Incorrect name or password');
    //     } catch(e) {
    //         {console.log(e)}
    //     }
    // })
});

afterAll(async () => {

    await db.sequelize.close();
});


