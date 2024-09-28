import mongoose, { Schema, model } from 'mongoose';

const foodItemSchema = new Schema({
  type: String,
  name: String,
  quantity: String,
  unit: String,
  expiryDate: Date,
});

const donorSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true,
  },
  address: {
    street: {
      type: String,
      required: false, 
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false, 
    },
    postalCode: {
      type: String,
      required: false,  
    },
    country: {
      type: String,
      required: false,  
    },
  },
  location: {
    latitude: {
      type: Number,
      required: false,
    },
    longitude: {
      type: Number,
      required: false,
    },
    city: {
      type: String,
      required: false,
      trim: true,
    },
    state: {
      type: String,
      required: false,
      trim: true,
    },
  },
  foodItems: [foodItemSchema],
  availableUntil: {
    type: Date,
    required: false,
  },
  isAccepted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default model('Donor', donorSchema);