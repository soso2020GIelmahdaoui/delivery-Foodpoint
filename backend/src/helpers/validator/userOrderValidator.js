import { z } from 'zod';

const OrderStatus = ['PENDING', 'PAID', 'COMPLETE', 'CANCELLED'];
const DeliveryStatus = ['PREPARING', 'DISPATCHED', 'DELIVERED'];

const UserOrderSchemaValidation = z.object({
  userId: z.string().nonempty(), // ObjectId should be a non-empty string
  orderItems: z.array(z.string().nonempty()), // Array of ObjectId strings
  orderPrice: z.number().nonnegative(), // Non-negative orderPrice
  createdAt: z.date().default(new Date()), // Default to current date
  updatedAt: z.date().optional(), // Optional date for updatedAt
  deliveryAddress: z.string().optional(), // Optional delivery address
  amountReceived: z.number().nonnegative().optional(), // Optional non-negative amount
  clientEmail: z.string().email(), // Valid email
  status: z.enum(OrderStatus).default('PENDING'), // Enum for order status
  deliveryStatus: z.enum(DeliveryStatus).default('PREPARING') // Enum for delivery status
});

export default UserOrderSchemaValidation;
