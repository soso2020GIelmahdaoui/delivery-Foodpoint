import CartItem from "../models/cartItem.model.js";
import CartItemSchemaValidation from "../helpers/validator/cartItemValidator.js"; 

// Create a new CartItem
export const createCartItem = async (req, res, next) => {
  try {
    // Validate request body using zod
    const validatedData = CartItemSchemaValidation.parse(req.body);

    const cartItem = new CartItem(validatedData);
    await cartItem.save();

    res.status(201).json({ message: "Cart item added", cartItem });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError("Validation Error: " + error.errors.map(err => err.message).join(", "), 400));
    } else {
      next(new ApiError("Error adding cart item: " + error.message, 500));
    }
  }
};

// Get all CartItems
export const getCartItems = async (req, res, next) => {
  try {
    const cartItems = await CartItem.find();
    res.status(200).json(cartItems);
  } catch (error) {
    next(new ApiError("Error retrieving cart items: " + error.message, 500));
  }
};

// Get CartItem by ID
export const getCartItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cartItem = await CartItem.findById(id);

    if (!cartItem) {
      return next(new ApiError("Cart item not found", 404));
    }

    res.status(200).json(cartItem);
  } catch (error) {
    next(new ApiError("Error retrieving cart item: " + error.message, 500));
  }
};

// Update CartItem
export const updateCartItem = async (req, res, next) => {
  try {
    // Validate request body using zod
    const validatedData = CartItemSchemaValidation.partial().parse(req.body);

    const { id } = req.params;
    const updatedCartItem = await CartItem.findByIdAndUpdate(id, validatedData, { new: true });

    if (!updatedCartItem) {
      return next(new ApiError("Cart item not found", 404));
    }

    res.status(200).json(updatedCartItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError("Validation Error: " + error.errors.map(err => err.message).join(", "), 400));
    } else {
      next(new ApiError("Error updating cart item: " + error.message, 500));
    }
  }
};

// Delete CartItem
export const deleteCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCartItem = await CartItem.findByIdAndDelete(id);

    if (!deletedCartItem) {
      return next(new ApiError("Cart item not found", 404));
    }

    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (error) {
    next(new ApiError("Error deleting cart item: " + error.message, 500));
  }
};
