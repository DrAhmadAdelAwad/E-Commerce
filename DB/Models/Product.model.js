import mongoose, { Schema, Types, model } from "mongoose";

export const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 20,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      min: 10,
      max: 200,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        id: {
          type: String,
          required: true,
        },
      },
    ],
    defaultImage: {
      url: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
    },
    count: {
      type: Number,
      required: true,
      min: 1,
      required: true,
    },
    soldItems: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    discount: {
      type: Number,
      default: 0,
      min: 1,
      max: 100,
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    brand: {
      type: Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    cloudFolder: {
      type: String,
      required: true,
      unique: true,
    },
    averageRate: { type: Number, min : 1 , max : 5}
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("finalPrice").get(function () {
  if (this.discount > 0) {
    return this.price - this.price * (this.discount / 100).toFixed(2);
  }
  return this.price;
  // productSchema.virtual("finalPrice".get(function () { return Number.parseFloat(this.price) - (this.price * this.discount || 0) / 100).toFixed(2)})
});

productSchema.virtual("review" , {
  ref: "Review",
  localField: "_id",
  foreignField: "productId",
  justOne: false,
})

//queryHelper
productSchema.query.paginate = function (page) {
  page = page < 1 || isNaN(page) || !page ? 1 : page;
  const limit = 2; // product perPage
  const skip = (page - 1) * limit;
  return this.skip(skip).limit(limit);
};

productSchema.query.search = function (keyword) {
  if (keyword) {
    return this.find({
      $or: [{ name: { $regex: keyword, $options: "i" } }],
    });
  }
};


productSchema.methods.inStock = function (requiredQuantity) {
  return this.count >= requiredQuantity ? true : false;
};

const productModel = mongoose.models.Product || model("Product", productSchema);
export default productModel;
