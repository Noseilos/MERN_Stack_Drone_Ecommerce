import express from "express";
const router = express.Router();
import { createCategory, getCategories } from "../controllers/productController.js";
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getCategories).post(protect, admin, createCategory);

export default router;