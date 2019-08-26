const joi = require('@hapi/joi');

// Register Validation
const registerValidation  = (data) => {
    const registerSchema = {
        username: joi.string()
                     .min(4)
                     .required(),
        password: joi.string()
                     .min(6)
                     .required(),
        repassword: joi.any().valid(joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } }),
        email: joi.string().email()
    };
    return joi.validate(data, registerSchema);
};

// Login Validation
const loginValidation  = (data) => {
    const loginSchema = {
        username: joi.string()
                     .required(),
        password: joi.string()
                     .required()
    };
    return joi.validate(data, loginSchema);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;