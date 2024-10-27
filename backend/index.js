import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import DonorForm from './routes/donor.route.js';
import path from 'path';
import cors from 'cors';

dotenv.config();

const port = process.env.PORT || 6001;
const app = express();

const __dirname = path.resolve();
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.resolve('uploads')));

// Define routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/donor', DonorForm);

// Enable CORS for the frontend origin
app.use(cors({
  origin: 'https://ecobites-dmwt.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// Serve static files for production build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
  });
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("Database connection error: ", err));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});