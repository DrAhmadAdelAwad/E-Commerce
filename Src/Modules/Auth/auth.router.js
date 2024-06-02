import { Router } from "express";
const router = Router();
import * as authController from "./auth.controller.js";
import * as authSchema from "./auth.schema.js";
import { validation } from "../../Middleware/Validation.js";
import { isAuthenticated } from "../../Middleware/Authentication.js";

// signup
router.post("/signup", validation(authSchema.signup), authController.signup);

//activate_account
router.get(
  "/activate_account/:token",
  validation(authSchema.activate_account),
  authController.activate_account
);

//login
router.get("/login", validation(authSchema.login), authController.login);

//getUsers
router.get("/", isAuthenticated, authController.getUsers);

//forgetCode
router.patch(
  "/forgetCode",
  validation(authSchema.forgetCode),
  authController.forgetCode
);

//resetPassword
router.patch(
  "/resetPassword",
  validation(authSchema.resetPassword),
  authController.resetPassword
);

export default router;
