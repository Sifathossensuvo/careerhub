import Category from "../models/Category.js";
import slugify from "slugify";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort("name");
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create({
      name: req.body.name,
      icon: req.body.icon,
      slug: slugify(req.body.name, { lower: true }),
    });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category removed" });
  } catch (error) {
    next(error);
  }
};
