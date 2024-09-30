import OrderItem from "../models/orderItem.model.js";

// Create a new OrderItem
export const createOrderItem = async (req, res) => {
  const { orderId, productId, quantity, sizeOption, sideOption, extraPrice, price } = req.body;
  try {
    const orderItem = new OrderItem({ orderId, productId, quantity, sizeOption, sideOption, extraPrice, price });
    await orderItem.save();
    res.status(201).json({ message: "Order item added", orderItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding order item" });
  }
};

// Get all OrderItems
export const getOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.find();
    res.status(200).json(orderItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving order items" });
  }
};

// Get OrderItem by ID
export const getOrderItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const orderItem = await OrderItem.findById(id);
    if (!orderItem) return res.status(404).json({ message: "Order item not found" });
    res.status(200).json(orderItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving order item" });
  }
};

// Update OrderItem
export const updateOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, sizeOption, sideOption, extraPrice, price } = req.body;
    const updatedOrderItem = await OrderItem.findByIdAndUpdate(id, { quantity, sizeOption, sideOption, extraPrice, price }, { new: true });
    if (!updatedOrderItem) return res.status(404).json({ message: "Order item not found" });
    res.status(200).json(updatedOrderItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating order item" });
  }
};

// Delete OrderItem
export const deleteOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrderItem = await OrderItem.findByIdAndDelete(id);
    if (!deletedOrderItem) return res.status(404).json({ message: "Order item not found" });
    res.status(200).json({ message: "Order item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting order item" });
  }
};
