import express from 'express';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductsForConnectedDistributors
} from '../controllers/productController.js';
import { authenticate, authorize } from '../middleware/distributorMiddleware.js';
import { authenticate as authenticateRetailer } from '../middleware/retailerMiddleware.js';


const router = express.Router();


router.post('/add', authenticate, addProduct);

// Add a new product
router.get('/get', getProducts);

// Update an existing product
router.put('/:productId', authenticate,updateProduct);

// Delete a product
router.delete('/:productId', authenticate,  deleteProduct);


router.get('/connected-distributors', authenticateRetailer, getProductsForConnectedDistributors);

export default router;
// ```

// ---

// ### Explanation:
// 1. **`addProduct`**:
//    - Adds a new product to the database.
//    - Checks if a product with the same `id` already exists.

// 2. **`updateProduct`**:
//    - Updates an existing product's details, including its variants.
//    - Uses `findById` to locate the product and updates only the provided fields.

// 3. **`deleteProduct`**:
//    - Deletes a product by its `productId`.
//    - Ensures the product exists before attempting to delete it.

// 4. **Routes**:
//    - `POST /api/products`: Add a new product.
//    - `PUT /api/products/:productId`: Update an existing product.
//    - `DELETE /api/products/:productId`: Delete a product.

// 5. **Middleware**:
//    - `authenticate`: Ensures the user is logged in.
//    - `authorize('retailer')`: Ensures only users with the `retailer` role can perform these actions.

// ---

// ### Example API Requests:
// 1. **Add Product**:
//    ```json
//    POST /api/products
//    {
//      "id": 1,
//      "name": "Smartphone X",
//      "icon": "📱",
//      "distributor": "TechGlobal",
//      "category": "Electronics",
//      "variants": [
//        { "id": 1, "name": "64GB Black", "stock": 10, "sellingPrice": 699, "costPrice": 500, "sku": "SMX-64-B" }
//      ]
//    }