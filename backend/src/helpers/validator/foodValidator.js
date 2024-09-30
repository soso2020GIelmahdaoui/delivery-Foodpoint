import { z } from 'zod';

const FoodStatus = ['available', 'unavailable']; // Utilisez une seule définition

const foodValidationSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.preprocess(
    (value) => (typeof value === 'string' ? parseFloat(value) : value),
    z.number().positive() // On s'assure toujours que c'est un nombre positif
  ),
  category: z.string().min(1),
  image: z.string(),
  status: z.enum(FoodStatus).optional().default('available') // Ajout de la valeur par défaut
}).strict();


export const validateFoodData = (data) => {
  try {
    return foodValidationSchema.parse(data);
  } catch (error) {
    console.error('Validation error:', error.errors);
    throw error;
  }
};

export default foodValidationSchema;
