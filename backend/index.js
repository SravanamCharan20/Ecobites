import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import DonorForm from './routes/donor.route.js';
import path from 'path';
import cors from 'cors';

dotenv.config();

const port = process.env.PORT;
const app = express();

const __dirname = path.resolve();
app.use(express.json());
app.use('/uploads', express.static(path.resolve('uploads')));
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/donor', DonorForm);
app.use(cors({
    origin: 'https://ecobites-dmwt.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
      success: false,
      message,
      statusCode,
  });
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '/frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
    });
}

mongoose.connect(process.env.MONGO)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("Database connection error: ", err));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});