import joi from "joi"
import { validObjectId } from "../../Middleware/Validation.js"


export const createProduct = joi.object({
    name : joi.string().min(2).max(20).required(),
    description : joi.string().min(10).max(200),
    count : joi.number().integer().positive().min(1).required(),
    price : joi.number().integer().positive().min(1).required(),
    discount : joi.number().integer().positive().min(1),
    category : joi.string().custom(validObjectId).required(),
    subcategory : joi.string().custom(validObjectId).required(),
    brand : joi.string().custom(validObjectId).required(),
}).required()

export const deleteProduct = joi.object({
    id : joi.string().custom(validObjectId).required()
}).required()