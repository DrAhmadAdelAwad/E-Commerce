import { asyncHandler } from "../../Utils/errorHandling.js";
import couponModel from "../../../DB/Models/Coupon.model.js";
import cartModel from "../../../DB/Models/Cart.model.js";
import productModel from "../../../DB/Models/Product.model.js";
import orderModel from "../../../DB/Models/Order.model.js";
import createInvoice from "../../Utils/pdfInvoice.js";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "../../Utils/cloudinary.js";
import sendEmail from "../../Utils/email.js";
import { clearCart, updateStock } from "./order.services.js";
import Stripe from "stripe";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import {unlink} from 'node:fs/promises'

//create
export const createOrder = asyncHandler(async (req, res, next) => {
  //Data
  const { payment, phone, address, coupon } = req.body;
  //Coupon Check
  let checkCoupon;
  if (coupon) {
    checkCoupon = await couponModel.findOne({
      name: coupon,
      expiredAt: { $gt: Date.now() },
    });
    if (!checkCoupon) {
      return next(new Error("Invalid Coupon or Expired", { cause: 404 }));
    }
  }
  //Products from Cart
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new Error("Cart Not Found", { cause: 404 }));
  }
  let products = cart.products;
  if (products.length < 1) {
    return next(new Error("Empty Cart", { cause: 404 }));
  }
  //loop on products
  let orderProducts = [];
  let orderPrice = 0;
  for (let i = 0; i < products.length; i++) {
    const product = await productModel.findById(products[i].productId);
    if (!product) {
      return next(new Error(`${product.name} not found`, { cause: 404 }));
    }
    if (!product.inStock(products[i].quantity)) {
      return next(
        new Error(
          `${product.name} out of stock , only ${product.count} are Available`,
          { cause: 400 }
        )
      );
    }
    orderProducts.push({
      name: product.name,
      quantity: products[i].quantity,
      productId: product._id,
      itemPrice: product.finalPrice,
      totalPrice: product.finalPrice * products[i].quantity,
    });
    orderPrice += product.finalPrice * products[i].quantity;
  }
  //Create Order
  const order = await orderModel.create({
    phone,
    address,
    payment,
    user: req.user._id,
    products: orderProducts,
    price: orderPrice,
    coupon: {
      id: checkCoupon?._id,
      name: checkCoupon?.name,
      discount: checkCoupon?.discount,
    },
  });
  //Create Invoice
  const invoice = {
    shipping: {
      name: req.user.userName,
      address,
      country: "Egypt",
    },
    items: order.products,
    subtotal: order.price,
    discount: (order.price - order.finalPrice).toFixed(2),
    total: order.finalPrice,
    invoice_nr: order._id,
  };

  let pdfPath = process.env.MOOD == "DEV" ? path.join(__dirname, `./../../tempInvoices/${order._id}.pdf`) : `/tmp/${order._id}.pdf`;
  createInvoice(invoice, pdfPath);
  //Upload invoice on Cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(pdfPath, {
    folder: `${process.env.CLOUD_APP_FOLDER}/Orders/Invoices`,
  });
  //Save Invoice in DB
  order.invoice = { url: secure_url, id: public_id };
  await order.save();
  await unlink(pdfPath)
  //Send Invoice to Client Email
  await sendEmail({
    to: req.user.email,
    subject: "Invoice",
    attachments: [{ path: secure_url, contentType: "application/pdf" }],
  });
  //Update Stock
  updateStock(order.products, true);
  //Clear cart
  clearCart(req.user._id);

  if (payment === "visa") {
    //Stripe gateway payment
    const stripe = new Stripe(process.env.STIPE_KEY);
    //Coupon Stripe
    let couponExist;
    if (order.coupon !== undefined) {
      couponExist = await stripe.coupons.create({
        percent_off: order.coupon.discount,
        duration: "once",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      metadata : {orderId : order._id.toString()},
      success_url: process.env.SUCCESS_URL,
      cancel_url: process.env.CANCEL_URL,
      line_items: order.products.map((product) => {
        return {
          price_data: {
            currency: "egp",
            product_data: {
              name: product.name,
            },
            unit_amount: product.itemPrice * 100,
          },
          quantity: product.quantity,
        };
      }),
      discounts : couponExist ? [{coupon : couponExist.id}] : [],
    });
    return res.json({message : 'Done' , url : session.url})
  }
  //Response
  return res.status(201).json({ message: "Order Created Successfully", order });
});

//cancelOrder
export const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return next(new Error("Order Not Found", { cause: 404 }));
  }
  if (order.status !== "placed") {
    return next(new Error("You can't cancel this order", { cause: 400 }));
  }
  order.status = "canceled";
  order.save();
  updateStock(order.products, false);
  return res.status(200).json({ message: "Order Canceled Successfully" });
});


//webhook
export const webhook = asyncHandler(async(req,res,next) => {

const stripe = new Stripe(process.env.STIPE_KEY);

  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.ENDPOINT_SECRET);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  const orderId = event.data.object.metadata.orderId;
  if(event.type == "checkout.session.completed"){
    await orderModel.findOneAndUpdate({_id : orderId} , {status : "visaPaid"})
  } else {
    await orderModel.findOneAndUpdate({_id : orderId} , {status : "failedToPay"})
  }
  
  return res.status(200).json({message : "Done"})
});
