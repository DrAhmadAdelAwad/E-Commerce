import mongoose, { Schema, Types, model } from "mongoose";

export const brandSchema = new Schema(
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
    slug: {
      type: String,
      required: true,
      unique : true,
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
  },
  { timestamps: true, toJSON: {virtuals:true}, toObject: {virtuals:true} }
);


const brandModel =
  mongoose.models.Brand || model("Brand", brandSchema);
export default brandModel;
