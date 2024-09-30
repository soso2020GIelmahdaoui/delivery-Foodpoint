import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  address: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v); // Valide les numéros à 10 chiffres
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true,
    unique: true
  },
  sexe: {
    type: String,
    enum: ['male', 'female'],
    default: 'male',
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verificationToken: String,
  verificationExpiresAt: Date,
  totalSpend: {
    type: Number,
    default: 0
  },
  cart: { 
    type: Schema.Types.ObjectId,
    ref: 'Cart' // Référence au modèle Cart
  },
  userOrder: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'UserOrder' 
  }]
}, 
{ timestamps: true });

export const User = mongoose.model('User', userSchema);
