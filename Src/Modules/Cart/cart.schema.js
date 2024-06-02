import joi from "joi";
import { validObjectId } from "../../Middleware/Validation.js";

export const addToCart = joi
  .object({
    productId: joi.string().custom(validObjectId).required(),
    quantity: joi.number().integer().positive().min(1).required(),
  })
  .required();

export const userCart = joi.object({
  cartId: joi.string().custom(validObjectId),
});

export const updateCart = joi
  .object({
    productId: joi.string().custom(validObjectId).required(),
    quantity: joi.number().integer().positive().min(1).required(),
  })
  .required();

export const removeFromCart = joi
  .object({
    productId: joi.string().custom(validObjectId).required(),
  })
  .required();
