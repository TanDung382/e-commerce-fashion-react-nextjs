import { Pool, RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';
import { Category, NewCategory, UpdateCategory } from '../models/categoryModel';
import slugify from 'slugify';

export class CategoryService {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    private mapRowToCategory(row: any): Category {
        return {
            id: row.id,
            name: row.name,
            slug: row.slug,
            created_at: row.created_at,
            updated_at: row.updated_at,
        };
    }

    // Hàm bỏ dấu tiếng Việt
    private removeVietnameseTones(str: string): string {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    }

    // Tạo slug từ tên
    private generateSlug(name: string): string {
        const withoutTones = this.removeVietnameseTones(name);
        return slugify(withoutTones, { lower: true, strict: true });
    }

    // Kiểm tra slug có duy nhất hay không
    private async isSlugUnique(slug: string, excludeId?: number, txConnection?: PoolConnection): Promise<boolean> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const query = excludeId
                ? 'SELECT COUNT(*) as count FROM categories WHERE slug = ? AND id != ?'
                : 'SELECT COUNT(*) as count FROM categories WHERE slug = ?';
            const params = excludeId ? [slug, excludeId] : [slug];
            const [rows] = await connection.execute<RowDataPacket[]>(query, params);
            return rows[0].count === 0;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async createCategory(data: NewCategory, txConnection?: PoolConnection): Promise<number> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            // Tạo slug từ name
            let slug = this.generateSlug(data.name);
            let suffix = 1;
            // Kiểm tra và xử lý slug trùng lặp
            while (!(await this.isSlugUnique(slug))) {
                slug = `${this.generateSlug(data.name)}-${suffix}`;
                suffix++;
            }

            const [result] = await connection.execute<ResultSetHeader>(
                'INSERT INTO categories (name, slug) VALUES (?, ?)',
                [data.name, slug]
            );
            return result.insertId;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async getCategoryBySlug(slug: string): Promise<Category | null> {
        const connection = await this.pool.getConnection();
        try {
            const [rows] = await connection.execute<RowDataPacket[]>(
                'SELECT id, name, slug, created_at, updated_at FROM categories WHERE slug = ?',
                [slug]
            );
            return rows[0] ? this.mapRowToCategory(rows[0]) : null;
        } finally {
            connection.release();
        }
    }

    async getAllCategories(): Promise<Category[]> {
        let connection: PoolConnection | null = null;
        try {
            connection = await this.pool.getConnection();

            const query = `
                SELECT id, name, slug, created_at, updated_at
                FROM categories
                ORDER BY name ASC
            `;

            const [rows] = await connection.query<RowDataPacket[]>(query);

            return rows.map(row => this.mapRowToCategory(row));
        } catch (error) {
            console.error('SQL error in getAllCategories:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    async getCategoryById(id: number, txConnection?: PoolConnection): Promise<Category | null> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const [rows] = await connection.execute<RowDataPacket[]>(
                'SELECT id, name, slug, created_at, updated_at FROM categories WHERE id = ?',
                [id]
            );
            return rows[0] ? this.mapRowToCategory(rows[0]) : null;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async updateCategory(id: number, data: UpdateCategory, txConnection?: PoolConnection): Promise<boolean> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const updateFields: string[] = [];
            const updateParams: any[] = [];

            if (data.name !== undefined) {
                updateFields.push('name = ?');
                updateParams.push(data.name);
                // Tạo slug mới từ name
                let slug = this.generateSlug(data.name);
                let suffix = 1;
                // Kiểm tra và xử lý slug trùng lặp
                while (!(await this.isSlugUnique(slug, id))) {
                    slug = `${this.generateSlug(data.name)}-${suffix}`;
                    suffix++;
                }
                updateFields.push('slug = ?');
                updateParams.push(slug);
            }

            if (updateFields.length === 0) {
                return false;
            }

            updateFields.push('updated_at = CURRENT_TIMESTAMP');
            updateParams.push(id);

            const updateSql = `UPDATE categories SET ${updateFields.join(', ')} WHERE id = ?`;
            const [result] = await connection.execute<ResultSetHeader>(updateSql, updateParams);
            return result.affectedRows > 0;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }

    async deleteCategory(id: number, txConnection?: PoolConnection): Promise<boolean> {
        const connection = txConnection || await this.pool.getConnection();
        try {
            const [result] = await connection.execute<ResultSetHeader>(
                'DELETE FROM categories WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } finally {
            if (!txConnection && connection) connection.release();
        }
    }
}