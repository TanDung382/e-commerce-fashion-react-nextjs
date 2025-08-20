// src/controllers/promotionController.ts

import { Request, Response } from 'express';
import { PromotionService } from '../services/promotionService';
import { NewPromotion, UpdatePromotion } from '../models/promotionModel';

export class PromotionController {
    private promotionService: PromotionService;

    constructor(promotionService: PromotionService) {
        this.promotionService = promotionService;
    }

    createPromotion = async (req: Request, res: Response): Promise<void> => {
        try {
            const newPromotion: NewPromotion = req.body;
            if (!newPromotion.name || !newPromotion.discount_type || newPromotion.discount_value === undefined || !newPromotion.start_date || !newPromotion.end_date) {
                res.status(400).json({ message: 'Promotion name, discount type, value, start date, and end date are required.' });
                return;
            }
            const id = await this.promotionService.createPromotion(newPromotion);
            res.status(201).json({ message: 'Promotion created successfully.', id });
        } catch (error) {
            console.error('Error in createPromotion:', error);
            res.status(400).json({ message: (error as Error).message });
        }
    };

    getAllPromotions = async (req: Request, res: Response): Promise<void> => {
    try {
        const promotions = await this.promotionService.getAllPromotions();
        res.json({
            success: true,
            message: 'Danh sách khuyến mãi',
            data: promotions,
        });
    }   catch (error) {
            console.error('Lỗi khi lấy khuyến mãi:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi lấy khuyến mãi',
            });
        }
    };

    getPromotionById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id; // Promotion ID là UUID (string)
            if (!id) {
                res.status(400).json({ message: 'Promotion ID is required.' });
                return;
            }
            const promotion = await this.promotionService.getPromotionById(id);
            if (promotion) {
                res.status(200).json(promotion);
            } else {
                res.status(404).json({ message: 'Promotion not found.' });
            }
        } catch (error) {
            console.error('Error in getPromotionById:', error);
            res.status(500).json({ message: 'Failed to retrieve promotion.', error: (error as Error).message });
        }
    };

    updatePromotion = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id; // Promotion ID là UUID (string)
            if (!id) {
                res.status(400).json({ message: 'Promotion ID is required.' });
                return;
            }
            const updateData: UpdatePromotion = req.body;
            const success = await this.promotionService.updatePromotion(id, updateData);
            if (success) {
                res.status(200).json({ message: 'Promotion updated successfully.' });
            } else {
                res.status(404).json({ message: 'Promotion not found or no changes made.' });
            }
        } catch (error) {
            console.error('Error in updatePromotion:', error);
            res.status(500).json({ message: 'Failed to update promotion.', error: (error as Error).message });
        }
    };

    deletePromotion = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id; // Promotion ID là UUID (string)
            if (!id) {
                res.status(400).json({ message: 'Promotion ID is required.' });
                return;
            }
            const success = await this.promotionService.deletePromotion(id);
            if (success) {
                res.status(200).json({ message: 'Promotion deleted successfully.' });
            } else {
                res.status(404).json({ message: 'Promotion not found.' });
            }
        } catch (error) {
            console.error('Error in deletePromotion:', error);
            res.status(500).json({ message: 'Failed to delete promotion.', error: (error as Error).message });
        }
    };
}