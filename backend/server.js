import express from 'express';
import dotenv from 'dotenv'; 
import cors from 'cors';
import bodyParser from 'body-parser';
import retailerRoutes from './routes/retailerRoutes.js';
// import inventoryRoutes from './routes/inventoryRoutes.js';
//import orderRoutes from './routes/orderRoutes.js';
// import cartRoutes from './routes/cartRoutes.js';
import {connectDB} from './config/db.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/retailers', retailerRoutes);
// app.use('/api/priducts', inventoryRoutes);
//app.use('/api/orders', orderRoutes);
// app.use('/api/cart', cartRoutes);

app.use(bodyParser.json());

// In-memory database (replace with real database in production)
let products = [
  {
    id: 1,
    name: "Smartphone X",
    icon: "📱",
    distributor: "TechGlobal",
    category: "Electronics",
    variants: [
      { id: 1, name: "64GB Black", stock: 15, sellingPrice: 699, expiry: "N/A", sku: "SMX-64-B" },
      { id: 2, name: "128GB Black", stock: 8, sellingPrice: 799, expiry: "N/A", sku: "SMX-128-B" },
      { id: 3, name: "64GB White", stock: 2, sellingPrice: 699, expiry: "N/A", sku: "SMX-64-W" },
      { id: 4, name: "128GB White", stock: 0, sellingPrice: 799, expiry: "N/A", sku: "SMX-128-W" }
    ]
  },
  {
    id: 2,
    name: "Bluetooth Headphones",
    icon: "🎧",
    distributor: "AudioTech",
    category: "Electronics",
    variants: [
      { id: 1, name: "Black", stock: 25, sellingPrice: 129, expiry: "N/A", sku: "BH-BLK" },
      { id: 2, name: "White", stock: 18, sellingPrice: 129, expiry: "N/A", sku: "BH-WHT" },
      { id: 3, name: "Blue", stock: 5, sellingPrice: 129, expiry: "N/A", sku: "BH-BLU" }
    ]
  },
  {
    id: 3,
    name: "Cotton T-Shirt",
    icon: "👕",
    distributor: "FashionWear",
    category: "Clothing",
    variants: [
      { id: 1, name: "Small White", stock: 30, sellingPrice: 19.99, expiry: "N/A", sku: "CT-S-W" },
      { id: 2, name: "Medium White", stock: 25, sellingPrice: 19.99, expiry: "N/A", sku: "CT-M-W" },
      { id: 3, name: "Large White", stock: 20, sellingPrice: 19.99, expiry: "N/A", sku: "CT-L-W" },
      { id: 4, name: "Small Black", stock: 30, sellingPrice: 19.99, expiry: "N/A", sku: "CT-S-B" },
      { id: 5, name: "Medium Black", stock: 20, sellingPrice: 19.99, expiry: "N/A", sku: "CT-M-B" },
      { id: 6, name: "Large Black", stock: 15, sellingPrice: 19.99, expiry: "N/A", sku: "CT-L-B" }
    ]
  },
  {
    id: 4,
    name: "Organic Milk",
    icon: "🥛",
    distributor: "FarmFresh",
    category: "Groceries",
    variants: [
      { id: 1, name: "1 Liter", stock: 40, sellingPrice: 3.99, expiry: "2025-05-15", sku: "OM-1L" },
      { id: 2, name: "2 Liter", stock: 25, sellingPrice: 6.99, expiry: "2025-05-15", sku: "OM-2L" }
    ]
  },
  {
    id: 5,
    name: "Moisturizing Cream",
    icon: "🧴",
    distributor: "BeautyEssentials",
    category: "Beauty",
    variants: [
      { id: 1, name: "50ml", stock: 35, sellingPrice: 12.99, expiry: "2026-01-10", sku: "MC-50" },
      { id: 2, name: "100ml", stock: 28, sellingPrice: 19.99, expiry: "2026-01-10", sku: "MC-100" }
    ]
  },
  {
    id: 6,
    name: "Notebook Set",
    icon: "📒",
    distributor: "OfficeSupplies",
    category: "Office Supplies",
    variants: [
      { id: 1, name: "Small Lined", stock: 50, sellingPrice: 4.99, expiry: "N/A", sku: "NB-SL" },
      { id: 2, name: "Medium Lined", stock: 45, sellingPrice: 6.99, expiry: "N/A", sku: "NB-ML" },
      { id: 3, name: "Large Lined", stock: 30, sellingPrice: 8.99, expiry: "N/A", sku: "NB-LL" }
    ]
  },
  {
    id: 7,
    name: "Smart Watch",
    icon: "⌚",
    distributor: "TechGlobal",
    category: "Electronics",
    variants: [
      { id: 1, name: "Black", stock: 12, sellingPrice: 249.99, expiry: "N/A", sku: "SW-BLK" },
      { id: 2, name: "Silver", stock: 8, sellingPrice: 249.99, expiry: "N/A", sku: "SW-SLV" },
      { id: 3, name: "Gold", stock: 3, sellingPrice: 279.99, expiry: "N/A", sku: "SW-GLD" }
    ]
  },
  {
    id: 8,
    name: "Decorative Pillow",
    icon: "🛋️",
    distributor: "HomeDeco",
    category: "Home Goods",
    variants: [
      { id: 1, name: "Blue", stock: 20, sellingPrice: 24.99, expiry: "N/A", sku: "DP-BLU" },
      { id: 2, name: "Red", stock: 15, sellingPrice: 24.99, expiry: "N/A", sku: "DP-RED" },
      { id: 3, name: "Green", stock: 0, sellingPrice: 24.99, expiry: "N/A", sku: "DP-GRN" }
    ]
  }
];

app.use('/api/products', (req, res) => {
    res.json(products);
  });

let orders = [];
let nextOrderId = 1001;

// PATCH update stock for a specific variant
app.patch('/products/:productId/variants/:variantId/stock', (req, res) => {
  const productId = parseInt(req.params.productId);
  const variantId = parseInt(req.params.variantId);
  const newStock = req.body.stock;
  
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const variantIndex = products[productIndex].variants.findIndex(v => v.id === variantId);
  
  if (variantIndex === -1) {
    return res.status(404).json({ error: 'Variant not found' });
  }
  
  products[productIndex].variants[variantIndex].stock = newStock;
  
  res.json({
    productId,
    variantId,
    updatedStock: newStock
  });
});

// POST process a new order
app.post('/orders', (req, res) => {
  const { items, totalPrice } = req.body;
  
  // Validate order data
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order items' });
  }
  
  // Update stock for each ordered item
  for (const item of items) {
    const { productId, variantId, quantity } = item;
    
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) continue;
    
    const variantIndex = products[productIndex].variants.findIndex(v => v.id === variantId);
    if (variantIndex === -1) continue;
    
    // Decrease stock based on order quantity
    const currentStock = products[productIndex].variants[variantIndex].stock;
    products[productIndex].variants[variantIndex].stock = Math.max(0, currentStock - quantity);
  }
  
  // Create new order record
  const orderDate = new Date().toISOString();
  const order = {
    orderId: nextOrderId++,
    items,
    totalPrice,
    orderDate,
    status: 'completed'
  };
  
  // Save order to database
  orders.push(order);
  
  res.status(201).json({
    orderId: order.orderId,
    orderDate,
    status: 'completed',
    message: 'Order processed successfully'
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
