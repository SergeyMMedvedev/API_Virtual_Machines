const router = require('express').Router();

const usersRouter = require('./users');
const ordersRouter = require('./orders');
const { notFound } = require('../utils/messeges');

router.use(
    usersRouter,
    ordersRouter,
);

router.use('*', (req, res) => {
    res.status(404).send({ message: notFound });
});

module.exports = router;
