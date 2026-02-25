import express from 'express';
const cors = require('cors');
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes';

dotenv.config();
const app=express();
connectDB();


app.use(cors());
// 1. Increase JSON body limit to handle large Base64 strings
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

import galleryRoutes from "./routes/galleryRoutes"
app.use('/api/gallery', galleryRoutes);

import profilePicRoute from "./routes/profilepicRoute"
app.use('/api/user', profilePicRoute);


app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });




