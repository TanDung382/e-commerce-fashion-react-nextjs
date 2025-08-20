// src/services/productSizeService.ts

import { Pool, RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import { ProductSize, NewProductSize, UpdateProductSize } from '../models/productSizeModel';
import { Buffer } from 'buffer';

// Hàm UUID utilities
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

export class ProductSizeService {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    private mapRowToProductSize(row: RowDataPacket): ProductSize {
        return {
            id: binaryToUuid(row.id),
            product_id: binaryToUuid(row.product_id),
            product_name: row.product_name || null,
            size_id: row.size_id,
            size_value: row.size_value,
            stock: row.stock,
            size_type_id: row.size_type_id,
            size_type_name: row.size_type_name || null,
            size_type_code: row.size_type_code || null,
            created_at: new Date(row.created_at),
            updated_at: new Date(row.updated_at),
        };
    }

    async createProductSize(data: NewProductSize, txConnection?: PoolConnection): Promise<string> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const newSizeId = uuidToBinary(uuidv4());
            await connection.execute<ResultSetHeader>(
                'INSERT INTO product_sizes (id, product_id, size_id, stock) VALUES (?, ?, ?, ?)',
                [newSizeId, uuidToBinary(data.product_id), data.size_id, data.stock]
            );
            return binaryToUuid(newSizeId);
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async getAllProductSize(): Promise<ProductSize[]> {
        let connection: PoolConnection | null = null;
        try {
            connection = await this.pool.getConnection();
            const query = `
                SELECT 
                    ps.id, ps.product_id, ps.size_id, s.value AS size_value, ps.stock,
                    s.size_type_id, st.name AS size_type_name, st.type_code AS size_type_code,
                    p.name AS product_name, ps.created_at, ps.updated_at
                FROM product_sizes ps
                JOIN sizes s ON ps.size_id = s.id
                JOIN size_types st ON s.size_type_id = st.id
                JOIN products p ON ps.product_id = p.id
                ORDER BY s.value ASC;
            `;
            const [rows] = await connection.query<RowDataPacket[]>(query);
            return rows.map(row => this.mapRowToProductSize(row));
        } catch (error) {
            console.error('SQL error in getAllProductSize:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    async getProductSizesByProductId(productId: string, txConnection?: PoolConnection): Promise<ProductSize[]> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const [rows] = await connection.execute<RowDataPacket[]>(
                `SELECT 
                    ps.id, ps.product_id, ps.size_id, s.value AS size_value, ps.stock,
                    s.size_type_id, st.name AS size_type_name, st.type_code AS size_type_code,
                    ps.created_at, ps.updated_at
                FROM product_sizes ps
                JOIN sizes s ON ps.size_id = s.id
                JOIN size_types st ON s.size_type_id = st.id
                WHERE ps.product_id = ?
                ORDER BY st.name ASC, s.value ASC`,
                [uuidToBinary(productId)]
            );
            return rows.map(row => this.mapRowToProductSize(row));
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async deleteProductSizesByProductId(productId: string, txConnection?: PoolConnection): Promise<boolean> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const [result] = await connection.execute<ResultSetHeader>(
                'DELETE FROM product_sizes WHERE product_id = ?',
                [uuidToBinary(productId)]
            );
            return result.affectedRows > 0;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async getProductSizeById(id: string, txConnection?: PoolConnection): Promise<ProductSize | null> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const [rows] = await connection.execute<RowDataPacket[]>(
                `SELECT 
                    ps.id, ps.product_id, ps.size_id, s.value AS size_value, ps.stock,
                    s.size_type_id, st.name AS size_type_name, st.type_code AS size_type_code,
                    ps.created_at, ps.updated_at
                FROM product_sizes ps
                JOIN sizes s ON ps.size_id = s.id
                JOIN size_types st ON s.size_type_id = st.id
                WHERE ps.id = ?`,
                [uuidToBinary(id)]
            );
            return rows[0] ? this.mapRowToProductSize(rows[0]) : null;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async updateProductSize(id: string, data: UpdateProductSize, txConnection?: PoolConnection): Promise<boolean> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const updateFields: string[] = [];
            const updateParams: any[] = [];

            if (data.size_id !== undefined) {
                updateFields.push('size_id = ?');
                updateParams.push(data.size_id);
            }
            if (data.stock !== undefined) {
                updateFields.push('stock = ?');
                updateParams.push(data.stock);
            }

            if (updateFields.length === 0) {
                return false;
            }

            updateFields.push('updated_at = CURRENT_TIMESTAMP');
            updateParams.push(uuidToBinary(id));

            const updateSql = `UPDATE product_sizes SET ${updateFields.join(', ')} WHERE id = ?`;
            const [result] = await connection.execute<ResultSetHeader>(updateSql, updateParams);
            return result.affectedRows > 0;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async deleteProductSize(id: string, txConnection?: PoolConnection): Promise<boolean> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const [result] = await connection.execute<ResultSetHeader>(
                'DELETE FROM product_sizes WHERE id = ?',
                [uuidToBinary(id)]
            );
            return result.affectedRows > 0;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }
}