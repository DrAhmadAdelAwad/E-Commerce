import { Router } from "express";
import * as orderSchema from "./oredr.schema.js";
import * as orderController from "./order.controller.js";
import { isAuthenticated } from "../../Middleware/Authentication.js";
import isAuthorized from "../../Middleware/Authorization.js";
import { validation } from "../../Middleware/Validation.js";

const router = Router();


//CreateOreder
router.post(
  "/",
  isAuthenticated,
  isAuthorized("user"),
  validation(orderSchema.createOrder),
  orderController.createOrder
);


//cancelOrder
router.put(
  "/:id",
  isAuthenticated,
  isAuthorized("user"),
  validation(orderSchema.cancelOrder),
  orderController.cancelOrder
);
export default router;
