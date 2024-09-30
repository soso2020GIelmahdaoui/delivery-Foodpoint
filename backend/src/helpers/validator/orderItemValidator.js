import { z } from 'zod';

const OrderItemSchemaValidation = z.object({
  orderId: z.string().nonempty(), // ObjectId should be a non-empty string
  productId: z.string().nonempty(), // ObjectId should be a non-empty string
  quantity: z.number().min(1).nonnegative(), // Quantity should be at least 1 and non-negative
  sizeOption: z.enum(Size), // Enum for sizeOption
  sideOption: z.enum(AddOns), // Enum for sideOption
  extraPrice: z.number().nonnegative(), // Non-negative extraPrice
  price: z.number().nonnegative() // Non-negative price
});

export default OrderItemSchemaValidation;
