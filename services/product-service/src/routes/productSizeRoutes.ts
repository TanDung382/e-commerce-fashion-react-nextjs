// src/routes/sizeRoutes.ts

import { Router } from 'express';
import { ProductSizeController } from '../controllers/productSizeController';
import { ProductSizeService } from '../services/productSizeService';
import { pool } from '../config/config';

const router = Router();
const productSizeService = new ProductSizeService(pool);
const productSizeController = new ProductSizeController(productSizeService);

router.post('/', productSizeController.createProductSize);
router.get('/', productSizeController.getAllProductSize);
router.get('/:productId', productSizeController.getProductSizesByProductId); // Get sizes by product ID
router.get('/:id', productSizeController.getProductSizeById);
router.put('/:id', productSizeController.updateProductSize);
router.delete('/:id', productSizeController.deleteProductSize);

export default router;