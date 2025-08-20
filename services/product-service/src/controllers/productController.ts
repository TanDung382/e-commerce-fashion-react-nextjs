// src/controllers/productController.ts

import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { NewProduct, UpdateProduct } from '../models/productModel';

export class ProductController {
    private productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;
    }

    getAllProducts = async (req: Request, res: Response): Promise<void> => {
        try {
            const sortBy = (req.query.sortBy as string) || 'created_at';
            const sortOrder = (req.query.sortOrder as 'ASC' | 'DESC') || 'DESC';
            const filters: any = {};
            if (req.query.category_id) filters.category_id = parseInt(req.query.category_id as string, 10);
            if (req.query.product_type_id) filters.product_type_id = parseInt(req.query.product_type_id as string, 10);
            if (req.query.is_visible !== undefined) filters.is_visible = req.query.is_visible === 'true';
            if (req.query.search) filters.search = req.query.search as string;

            const products = await this.productService.getAllProducts(filters, sortBy, sortOrder);
                res.json({
                success: true,
                message: 'Danh sách sản phẩm',
                data: products,
            });
        } catch (error) {
            console.error('Lỗi khi lấy sản phẩm:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi lấy sản phẩm',
            });
        }
    };
    
    getBestSellerProducts = async (req: Request, res: Response): Promise<void> => {
        try {
            const categories = await this.productService.getBestSellerProducts();
            res.status(200).json({
                success: true,
                message: 'Danh sách sản phẩm bán chạy theo danh mục',
                data: categories,
            });
        } catch (error) {
            console.error('Error in getBestSellerProducts:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi lấy sản phẩm bán chạy',
                error: (error as Error).message,
            });
        }
    };

    getProductById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id; // Product ID là UUID (string)
            if (!id) {
                res.status(400).json({
                    data: null,
                    message: 'Product ID is required.',
                    status: 400
                });
                return;
            }
            const product = await this.productService.getProductById(id);
            if (product) {
                res.status(200).json({
                    data: product,
                    message: 'Lấy thông tin sản phẩm thành công.',
                    status: 200
                });
            } else {
                res.status(404).json({
                    data: null,
                    message: 'Không tìm thấy sản phẩm.',
                    status: 404
                });
            }
        } catch (error) {
            console.error('Error in getProductById:', error);
            res.status(500).json({
                data: null,
                message: 'Failed to retrieve product.',
                error: (error as Error).message,
                status: 500
            });
        }
    };

    getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
        try {
            const { slug } = req.params; // Lấy slug từ URL
            if (!slug) {
                res.status(400).json({
                    data: null,
                    message: 'Category slug is required.',
                    status: 400
                });
                return;
            }
            const products = await this.productService.getProductsByCategory(slug);
            res.status(200).json({
                success: true,
                message: 'Danh sách sản phẩm theo danh mục',
                data: products,
            });
        } catch (error) {
            console.error('Error in getProductsByCategory:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi lấy sản phẩm theo danh mục.',
                error: (error as Error).message,
            });
        }
    };

    createProduct = async (req: Request, res: Response): Promise<void> => {
        try {
            const newProduct: NewProduct = req.body;
            const id = await this.productService.createProduct(newProduct);
            res.status(201).json({ message: 'Product created successfully.', id });
        } catch (error) {
            console.error('Error in createProduct:', error);
            res.status(400).json({ message: (error as Error).message });
        }
    };

    updateProduct = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id; // Product ID là UUID (string)
            if (!id) {
                res.status(400).json({ message: 'Product ID is required.' });
                return;
            }
            const updateData: UpdateProduct = req.body;
            const success = await this.productService.updateProduct(id, updateData);
            if (success) {
                res.status(200).json({ message: 'Product updated successfully.' });
            } else {
                res.status(404).json({ message: 'Product not found or no changes made.' });
            }
        } catch (error) {
            console.error('Error in updateProduct:', error);
            res.status(500).json({ message: 'Failed to update product.', error: (error as Error).message });
        }
    };

    deleteProduct = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id; // Product ID là UUID (string)
            if (!id) {
                res.status(400).json({ message: 'Product ID is required.' });
                return;
            }
            const success = await this.productService.deleteProduct(id);
            if (success) {
                res.status(200).json({ message: 'Product deleted successfully.' });
            } else {
                res.status(404).json({ message: 'Product not found.' });
            }
        } catch (error) {
            console.error('Error in deleteProduct:', error);
            res.status(500).json({ message: 'Failed to delete product.', error: (error as Error).message });
        }
    };
}