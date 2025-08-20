// src/routes/productTypeRoutes.ts

import { Router } from 'express';
import { ProductTypeController } from '../controllers/typeController';
import { ProductTypeService } from '../services/typeService';
import { pool } from '../config/config';

const router = Router();
const productTypeService = new ProductTypeService(pool);
const productTypeController = new ProductTypeController(productTypeService);

router.post('/', productTypeController.createProductType);
router.get('/', productTypeController.getAllProductTypes);
router.get('/:id', productTypeController.getProductTypeById);
router.put('/:id', productTypeController.updateProductType);
router.delete('/:id', productTypeController.deleteProductType);

export default router;