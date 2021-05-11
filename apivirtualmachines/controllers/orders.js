const db = require('../database');

const BadRequestError = require('../errors/bad-request-error');

const {
    requireOrderData,
} = require('../utils/messeges');

module.exports.getAllOrders = (req, res, next) => {
    db.Order.findAll()
        .then((orders) => {
            res.status(200).send({ data: orders });
        })
        .catch(next);
};

module.exports.getOrders = (req, res, next) => {
    db.Order.findAll({ where: { UserId: req.user.id } })
        .then((orders) => {
            res.status(200).send({ data: orders });
        })
        .catch(next);
};

module.exports.getOrder = (req, res, next) => {
    db.Order.findByPk(req.params.id)
        .then((order) => {
            res.status(200).send({ data: order });
        })
        .catch(next);
};

module.exports.getOrderStatus = (req, res, next) => {
    db.Order.findByPk(req.params.id)
        .then((order) => {
            res.status(200).send({ data: { status: order.status } });
        })
        .catch(next);
};

module.exports.createOrder = (req, res, next) => {
    const { vCPU, vRAM, vHDD } = req.body;

    if (!vCPU || !vRAM || !vHDD) {
        throw new BadRequestError(requireOrderData);
    }

    console.log('req.user.id', req.user.id);

    db.Order.create({
        vCPU,
        vRAM,
        vHDD,
        UserId: req.user.id,
    })
        .then((order) => {
            res.status(201).send({ data: order });
        })
        .catch(next);
    // .catch((err) => res.status(500).send({ data: err }));
};
