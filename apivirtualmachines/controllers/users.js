const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../database');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const {
    requireNamePasswordStatus,
    userAlreadyExist,
} = require('../utils/messeges');

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

module.exports.getAllUsers = (req, res, next) => {
    db.User.findAll({ include: db.Order })
        .then((users) => {
            res.status(200).send({ data: users });
        })
        .catch(next);
};

module.exports.getUser = (req, res) => {
    db.User.findByPk(req.params.id)
        .then((user) => {
            res.status(200).send(JSON.stringify(user));
        })
        .catch((err) => {
            res.status(500).send(JSON.stringify(err));
        });
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

module.exports.deleteUser = (req, res) => {
    db.User.destroy({
        where: {
            id: req.params.id,
        },
    })
        .then(() => {
            res.status(204).send();
        })
        .catch((err) => {
            res.status(500).send(JSON.stringify(err));
        });
};

module.exports.authrequired = (req, res) => {
    if (req.isAuthenticated()) {
        res.send({ message: 'you hit the authentication endpoint' });
    } else {
        res.send('you are not authorized\n');
    }
};
