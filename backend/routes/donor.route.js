import express from 'express';
import {
  avldatalist,
  donationform,
  getid,
  updateDonor,
  getDonationsByUserId,
  getUserDonations,
  requestFood,
  getRequestsForDonor,
  getStatus,
} from '../controllers/donor.controller.js';

const router = express.Router();

router.post('/donorform', donationform);
router.get('/donorform', avldatalist); 
router.get('/userdonations/:userId', getDonationsByUserId);
router.get('/:id', getid);
router.put('/:id', updateDonor);
router.get('/userdonations/:userId', getUserDonations); 
router.post('/request', requestFood);
router.get('/requests/:donorId', getRequestsForDonor);
router.patch('/requests/:requestId/status', getStatus);

export default router;