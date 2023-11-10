import Joi from "@hapi/joi";

const register = Joi.object({
  email: Joi.string().email().required(),
  first_name: Joi.string().max(255).required(),
  last_name: Joi.string().max(255).required(),
  password: Joi.string().min(8).max(255).required(),
  phone_number: Joi.string().min(13).max(15).required(),
});

export default { register };
