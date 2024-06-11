import connectDB from "../DB/Connection.js";
import authRouter from "./Modules/Auth/auth.router.js";
import categoryRouter from "./Modules/Category/category.router.js";
import { globalErrorHandling } from "./Utils/errorHandling.js";
import subcategoryRouter from "./Modules/SubCategory/subcategory.router.js";
import brandRouter from "./Modules/Brand/brand.router.js";
import couponRouter from "./Modules/Coupon/coupon.router.js";
import productRouter from "./Modules/Product/product.router.js";
import cartRouter from "./Modules/Cart/cart.router.js";
import orderRouter from "./Modules/Order/order.router.js";
import reviewRouter from "./Modules/Review/review.router.js";
import cors from 'cors'


const initApp = (app, express) => {
  connectDB();

  app.use(cors());
  app.use((req, res, next) => {
    if(req.originalUrl == "/order/webhook"){
      return next()
    }
    express.json ()(req,res,next)
  })
  app.use(express.json());
  app.get("/" , (req,res,next)=>{
    return res.status(200).json({message : 'Welcome to Ecommerce'})
  })
  app.use("/auth", authRouter);
  app.use("/category", categoryRouter);
  app.use("/subcategory", subcategoryRouter);
  app.use("/brand", brandRouter);
  app.use("/coupon", couponRouter);
  app.use("/product", productRouter);
  app.use("/cart", cartRouter);
  app.use("/order", orderRouter);
  app.use("/review", reviewRouter);


  app.use("*", (req, res, next) => {
    return res.status(404).json({ message: "Invalid Routing" });
  });
  app.use(globalErrorHandling);
};

export default initApp;
