import mongoose from 'mongoose';
const { Schema } = mongoose;

// Schéma des items du panier
const CartItemSchema = new mongoose.Schema({
  foodId: { type: Schema.Types.ObjectId, ref: 'Food', required: true },
  quantity: { type: Number, required: true, min: 1 } // Quantité minimum 1
});

// Schéma du panier
const CartSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  items: [CartItemSchema] // Liste des items avec le schéma défini
});

export const Cart = mongoose.model('Cart', CartSchema);
