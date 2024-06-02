import mongoose, { Schema, Types, model } from "mongoose";

export const cartSchema = new Schema(
  {
    products: [
      {
        productId: {
          type: Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    user : {
        type: Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const cartModel = mongoose.models.Category || model("Cart", cartSchema);
export default cartModel;
