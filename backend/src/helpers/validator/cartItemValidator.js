import { z } from 'zod';

// Définition des options pour size et side
const Size = z.enum(['standard', 'large']);
const AddOns = z.enum(['redRice', 'potatoSalad', 'brownToast', 'noAddOns']);

// Schéma de validation pour un item du panier (CartItem)
const CartItemSchemaValidation = z.object({
  foodId: z.string().nonempty(), // ID de l'aliment (doit être une chaîne non vide)
  quantity: z.number().min(1), // Quantité minimale de 1
  sizeOption: Size.default('standard'), // Option de taille, avec une valeur par défaut
  sideOption: AddOns.default('brownToast'), // Option d'accompagnement, avec une valeur par défaut
  extraPrice: z.number().nonnegative().default(0), // Prix supplémentaire, valeur par défaut 0
  itemTotal: z.number().positive() // Le prix total de l'item (doit être un nombre positif)
});

export default CartItemSchemaValidation;
