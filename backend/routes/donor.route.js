import express from 'express'
import { avldatalist, donationform } from '../controllers/donor.controller.js';

const router = express.Router()

router.post('/donorform',donationform)
router.get('/donorform', avldatalist);

export default router;
