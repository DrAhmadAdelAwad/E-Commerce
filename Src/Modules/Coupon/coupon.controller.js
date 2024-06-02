import { asyncHandler } from "../../Utils/errorHandling.js";
import voucher_codes from "voucher-code-generator";
import couponModel from "../../../DB/Models/Coupon.model.js";

export const createCoupon = asyncHandler(async (req, res, next) => {
  //generate Code
  const code = voucher_codes.generate({
    length: 5,
  });
  //create coupon in the database
  const coupon = await couponModel.create({
    name: code[0],
    createdBy: req.user._id,
    discount: req.body.discount,
    expiredAt: req.body.expiredAt,
  });
  //response
  return res
    .status(201)
    .json({ message: "Coupon Created Successfully", coupon });
});

//Update the Coupon
export const updateCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await couponModel.findOne({
    name: req.params.code,
    expiredAt: { $gt: Date.now() },
  });
  if (!coupon)
    return next(new Error("Coupon Doesn't Exist or Expired", { cause: 404 }));
  if (req.user._id.toString() != coupon.createdBy.toString())
    return next(
      new Error("You Are Not Allowed To Update This Coupon", { cause: 403 })
    );
  coupon.discount = req.body.discount ? req.body.discount : coupon.discount;
  coupon.expiredAt = req.body.expiredAt ? req.body.expiredAt : coupon.expiredAt;
  await coupon.save();
  return res
    .status(200)
    .json({ message: "Coupon Updated Successfully", coupon });
});

//Delete the Coupon
export const deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await couponModel.findOne({
    name: req.params.code,
    expiredAt: { $gt: Date.now() },
  });
  if (!coupon)
    return next(new Error("Coupon Doesn't Exist or Expired", { cause: 404 }));
  if (req.user._id.toString() != coupon.createdBy.toString())
    return next(
      new Error("You Are Not Allowed To Delete This Coupon", { cause: 403 })
    );
  await coupon.deleteOne();
  return res
    .status(200)
    .json({ message: "Coupon Deleted Successfully", coupon });
});

//Get All Coupons
export const getAllCoupons = asyncHandler(async (req, res, next) => {
  //Admin
  if (req.user.role == "admin") {
    const coupons = await couponModel.find();
    return res.status(200).json({ message: "Done", coupons });
  }
  //Seller
  if (req.user.role == "seller") {
    const coupons = await couponModel.find({ createdBy: req.user._id });
    return res.status(200).json({ message: "Done", coupons });
  }

});
