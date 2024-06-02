import { nanoid } from "nanoid";
import brandModel from "../../../DB/Models/Brand.model.js";
import categoryModel from "../../../DB/Models/Category.model.js";
import SubcategoryModel from "../../../DB/Models/Subcategory.model.js";
import { asyncHandler } from "../../Utils/errorHandling.js";
import cloudinary from "../../Utils/cloudinary.js";
import productModel from "../../../DB/Models/Product.model.js";


export const createProduct = asyncHandler(async (req, res, next) => {
  //check Category
  const category = await categoryModel.findById(req.body.category);
  if (!category)
    return next(new Error("Category Doesn't Exists", { cause: 404 }));

  //check SubCategory
  const subcategory = await SubcategoryModel.findById(req.body.subcategory);
  if (!subcategory)
    return next(new Error("SubCategory Doesn't Exists", { cause: 404 }));
  //check Brand
  const brand = await brandModel.findById(req.body.brand);
  if (!brand) return next(new Error("Brand Doesn't Exists", { cause: 404 }));
  //check files
  if (!req.files) {
    return next(new Error("Please Upload Images", { cause: 400 }));
  }
  //create Folder Name
  const cloudFolder = nanoid();
  // Upload SubImages
  let images = [];
  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.CLOUD_APP_FOLDER}/Products/${cloudFolder}` }
    );
    images.push({ url: secure_url, id: public_id });
  }
  // upload default image
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path,
    { folder: `${process.env.CLOUD_APP_FOLDER}/Products/${cloudFolder}` }
  );
  // create product
  const product = await productModel.create({
    ...req.body,
    cloudFolder,
    createdBy: req.user._id,
    defaultImage: { url: secure_url, id: public_id },
    images,
  });
  // send response
  return res
    .status(201)
    .json({ message: "Product Created Successfully", product });
});



export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);
  if (!product) {
    return next(new Error("Product Not Found", { cause: 404 }));
  }
  if (req.user._id.toString() != product.createdBy.toString()) {
    return next(
      new Error("You are not allowed to delete this product", { cause: 401 })
    );
  }
  await productModel.findByIdAndDelete(req.params.id);
  const ids = product.images.map((image) => image.id);
  ids.push(product.defaultImage.id);
  await cloudinary.api.delete_resources(ids);
  await cloudinary.api.delete_folder(
    `${process.env.CLOUD_APP_FOLDER}/Products/${product.cloudFolder}`
  );
  return res.status(200).json({ message: "Product Deleted Successfully" });
});



export const getAllProducts = asyncHandler(async(req,res,next) => {
  const {sort,page,keyword,category,subcategory,brand} = req.query;
  if(category && !(await categoryModel.findById(category))){
    return next(new Error("Category Doesn't Exists", { cause: 404 }));
  }
  if(subcategory &&!(await SubcategoryModel.findById(subcategory))){
    return next(new Error("SubCategory Doesn't Exists", { cause: 404 }));
  }
  if(brand &&!(await brandModel.findById(brand))){
    return next(new Error("Brand Doesn't Exists", { cause: 404 }));
  }
  const products = await productModel.find({...req.query}).sort(sort).paginate(page).search(keyword)
  // {price: {$lte : 120}}
  return res.status(200).json({message : 'Done', products})
})