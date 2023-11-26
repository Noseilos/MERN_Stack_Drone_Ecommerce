import express from "express";
const router = express.Router();
import { createBrand } from "../controllers/productController.js";
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(protect, admin, createBrand);

export default router;