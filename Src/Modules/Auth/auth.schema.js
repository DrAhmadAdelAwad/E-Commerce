import joi from "joi";

//signup
export const signup = joi
  .object({
    userName: joi.string().min(3).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    cPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();

//activate_account
export const activate_account = joi
  .object({
    token: joi.string().required(),
  })
  .required();

//login
export const login = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .required();

//forgetCode
export const forgetCode = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();

//resetPassword
export const resetPassword = joi
  .object({
    forgetCode: joi.number().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    cPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();
