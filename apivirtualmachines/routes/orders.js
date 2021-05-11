const router = require('express').Router();

const {
    getAllOrders,
    getOrders,
    getOrder,
    getOrderStatus,
    createOrder,
} = require('../controllers/orders');
const { validateOrder } = require('../middlewares/validations');

router.get('/orders/all', getAllOrders);

router.get('/orders', getOrders);

router.post('/orders', validateOrder, createOrder);

router.get('/orders/:id', getOrder);

router.get('/orders/:id/status', getOrderStatus);

module.exports = router;
