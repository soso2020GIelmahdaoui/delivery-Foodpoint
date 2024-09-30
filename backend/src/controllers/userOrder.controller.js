import UserOrder from "../models/userOrder.model.js";
import UserOrderSchemaValidation from "../helpers/validator/userOrderValidator.js";
import ApiError from "../helpers/ApiError.js";

// Create a new UserOrder
export const createUserOrder = async (req, res, next) => {
  try {
    // Validate request body using zod
    const validatedData = UserOrderSchemaValidation.parse(req.body);

    const userOrder = new UserOrder(validatedData);
    await userOrder.save();

    res.status(201).json({ message: "Order created successfully", userOrder });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError("Validation Error: " + error.errors.map(err => err.message).join(", "), 400));
    } else {
      next(new ApiError("Error creating order: " + error.message, 500));
    }
  }
};

// Get all UserOrders
export const getUserOrders = async (req, res, next) => {
  try {
    const userOrders = await UserOrder.find().populate('orderItems');
    res.status(200).json(userOrders);
  } catch (error) {
    next(new ApiError("Error retrieving orders: " + error.message, 500));
  }
};

// Get UserOrder by ID
export const getUserOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userOrder = await UserOrder.findById(id).populate('orderItems');

    if (!userOrder) {
      return next(new ApiError("Order not found", 404));
    }

    res.status(200).json(userOrder);
  } catch (error) {
    next(new ApiError("Error retrieving order: " + error.message, 500));
  }
};

// Update UserOrder
export const updateUserOrder = async (req, res, next) => {
  try {
    // Validate request body using zod
    const validatedData = UserOrderSchemaValidation.partial().parse(req.body);

    const { id } = req.params;
    const updatedUserOrder = await UserOrder.findByIdAndUpdate(id, validatedData, { new: true });

    if (!updatedUserOrder) {
      return next(new ApiError("Order not found", 404));
    }

    res.status(200).json(updatedUserOrder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError("Validation Error: " + error.errors.map(err => err.message).join(", "), 400));
    } else {
      next(new ApiError("Error updating order: " + error.message, 500));
    }
  }
};

// Delete UserOrder
export const deleteUserOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUserOrder = await UserOrder.findByIdAndDelete(id);

    if (!deletedUserOrder) {
      return next(new ApiError("Order not found", 404));
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    next(new ApiError("Error deleting order: " + error.message, 500));
  }
};
