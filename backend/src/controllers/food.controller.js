import { Food } from "../models/food.model.js";
import cloudinary from '../utils/cloudinary.js';
import { z } from 'zod'
import { validateFoodData } from "../helpers/validator/foodValidator.js"; // Assuming validation is in this file
import { ApiError } from '../helpers/ApiError.js';

// Create a new Food
export const createFood = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return next(new ApiError("Image is required", 400));
    }

    const validatedData = validateFoodData(req.body); // Zod validation

    const result = await cloudinary.v2.uploader.upload(file.path);
    const imageUrl = result.secure_url;

    const food = new Food({
      ...validatedData,
      image: imageUrl
    });

    await food.save();
    res.json({ message: "Food created successfully", food });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ApiError("Validation Error: " + error.errors.map(err => err.message).join(", "), 400));
    } else {
      return next(new ApiError("Error creating food: " + error.message, 500));
    }
  }
};

// Get all Foods
export const getFoods = async (req, res, next) => {
  try {
    const foods = await Food.find();
    if (!foods || foods.length === 0) {
      return next(new ApiError("No foods found", 404));
    }
    res.status(200).json(foods);
  } catch (error) {
    return next(new ApiError("Error retrieving foods: " + error.message, 500));
  }
};

// Get Food by ID
export const getFoodById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);
    if (!food) {
      return next(new ApiError("Food not found", 404));
    }
    return res.status(200).json(food);
  } catch (error) {
    return next(new ApiError("Error retrieving food: " + error.message, 500));
  }
};

// Update Food
export const updateFood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const file = req.file;

    const validatedData = validateFoodData(req.body); // Zod validation

    let updatedFields = { ...validatedData };

    if (file) {
      const result = await cloudinary.v2.uploader.upload(file.path);
      const imageUrl = result.secure_url;
      updatedFields.image = imageUrl;
    }

    const existingFood = await Food.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!existingFood) {
      return next(new ApiError("Food not found", 404));
    }

    return res.status(200).json(existingFood);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ApiError("Validation Error: " + error.errors.map(err => err.message).join(", "), 400));
    } else {
      return next(new ApiError("Error updating food: " + error.message, 500));
    }
  }
};

// Delete Food
export const deleteFood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedFood = await Food.findByIdAndDelete(id);
    if (!deletedFood) {
      return next(new ApiError("Food not found", 404));
    }
    return res.status(200).json({ message: "Food deleted successfully" });
  } catch (error) {
    return next(new ApiError("Error deleting food: " + error.message, 500));
  }
};
