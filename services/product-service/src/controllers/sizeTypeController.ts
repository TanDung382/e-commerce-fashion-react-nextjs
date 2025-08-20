// src/controllers/sizeTypeController.ts

import { Request, Response } from 'express';
import { SizeTypeService } from '../services/sizeTypeService';
import { NewSizeType, UpdateSizeType } from '../models/sizeTypeModel';

export class SizeTypeController {
    private sizeTypeService: SizeTypeService;

    constructor(sizeTypeService: SizeTypeService) {
        this.sizeTypeService = sizeTypeService;
    }

    createSizeType = async (req: Request, res: Response): Promise<void> => {
        try {
            const newSizeType: NewSizeType = req.body;
            if (!newSizeType.name || !newSizeType.type_code) {
                res.status(400).json({ message: 'Size type name and type code are required.' });
                return;
            }
            const id = await this.sizeTypeService.createSizeType(newSizeType);
            res.status(201).json({ message: 'Size type created successfully.', id });
        } catch (error) {
            console.error('Error in createSizeType:', error);
            res.status(400).json({ message: (error as Error).message });
        }
    };

    getAllSizeTypes = async (req: Request, res: Response): Promise<void> => {
        try {
            const sizeType = await this.sizeTypeService.getAllSizeTypes();
            res.json({
                success: true,
                message: 'Danh sách loại size sản phẩm',
                data: sizeType,
            });
        }   catch (error) {
                console.error('Lỗi khi lấy loại size sản phẩm:', error);
                res.status(500).json({
                    success: false,
                    message: 'Lỗi server khi lấy loại size sản phẩm',
                });
            }
    };

    getSizeTypeById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id as string, 10); // ID là number, cần parse
            if (isNaN(id)) {
                res.status(400).json({ message: 'Size Type ID must be a valid number.' });
                return;
            }
            const sizeType = await this.sizeTypeService.getSizeTypeById(id);
            if (sizeType) {
                res.status(200).json(sizeType);
            } else {
                res.status(404).json({ message: 'Size type not found.' });
            }
        } catch (error) {
            console.error('Error in getSizeTypeById:', error);
            res.status(500).json({ message: 'Failed to retrieve size type.', error: (error as Error).message });
        }
    };

    updateSizeType = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id as string, 10); // ID là number, cần parse
            if (isNaN(id)) {
                res.status(400).json({ message: 'Size Type ID must be a valid number.' });
                return;
            }
            const updateData: UpdateSizeType = req.body;
            const success = await this.sizeTypeService.updateSizeType(id, updateData);
            if (success) {
                res.status(200).json({ message: 'Size type updated successfully.' });
            } else {
                res.status(404).json({ message: 'Size type not found or no changes made.' });
            }
        } catch (error) {
            console.error('Error in updateSizeType:', error);
            res.status(500).json({ message: 'Failed to update size type.', error: (error as Error).message });
        }
    };

    deleteSizeType = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id as string, 10); // ID là number, cần parse
            if (isNaN(id)) {
                res.status(400).json({ message: 'Size Type ID must be a valid number.' });
                return;
            }
            const success = await this.sizeTypeService.deleteSizeType(id);
            if (success) {
                res.status(200).json({ message: 'Size type deleted successfully.' });
            } else {
                res.status(404).json({ message: 'Size type not found.' });
            }
        } catch (error) {
            console.error('Error in deleteSizeType:', error);
            res.status(500).json({ message: 'Failed to delete size type.', error: (error as Error).message });
        }
    };
}