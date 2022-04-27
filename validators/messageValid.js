const Joi = require('joi');

const messageValidation = {
     messageVal : {
         body: Joi.object({
            name: Joi.string().required(),
            email: Joi.string().lowercase() 
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
            message: Joi.string().required()
         })
     }
}

module.exports = messageValidation;