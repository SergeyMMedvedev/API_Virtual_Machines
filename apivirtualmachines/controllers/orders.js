const db = require('../database');

const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error.js');
const {
    requireOrderData,
    orderNotFound,
    notOwnOrder,
} = require('../utils/messeges');

module.exports.getOrders = (req, res, next) => {
    db.Order.findAll({
        attributes: ['orderNumber', 'vCPU', 'vRAM', 'vHDD', 'createdAt'],
        where: { UserId: req.user.id },
    })
        .then((orders) => {
            res.status(200).send({ data: orders });
        })
        .catch(next);
};

module.exports.getOrder = (req, res, next) => {
    db.Order.findByPk(req.params.id)
        .then((order) => {
            if (!order) {
                throw new NotFoundError(orderNotFound);
            }
            if (order.UserId !== req.user.id) {
                throw new ForbiddenError(notOwnOrder);
            }
            res.status(200).send({
                data: {
                    orderNumber: order.orderNumber,
                    vCPU: order.vCPU,
                    vRAM: order.vRAM,
                    vHDD: order.vHDD,
                    createdAt: order.createdAt,
                },
            });
        })
        .catch(next);
};

module.exports.getOrderStatus = (req, res, next) => {
    db.Order.findByPk(req.params.id)
        .then((order) => {
            if (!order) {
                throw new NotFoundError(orderNotFound);
            }
            if (order.UserId !== req.user.id) {
                throw new ForbiddenError(notOwnOrder);
            }
            res.status(200).send({
                data: {
                    orderNumber: order.orderNumber,
                    status: order.status,
                },
            });
        })
        .catch(next);
};

module.exports.createOrder = (req, res, next) => {
    const { vCPU, vRAM, vHDD } = req.body;

    if (!vCPU || !vRAM || !vHDD) {
        throw new BadRequestError(requireOrderData);
    }

    db.Order.create({
        vCPU,
        vRAM,
        vHDD,
        UserId: req.user.id,
    })
        .then((order) => {
            res.status(201).send({
                data: {
                    orderNumber: order.orderNumber,
                    vCPU: order.vCPU,
                    vRAM: order.vRAM,
                    vHDD: order.vHDD,
                    createdAt: order.createdAt,
                },
            });
        })
        .catch(next);
};
