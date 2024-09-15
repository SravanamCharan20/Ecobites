import Donor from '../models/donor.model.js';
import User from '../models/user.model.js';
import Request from '../models/request.model.js'
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

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
    const donatedFoodItems = await Donor.find();
    res.json(donatedFoodItems);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donated food items.', error });
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
export const requestFood = async (req, res) => {
  try {
    const { donorId, name, contactNumber, address, latitude, longitude, description } = req.body;

    // Validation
    if (!donorId || !name || !contactNumber || !address) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found.' });
    }

    const newRequest = new Request({
      donorId,
      userId: donor.userId, 
      requesterName: name,
      contactNumber,
      address: {
        street: address.street,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
      },
      latitude: latitude || null,
      longitude: longitude || null,
      description,
    });

    await newRequest.save();
    res.status(200).json({ message: 'Request submitted successfully.' });
  } catch (error) {
    console.error('Error submitting request:', error);
    res.status(500).json({ message: 'Failed to submit request.', error });
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

export const getRequestsForDonor = async (req, res) => {
  try {
    const { userId } = req.params; 
    const requests = await Request.find({ userId });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests', error });
  }
};