import joi from "joi"
import { validObjectId } from "../../Middleware/Validation.js"

//createCategory
export const createCategory = joi.object({
    name : joi.string().min(3).max(20).required() , 
    slug : joi.string(), 
    createdBy : joi.string().custom(validObjectId),
}).required()

//updateCategory
export const updateCategory = joi.object({
    name : joi.string().min(3).max(20) , 
    id : joi.string().custom(validObjectId).required()
}).required()
