import { Router } from "express";
import * as subcategoryController from "./subcategory.controller.js";
import { isAuthenticated } from "../../Middleware/Authentication.js";
import isAuthorized from "../../Middleware/Authorization.js";
import { fileUpload, fileValidation } from "../../Utils/multer.cloud.js";
import { validation } from "../../Middleware/Validation.js";
import * as subcategorySchema from "./subcategory.schema.js";
const router = Router({ mergeParams: true });

//create a new Subcategory
router.post(
    "/",
    isAuthenticated,
    isAuthorized("admin"),
    fileUpload(fileValidation.image).single("subcategory"),
    validation(subcategorySchema.createSubcategory),
    subcategoryController.createSubcategory
);

//Update the subcategory
router.put(
    '/:id',
    isAuthenticated,
    isAuthorized("admin"),
    fileUpload(fileValidation.image).single("subcategory"),
    validation(subcategorySchema.updateSubcategory),
    subcategoryController.updateSubcategory
);

// Delete Subcategory
router.delete(
    "/:id",
    isAuthenticated,
    isAuthorized("admin"),
    validation(subcategorySchema.deleteSubcategory),
    subcategoryController.deleteSubcategory
);

//GetAllSubcategories
router.get('/' , subcategoryController.getAllSubcategories)


export default router;
