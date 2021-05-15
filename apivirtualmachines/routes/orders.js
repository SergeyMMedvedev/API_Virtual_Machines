const router = require('express').Router();

const {
    getOrders,
    getOrder,
    getOrderStatus,
    createOrder,
} = require('../controllers/orders');
const { validateOrder, validateObjId } = require('../middlewares/validations');

router.get('/orders', getOrders);

router.post('/orders', validateOrder, createOrder);

router.get('/orders/:id', validateObjId, getOrder);

router.get('/orders/:id/status', validateObjId, getOrderStatus);

module.exports = router;
