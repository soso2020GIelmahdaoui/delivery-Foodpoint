import mongoose from 'mongoose';
const FoodStatus = ['available', 'unavailable'];

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: FoodStatus,
    default: 'available'
  }
});

export const Food = mongoose.model('Food', foodSchema);
