
import mongoose, { Schema, Types, model } from "mongoose";

export const couponSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    discount: {
      type: Number,
      required: true,
      min : 1,
      max : 100,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiredAt: {
        type : Date,
        required : true,
        default : Date.now() + 1000 * 60 * 60 * 24 * 30,
    },
  },
  { timestamps: true, toJSON: {virtuals:true}, toObject: {virtuals:true} }
);


const couponModel =
  mongoose.models.Coupon || model("Coupon", couponSchema);
export default couponModel;

