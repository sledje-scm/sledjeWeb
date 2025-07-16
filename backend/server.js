import express from 'express';
import dotenv from 'dotenv'; 
import cors from 'cors';
import retailerRoutes from './routes/retailerRoutes.js';
import distributorRoutes from './routes/distributorRoutes.js';
import productsRoutes from './routes/productsRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import {connectDB} from './config/db.js';
import connectionRoutes from './routes/connectionRoutes.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/retailers', retailerRoutes);
app.use('/api/distributors',distributorRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
