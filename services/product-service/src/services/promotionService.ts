// src/services/promotionService.ts

import { Pool, RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 trực tiếp
import { Promotion, NewPromotion, UpdatePromotion } from '../models/promotionModel';
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

export class PromotionService {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    private mapRowToPromotion(row: RowDataPacket): Promotion {
        return {
            id: binaryToUuid(row.id), // UUID
            name: row.name,
            description: row.description || null,
            discount_type: row.discount_type,
            discount_value: parseFloat(row.discount_value),
            start_date: new Date(row.start_date),
            end_date: new Date(row.end_date),
            created_at: new Date(row.created_at),
            updated_at: new Date(row.updated_at),
        };
    }

    async getAllPromotions(): Promise<Promotion[]> {
        let connection: PoolConnection | null = null;
        try {
            connection = await this.pool.getConnection();
    
            const query = `
                SELECT id, name, description, discount_type, discount_value, start_date, end_date, created_at, updated_at
                FROM promotions
                ORDER BY name ASC;
            `;
    
            const [rows] = await connection.query<RowDataPacket[]>(query);
    
            return rows.map(row => this.mapRowToPromotion(row));
        } catch (error) {
            console.error('SQL error in getAllPromotions:', error);
            throw error;
        }finally {
            if (connection) connection.release();
        }
    }

    async getPromotionById(id: string, txConnection?: PoolConnection): Promise<Promotion | null> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const [rows] = await connection.execute<RowDataPacket[]>(
                'SELECT * FROM promotions WHERE id = ?',
                [uuidToBinary(id)]
            );
            return rows[0] ? this.mapRowToPromotion(rows[0]) : null;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async getPromotionsByProductId(productId: string, txConnection?: PoolConnection): Promise<Promotion[]> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const [rows] = await connection.execute<RowDataPacket[]>(
                `SELECT
                    prm.id, prm.name, prm.description, prm.discount_type, prm.discount_value,
                    prm.start_date, prm.end_date, prm.created_at, prm.updated_at
                FROM promotions prm
                JOIN product_promotions pp ON prm.id = pp.promotion_id
                WHERE pp.product_id = ?`,
                [uuidToBinary(productId)]
            );
            return rows.map(row => this.mapRowToPromotion(row));
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async createPromotion(data: NewPromotion, txConnection?: PoolConnection): Promise<string> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const newPromoId = uuidToBinary(uuidv4()); // Tạo UUID bằng uuidv4()
            await connection.execute<ResultSetHeader>(
                `INSERT INTO promotions (id, name, description, discount_type, discount_value, start_date, end_date)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    newPromoId, data.name, data.description || null, data.discount_type,
                    data.discount_value, new Date(data.start_date as string), new Date(data.end_date as string) // Sửa: Chuyển chuỗi thành Date object
                ]
            );
            return binaryToUuid(newPromoId);
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async updatePromotion(id: string, data: UpdatePromotion, txConnection?: PoolConnection): Promise<boolean> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const updateFields: string[] = [];
            const updateParams: any[] = [];

            if (data.name !== undefined) { updateFields.push('name = ?'); updateParams.push(data.name); }
            if (data.description !== undefined) { updateFields.push('description = ?'); updateParams.push(data.description || null); }
            if (data.discount_type !== undefined) { updateFields.push('discount_type = ?'); updateParams.push(data.discount_type); }
            if (data.discount_value !== undefined) { updateFields.push('discount_value = ?'); updateParams.push(data.discount_value); }
            
            // Sửa lỗi: Chuyển đổi chuỗi ngày giờ từ frontend thành Date object
            if (data.start_date !== undefined) { updateFields.push('start_date = ?'); updateParams.push(new Date(data.start_date as string)); }
            if (data.end_date !== undefined) { updateFields.push('end_date = ?'); updateParams.push(new Date(data.end_date as string)); }

            if (updateFields.length === 0) {
                return false; // No fields to update
            }

            updateFields.push('updated_at = CURRENT_TIMESTAMP');
            updateParams.push(uuidToBinary(id));

            const updateSql = `UPDATE promotions SET ${updateFields.join(', ')} WHERE id = ?`;
            const [result] = await connection.execute<ResultSetHeader>(updateSql, updateParams);
            return result.affectedRows > 0;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async deletePromotion(id: string, txConnection?: PoolConnection): Promise<boolean> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const [result] = await connection.execute<ResultSetHeader>(
                'DELETE FROM promotions WHERE id = ?',
                [uuidToBinary(id)]
            );
            return result.affectedRows > 0;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }
}
