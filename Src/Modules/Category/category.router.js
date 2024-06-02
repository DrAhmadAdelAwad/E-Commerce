import { Router } from "express";
import * as categoryController from "./category.controller.js";
import { isAuthenticated } from "../../Middleware/Authentication.js";
import isAuthorized from "../../Middleware/Authorization.js";
import { fileUpload, fileValidation } from "../../Utils/multer.cloud.js";
import { validation } from "../../Middleware/Validation.js";
import * as categorySchema from "./category.schema.js";
import subcategoryRouter from '../SubCategory/subcategory.router.js'
const router = Router();


router.use('/:categoryId/subcategory' , subcategoryRouter)
//createCategory
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(fileValidation.image).single("category"),
  validation(categorySchema.createCategory),
  categoryController.createCategory
);



//updateCategory
router.patch(
    "/:id",
    isAuthenticated,
    isAuthorized("admin"),
    fileUpload(fileValidation.image).single("category"),
    validation(categorySchema.updateCategory),
    categoryController.updateCategory
  );


  //deleteCategory
  router.delete(
    "/:id",
    isAuthenticated,
    isAuthorized("admin"),
    categoryController.deleteCategory
  );

  //getCategories
router.get("/" , categoryController.getCategories)
  export default router;


