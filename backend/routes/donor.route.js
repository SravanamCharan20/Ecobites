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
  nonfooddonorform,
  avlnonfooddatalist,
  getnonid,
} from '../controllers/donor.controller.js';

const router = express.Router();


router.post('/donorform', donationform);
router.get('/donorform', avldatalist); 
router.get('/userdonations/:userId', getDonationsByUserId);
router.get('/get-donor/:id', getid);
router.get('/get-nondonor/:id', getnonid);
router.put('/:id', updateDonor);
router.get('/userdonations/:userId', getUserDonations); 
router.post('/request', requestFood);
router.get('/requests/:donorId', getRequestsForDonor);
router.patch('/requests/:requestId/status', getStatus);
router.post('/nfdonorform',nonfooddonorform);
router.get('/nfdonorform',avlnonfooddatalist)


export default router;