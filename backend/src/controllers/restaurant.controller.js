import { Restaurant } from "../models/restaurant.model.js";
import cloudinary from '../utils/cloudinary.js';
import { ApiError } from '../helpers/ApiError.js';
import { validateRestaurantData } from '../helpers/validator/restaurantValidator.js'; 

export const createRestaurant = async (req, res, next) => {
  try {
    const file = req.file; // Fichier image téléchargé

    // Si l'image est obligatoire
    if (!file) {
      return next(new ApiError("Image is required", 400));
    }

    // Valider les données du formulaire
    const validatedData = validateRestaurantData(req.body); // Validation avec Zod

    // Vérifiez si un restaurant avec cet email existe déjà
    const existingRestaurant = await Restaurant.findOne({ email: validatedData.email });
    if (existingRestaurant) {
      return next(new ApiError("Restaurant with this email already exists", 400));
    }

    // Téléverser l'image sur Cloudinary
    const result = await cloudinary.v2.uploader.upload(file.path);
    const imageUrl = result.secure_url;

    // Créer le restaurant avec les données validées et l'URL de l'image
    const restaurant = new Restaurant({
      ...validatedData, // Inclure les données validées
      image: imageUrl // Ajouter l'URL de l'image téléversée
    });

    // Sauvegarder le restaurant dans la base de données
    await restaurant.save();

    // Répondre avec succès
    res.status(201).json({ message: "Restaurant created successfully", restaurant });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // En cas d'erreur de validation Zod, renvoyer un message approprié
      return next(new ApiError("Validation Error: " + error.errors.map(err => err.message).join(", "), 400));
    }
    // Pour toute autre erreur
    next(new ApiError("Error creating restaurant: " + error.message, 500));
  }
};

export const getRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find();
    if (!restaurants || restaurants.length === 0) {
      return next(new ApiError("No restaurants found", 404));
    }
    res.status(200).json(restaurants);
  } catch (error) {
    return next(new ApiError("Error retrieving restaurants: " + error.message, 500));
  }
};

// Get Restaurant by ID
export const getRestaurantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return next(new ApiError("Restaurant not found", 404));
    }
    return res.status(200).json(restaurant);
  } catch (error) {
    return next(new ApiError("Error retrieving restaurant: " + error.message, 500));
  }
};
export const updateRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const file = req.file;

    // Valider les données avec Zod
    const validatedData = validateRestaurantData(req.body); // Zod validation

    let updatedFields = { ...validatedData };

    if (file) {
      // Upload a new image to Cloudinary if a new file is uploaded
      const result = await cloudinary.v2.uploader.upload(file.path);
      const imageUrl = result.secure_url;
      updatedFields.image = imageUrl;
    }

    // Update the restaurant
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedRestaurant) {
      return next(new ApiError("Restaurant not found", 404));
    }

    res.status(200).json(updatedRestaurant);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ApiError("Validation Error: " + error.errors.map(err => err.message).join(", "), 400));
    } else {
      return next(new ApiError("Error updating restaurant: " + error.message, 500));
    }
  }
};

export const deleteRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedRestaurant = await Restaurant.findByIdAndDelete(id);
    if (!deletedRestaurant) {
      return next(new ApiError("Restaurant not found", 404));
    }
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    return next(new ApiError("Error deleting restaurant: " + error.message, 500));
  }
};

