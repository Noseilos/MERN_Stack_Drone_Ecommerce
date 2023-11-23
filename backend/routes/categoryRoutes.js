import express from "express";
const router = express.Router();
import { createCategory } from "../controllers/productController.js";
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(protect, admin, createCategory);

export default router;