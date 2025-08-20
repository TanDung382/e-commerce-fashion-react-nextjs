// services/order-service/src/routes/orderRoutes.ts
import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { OrderService } from '../services/orderService';
import { pool } from '../config/config';

const router = Router();
const orderService = new OrderService(pool);
const orderController = new OrderController(orderService);

router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderById);

export default router;