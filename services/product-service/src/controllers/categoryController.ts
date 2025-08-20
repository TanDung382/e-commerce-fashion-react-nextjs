// src/controllers/categoryController.ts

import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';
import { NewCategory, UpdateCategory } from '../models/categoryModel';

export class CategoryController {
    private categoryService: CategoryService;

    constructor(categoryService: CategoryService) {
        this.categoryService = categoryService;
    }

    createCategory = async (req: Request, res: Response): Promise<void> => {
        try {
            const newCategory: NewCategory = req.body;
            if (!newCategory.name) {
                res.status(400).json({ message: 'Category name is required.' });
                return;
            }
            const id = await this.categoryService.createCategory(newCategory);
            res.status(201).json({ message: 'Category created successfully.', id });
        } catch (error) {
            console.error('Error in createCategory:', error);
            res.status(400).json({ message: (error as Error).message });
        }
    };

    getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
        try {
            const { slug } = req.params;
            const category = await this.categoryService.getCategoryBySlug(slug);
            if (category) {
                res.status(200).json(category);
            } else {
                res.status(404).json({ message: 'Category not found.' });
            }
        } catch (error) {
            console.error('Error in getCategoryBySlug:', error);
            res.status(500).json({ message: 'Failed to retrieve category.', error: (error as Error).message });
        }
    };

    getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await this.categoryService.getAllCategories();
        res.json({
            success: true,
            message: 'Danh sách danh mục',
            data: categories,
        });
    }   catch (error) {
            console.error('Lỗi khi lấy danh mục:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi lấy danh mục',
            });
        }
    };

    getCategoryById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id as string, 10); // ID là number, cần parse
            if (isNaN(id)) {
                res.status(400).json({ message: 'Category ID must be a valid number.' });
                return;
            }
            const category = await this.categoryService.getCategoryById(id);
            if (category) {
                res.status(200).json(category);
            } else {
                res.status(404).json({ message: 'Category not found.' });
            }
        } catch (error) {
            console.error('Error in getCategoryById:', error);
            res.status(500).json({ message: 'Failed to retrieve category.', error: (error as Error).message });
        }
    };

    updateCategory = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id as string, 10); // ID là number, cần parse
            if (isNaN(id)) {
                res.status(400).json({ message: 'Category ID must be a valid number.' });
                return;
            }
            const updateData: UpdateCategory = req.body;
            const success = await this.categoryService.updateCategory(id, updateData);
            if (success) {
                res.status(200).json({ message: 'Category updated successfully.' });
            } else {
                res.status(404).json({ message: 'Category not found or no changes made.' });
            }
        } catch (error) {
            console.error('Error in updateCategory:', error);
            res.status(500).json({ message: 'Failed to update category.', error: (error as Error).message });
        }
    };

    deleteCategory = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id as string, 10); // ID là number, cần parse
            if (isNaN(id)) {
                res.status(400).json({ message: 'Category ID must be a valid number.' });
                return;
            }
            const success = await this.categoryService.deleteCategory(id);
            if (success) {
                res.status(200).json({ message: 'Category deleted successfully.' });
            } else {
                res.status(404).json({ message: 'Category not found.' });
            }
        } catch (error) {
            console.error('Error in deleteCategory:', error);
            res.status(500).json({ message: 'Failed to delete category.', error: (error as Error).message });
        }
    };
}