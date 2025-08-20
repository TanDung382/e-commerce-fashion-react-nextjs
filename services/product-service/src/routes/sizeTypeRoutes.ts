// src/routes/sizeTypeRoutes.ts

import { Router } from 'express';
import { SizeTypeController } from '../controllers/sizeTypeController';
import { SizeTypeService } from '../services/sizeTypeService';
import { pool } from '../config/config';

const router = Router();
const sizeTypeService = new SizeTypeService(pool);
const sizeTypeController = new SizeTypeController(sizeTypeService);

router.post('/', sizeTypeController.createSizeType);
router.get('/', sizeTypeController.getAllSizeTypes);
router.get('/:id', sizeTypeController.getSizeTypeById);
router.put('/:id', sizeTypeController.updateSizeType);
router.delete('/:id', sizeTypeController.deleteSizeType);

export default router;