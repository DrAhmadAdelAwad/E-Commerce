import joi from "joi";
import { validObjectId } from "../../Middleware/Validation.js";

// create a new subCategory
export const createSubcategory = joi.object({
    name : joi.string().min(3).max(20).required(),
    categoryId : joi.string().custom(validObjectId).required(),
}).required()

// update SubCategory
export const updateSubcategory = joi.object({
    name : joi.string().min(3).max(20) ,
    categoryId : joi.string().custom(validObjectId).required() ,
    id : joi.string().custom(validObjectId).required()
}).required()

// delete SubCategory
export const deleteSubcategory = joi.object({
    categoryId : joi.string().custom(validObjectId).required() ,
    id : joi.string().custom(validObjectId).required(),
}).required()

