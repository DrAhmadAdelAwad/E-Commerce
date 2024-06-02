import { Router } from "express";
import * as brandController from "./brand.controller.js";
import * as brandSchema from "./brand.schema.js";
import { isAuthenticated } from "../../Middleware/Authentication.js";
import isAuthorized from "../../Middleware/Authorization.js";
import { fileUpload, fileValidation } from "../../Utils/multer.cloud.js";
import { validation } from "../../Middleware/Validation.js";
const router = Router();

//create a new brand
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(fileValidation.image).single("brand"),
  validation(brandSchema.createBrand),
  brandController.createBrand
);

// Update a Brand
router.put(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(fileValidation.image).single("brand"),
  validation(brandSchema.updateBrand),
  brandController.updateBrand
);

// Delete Brand
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  validation(brandSchema.deleteBrand),
  brandController.deleteBrand
);

//getAllBrands
router.get('/' , brandController.getAllBrands)

export default router;
