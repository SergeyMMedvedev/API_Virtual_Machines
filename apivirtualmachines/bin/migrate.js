const db = require('../database.js');

db.sequelize.sync({ force: true });

console.log('All models were synchronized successfully.');
