// src/services/imageService.ts

import { Pool, RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 trực tiếp
import { ProductImage, NewProductImage, UpdateProductImage } from '../models/imageModel';
import { Buffer } from 'buffer';

// Hàm UUID utilities (chỉ cần trong các service xử lý binary(16))
function binaryToUuid(buffer: Buffer): string {
    if (!buffer || buffer.length !== 16) {
        throw new Error('Invalid UUID buffer for conversion');
    }
    return buffer.toString('hex').replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
}

function uuidToBinary(uuid: string): Buffer {
    if (!uuid || typeof uuid !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid)) {
        throw new Error('Invalid UUID string for conversion');
    }
    const hex = uuid.replace(/-/g, '');
    return Buffer.from(hex, 'hex');
}

export class ProductImageService {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    private mapRowToProductImage(row: RowDataPacket): ProductImage {
        return {
            id: binaryToUuid(row.id), // UUID
            product_id: binaryToUuid(row.product_id), // UUID
            image_url: row.image_url || null,
            is_thumbnail: Boolean(row.is_thumbnail),
            created_at: new Date(row.created_at),
            updated_at: new Date(row.updated_at),
        };
    }

    async createImage(data: NewProductImage, txConnection?: PoolConnection): Promise<string> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const newImageId = uuidToBinary(uuidv4()); // Tạo UUID bằng uuidv4()
            await connection.execute<ResultSetHeader>(
                'INSERT INTO product_images (id, product_id, image_url, is_thumbnail) VALUES (?, ?, ?, ?)',
                [newImageId, uuidToBinary(data.product_id), data.image_url, data.is_thumbnail ?? false]
            );
            return binaryToUuid(newImageId);
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async getImagesByProductId(productId: string, txConnection?: PoolConnection): Promise<ProductImage[]> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const [rows] = await connection.execute<RowDataPacket[]>(
                'SELECT id, product_id, image_url, is_thumbnail, created_at, updated_at FROM product_images WHERE product_id = ? ORDER BY is_thumbnail DESC, created_at ASC',
                [uuidToBinary(productId)]
            );
            return rows.map(row => this.mapRowToProductImage(row));
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async deleteImagesByProductId(productId: string, txConnection?: PoolConnection): Promise<boolean> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const [result] = await connection.execute<ResultSetHeader>(
                'DELETE FROM product_images WHERE product_id = ?',
                [uuidToBinary(productId)]
            );
            return result.affectedRows > 0;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async getImageById(id: string, txConnection?: PoolConnection): Promise<ProductImage | null> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const [rows] = await connection.execute<RowDataPacket[]>(
                'SELECT id, product_id, image_url, is_thumbnail, created_at, updated_at FROM product_images WHERE id = ?',
                [uuidToBinary(id)]
            );
            return rows[0] ? this.mapRowToProductImage(rows[0]) : null;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async updateImage(id: string, data: UpdateProductImage, txConnection?: PoolConnection): Promise<boolean> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const updateFields: string[] = [];
            const updateParams: any[] = [];

            if (data.image_url !== undefined) { updateFields.push('image_url = ?'); updateParams.push(data.image_url); }
            if (data.is_thumbnail !== undefined) { updateFields.push('is_thumbnail = ?'); updateParams.push(data.is_thumbnail); }

            if (updateFields.length === 0) {
                return false;
            }

            updateFields.push('updated_at = CURRENT_TIMESTAMP');
            updateParams.push(uuidToBinary(id));

            const updateSql = `UPDATE product_images SET ${updateFields.join(', ')} WHERE id = ?`;
            const [result] = await connection.execute<ResultSetHeader>(updateSql, updateParams);
            return result.affectedRows > 0;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async deleteImage(id: string, txConnection?: PoolConnection): Promise<boolean> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const [result] = await connection.execute<ResultSetHeader>(
                'DELETE FROM product_images WHERE id = ?',
                [uuidToBinary(id)]
            );
            return result.affectedRows > 0;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }
}