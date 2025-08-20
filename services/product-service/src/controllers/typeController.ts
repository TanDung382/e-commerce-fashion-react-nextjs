// src/controllers/productTypeController.ts

import { Request, Response } from 'express';
import { ProductTypeService } from '../services/typeService';
import { NewProductType, UpdateProductType } from '../models/typeModel';

export class ProductTypeController {
    private productTypeService: ProductTypeService;

    constructor(productTypeService: ProductTypeService) {
        this.productTypeService = productTypeService;
    }

    createProductType = async (req: Request, res: Response): Promise<void> => {
        try {
            const newProductType: NewProductType = req.body;
            if (!newProductType.name) {
                res.status(400).json({ message: 'Product type name and size type ID are required.' });
                return;
            }
            const id = await this.productTypeService.createProductType(newProductType);
            res.status(201).json({ message: 'Product type created successfully.', id });
        } catch (error) {
            console.error('Error in createProductType:', error);
            res.status(400).json({ message: (error as Error).message });
        }
    };

    getAllProductTypes = async (req: Request, res: Response): Promise<void> => {
        try {
            const sizeType = await this.productTypeService.getAllProductTypes();
            res.json({
                success: true,
                message: 'Danh sách loại sản phẩm',
                data: sizeType,
            });
        }   catch (error) {
                console.error('Lỗi khi lấy loại sản phẩm:', error);
                res.status(500).json({
                    success: false,
                    message: 'Lỗi server khi lấy loạisản phẩm',
                });
            }
    };

    getProductTypeById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id as string, 10); // ID là number, cần parse
            if (isNaN(id)) {
                res.status(400).json({ message: 'Product Type ID must be a valid number.' });
                return;
            }
            const productType = await this.productTypeService.getProductTypeById(id);
            if (productType) {
                res.status(200).json(productType);
            } else {
                res.status(404).json({ message: 'Product type not found.' });
            }
        } catch (error) {
            console.error('Error in getProductTypeById:', error);
            res.status(500).json({ message: 'Failed to retrieve product type.', error: (error as Error).message });
        }
    };

    updateProductType = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id as string, 10); // ID là number, cần parse
            if (isNaN(id)) {
                res.status(400).json({ message: 'Product Type ID must be a valid number.' });
                return;
            }
            const updateData: UpdateProductType = req.body;
            const success = await this.productTypeService.updateProductType(id, updateData);
            if (success) {
                res.status(200).json({ message: 'Product type updated successfully.' });
            } else {
                res.status(404).json({ message: 'Product type not found or no changes made.' });
            }
        } catch (error) {
            console.error('Error in updateProductType:', error);
            res.status(500).json({ message: 'Failed to update product type.', error: (error as Error).message });
        }
    };

    deleteProductType = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id as string, 10); // ID là number, cần parse
            if (isNaN(id)) {
                res.status(400).json({ message: 'Product Type ID must be a valid number.' });
                return;
            }
            const success = await this.productTypeService.deleteProductType(id);
            if (success) {
                res.status(200).json({ message: 'Product type deleted successfully.' });
            } else {
                res.status(404).json({ message: 'Product type not found.' });
            }
        } catch (error) {
            console.error('Error in deleteProductType:', error);
            res.status(500).json({ message: 'Failed to delete product type.', error: (error as Error).message });
        }
    };
}