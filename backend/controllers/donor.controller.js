import Donor from '../models/donor.model.js'
import User from  '../models/user.model.js'

export const donationform = async (req, res) => {
  try {
    const donoremail = req.body.email;
    const existingUser = await User.findOne({ email: donoremail });
    if(!existingUser) 
      return res.status(400).json({ message: 'Email is not there please sign up' });
    const donor = new Donor(req.body);
    const savedDonor = await donor.save();
    res.status(201).json(savedDonor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const avldatalist = async (req, res) => {
    try {
      const donatedFoodItems = await Donor.find();
      res.json(donatedFoodItems);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch donated food items' });
    }
  };