import mongoose, { Schema, Types, model } from "mongoose";

export const orderSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          min: 1,
        },
        name: String,
        itemPrice: Number,
        totalPrice: Number,
      },
    ],
    address: {
      type: String,
      required: true,
    },
    payment: {
      type: String,
      default: "cash",
      enum: ["cash", "visa"],
    },
    phone: {
      type: String,
      required: true,
    },
    coupon: {
      id: { type: Types.ObjectId, ref: "Coupon", required: true },
      name: String,
      discount: {
        type: Number,
        min: 1,
        max: 100,
      },
    },
    price : Number,
    invoice: {
      id: String,
      url: String,
    },
    status: {
      type: String,
      default: "placed",
      enum: ["placed", "shipped", "delivered", "cancelled", "refunded"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

orderSchema.virtual("finalPrice").get(function () {
    if (this.coupon) {
      return this.price - this.price * (this.coupon.discount / 100).toFixed(2);
    }
    return this.price;
  });

const orderModel = mongoose.models.Order || model("Order", orderSchema);
export default orderModel;
