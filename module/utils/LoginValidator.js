const Joi = require("joi");

const LoginValidator = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).max(255).required(),
});

module.exports = LoginValidator;
