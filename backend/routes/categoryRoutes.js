import express from "express";
const router = express.Router();
import { createCategory, getCategories, updateCategory, getCategoryById, deleteCategory } from "../controllers/productController.js";
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getCategories).post(protect, admin, createCategory)
router.route('/:id').get(protect, admin, getCategoryById).put(protect, admin, updateCategory).delete(protect, admin, deleteCategory);

export default router;