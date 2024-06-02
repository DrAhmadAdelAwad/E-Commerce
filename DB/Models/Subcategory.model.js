import mongoose, { Schema, Types, model } from "mongoose";

export const subcategorySchema = new Schema(
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
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brands : {
      type: Types.ObjectId,
      ref: "Brand",
    }
  },

  { timestamps: true }
);

const SubcategoryModel =
  mongoose.models.Subcategory || model("Subcategory", subcategorySchema);
export default SubcategoryModel;
