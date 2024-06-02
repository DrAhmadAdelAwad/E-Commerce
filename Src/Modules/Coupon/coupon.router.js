import { Router } from "express";
import * as couponController from "./coupon.controller.js";
import * as couponSchema from "./coupon.schema.js";
import { isAuthenticated } from "../../Middleware/Authentication.js";
import isAuthorized from "../../Middleware/Authorization.js";
import { validation } from "../../Middleware/Validation.js";

const router = Router();

//Create a new coupon
router.post(
  "/",
  isAuthenticated,
  isAuthorized("seller"),
  validation(couponSchema.createCoupon),
  couponController.createCoupon
);

//Update the coupon
router.patch(
  "/:code",
  isAuthenticated,
  isAuthorized("seller"),
  validation(couponSchema.updateCoupon),
  couponController.updateCoupon
);

//Delete the coupon
router.delete(
  "/:code",
  isAuthenticated,
  isAuthorized("seller"),
  validation(couponSchema.deleteCoupon),
  couponController.deleteCoupon
);
export default router;

//Get All Coupons
router.get(
  "/",
  isAuthenticated,
  isAuthorized("seller", "admin"),
  couponController.getAllCoupons
);
