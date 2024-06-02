import mongoose, { Schema, Types, model } from "mongoose";

export const reviewSchema = new Schema(
  {
    rating : {type : Number , min : 1  , max : 5 , required : true},
    comment : {type : String , required : true},
    createdBy : {type : Types.ObjectId , ref : "user", required : true},
    productId : {type : Types.ObjectId , ref: "Product" ,required : true},
    orderId : {type : Types.ObjectId , ref: "Order" ,required : true},
},
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const reviewModel = mongoose.models.Review || model("Review", reviewSchema);
export default reviewModel;
