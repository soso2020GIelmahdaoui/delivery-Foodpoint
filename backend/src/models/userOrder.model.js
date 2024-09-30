import mongoose from 'mongoose';
const { Schema } = mongoose;

const OrderStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  COMPLETE: 'COMPLETE',
  CANCELLED: 'CANCELLED',
};

const DeliveryStatus = {
  PREPARING: 'PREPARING',
  DISPATCHED: 'DISPATCHED',
  DELIVERED: 'DELIVERED',
};

const UserOrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  orderItems: [{ type: Schema.Types.ObjectId, ref: 'OrderItem' }],
  orderPrice: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  deliveryAddress: { type: String },
  amountReceived: { type: Number },
  clientEmail: { type: String },
  status: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
  deliveryStatus: { type: String, enum: Object.values(DeliveryStatus), default: DeliveryStatus.PREPARING }
});

module.exports = mongoose.model('UserOrder', UserOrderSchema);
