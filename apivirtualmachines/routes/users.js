const router = require('express').Router();

const {
    getLogin,
    postLogin,
    getLogout,
    getAllUsers,
    getUser,
    createUser,
    deleteUser,
    authrequired,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const checkSuperStatus = require('../middlewares/check-super-status');
const checkStatus = require('../middlewares/check-status');
const { validateUserBody, validateAuthentication } = require('../middlewares/validations');

router.get('/login', getLogin);

router.get('/logout', getLogout);

router.post('/login', validateAuthentication, postLogin);

router.use(auth);

router.use(checkStatus);

router.get('/users/all', getAllUsers);

router.get('/users/:id', getUser);

router.post('/users', validateUserBody, checkSuperStatus, createUser);

router.delete('/users/:id', deleteUser);

router.get('/authrequired', authrequired);

module.exports = router;
