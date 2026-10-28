const Joi = require("joi");

const usersValidation = {
  createUpdateUser: {
    body: Joi.object({
      full_name: Joi.string().min(2).max(50).required().messages({
        "string.empty": "Full name cannot be empty",
        "any.required": "Full name is required",
      }),

      email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
      }),

      password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required",
      }),
    }),
  },
};

module.exports = usersValidation;
