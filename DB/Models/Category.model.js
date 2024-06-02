import mongoose, { Schema, Types, model } from "mongoose";
import SubcategoryModel from "./Subcategory.model.js";

export const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
      trim: true,
      lowercase: true,
    },
    slug: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      url: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
    },
    brands: [
      {
        type: Types.ObjectId,
        ref: "Brand",
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

categorySchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    //delete Subcategories
    await SubcategoryModel.deleteMany({
      category: this._id,
    });
  }
);

categorySchema.virtual("subcategory", {
  ref: "Subcategory",
  localField: "_id",
  foreignField: "category",
});

const categoryModel =
  mongoose.models.Category || model("Category", categorySchema);
export default categoryModel;
