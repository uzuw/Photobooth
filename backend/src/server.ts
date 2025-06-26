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
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });



