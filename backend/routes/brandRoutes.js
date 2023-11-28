import express from "express";
const router = express.Router();
import { createBrand, getBrands, getBrandById, updateBrand, deleteBrand } from "../controllers/productController.js";
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getBrands).post(protect, admin, createBrand);
router.route('/:id').get(protect, admin, getBrandById).put(protect, admin, updateBrand).delete(protect, admin, deleteBrand);

export default router;