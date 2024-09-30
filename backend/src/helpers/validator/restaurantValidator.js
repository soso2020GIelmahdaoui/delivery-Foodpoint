import { z } from 'zod';

// Schéma de validation pour un restaurant
const restaurantValidationSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  country: z.string().min(3, { message: "Country must be at least 3 characters long" }),
  city: z.string().min(3, { message: "City must be at least 3 characters long" }),
  address: z.string().min(6, { message: "Address must be at least 6 characters long" }),
  phone_number: z.string()
    .min(9, { message: "Phone number must be at least 9 characters long" })
    .regex(/^\d+$/, { message: "Phone number must only contain digits" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  image: z.string().optional(), // Valeur par défaut pour le statut
}).strict(); // Utilisation de strict pour interdire les champs non définis

// Fonction de validation
export const validateRestaurantData = (data) => {
  try {
    return restaurantValidationSchema.parse(data);
  } catch (error) {
    console.error('Validation error:', error.errors);
    throw error;
  }
};

export default restaurantValidationSchema;
