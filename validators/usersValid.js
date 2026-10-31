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

      password: Joi.string()
        .min(8)
        .pattern(
          new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"),
        )
        .required()
        .messages({
          "string.min": "Password must be at least 8 characters long",
          "string.pattern.base":
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)",
          "any.required": "Password is required",
        }),
    }),
  },
};

module.exports = usersValidation;
