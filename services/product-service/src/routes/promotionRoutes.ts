// src/routes/promotionRoutes.ts

import { Router } from 'express';
import { PromotionController } from '../controllers/promotionController';
import { PromotionService } from '../services/promotionService';
import { pool } from '../config/config';

const router = Router();
const promotionService = new PromotionService(pool);
const promotionController = new PromotionController(promotionService);

router.post('/', promotionController.createPromotion);
router.get('/', promotionController.getAllPromotions);
router.get('/:id', promotionController.getPromotionById);
router.put('/:id', promotionController.updatePromotion);
router.delete('/:id', promotionController.deletePromotion);

export default router;