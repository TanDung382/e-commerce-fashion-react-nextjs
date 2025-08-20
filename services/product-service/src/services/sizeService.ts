// src/services/sizeService.ts

import { Pool, RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';
import { Size, NewSize, UpdateSize } from '../models/sizeModel';

export class SizeService {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    private mapRowToSize(row: RowDataPacket): Size {
        return {
            id: row.id,
            value: row.value,
            size_type_id: row.size_type_id,
            size_type_name: row.size_type_name || null,
            size_type_code: row.size_type_code || null,
            created_at: new Date(row.created_at),
            updated_at: new Date(row.updated_at),
        };
    }

    async createSize(data: NewSize, txConnection?: PoolConnection): Promise<number> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const [result] = await connection.execute<ResultSetHeader>(
                'INSERT INTO sizes (value, size_type_id) VALUES (?, ?)',
                [data.value, data.size_type_id]
            );
            return result.insertId;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async getAllSizes(): Promise<Size[]> {
        let connection: PoolConnection | null = null;
        try {
            connection = await this.pool.getConnection();
            const query = `
                SELECT 
                    s.id, s.value, s.size_type_id,
                    st.name AS size_type_name, st.type_code AS size_type_code,
                    s.created_at, s.updated_at
                FROM sizes s
                JOIN size_types st ON s.size_type_id = st.id
                ORDER BY s.value ASC;
            `;
            const [rows] = await connection.query<RowDataPacket[]>(query);
            return rows.map(row => this.mapRowToSize(row));
        } catch (error) {
            console.error('SQL error in getAllSizes:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    async getSizeById(id: number, txConnection?: PoolConnection): Promise<Size | null> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const [rows] = await connection.execute<RowDataPacket[]>(
                `SELECT 
                    s.id, s.value, s.size_type_id,
                    st.name AS size_type_name, st.type_code AS size_type_code,
                    s.created_at, s.updated_at
                FROM sizes s
                JOIN size_types st ON s.size_type_id = st.id
                WHERE s.id = ?`,
                [id]
            );
            return rows[0] ? this.mapRowToSize(rows[0]) : null;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async updateSize(id: number, data: UpdateSize, txConnection?: PoolConnection): Promise<boolean> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const updateFields: string[] = [];
            const updateParams: any[] = [];

            if (data.value !== undefined) {
                updateFields.push('value = ?');
                updateParams.push(data.value);
            }
            if (data.size_type_id !== undefined) {
                updateFields.push('size_type_id = ?');
                updateParams.push(data.size_type_id);
            }

            if (updateFields.length === 0) {
                return false;
            }

            updateFields.push('updated_at = CURRENT_TIMESTAMP');
            updateParams.push(id);

            const updateSql = `UPDATE sizes SET ${updateFields.join(', ')} WHERE id = ?`;
            const [result] = await connection.execute<ResultSetHeader>(updateSql, updateParams);
            return result.affectedRows > 0;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async deleteSize(id: number, txConnection?: PoolConnection): Promise<boolean> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const [result] = await connection.execute<ResultSetHeader>(
                'DELETE FROM sizes WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }
}