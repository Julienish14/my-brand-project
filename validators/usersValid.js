const Joi = require('joi');

const usersValidation = {
     createUpdateUser : {
         body: Joi.object({
            full_name: Joi.string().required(),
            email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
            password: Joi.string().min(6).required()
         })
     }
}

module.exports = usersValidation;