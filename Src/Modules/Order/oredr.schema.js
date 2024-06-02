import joi from "joi";
import { validObjectId } from "../../Middleware/Validation.js";

export const createOrder = joi
  .object({
    phone: joi.string().required(),
    address: joi.string().required(),
    payment: joi.string().valid("cash", "visa").required(),
    coupon: joi.string(),
  })
  .required();


  //cancelOrder
  export const cancelOrder = joi.object({
    id : joi.string().custom(validObjectId).required()
}).required()