import { Router } from "express";
import * as reviewController from "./review.controller.js";
import * as reviewSchema from "./review.schema.js";
import { isAuthenticated } from "../../Middleware/Authentication.js";
import isAuthorized from "../../Middleware/Authorization.js";
import { validation } from "../../Middleware/Validation.js";
const router = Router({mergeParams: true});

// Add Review
router.post(
  "/",
  isAuthenticated,
  isAuthorized("user"),
  validation(reviewSchema.addReview),
  reviewController.addReview
);



// Update Review
router.patch(
    "/:id",
    isAuthenticated,
    isAuthorized("user"),
    validation(reviewSchema.updateReview),
    reviewController.updateReview
  );


export default router;
