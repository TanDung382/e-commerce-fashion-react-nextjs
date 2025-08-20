// src/routes/productRoutes.ts

import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { ProductService } from '../services/productService';
import { pool } from '../config/config';
import { CategoryService } from '../services/categoryService';

const router = Router();
const categoryService = new CategoryService(pool);
const productService = new ProductService(pool, categoryService);
const productController = new ProductController(productService);

router.get('/', productController.getAllProducts);
router.get('/best-sellers', productController.getBestSellerProducts);
router.get('/:id', productController.getProductById);
router.get('/category/:slug', productController.getProductsByCategory);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;