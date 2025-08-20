// src/services/sizeTypeService.ts

import { Pool, RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';
import { SizeType, NewSizeType, UpdateSizeType } from '../models/sizeTypeModel';

export class SizeTypeService {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    private mapRowToSizeType(row: RowDataPacket): SizeType {
        return {
            id: row.id, // id là int
            name: row.name,
            type_code: row.type_code,
        };
    }

    async createSizeType(data: NewSizeType, txConnection?: PoolConnection): Promise<number> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const [result] = await connection.execute<ResultSetHeader>(
                'INSERT INTO size_types (name, type_code) VALUES (?, ?)',
                [data.name, data.type_code]
            );
            return result.insertId; // Trả về ID tự tăng
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async getAllSizeTypes(): Promise<SizeType[]> {
        let connection: PoolConnection | null = null;
        try {
            connection = await this.pool.getConnection();

            const query = `
                SELECT id, name, type_code FROM size_types ORDER BY name ASC
            `;

            const [rows] = await connection.query<RowDataPacket[]>(query);

            return rows.map(row => this.mapRowToSizeType(row));
        } catch (error) {
            console.error('SQL error in getAllSizeTypes:', error); // ← thêm dòng này
            throw error;
        }finally {
            if (connection) connection.release();
        }
    }

    async getSizeTypeById(id: number, txConnection?: PoolConnection): Promise<SizeType | null> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const [rows] = await connection.execute<RowDataPacket[]>(
                'SELECT id, name, type_code FROM size_types WHERE id = ?',
                [id]
            );
            return rows[0] ? this.mapRowToSizeType(rows[0]) : null;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async updateSizeType(id: number, data: UpdateSizeType, txConnection?: PoolConnection): Promise<boolean> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const updateFields: string[] = [];
            const updateParams: any[] = [];

            if (data.name !== undefined) { updateFields.push('name = ?'); updateParams.push(data.name); }
            if (data.type_code !== undefined) { updateFields.push('type_code = ?'); updateParams.push(data.type_code); }

            if (updateFields.length === 0) {
                return false;
            }

            // Assuming updated_at column exists in size_types table, if not, remove this line.
            // updateFields.push('updated_at = CURRENT_TIMESTAMP');
            updateParams.push(id);

            const updateSql = `UPDATE size_types SET ${updateFields.join(', ')} WHERE id = ?`;
            const [result] = await connection.execute<ResultSetHeader>(updateSql, updateParams);
            return result.affectedRows > 0;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async deleteSizeType(id: number, txConnection?: PoolConnection): Promise<boolean> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            // Bắt đầu transaction (tùy chọn, để đảm bảo tính toàn vẹn)
            await connection.beginTransaction();

            // Thực hiện xóa sizeType (MySQL sẽ tự đặt size_type_id thành NULL nhờ ON DELETE SET NULL)
            const [result] = await connection.execute<ResultSetHeader>(
                'DELETE FROM size_types WHERE id = ?',
                [id]
            );

            if (result.affectedRows > 0) {
                // Kiểm tra xem bảng còn bản ghi nào không
                const [countRows] = await connection.execute<RowDataPacket[]>(
                    'SELECT COUNT(*) as count FROM size_types'
                );
                const count = countRows[0].count as number;
                if (count === 0) {
                    // Nếu không còn bản ghi, đặt lại AUTO_INCREMENT về 1
                    await connection.execute('ALTER TABLE size_types AUTO_INCREMENT = 1');
                }
            }

            // Commit transaction
            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            // Rollback nếu có lỗi
            await connection.rollback();
            console.error('SQL error in deleteSizeType:', error);
            throw error;
        } finally {
            if (!txConnection && connection) connection.release();
        }    
    }
}