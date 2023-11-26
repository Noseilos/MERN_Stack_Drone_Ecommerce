import express from "express";
const router = express.Router();
import { createBrand, getBrands } from "../controllers/productController.js";
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getBrands).post(protect, admin, createBrand);

export default router;