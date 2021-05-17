const uuid = require('uuid').v4;
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const { errors } = require('celebrate');
const passport = require('passport');
const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');

const routes = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');
const limiter = require('./middlewares/limiter');
const localstrategy = require('./middlewares/localstrategy');
const db = require('./database');
require('dotenv').config();

const { PASSPORT_SECRET_KEY = 'secret_key' } = process.env;

passport.use(localstrategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.User.findByPk(id).then((user) => {
        done(null, user);
    })
        .catch((error) => done(error));
});

const app = express();

app.use(logger('dev'));

app.use(limiter);

app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(session({
    genid: () => uuid(),
    store: new FileStore(),
    secret: PASSPORT_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/api/v1', (req, res) => {
    res.send({
        message: {
            text: 'Welcome to API home page!',
        },
    });
});

app.use(routes);

app.use(errors());

app.use(errorHandler);

module.exports = app;
