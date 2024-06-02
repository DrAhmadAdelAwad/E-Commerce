import orderModel from "../../../DB/Models/Order.model.js";
import { asyncHandler } from "../../Utils/errorHandling.js";
import reviewModel from "../../../DB/Models/Review.model.js";
import productModel from "../../../DB/Models/Product.model.js";

export const addReview = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { comment, rating } = req.body;
  const order = await orderModel.findOne({
    user: req.user._id,
    status: "delivered",
    "products.productId": productId,
  });
  if (!order)
    return next(new Error("You Can't Review this Product", { cause: 404 }));
  const checkPreviousReview = await reviewModel.findOne({
    createdBy: req.user._id,
    productId,
    orderId: order._id,
  });
  if (checkPreviousReview) {
    return next(
      new Error(
        "You have already Reviewed this product , you Can't Review this Product Again",
        { cause: 404 }
      )
    );
  }
  const review = await reviewModel.create({
    comment,
    rating,
    productId,
    orderId: order._id,
    createdBy: req.user._id,
  });

  let calcRating = 0;
  const product = await productModel.findById(productId);
  const reviews = await reviewModel.find({ productId });
  for (let i = 0; i < reviews.length; i++) {
    calcRating += reviews[i].rating;
  }
  product.averageRate = calcRating / reviews.length;
  await product.save();
  return res.status(200).json({ message: "Done", review });
});

//Update Review
export const updateReview = asyncHandler(async (req, res, next) => {
  const { productId, id } = req.params;
  await reviewModel.updateOne({ _id: id, productId }, { ...req.body });
  
  let calcRating = 0;
  const product = await productModel.findById(productId);
  const reviews = await reviewModel.find({ productId });
  for (let i = 0; i < reviews.length; i++) {
    calcRating += reviews[i].rating;
  }
  product.averageRate = calcRating / reviews.length;
  await product.save();
  return res.status(200).json({ message: "Review updated successfully" });
});
