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

const CartItemSchema = new Schema({
  cartId: { type: Schema.Types.ObjectId, ref: 'Cart' }, // Relation vers Cart
  foodId: { type: Schema.Types.ObjectId, ref: 'Food', required: true }, // Relation vers Food
  quantity: { type: Number, required: true, min: 1, default: 1 }, // Quantité minimum 1
  addedOn: { type: Date, default: Date.now }, // Date d'ajout de l'item au panier
  sizeOption: { type: String, enum: Object.values(Size), default: Size.STANDARD }, // Taille standard par défaut
  sideOption: { type: String, enum: Object.values(AddOns), default: AddOns.BROWN_TOAST }, // Accompagnement par défaut
  extraPrice: { type: Number, default: 0 }, // Prix supplémentaire en fonction des options choisies
  itemTotal: { type: Number, required: true } // Prix total pour cet item (doit être calculé lors de l'ajout)
});

export default mongoose.model('CartItem', CartItemSchema);
