// services/order-service/src/controllers/orderController.ts
import { Request, Response } from 'express';
import { OrderService } from '../services/orderService'; 
import { NewOrder } from '../models/orderModel';

export class OrderController {
  private orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: NewOrder = req.body;
      if (!data.user_id || !data.order_address || !data.items || !data.payment_method) {
        res.status(400).json({ message: 'Missing required fields.' });
        return;
      }

      const result = await this.orderService.createOrder(data);
      res.status(201).json({ message: 'Order created successfully.', ...result });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ message: 'Failed to create order.', error: (error as Error).message });
    }
  };

  getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ message: 'Order ID is required.' });
        return;
      }
      const order = await this.orderService.getOrderById(id);
      if (order) {
        res.status(200).json({ message: 'Order retrieved successfully.', data: order });
      } else {
        res.status(404).json({ message: 'Order not found.' });
      }
    } catch (error) {
      console.error('Error retrieving order:', error);
      res.status(500).json({ message: 'Failed to retrieve order.', error: (error as Error).message });
    }
  };
}