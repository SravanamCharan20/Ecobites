import express from 'express';
import { signin, signup, updateUser } from '../controllers/auth.controller.js';
import authenticateToken from '../middlewares/auth.middleware.js'
import upload from '../middlewares/upload.js';


const router = express.Router();

router.post("/signup", signup)
router.post("/signin", signin)
router.put("/update",authenticateToken,upload.single('profilePicture'), updateUser);

export default router;