const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../database');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const {
    requireNamePasswordStatus,
    userAlreadyExist,
} = require('../utils/messeges');

module.exports.getAllUsers = (req, res) => {
    db.User.findAll().then((users) => {
        res.send({ data: users });
    });
};

module.exports.getLogin = (req, res) => {
    res.send('You got the login page!');
};

module.exports.postLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (info) { return res.send(info.message); }
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        return req.login(user, (error) => {
            if (error) { return next(error); }
            return res.send({ message: 'You were authenticated & logged in!' });
        });
    })(req, res, next);
};

module.exports.getLogout = (req, res) => {
    req.logout();
    return res.send({ message: 'logout success' });
};

module.exports.createUser = (req, res, next) => {
    const { name, password, status } = req.body;

    if (!name || !password || !status) {
        throw new BadRequestError(requireNamePasswordStatus);
    }

    db.User.findOne({ where: { name } }).then((user) => {
        if (user) {
            throw new ConflictError(userAlreadyExist);
        }
        bcrypt.hash(password, 10).then((hash) => {
            db.User.create({
                name,
                password: hash,
                status,
            })
                .then((newUser) => {
                    res.status(201).send({
                        data: {
                            id: newUser.id,
                            name: newUser.name,
                            status: newUser.status,
                        },
                    });
                })
                .catch(next);
        });
    })
        .catch(next);
};
