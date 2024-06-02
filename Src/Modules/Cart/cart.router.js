import { Router } from "express";
import * as cartController from "./cart.controller.js";
import * as cartSchema from "./cart.schema.js";
import { isAuthenticated } from "../../Middleware/Authentication.js";
import isAuthorized from "../../Middleware/Authorization.js";
import { validation } from "../../Middleware/Validation.js";

const router = Router();

// add to cart
router.post(
  "/",
  isAuthenticated,
  isAuthorized("user"),
  validation(cartSchema.addToCart),
  cartController.addToCart
);

// get user cart
router.get(
  "/",
  isAuthenticated,
  isAuthorized("user", "admin"),
  validation(cartSchema.userCart),
  cartController.userCart
);

// update user cart
router.patch(
  "/",
  isAuthenticated,
  isAuthorized("user"),
  validation(cartSchema.updateCart),
  cartController.updateCart
);
// remove product from cart
router.patch(
  "/:productId",
  isAuthenticated,
  isAuthorized("user"),
  validation(cartSchema.removeFromCart),
  cartController.removeFromCart
);

// clear cart
router.put('/clearCart' , isAuthenticated, isAuthorized("user") , cartController.clearCart)

export default router;
