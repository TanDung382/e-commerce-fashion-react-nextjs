// src/routes/imageRoutes.ts

import { Router } from 'express';
import { ProductImageController } from '../controllers/imageController';
import { ProductImageService } from '../services/imageService';
import { pool } from '../config/config';

const router = Router();
const productImageService = new ProductImageService(pool);
const productImageController = new ProductImageController(productImageService);

router.post('/', productImageController.createImage);
router.get('/product/:productId', productImageController.getImagesByProductId); // Get images by product ID
router.get('/:id', productImageController.getImageById);
router.put('/:id', productImageController.updateImage);
router.delete('/:id', productImageController.deleteImage);

export default router;