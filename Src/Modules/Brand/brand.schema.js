import joi from "joi"
import { validObjectId } from "../../Middleware/Validation.js"

export const createBrand = joi.object({
    name : joi.string().min(2).max(20).required() , 
    categories : joi.array().items(joi.string().custom(validObjectId)).required(),
}).required()

// updateBrand
export const updateBrand = joi.object({
    id : joi.string().custom(validObjectId).required(),
    name : joi.string().min(2).max(20),
}).required()

// deleteBrand 
export const deleteBrand = joi.object({
    id : joi.string().custom(validObjectId).required(),
}).required()