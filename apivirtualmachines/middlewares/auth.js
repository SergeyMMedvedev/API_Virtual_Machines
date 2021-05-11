const UnauthorizedError = require('../errors/unauthorized-error');
const { userNotAuth } = require('../utils/messeges');

module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    throw new UnauthorizedError(userNotAuth);
};
