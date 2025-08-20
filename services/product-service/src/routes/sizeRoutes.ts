// src/routes/sizeRoutes.ts

import { Router } from 'express';
import { SizeController } from '../controllers/sizeController';
import { SizeService } from '../services/sizeService';
import { pool } from '../config/config';

const router = Router();
const sizeService = new SizeService(pool);
const sizeController = new SizeController(sizeService);

router.post('/', sizeController.createSize);
router.get('/', sizeController.getAllSizes);
router.get('/:productId', sizeController.getSizeById); 
router.put('/:id', sizeController.updateSize);
router.delete('/:id', sizeController.deleteSize);

export default router;