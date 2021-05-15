const { Joi, celebrate } = require('celebrate');

const validateObjId = celebrate({
    params: Joi.object().keys({
        id: Joi.number().required(),
    }),
});

const validateUserBody = celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(50).trim()
            .required()
            .messages({
                'string.min': 'name field must contain at least two characters',
                'string.max': 'name field must be no more than 50 characters',
                'any.required': 'name field required',
            }),
        password: Joi.string().required().min(6)
            .messages({
                'string.min': 'password field must contain at least 6 characters',
                'any.required': 'password field required',
            }),
        status: Joi.string().required().custom((value, helpers) => {
            if (['1', '2', '3'].includes(value)) {
                return value;
            }
            return helpers.message('Invalid user status. Valid values: 1, 2, 3');
        }),
    }),
});

const validateAuthentication = celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(50).trim()
            .required()
            .messages({
                'string.min': 'name field must contain at least two characters',
                'string.max': 'name field must be no more than 50 characters',
                'any.required': 'name field required',
            }),
        password: Joi.string().required().min(6)
            .messages({
                'string.min': 'password field must contain at least 6 characters',
                'any.required': 'password field required',
            }),
    }),
});

const validateOrder = celebrate({
    body: Joi.object().keys({
        vCPU: Joi.number().integer().greater(1).less(81)
            .required()
            .messages({
                'number.greater': 'the number of vCPUs must be at least 2',
                'number.less': 'the number of vCPUs must be no more than 80',
                'any.required': 'vCPU field required',
            }),
        vRAM: Joi.number().integer().greater(1).less(641)
            .required()
            .messages({
                'number.greater': 'the number of vRAMs must be at least 2',
                'number.less': 'the number of vRAMs must be no more than 640',
                'any.required': 'vRAM field required',
            }),
        vHDD: Joi.number().integer().greater(0).less(8193)
            .required()
            .messages({
                'number.greater': 'the number of vHDDs must be at least 1',
                'number.less': 'the number of vHDDs must be no more than 8192',
                'any.required': 'vHDD field required',
            }),
    }),
});

module.exports = {
    validateUserBody,
    validateAuthentication,
    validateOrder,
    validateObjId,
};
