import { asyncHandler } from "../../Utils/errorHandling.js";
import cloudinary from "../../Utils/cloudinary.js";
import categoryModel from "../../../DB/Models/Category.model.js";
import slugify from "slugify";

//createCategory
export const createCategory = asyncHandler(async (req, res, next) => {
  if (!req.file) return next(new Error("Category Image Is Rquired!"));
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.CLOUD_APP_FOLDER}/Category` }
  );
  const category = await categoryModel.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.user._id,
    image: {
      url: secure_url,
      id: public_id,
    },
  });
  return res
    .status(201)
    .json({ message: "Category Created Successfully", category });
});

//updateCategory
export const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await categoryModel.findById(req.params.id);
  if (!category) return next(new Error("Category Not Found"));
  if (req.user._id.toString() != category.createdBy.toString())
    return next(new Error("You are not allowed to update this category"));
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { public_id: category.image.id }
    );
    category.image = { url: secure_url, id: public_id };
  }
  const checkCategoryExists = await categoryModel.findOne({
    name: req.body.name,
  });
  if (checkCategoryExists)
    return next(new Error("Category Already Exists", { cause: 409 }));
  category.name = req.body.name ? req.body.name : category.name;
  category.slug = req.body.name ? slugify(req.body.name) : category.slug;
  category.updatedBy = req.user._id;
  console.log(category);
  await category.save();
  return res
    .status(200)
    .json({ message: "Category Updated Successfully", category });
});

//deleteCategory
export const deleteCategory = asyncHandler(async(req, res, next)=>{
    const {id} = req.params
    const category = await categoryModel.findById(id)
    if(!category){
        return next(new Error("Category Not Found"))
    }
    if (req.user._id.toString() != category.createdBy.toString())
        return next(new Error("You are not allowed to update this category"));
    await category.deleteOne()
    await cloudinary.uploader.destroy(category.image.id)
    return res.status(200).json({message : "Category Deleted Successfully"})
})

//getCategories
export const getCategories = asyncHandler(async(req,res,next)=>{
    const categories = await categoryModel.find().populate("subcategory")
    return res.status(200).json({message : 'Done' , categories})
})
