import mongoose from 'mongoose';

// Define the Restaurant schema
const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 6,
  },
  country: {
    type: String,
    required: true,
    minlength: 3,
  },
  city: {
    type: String,
    required: true,
    minlength: 3,
  },
  address: {
    type: String,
    required: true,
    minlength: 6,
  },
  phone_number: {
    type: String,
    required: true,
    minlength: 9,
  },
  email: {
    type: String,
    required: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  image: {
    type: String, // URL or file path of the uploaded image
    required: false, // If image is optional
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt timestamps
});

// Create the Restaurant model from the schema
export const Restaurant = mongoose.model('Restaurant', restaurantSchema);


