// src/controllers/sizeController.ts

import { Request, Response } from 'express';
import { SizeService } from '../services/sizeService';
import { NewSize, UpdateSize } from '../models/sizeModel';

export class SizeController {
    private sizeService: SizeService;

    constructor(sizeService: SizeService) {
        this.sizeService = sizeService;
    }

    createSize = async (req: Request, res: Response): Promise<void> => {
        try {
            const newSize: NewSize = req.body;
            if (!newSize.value || newSize.size_type_id === undefined) {
                res.status(400).json({ message: 'Size value and size type ID are required.' });
                return;
            }
            const id = await this.sizeService.createSize(newSize);
            res.status(201).json({ message: 'Size created successfully.', id });
        } catch (error) {
            console.error('Error in createSize:', error);
            res.status(400).json({ message: (error as Error).message });
        }
    };

    getAllSizes = async (req: Request, res: Response): Promise<void> => {
        try {
            const sizes = await this.sizeService.getAllSizes();
            res.json({
                success: true,
                message: 'Danh sách kích cỡ',
                data: sizes,
            });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách kích cỡ:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi lấy danh sách kích cỡ',
            });
        }
    };

    getSizeById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Size ID must be a valid number.' });
                return;
            }
            const size = await this.sizeService.getSizeById(id);
            if (size) {
                res.status(200).json(size);
            } else {
                res.status(404).json({ message: 'Size not found.' });
            }
        } catch (error) {
            console.error('Error in getSizeById:', error);
            res.status(500).json({ message: 'Failed to retrieve size.', error: (error as Error).message });
        }
    };

    updateSize = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Size ID must be a valid number.' });
                return;
            }
            const updateData: UpdateSize = req.body;
            if (updateData.value === undefined && updateData.size_type_id === undefined) {
                res.status(400).json({ message: 'At least one field (value or size_type_id) is required for update.' });
                return;
            }
            const success = await this.sizeService.updateSize(id, updateData);
            if (success) {
                res.status(200).json({ message: 'Size updated successfully.' });
            } else {
                res.status(404).json({ message: 'Size not found or no changes made.' });
            }
        } catch (error) {
            console.error('Error in updateSize:', error);
            res.status(500).json({ message: 'Failed to update size.', error: (error as Error).message });
        }
    };

    deleteSize = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Size ID must be a valid number.' });
                return;
            }
            const success = await this.sizeService.deleteSize(id);
            if (success) {
                res.status(200).json({ message: 'Size deleted successfully.' });
            } else {
                res.status(404).json({ message: 'Size not found.' });
            }
        } catch (error) {
            console.error('Error in deleteSize:', error);
            res.status(500).json({ message: 'Failed to delete size.', error: (error as Error).message });
        }
    };
}