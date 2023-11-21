import Joi from "@hapi/joi";

export const listing_validation = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  regular_price: Joi.required(),
  discount_price: Joi.required(),
  address: Joi.string().required(),
  bath_rooms: Joi.number().required(),
  bed_rooms: Joi.number().required(),
  furnished: Joi.boolean().required(),
  image_urls: Joi.array().required(),
  offer: Joi.boolean().required(),
  parking: Joi.boolean().required(),
  user_ref: Joi.string().required(),
  type: Joi.string().required(),
});
