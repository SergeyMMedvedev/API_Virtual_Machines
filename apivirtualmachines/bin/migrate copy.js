const bcrypt = require('bcrypt');
const db = require('../database.js');
require('dotenv').config();

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

async function createSuperUser() {
    let hash = await bcrypt.hash(SUPERUSER_PASSWORD, 10);
    await db.User.create({
        name: SUPERUSER_NAME,
        password: hash,
        status: SUPERUSER_SATUS,
    });
    hash = await bcrypt.hash(USER2_PASSWORD, 10);
    await db.User.create({
        name: USER2_NAME,
        password: hash,
        status: USER2_SATUS,
    });
    hash = await bcrypt.hash(USER3_PASSWORD, 10);
    await db.User.create({
        name: USER3_NAME,
        password: hash,
        status: USER3_SATUS,
    });
}

async function synchronize() {
    await db.sequelize.sync({ force: true });
    createSuperUser();
}
// db.sequelize.sync({ alter: true });

synchronize();

console.log('All models were synchronized successfully.');
