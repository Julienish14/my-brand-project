const Joi = require("joi");

const passwordSchema = Joi.string()
  .min(8)
  .pattern(new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
  .messages({
    "string.min": "Password must be at least 8 characters long",
    "string.pattern.base":
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)",
  });

const usersValidation = {
  signUp: {
    body: Joi.object({
      full_name: Joi.string().min(2).max(50).required().messages({
        "string.empty": "Full name cannot be empty",
        "any.required": "Full name is required",
      }),
      email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
      }),
      password: passwordSchema.required().messages({
        "any.required": "Password is required",
      }),
      bio: Joi.string()
        .max(500)
        .allow("")
        .optional()
        .messages({ "string.max": "Bio cannot exceed 500 characters" }),
      location: Joi.string()
        .max(100)
        .allow("")
        .optional()
        .messages({ "string.max": "Location cannot exceed 100 characters" }),
      website: Joi.string().uri().allow("").optional().messages({
        "string.uri": "Please provide a valid URL (e.g, https//example.com)",
      }),
    }),
  },

  updateUser: {
    body: Joi.object({
      full_name: Joi.string().min(2).max(50).optional().messages({
        "string.empty": "Full name cannot be empty",
      }),
      email: Joi.string()
        .email()
        .optional()
        .messages({ "string.email": "Please provide a valid email address" }),
      password: passwordSchema.optional(),
      bio: Joi.string()
        .max(500)
        .allow("")
        .optional()
        .messages({ "string.max": "Bio cannot exceed 500 characters" }),
      website: Joi.string().uri().allow("").optional().messages({
        "string.uri": "Please provide a valid URL (e.g., https://example.com)",
      }),
    }),
  },
};

module.exports = usersValidation;
