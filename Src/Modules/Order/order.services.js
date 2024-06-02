import cartModel from "../../../DB/Models/Cart.model.js";
import productModel from "../../../DB/Models/Product.model.js";



export const updateStock = async (products, createOrder) => {
  if (createOrder) {
    for (const product of products) {
      await productModel.findByIdAndUpdate(product.productId, {
        $inc: { count: -product.quantity, soldItems: +product.quantity },
      });
    }
  } else {
    for (const product of products) {
      await productModel.findByIdAndUpdate(product.productId, {
        $inc: { count: +product.quantity, soldItems: -product.quantity },
      });
    }
  }
};


export const clearCart = async (userId) => {
  await cartModel.findOneAndUpdate(
    { user: userId },
    { products: [] },
    { new: true }
  );
};
