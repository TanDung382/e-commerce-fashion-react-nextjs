// src/services/productTypeService.ts

import { Pool, RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';
import { ProductType, NewProductType, UpdateProductType } from '../models/typeModel';

export class ProductTypeService {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    private mapRowToProductType(row: RowDataPacket): ProductType {
        return {
            id: row.id, // id là int
            name: row.name
        };
    }

    async createProductType(data: NewProductType, txConnection?: PoolConnection): Promise<number> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const [result] = await connection.execute<ResultSetHeader>(
                'INSERT INTO product_types (name) VALUES (?)',
                [data.name]
            );
            return result.insertId; // Trả về ID tự tăng
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async getAllProductTypes(txConnection?: PoolConnection): Promise<ProductType[]> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const [rows] = await connection.execute<RowDataPacket[]>(
                'SELECT id, name FROM product_types ORDER BY name ASC'
            );
            return rows.map(row => this.mapRowToProductType(row));
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async getProductTypeById(id: number, txConnection?: PoolConnection): Promise<ProductType | null> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const [rows] = await connection.execute<RowDataPacket[]>(
                'SELECT id, name FROM product_types WHERE id = ?',
                [id]
            );
            return rows[0] ? this.mapRowToProductType(rows[0]) : null;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async updateProductType(id: number, data: UpdateProductType, txConnection?: PoolConnection): Promise<boolean> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const updateFields: string[] = [];
            const updateParams: any[] = [];

            if (data.name !== undefined) { updateFields.push('name = ?'); updateParams.push(data.name); }

            if (updateFields.length === 0) {
                return false;
            }
            
            updateParams.push(id);

            const updateSql = `UPDATE product_types SET ${updateFields.join(', ')} WHERE id = ?`;
            const [result] = await connection.execute<ResultSetHeader>(updateSql, updateParams);
            return result.affectedRows > 0;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async deleteProductType(id: number, txConnection?: PoolConnection): Promise<boolean> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const [result] = await connection.execute<ResultSetHeader>(
                'DELETE FROM product_types WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }
}