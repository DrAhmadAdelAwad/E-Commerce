import slugify from "slugify";
import categoryModel from "../../../DB/Models/Category.model.js";
import SubcategoryModel, { subcategorySchema } from "../../../DB/Models/Subcategory.model.js";
import cloudinary from "../../Utils/cloudinary.js";
import { asyncHandler } from "../../Utils/errorHandling.js";


//Create a new Subcategory

export const createSubcategory = asyncHandler(async (req, res, next) => {
    const category = await categoryModel.findById(req.params.categoryId)
    if (!category) return next(new Error("Category Doesn't Exists", { cause: 404 }));
    if (!req.file) return next(new Error("SubCategory Image is Required", { cause: 404 }));
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.CLOUD_APP_FOLDER}/Subcategory` })
    const checkSubcategory = await SubcategoryModel.findOne({ name: req.body.name })
    if (checkSubcategory) return next(new Error("Subcategory Already Exists", { cause: 409 }))
    const subcategory = await SubcategoryModel.create({
        name: req.body.name,
        slug: slugify(req.body.name),
        createdBy: req.user._id,
        image: { id: public_id, url: secure_url },
        category: req.params.categoryId
    })
    return res.status(200).json({ message: "SubCategory Created Successfully", subcategory })
})

// update SubCategory
export const updateSubcategory = asyncHandler(async (req, res, next) => {
    const category = await categoryModel.findById(req.params.categoryId)
    if (!category) return next(new Error("Category Doesn't Exists", { cause: 404 }));
    const subCategory = await SubcategoryModel.findById(req.params.id)
    if (!subCategory) return next(new Error("SubCategory Doesn't Exists", { cause: 404 }))
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { public_id: subCategory.image.id })
        subCategory.image = { url: secure_url, id: public_id }
    }
    subCategory.name = req.body.name ? req.body.name : subCategory.name
    subCategory.slug = req.body.name ? slugify(req.body.name) : subCategory.slug
    await subCategory.save()

    return res.status(200).json({ message: "SubCategory Updated Successfully", subCategory })
})

// deleteSubcategory
export const deleteSubcategory = asyncHandler(async (req, res, next) => {
    const category = await categoryModel.findById(req.params.categoryId)
    if (!category) return next(new Error("Category Doesn't Exists", { cause: 404 }));
    const subCategory = await SubcategoryModel.findOne({ _id: req.params.id, category: req.params.categoryId })
    if (!subCategory) return next(new Error("SubCategory Doesn't Exists", { cause: 404 }))
    const deletedSubcategory = await SubcategoryModel.findByIdAndDelete(req.params.id)
    if (!deletedSubcategory) return next(new Error("Subcategory not found"))
    await cloudinary.uploader.destroy(deletedSubcategory.image.id)
    return res.status(200).json({ message: "Subcategory deleted", deletedSubcategory })
})

// getAllSubcategories
export const getAllSubcategories = asyncHandler(async (req, res, next) => {
    if (req.params.categoryId != undefined) {
        const category = await categoryModel.findById(req.params.categoryId)
        if (!category) return next(new Error("Category not found"))
        const subcategories = await SubcategoryModel.find({ category: req.params.categoryId })
        return res.status(200).json({ message: "Done", subcategories })
    }
    const subcategories = await SubcategoryModel.find().populate([{
        path: "category",
        select: "name -_id",
        populate: {
            path: "createdBy",
            select: "email -_id"
        }
    }, {
        path: "createdBy",
        select: "userName -_id"
    }])
    return res.status(200).json({ message: "Done", subcategories })

})