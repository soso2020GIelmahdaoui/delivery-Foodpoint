import mongoose from 'mongoose';
const { Schema } = mongoose;

const Size = {
  STANDARD: 'standard',
  LARGE: 'large',
};

const AddOns = {
  RED_RICE: 'redRice',
  POTATO_SALAD: 'potatoSalad',
  BROWN_TOAST: 'brownToast',
  NO_ADDONS: 'noAddOns',
};

const OrderItemSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'UserOrder' },
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number },
  sizeOption: { type: String, enum: Object.values(Size) },
  sideOption: { type: String, enum: Object.values(AddOns) },
  extraPrice: { type: Number },
  price: { type: Number }
});

module.exports = mongoose.model('OrderItem', OrderItemSchema);
