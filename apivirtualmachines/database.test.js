const db = require('./database');

beforeAll(async () => {
    await db.sequelize.sync({ force: true });
});

test('create user', async () => {
    expect.assertions(1);
    const user = await db.User.create({
        id: 1,
        firstName: 'Bobbie',
        lastName: 'Draper',
        lastName2: 'Draper2',
    });
    expect(user.id).toEqual(1);
});

test('get user', async () => {
    expect.assertions(3);
    const user = await db.User.findByPk(1);
    expect(user.firstName).toEqual('Bobbie');
    expect(user.lastName).toEqual('Draper');
    expect(user.lastName2).toEqual('Draper2');
});

test('delete user', async () => {
    expect.assertions(1);
    await db.User.destroy({
        where: {
            id: 1
        }
    });
    const user = await db.User.findByPk(1);
    expect(user).toBeNull();
});

afterAll(async () => {
    await db.sequelize.close();
});
