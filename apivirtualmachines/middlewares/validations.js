const { Joi, celebrate } = require('celebrate');
// const validator = require('validator');

// const validateObjId = celebrate({
//     params: Joi.object().keys({
//         id: Joi.string().required().custom((value, helpers) => {
//             if (ObjectId.isValid(value)) {
//                 return value;
//             }
//             return helpers.message('Неверный id');
//         }),
//     }),
// });

const validateUserBody = celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(50).trim()
            .required()
            .messages({
                'string.min': 'поле name должно включать минимум два символа',
                'string.max': 'поле name должно включать не более 50 символов',
                'any.required': 'поле name должно быть заполнено',
            }),
        password: Joi.string().required().min(6)
            .messages({
                'string.min': 'поле name должно включать минимум 6 символов',
                'any.required': 'поле password должно быть заполнено',
            }),
        status: Joi.string().required().custom((value, helpers) => {
            if (['1', '2', '3'].includes(value)) {
                return value;
            }
            return helpers.message('Недопустимый сатус пользователя. Допустимые значения: 1, 2, 3');
        }),
    }),
});

const validateAuthentication = celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(50).trim()
            .required()
            .messages({
                'string.min': 'поле name должно включать минимум два символа',
                'string.max': 'поле name должно включать не более 50 символов',
                'any.required': 'поле name должно быть заполнено',
            }),
        password: Joi.string().required().min(6)
            .messages({
                'string.min': 'поле name должно включать минимум 6 символов',
                'any.required': 'поле password должно быть заполнено',
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
};
