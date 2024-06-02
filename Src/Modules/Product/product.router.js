import { Router } from "express";
import { isAuthenticated } from "../../Middleware/Authentication.js";
import isAuthorized from "../../Middleware/Authorization.js";
import { fileUpload, fileValidation } from "../../Utils/multer.cloud.js";
import { validation } from "../../Middleware/Validation.js";
import * as productController from './product.controller.js'
import * as productSchema from './product.schema.js'
import reviewRouter from '../../Modules/Review/review.router.js'

const router = Router();

router.use('/:productId/review' , reviewRouter);

//Create Product
router.post(
  "/",
  isAuthenticated,
  isAuthorized("seller"),
  fileUpload(fileValidation.image).fields([
    { name: "defaultImage", maxCount: 1 },
    { name: "subImages", maxCount: 3 },
  ]),
  validation(productSchema.createProduct),
  productController.createProduct
);

//delete Product
router.delete('/:id' , isAuthenticated,
isAuthorized("seller"),
validation(productSchema.deleteProduct),
productController.deleteProduct)
export default router;


router.get('/' , productController.getAllProducts)