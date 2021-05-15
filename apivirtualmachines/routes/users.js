const router = require('express').Router();

const {
    getAllUsers,

    postLogin,
    getLogout,
    createUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const checkSuperStatus = require('../middlewares/check-super-status');
const checkStatus = require('../middlewares/check-status');
const { validateUserBody, validateAuthentication } = require('../middlewares/validations');

router.get('/logout', getLogout);

router.post('/login', validateAuthentication, postLogin);

router.get('/users/all', getAllUsers);

router.use(auth);

router.use(checkStatus);

router.post('/users', validateUserBody, checkSuperStatus, createUser);

module.exports = router;
