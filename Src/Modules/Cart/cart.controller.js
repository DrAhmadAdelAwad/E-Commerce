import cartModel from "../../../DB/Models/Cart.model.js";
import { asyncHandler } from "../../Utils/errorHandling.js";
import productModel from "../../../DB/Models/Product.model.js";

//Add To Cart
export const addToCart = asyncHandler(async (req, res, next) => {
  //add product in products array in the cart
  const { productId, quantity } = req.body;
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new Error("Product Not Found", { cause: 404 }));
  }
  if (!product.inStock(quantity)) {
    return next(
      new Error(
        `Not Enough Quantity , only ${product.count} are Available in Stock`,
        { cause: 400 }
      )
    );
  }
  const productInCart = await cartModel.findOne({
    user: req.user._id,
    "products.productId": productId,
  });
  if (productInCart) {
    const theProduct = productInCart.products.find(
      (prd) => prd.productId.toString() === productId.toString()
    );
    if (product.inStock(quantity + theProduct.quantity)) {
      theProduct.quantity = quantity + theProduct.quantity;
    } else {
      return next(
        new Error(
          `Not Enough Quantity , only ${product.count} are Available in Stock`,
          { cause: 400 }
        )
      );
    }
    await productInCart.save();
    return res.status(200).json({ message: "Done", productInCart });
  }
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { $push: { products: { productId, quantity } } },
    { new: true }
  );
  if (!cart) return next(new Error("Cart Not Found", { cause: 404 }));
  return res.status(200).json({ message: "Done", cart });
});

export const userCart = asyncHandler(async (req, res, next) => {
  if (req.user.role == "user") {
    const cart = await cartModel.findOne({ user: req.user._id });
    return res.status(200).json({ message: "Done", cart });
  }
  if (req.user.role == "admin" && !req.body.cartId) {
    return next(new Error("Cart Id is Required"));
  }
  const cart = await cartModel.findById(req.body.cartId);
  return res.status(200).json({ message: "Done", cart });
});

export const updateCart = asyncHandler(async (req, res, next) => {
  const { quantity, productId } = req.body;
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new Error("Product Not Found", { cause: 404 }));
  }
  if (product.inStock(quantity)) {
    return next(
      new Error(
        `Not Enough Quantity , only ${product.count} are Available in Stock`,
        { cause: 400 }
      )
    );
  }
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id, "products.productId": productId },
    { $set: { "products.$.quantity": quantity } },
    { new: true }
  );
  return res.status(200).json({ message: "Done", cart });
});

export const removeFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new Error("Product Not Found", { cause: 404 }));
  }
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { products: { productId } } },
    { new: true }
  );
  if (!cart) return next(new Error("Cart Not Found", { cause: 404 }));
  return res.status(200).json({ message: "Done", cart });
});

export const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { products: [] },
    { new: true }
  );
  if (!cart) return next(new Error("Cart Not Found", { cause: 404 }));
  return res.status(200).json({ message: "Done", cart });
});
