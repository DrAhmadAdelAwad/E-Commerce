import joi from 'joi';
import { validObjectId } from '../../Middleware/Validation.js';

export const addReview = joi.object({
    productId : joi.string().custom(validObjectId).required(),
    rating : joi.number().min(1).max(5).required(),
    comment : joi.string().required(),
}).required()

export const updateReview = joi.object({
    id : joi.string().custom(validObjectId).required(),
    rating : joi.number().min(1).max(5),
    comment : joi.string(),
    productId : joi.string().custom(validObjectId).required(),
}).required()