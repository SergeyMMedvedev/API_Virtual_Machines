const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
    message: {
        message: 'Request limit exceeded. Please try again later.',
    },
});

module.exports = limiter;
