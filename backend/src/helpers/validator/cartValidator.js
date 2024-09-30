import mongoose from 'mongoose';
import CartItemSchema from './CartItem'; // Assurez-vous que l'import est correct

const CartSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true, required: true }, // Relation vers l'utilisateur
  items: [CartItemSchema], // Relation vers les items du panier
});

export const Cart = mongoose.model('Cart', CartSchema);
