import express from 'express'
import { avldatalist, donationform, getid } from '../controllers/donor.controller.js';

const router = express.Router()

router.post('/donorform',donationform)
router.get('/donorform', avldatalist);
router.get('/:id', getid);

export default router;
