const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_SCHEMA || 'postgres',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        dialectOptions: {
            ssl: process.env.DB_SSL === 'true',
        },
        logging: false,
    });
const User = sequelize.define('User', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [2, 50],
        },
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [6, 100],
        },
    },
    status: {
        type: Sequelize.ENUM,
        values: ['1', '2', '3'],
        allowNull: false,
        defaultValue: '2',
    },
});

const Order = sequelize.define('Order', {
    orderNumber: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    vCPU: {
        type: Sequelize.REAL,
        allowNull: false,
        minValue: 2,
        maxValue: 80,
    },
    vRAM: {
        type: Sequelize.REAL,
        allowNull: false,
        minValue: 2,
        maxValue: 640,
    },
    vHDD: {
        type: Sequelize.REAL,
        allowNull: false,
        minValue: 1,
        maxValue: 8192,
    },
    status: {
        type: Sequelize.ENUM,
        values: ['done', 'in progress'],
        allowNull: false,
        defaultValue: 'in progress',
    },
});
User.hasMany(Order, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Order.belongsTo(User);

module.exports = {
    sequelize,
    User,
    Order,
};
