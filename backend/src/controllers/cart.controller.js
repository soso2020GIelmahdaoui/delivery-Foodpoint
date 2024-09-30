import { Cart } from '../models/cart.model.js';
import { ApiError } from '../helpers/ApiError.js';

// Create a new Cart
export const createCart = async (req, res, next) => {
  try {
    const { userId, items } = req.body;

    // Vérifier si le panier pour l'utilisateur existe déjà
    const existingCart = await Cart.findOne({ userId });
    if (existingCart) {
      return next(new ApiError('Cart for this user already exists', 400));
    }

    // Créer un nouveau panier
    const cart = new Cart({ userId, items });
    await cart.save();

    res.status(201).json({ message: 'Cart created successfully', cart });
  } catch (error) {
    console.error(error);
    next(new ApiError('Error creating cart', 500));
  }
};

// Get all Carts
export const getCarts = async (req, res, next) => {
  try {
    const carts = await Cart.find().populate('items.foodId'); // Populer les détails des aliments
    res.status(200).json(carts);
  } catch (error) {
    console.error(error);
    next(new ApiError('Error retrieving carts', 500));
  }
};

// Get Cart by ID
export const getCartById = async (req, res, next) => {
  try {
    const { id } = req.params; // Utiliser les paramètres de l'URL
    const cart = await Cart.findById(id).populate('items.foodId'); // Populer les détails des aliments
    if (!cart) return next(new ApiError('Cart not found', 404));

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    next(new ApiError('Error retrieving cart', 500));
  }
};

// Update Cart
export const updateCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { items } = req.body;

    // Mettre à jour le panier
    const updatedCart = await Cart.findByIdAndUpdate(id, { items }, { new: true }).populate('items.foodId');
    if (!updatedCart) return next(new ApiError('Cart not found', 404));

    res.status(200).json({ message: 'Cart updated successfully', updatedCart });
  } catch (error) {
    console.error(error);
    next(new ApiError('Error updating cart', 500));
  }
};

// Delete Cart
export const deleteCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCart = await Cart.findByIdAndDelete(id);
    if (!deletedCart) return next(new ApiError('Cart not found', 404));

    res.status(200).json({ message: 'Cart deleted successfully' });
  } catch (error) {
    console.error(error);
    next(new ApiError('Error deleting cart', 500));
  }
};
