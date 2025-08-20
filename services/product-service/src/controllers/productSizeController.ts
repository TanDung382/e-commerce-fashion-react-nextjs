// src/controllers/productSizeController.ts

import { Request, Response } from 'express';
import { ProductSizeService } from '../services/productSizeService';
import { NewProductSize, UpdateProductSize } from '../models/productSizeModel';

export class ProductSizeController {
    private productSizeService: ProductSizeService;

    constructor(productSizeService: ProductSizeService) {
        this.productSizeService = productSizeService;
    }

    createProductSize = async (req: Request, res: Response): Promise<void> => {
        try {
            const newSize: NewProductSize = req.body;
            if (!newSize.product_id || newSize.size_id === undefined || newSize.stock === undefined) {
                res.status(400).json({ message: 'Product ID, size ID, and stock are required.' });
                return;
            }
            const id = await this.productSizeService.createProductSize(newSize);
            res.status(201).json({ message: 'Product size created successfully.', id });
        } catch (error) {
            console.error('Error in createProductSize:', error);
            res.status(400).json({ message: (error as Error).message });
        }
    };

    getAllProductSize = async (req: Request, res: Response): Promise<void> => {
        try {
            const productSizes = await this.productSizeService.getAllProductSize();
            res.json({
                success: true,
                message: 'Danh sách size sản phẩm',
                data: productSizes,
            });
        } catch (error) {
            console.error('Lỗi khi lấy size sản phẩm:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi lấy size sản phẩm',
            });
        }
    };

    getProductSizesByProductId = async (req: Request, res: Response): Promise<void> => {
        try {
            const productId = req.params.productId;
            if (!productId) {
                res.status(400).json({ message: 'Product ID is required.' });
                return;
            }
            const sizes = await this.productSizeService.getProductSizesByProductId(productId);
            res.status(200).json(sizes);
        } catch (error) {
            console.error('Error in getProductSizesByProductId:', error);
            res.status(500).json({ message: 'Failed to retrieve product sizes.', error: (error as Error).message });
        }
    };

    getProductSizeById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ message: 'Product Size ID is required.' });
                return;
            }
            const size = await this.productSizeService.getProductSizeById(id);
            if (size) {
                res.status(200).json(size);
            } else {
                res.status(404).json({ message: 'Product size not found.' });
            }
        } catch (error) {
            console.error('Error in getProductSizeById:', error);
            res.status(500).json({ message: 'Failed to retrieve product size.', error: (error as Error).message });
        }
    };

    updateProductSize = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ message: 'Product Size ID is required.' });
                return;
            }
            const updateData: UpdateProductSize = req.body;
            if (updateData.size_id === undefined && updateData.stock === undefined) {
                res.status(400).json({ message: 'At least one field (size_id or stock) is required for update.' });
                return;
            }
            const success = await this.productSizeService.updateProductSize(id, updateData);
            if (success) {
                res.status(200).json({ message: 'Product size updated successfully.' });
            } else {
                res.status(404).json({ message: 'Product size not found or no changes made.' });
            }
        } catch (error) {
            console.error('Error in updateProductSize:', error);
            res.status(500).json({ message: 'Failed to update product size.', error: (error as Error).message });
        }
    };

    deleteProductSize = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ message: 'Product Size ID is required.' });
                return;
            }
            const success = await this.productSizeService.deleteProductSize(id);
            if (success) {
                res.status(200).json({ message: 'Product size deleted successfully.' });
            } else {
                res.status(404).json({ message: 'Product size not found.' });
            }
        } catch (error) {
            console.error('Error in deleteProductSize:', error);
            res.status(500).json({ message: 'Failed to delete product size.', error: (error as Error).message });
        }
    };
}