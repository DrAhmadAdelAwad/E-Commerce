import slugify from "slugify";
import categoryModel from "../../../DB/Models/Category.model.js";
import { asyncHandler } from "../../Utils/errorHandling.js";
import cloudinary from "../../Utils/cloudinary.js";
import brandModel from "../../../DB/Models/Brand.model.js";

// Create a new Brand
export const createBrand = asyncHandler(async (req, res, next) => {
  // checkCategories
  const { categories, name } = req.body;
  categories.forEach(async (categoryId) => {
    const category = await categoryModel.findById(categoryId);
    if (!category)
      return next(
        new Error(`Category ${categoryId} Doesn't Exists`, { cause: 404 })
      );
  });
  // checkFile
  if (!req.file)
    return next(new Error("Brand Image is Required", { cause: 404 }));
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.CLOUD_APP_FOLDER}/Brand` }
  );
  const brand = await brandModel.create({
    name,
    slug: slugify(name),
    createdBy: req.user._id,
    image: { url: secure_url, id: public_id },
  });
  // save Brand In Each category

  categories.forEach(async (categoryId) => {
    await categoryModel.findByIdAndUpdate(categoryId, {
      $push: { brands: brand._id },
    });
  });
  // categories.forEach(async (categoryId) => {
  //     const category = await categoryModel.findById(categoryId)
  //     if(!category) return next(new Error(`Category ${categoryId} Doesn't Exists`,{cause : 404}))
  //     category.brands.push(brand._id)
  //     await category.save()
  // })

  // return Response
  return res.status(200).json({ message: "Brand Created Successfully", brand });
});

// Update a brand
export const updateBrand = asyncHandler(async (req, res, next) => {
  const brand = await brandModel.findById(req.params.id);
  if (!brand) return next(new Error("Brand Doesn't Exists", { cause: 404 }));
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { public_id: brand.image.id }
    );
    brand.image = { url: secure_url, id: public_id };
  }
  brand.name = req.body.name ? req.body.name : brand.name;
  brand.slug = req.body.name ? slugify(req.body.name) : brand.slug;
  await brand.save();
  return res.status(200).json({ message: "Brand Updated Successfully", brand });
});

// delete a brand
export const deleteBrand = asyncHandler(async (req, res, next) => {
  const brand = await brandModel.findByIdAndDelete(req.params.id);
  if (!brand) return next(new Error("Brand Doesn't Exists", { cause: 404 }));
  await cloudinary.uploader.destroy(brand.image.id);
  // delete brand from categories
  await categoryModel.updateMany({}, { $pull: { brands: brand._id } });
  return res.status(200).json({ message: "Brand Deleted Successfully", brand });
});

// getAllBrands
export const getAllBrands = asyncHandler(async(req,res,next)=>{
    const brands = await brandModel.find()
    return res.status(200).json({message : 'Done', brands})
})
