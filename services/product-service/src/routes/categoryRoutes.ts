// src/routes/categoryRoutes.ts

import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { CategoryService } from '../services/categoryService';
import { pool } from '../config/config';

const router = Router();
const categoryService = new CategoryService(pool);
const categoryController = new CategoryController(categoryService);

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/slug/:slug', categoryController.getCategoryBySlug);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;