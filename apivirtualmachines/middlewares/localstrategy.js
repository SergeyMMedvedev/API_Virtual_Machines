const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const db = require('../database');
const UnauthorizedError = require('../errors/unauthorized-error');
const { incorrectNameOrPassword } = require('../utils/messeges');

module.exports = new LocalStrategy(
    { usernameField: 'name' },
    (name, password, done) => {
        db.User.findOne({ where: { name } }).then((user) => {
            if (!user) {
                throw new UnauthorizedError(incorrectNameOrPassword);
            }
            return bcrypt.compare(password, user.password)
                .then((matched) => {
                    if (!matched) {
                        throw new UnauthorizedError(incorrectNameOrPassword);
                    }
                    return done(null, user);
                })
                .catch((error) => done(error));
        }).catch((error) => done(error));
    },
);
