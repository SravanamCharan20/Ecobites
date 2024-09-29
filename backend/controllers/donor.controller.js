import Donor from '../models/donor.model.js';
import User from '../models/user.model.js';
// import Request from '../models/request.model.js'
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSmsNotification = async (phoneNumber, message) => {
  try {
    const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    if (formattedPhoneNumber.length !== 13) { 
      throw new Error('Invalid phone number length');
    }

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhoneNumber
    });
  } catch (error) {
    console.error('Failed to send SMS:', error.message);
  }
};

export const donationform = async (req, res) => {
  try {
    const donoremail = req.body.email;
    const existingUser = await User.findOne({ email: donoremail });
    if (!existingUser) 
      return res.status(400).json({ message: 'Email is not registered. Please sign up.' });

    const donor = new Donor({
      ...req.body,
      userId: existingUser._id
    });

    const savedDonor = await donor.save();
    res.status(201).json(savedDonor);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create donation.', error });
  }
};

export const avldatalist = async (req, res) => {
  try {
    const donatedFoodItems = await Donor.find({ isAccepted: false });
    if (donatedFoodItems.length === 0) {
      return res.status(404).json({ message: 'No donated food items found.' });
    }
    res.status(200).json(donatedFoodItems);
  } catch (error) {
    console.error('Error fetching donated food items:', error); 
    res.status(500).json({ message: 'Failed to fetch donated food items.', error: error.message });
  }
};

export const getid = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found.' });
    }
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

export const updateDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found.' });
    }
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update donation.', error });
  }
};

export const getDonationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const donations = await Donor.find({ userId });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donations for this user.', error });
  }
};
export const getUserDonations = async (req, res) => {
  const { userId } = req.params;
  
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    const donations = await Donor.find({ userId });
    if (!donations.length) {
      return res.status(404).json({ message: 'No donations found for this user.' });
    }
    res.status(200).json(donations);
  } catch (error) {
    console.error('Error fetching user donations:', error);
    res.status(500).json({ message: 'Failed to fetch donations.', error });
  }
};

