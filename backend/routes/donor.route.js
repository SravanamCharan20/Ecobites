import express from 'express';
import { avldatalist, donationform, getid, updateDonor, getDonationsByUserId, getUserDonations } from '../controllers/donor.controller.js';

const router = express.Router();

router.post('/donorform', donationform);
router.get('/donorform', avldatalist); 
router.get('/userdonations/:userId', getDonationsByUserId);
router.get('/:id', getid);
router.put('/:id', updateDonor);
router.get('/userdonations/:userId', getUserDonations); 


export default router;