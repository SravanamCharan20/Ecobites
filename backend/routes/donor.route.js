import express from 'express';
import { avldatalist, donationform, getid, updateDonor } from '../controllers/donor.controller.js';

const router = express.Router();

router.post('/donorform', donationform);
router.get('/donorform', avldatalist);
router.get('/:id', getid);
router.put('/:id', updateDonor); 

export default router;