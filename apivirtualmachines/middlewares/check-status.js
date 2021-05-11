const ForbiddenError = require('../errors/forbidden-error');
const { incorrectStatus } = require('../utils/messeges');

module.exports = (req, res, next) => {
    if (req.user.status === '3' || req.user.status === '1') {
        return next();
    }
    throw new ForbiddenError(incorrectStatus);
};
