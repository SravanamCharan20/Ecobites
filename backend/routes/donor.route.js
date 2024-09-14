import express from 'express';
import { avldatalist, donationform, getid, updateDonor, getDonationsByUserId } from '../controllers/donor.controller.js';

const router = express.Router();

router.post('/donorform', donationform);
router.get('/donorform', avldatalist); // For fetching all donations
router.get('/userdonations/:userId', getDonationsByUserId); // New route
router.get('/:id', getid);
router.put('/:id', updateDonor);

export default router;