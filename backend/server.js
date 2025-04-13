import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'; 
import cors from 'cors';
import retailerRoutes from './routes/retailerRoutes.js';
// import inventoryRoutes from './routes/inventoryRoutes.js';
//import orderRoutes from './routes/orderRoutes.js';
// import cartRoutes from './routes/cartRoutes.js';
import {connectDB} from './config/db.js';
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

connectDB();

// app.use('/api/auth', authRoutes);
app.use('/api/retailers', retailerRoutes);
// app.use('/api/inventory', inventoryRoutes);
//app.use('/api/orders', orderRoutes);
// app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
