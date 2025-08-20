// src/controllers/imageController.ts

import { Request, Response } from 'express';
import { ProductImageService } from '../services/imageService';
import { NewProductImage, UpdateProductImage } from '../models/imageModel';

export class ProductImageController {
    private productImageService: ProductImageService;

    constructor(productImageService: ProductImageService) {
        this.productImageService = productImageService;
    }

    createImage = async (req: Request, res: Response): Promise<void> => {
        try {
            const newImage: NewProductImage = req.body;
            if (!newImage.product_id || !newImage.image_url) {
                res.status(400).json({ message: 'Product ID and image URL are required.' });
                return;
            }
            const id = await this.productImageService.createImage(newImage);
            res.status(201).json({ message: 'Image created successfully.', id });
        } catch (error) {
            console.error('Error in createImage:', error);
            res.status(400).json({ message: (error as Error).message });
        }
    };

    getImagesByProductId = async (req: Request, res: Response): Promise<void> => {
        try {
            const productId = req.params.productId; // Product ID là UUID (string)
            if (!productId) {
                res.status(400).json({ message: 'Product ID is required.' });
                return;
            }
            const images = await this.productImageService.getImagesByProductId(productId);
            res.status(200).json(images);
        } catch (error) {
            console.error('Error in getImagesByProductId:', error);
            res.status(500).json({ message: 'Failed to retrieve images.', error: (error as Error).message });
        }
    };

    getImageById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id; // Image ID là UUID (string)
            if (!id) {
                res.status(400).json({ message: 'Image ID is required.' });
                return;
            }
            const image = await this.productImageService.getImageById(id);
            if (image) {
                res.status(200).json(image);
            } else {
                res.status(404).json({ message: 'Image not found.' });
            }
        } catch (error) {
            console.error('Error in getImageById:', error);
            res.status(500).json({ message: 'Failed to retrieve image.', error: (error as Error).message });
        }
    };

    updateImage = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id; // Image ID là UUID (string)
            if (!id) {
                res.status(400).json({ message: 'Image ID is required.' });
                return;
            }
            const updateData: UpdateProductImage = req.body;
            const success = await this.productImageService.updateImage(id, updateData);
            if (success) {
                res.status(200).json({ message: 'Image updated successfully.' });
            } else {
                res.status(404).json({ message: 'Image not found or no changes made.' });
            }
        } catch (error) {
            console.error('Error in updateImage:', error);
            res.status(500).json({ message: 'Failed to update image.', error: (error as Error).message });
        }
    };

    deleteImage = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id; // Image ID là UUID (string)
            if (!id) {
                res.status(400).json({ message: 'Image ID is required.' });
                return;
            }
            const success = await this.productImageService.deleteImage(id);
            if (success) {
                res.status(200).json({ message: 'Image deleted successfully.' });
            } else {
                res.status(404).json({ message: 'Image not found.' });
            }
        } catch (error) {
            console.error('Error in deleteImage:', error);
            res.status(500).json({ message: 'Failed to delete image.', error: (error as Error).message });
        }
    };
}