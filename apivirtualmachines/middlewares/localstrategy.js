const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const db = require('../database');
const UnauthorizedError = require('../errors/unauthorized-error');
const { incorrectNameOrPassword } = require('../utils/messeges');

module.exports = new LocalStrategy(
    { usernameField: 'name' },
    (name, password, done) => {
        console.log('Inside local strategy callback');
        // here is where you make a call to the database
        // to find the user based on their username or email address
        // for now, we'll just pretend we found that it was users[0]

        // const user = users[0];
        // if (email === user.email && password === user.password) {
        //     console.log('Local strategy returned true');
        //     return done(null, user);
        // }

        db.User.findOne({ where: { name } }).then((user) => {
            if (!user) {
                throw new UnauthorizedError(incorrectNameOrPassword);
            }
            return bcrypt.compare(password, user.password)
                .then((matched) => {
                    if (!matched) {
                        throw new UnauthorizedError(incorrectNameOrPassword);
                    }
                    console.log('Local strategy returned true');
                    return done(null, user);
                })
                .catch((error) => done(error));
        }).catch((error) => done(error));
    },
);
