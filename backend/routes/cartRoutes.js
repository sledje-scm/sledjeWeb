import express from "express";
import { saveCart, getCart, clearCart } from "../controllers/cartController.js";
import {
  authenticate as authenticateRetailer,
  authorize as authorizeRetailer
} from '../middleware/retailerMiddleware.js';
const router = express.Router();

router.post("/save", authenticateRetailer, saveCart);
router.get("/", authenticateRetailer, getCart);
router.post("/clear", authenticateRetailer, clearCart);

export default router;