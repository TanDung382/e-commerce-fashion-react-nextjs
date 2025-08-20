// src/services/productService.ts

import { Pool, RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import { Product, NewProduct, UpdateProduct, GenderType } from '../models/productModel';
import { NewProductImage, ProductImage } from '../models/imageModel';
import { NewProductSize, ProductSize } from '../models/productSizeModel';
import { Promotion } from '../models/promotionModel';
import { Buffer } from 'buffer';
import { CategoryService } from './categoryService';

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

// Import các service con
import { ProductImageService } from './imageService';
import { ProductSizeService } from './productSizeService';
import { PromotionService } from './promotionService';

export class ProductService {
    private pool: Pool;
    private productImageService: ProductImageService;
    private productSizeService: ProductSizeService;
    private promotionService: PromotionService;
    private categoryService: CategoryService;

    constructor(pool: Pool, categoryService: CategoryService) {
        this.pool = pool;
        this.productImageService = new ProductImageService(pool);
        this.productSizeService = new ProductSizeService(pool);
        this.promotionService = new PromotionService(pool);
        this.categoryService = categoryService;
    }

    private mapRowToProduct(row: RowDataPacket): Product {
        // Cập nhật: Thêm discount_price và khởi tạo là null
        return {
            id: binaryToUuid(row.id),
            name: row.name,
            description: row.description || null,
            price: parseFloat(row.price),
            discount_price: null, // Khởi tạo là null, sẽ được tính sau
            views: row.views,
            brand: row.brand || null,
            color: row.color || null,
            material: row.material || null,
            gender: row.gender as GenderType || null,
            is_best_seller: Boolean(row.is_best_seller),
            is_visible: Boolean(row.is_visible),
            category_id: row.category_id || null,
            product_type_id: row.product_type_id || null,
            created_at: new Date(row.created_at),
            updated_at: new Date(row.updated_at),
            category_name: row.category_name || null,
            product_type_name: row.product_type_name || null,
            images: [],
            sizes: [],
            promotions: []
        };
    }

    private mapRowToProductImage(row: RowDataPacket): ProductImage {
        return {
            id: binaryToUuid(row.id),
            product_id: binaryToUuid(row.product_id),
            image_url: row.image_url || null,
            is_thumbnail: Boolean(row.is_thumbnail),
            created_at: new Date(row.created_at),
            updated_at: new Date(row.updated_at),
        };
    }

    private mapRowToProductSize(row: RowDataPacket): ProductSize {
        return {
            id: binaryToUuid(row.id),
            product_id: binaryToUuid(row.product_id),
            product_name: row.product_name || null,
            size_id: row.size_id,
            size_value: row.size_value,
            stock: row.stock,
            size_type_id: row.size_type_id || null,
            size_type_name: row.size_type_name || null,
            size_type_code: row.size_type_code || null,
            created_at: new Date(row.created_at),
            updated_at: new Date(row.updated_at),
        };
    }

    private mapRowToPromotion(row: RowDataPacket): Promotion {
        return {
            id: binaryToUuid(row.id),
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
    
    /**
     * Hàm private để tính toán giá giảm dựa trên một promotion duy nhất.
     */
    private _calculateDiscountedPrice(productPrice: number, promotion: Promotion): number | null {
        const now = new Date();
        const startDate = new Date(promotion.start_date);
        const endDate = new Date(promotion.end_date);
        
        // Kiểm tra xem khuyến mãi còn hiệu lực không
        if (now < startDate || now > endDate) {
            return null;
        }

        let discountAmount = 0;
        if (promotion.discount_type === 'PERCENT') {
            discountAmount = productPrice * (promotion.discount_value / 100);
        } else if (promotion.discount_type === 'AMOUNT') {
            discountAmount = promotion.discount_value;
        }

        const discountedPrice = productPrice - discountAmount;
        return Math.max(discountedPrice, 0); // Đảm bảo giá không âm
    }

    /**
     * Hàm private để tìm và trả về giá giảm tốt nhất từ các khuyến mãi hợp lệ.
     */
    private _findBestDiscount(product: Product): number | null {
        if (!product.promotions || product.promotions.length === 0) {
            return null;
        }

        let bestDiscountedPrice: number | null = null;
        let bestPromotion: Promotion | null = null;
        
        // Duyệt qua tất cả các khuyến mãi của sản phẩm
        for (const promotion of product.promotions) {
            // Tính toán giá giảm cho từng khuyến mãi
            const currentDiscountedPrice = this._calculateDiscountedPrice(product.price, promotion);

            // Nếu giá giảm hợp lệ và tốt hơn giá tốt nhất hiện tại, cập nhật
            if (currentDiscountedPrice !== null) {
                if (bestDiscountedPrice === null || currentDiscountedPrice < bestDiscountedPrice) {
                    bestDiscountedPrice = currentDiscountedPrice;
                    bestPromotion = promotion;
                }
            }
        }
        
        return bestDiscountedPrice;
    }

    async getAllProducts(
        filters: any = {},
        sortBy: string = 'created_at',
        sortOrder: 'ASC' | 'DESC' = 'DESC'
    ): Promise<Product[]> {
        let connection: PoolConnection | null = null;
        try {
            connection = await this.pool.getConnection();
            let query = `
                SELECT
                    p.id, p.name, p.description, p.price, p.views,
                    p.brand, p.color, p.material, p.gender, p.is_best_seller, p.is_visible,
                    p.category_id, p.product_type_id, p.created_at, p.updated_at,
                    c.name AS category_name, pt.name AS product_type_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN product_types pt ON p.product_type_id = pt.id
            `;
            const queryParams: any[] = [];

            const whereClauses: string[] = [];
            if (filters.category_id) {
                whereClauses.push('p.category_id = ?');
                queryParams.push(filters.category_id);
            }
            if (filters.product_type_id) {
                whereClauses.push('p.product_type_id = ?');
                queryParams.push(filters.product_type_id);
            }
            if (filters.is_visible !== undefined) {
                whereClauses.push('p.is_visible = ?');
                queryParams.push(filters.is_visible);
            }
            if (filters.search) {
                const searchTerm = `%${filters.search}%`;
                whereClauses.push('(p.name LIKE ? OR p.description LIKE ?)');
                queryParams.push(searchTerm, searchTerm);
            }

            if (whereClauses.length > 0) {
                query += ` WHERE ${whereClauses.join(' AND ')}`;
            }

            query += ` ORDER BY p.${sortBy} ${sortOrder}`;

            const [rows] = await connection.execute<RowDataPacket[]>(query, queryParams);
            const products: Product[] = rows.map(row => this.mapRowToProduct(row));

            const productIdsBinary = products.map(p => uuidToBinary(p.id));

            if (productIdsBinary.length > 0) {
                const placeholders = productIdsBinary.map(() => '?').join(', ');

                const [imagesRows] = await connection.execute<RowDataPacket[]>(
                    `SELECT *
                    FROM product_images
                    WHERE product_id IN (${placeholders})
                    ORDER BY is_thumbnail DESC, created_at ASC`,
                    productIdsBinary
                );
                const imagesMap = new Map<string, ProductImage[]>();
                imagesRows.forEach(row => {
                    const productId = binaryToUuid(row.product_id);
                    if (!imagesMap.has(productId)) {
                        imagesMap.set(productId, []);
                    }
                    imagesMap.get(productId)?.push(this.mapRowToProductImage(row));
                });

                const [sizesRows] = await connection.execute<RowDataPacket[]>(
                    `SELECT
                        ps.id, ps.product_id, ps.stock,
                        s.id AS size_id, s.value AS size_value,
                        st.id AS size_type_id, st.name AS size_type_name, st.type_code AS size_type_code,
                        ps.created_at, ps.updated_at
                    FROM product_sizes ps
                    JOIN sizes s ON ps.size_id = s.id
                    JOIN size_types st ON s.size_type_id = st.id
                    WHERE ps.product_id IN (${placeholders})
                    ORDER BY st.name ASC, s.value ASC`,
                    productIdsBinary
                );
                const sizesMap = new Map<string, ProductSize[]>();
                sizesRows.forEach(row => {
                    const productId = binaryToUuid(row.product_id);
                    if (!sizesMap.has(productId)) {
                        sizesMap.set(productId, []);
                    }
                    sizesMap.get(productId)?.push(this.mapRowToProductSize(row));
                });

                const [promotionsRows] = await connection.execute<RowDataPacket[]>(
                    `SELECT
                        prm.id, prm.name, prm.description, prm.discount_type, prm.discount_value,
                        prm.start_date, prm.end_date, prm.created_at, prm.updated_at,
                        pp.product_id
                    FROM promotions prm
                    JOIN product_promotions pp ON prm.id = pp.promotion_id
                    WHERE pp.product_id IN (${placeholders})`,
                    productIdsBinary
                );
                const promotionsMap = new Map<string, Promotion[]>();
                promotionsRows.forEach(row => {
                    const productId = binaryToUuid(row.product_id);
                    if (!promotionsMap.has(productId)) {
                        promotionsMap.set(productId, []);
                    }
                    promotionsMap.get(productId)?.push(this.mapRowToPromotion(row));
                });

                products.forEach(product => {
                    product.images = imagesMap.get(product.id) || [];
                    product.sizes = sizesMap.get(product.id) || [];
                    product.promotions = promotionsMap.get(product.id) || [];
                    product.discount_price = this._findBestDiscount(product);
                });
            }

            return products;
        } catch (error) {
            console.error('Error in getAllProducts:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }
    
    async getBestSellerProducts(): Promise<{ name: string; products: Product[] }[]> {
        let connection: PoolConnection | null = null;
        try {
            connection = await this.pool.getConnection();
            const query = `
                SELECT
                    p.id, p.name, p.description, p.price, p.views,
                    p.brand, p.color, p.material, p.gender, p.is_best_seller, p.is_visible,
                    p.category_id, p.product_type_id, p.created_at, p.updated_at,
                    c.name AS category_name, pt.name AS product_type_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN product_types pt ON p.product_type_id = pt.id
                WHERE p.is_best_seller = true AND p.is_visible = true
                ORDER BY c.name ASC, p.views DESC
            `;
            const [rows] = await connection.execute<RowDataPacket[]>(query);
            const products: Product[] = rows.map(row => this.mapRowToProduct(row));

            const productIdsBinary = products.map(p => uuidToBinary(p.id));

            if (productIdsBinary.length > 0) {
                const placeholders = productIdsBinary.map(() => '?').join(', ');

                const [imagesRows] = await connection.execute<RowDataPacket[]>(
                    `SELECT *
                    FROM product_images
                    WHERE product_id IN (${placeholders})
                    ORDER BY is_thumbnail DESC, created_at ASC`,
                    productIdsBinary
                );
                const imagesMap = new Map<string, ProductImage[]>();
                imagesRows.forEach(row => {
                    const productId = binaryToUuid(row.product_id);
                    if (!imagesMap.has(productId)) {
                        imagesMap.set(productId, []);
                    }
                    imagesMap.get(productId)?.push(this.mapRowToProductImage(row));
                });

                const [sizesRows] = await connection.execute<RowDataPacket[]>(
                    `SELECT
                        ps.id, ps.product_id, ps.stock,
                        s.id AS size_id, s.value AS size_value,
                        st.id AS size_type_id, st.name AS size_type_name, st.type_code AS size_type_code,
                        ps.created_at, ps.updated_at
                    FROM product_sizes ps
                    JOIN sizes s ON ps.size_id = s.id
                    JOIN size_types st ON s.size_type_id = st.id
                    WHERE ps.product_id IN (${placeholders})
                    ORDER BY st.name ASC, s.value ASC`,
                    productIdsBinary
                );
                const sizesMap = new Map<string, ProductSize[]>();
                sizesRows.forEach(row => {
                    const productId = binaryToUuid(row.product_id);
                    if (!sizesMap.has(productId)) {
                        sizesMap.set(productId, []);
                    }
                    sizesMap.get(productId)?.push(this.mapRowToProductSize(row));
                });

                const [promotionsRows] = await connection.execute<RowDataPacket[]>(
                    `SELECT
                        prm.id, prm.name, prm.description, prm.discount_type, prm.discount_value,
                        prm.start_date, prm.end_date, prm.created_at, prm.updated_at,
                        pp.product_id
                    FROM promotions prm
                    JOIN product_promotions pp ON prm.id = pp.promotion_id
                    WHERE pp.product_id IN (${placeholders})`,
                    productIdsBinary
                );
                const promotionsMap = new Map<string, Promotion[]>();
                promotionsRows.forEach(row => {
                    const productId = binaryToUuid(row.product_id);
                    if (!promotionsMap.has(productId)) {
                        promotionsMap.set(productId, []);
                    }
                    promotionsMap.get(productId)?.push(this.mapRowToPromotion(row));
                });

                products.forEach(product => {
                    product.images = imagesMap.get(product.id) || [];
                    product.sizes = sizesMap.get(product.id) || [];
                    product.promotions = promotionsMap.get(product.id) || [];
                    product.discount_price = this._findBestDiscount(product);
                });
            }

            // Nhóm sản phẩm theo danh mục
            const categoriesMap = new Map<number, { name: string; products: Product[] }>();
            products.forEach(product => {
                if (product.category_id && product.category_name) {
                    if (!categoriesMap.has(product.category_id)) {
                        categoriesMap.set(product.category_id, {
                            name: product.category_name,
                            products: [],
                        });
                    }
                    categoriesMap.get(product.category_id)?.products.push(product);
                }
            });

            // Chuyển Map thành mảng và giới hạn 4 sản phẩm mỗi danh mục
            const groupedProducts = Array.from(categoriesMap.values()).map(category => ({
                name: category.name,
                products: category.products.slice(0, 8), // Giới hạn 4 sản phẩm mỗi danh mục
            }));

            return groupedProducts;
        } catch (error) {
            console.error('Error in getBestSellerProducts:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    async getProductById(id: string): Promise<Product | null> {
        let connection: PoolConnection | null = null;
        try {
            connection = await this.pool.getConnection();
            const [rows] = await connection.execute<RowDataPacket[]>(
                `SELECT
                    p.id, p.name, p.description, p.price, p.views,
                    p.brand, p.color, p.material, p.gender, p.is_best_seller, p.is_visible,
                    p.category_id, p.product_type_id, p.created_at, p.updated_at,
                    c.name AS category_name, pt.name AS product_type_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN product_types pt ON p.product_type_id = pt.id
                WHERE p.id = ?`,
                [uuidToBinary(id)]
            );

            if (!rows[0]) return null;

            const product = this.mapRowToProduct(rows[0]);

            product.images = await this.productImageService.getImagesByProductId(id, connection);
            product.sizes = await this.productSizeService.getProductSizesByProductId(id, connection);
            product.promotions = await this.promotionService.getPromotionsByProductId(id, connection);

            // Gán giá khuyến mãi tốt nhất vào product.discount_price
            product.discount_price = this._findBestDiscount(product);

            return product;
        } finally {
            if (connection) connection.release();
        }
    }

    async getProductsByCategory(slug: string): Promise<Product[]> {
        let connection: PoolConnection | null = null;
        try {
            connection = await this.pool.getConnection();
            // Lấy category_id từ slug
            const category = await this.categoryService.getCategoryBySlug(slug);
            if (!category || !category.id) {
                console.warn(`Không tìm thấy danh mục với slug: ${slug}`);
                return [];
            }

            let query = `
                SELECT
                    p.id, p.name, p.description, p.price, p.views,
                    p.brand, p.color, p.material, p.gender, p.is_best_seller, p.is_visible,
                    p.category_id, p.product_type_id, p.created_at, p.updated_at,
                    c.name AS category_name, pt.name AS product_type_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN product_types pt ON p.product_type_id = pt.id
                WHERE p.category_id = ?
            `;
            const queryParams: any[] = [category.id];

            const [rows] = await connection.execute<RowDataPacket[]>(query, queryParams);
            const products: Product[] = rows.map(row => this.mapRowToProduct(row));

            const productIdsBinary = products.map(p => uuidToBinary(p.id));

            if (productIdsBinary.length > 0) {
                const placeholders = productIdsBinary.map(() => '?').join(', ');

                const [imagesRows] = await connection.execute<RowDataPacket[]>(
                    `SELECT *
                    FROM product_images
                    WHERE product_id IN (${placeholders})
                    ORDER BY is_thumbnail DESC, created_at ASC`,
                    productIdsBinary
                );
                const imagesMap = new Map<string, ProductImage[]>();
                imagesRows.forEach(row => {
                    const productId = binaryToUuid(row.product_id);
                    if (!imagesMap.has(productId)) {
                        imagesMap.set(productId, []);
                    }
                    imagesMap.get(productId)?.push(this.mapRowToProductImage(row));
                });

                const [sizesRows] = await connection.execute<RowDataPacket[]>(
                    `SELECT
                        ps.id, ps.product_id, ps.stock,
                        s.id AS size_id, s.value AS size_value,
                        st.id AS size_type_id, st.name AS size_type_name, st.type_code AS size_type_code,
                        ps.created_at, ps.updated_at
                    FROM product_sizes ps
                    JOIN sizes s ON ps.size_id = s.id
                    JOIN size_types st ON s.size_type_id = st.id
                    WHERE ps.product_id IN (${placeholders})
                    ORDER BY st.name ASC, s.value ASC`,
                    productIdsBinary
                );
                const sizesMap = new Map<string, ProductSize[]>();
                sizesRows.forEach(row => {
                    const productId = binaryToUuid(row.product_id);
                    if (!sizesMap.has(productId)) {
                        sizesMap.set(productId, []);
                    }
                    sizesMap.get(productId)?.push(this.mapRowToProductSize(row));
                });

                const [promotionsRows] = await connection.execute<RowDataPacket[]>(
                    `SELECT
                        prm.id, prm.name, prm.description, prm.discount_type, prm.discount_value,
                        prm.start_date, prm.end_date, prm.created_at, prm.updated_at,
                        pp.product_id
                    FROM promotions prm
                    JOIN product_promotions pp ON prm.id = pp.promotion_id
                    WHERE pp.product_id IN (${placeholders})`,
                    productIdsBinary
                );
                const promotionsMap = new Map<string, Promotion[]>();
                promotionsRows.forEach(row => {
                    const productId = binaryToUuid(row.product_id);
                    if (!promotionsMap.has(productId)) {
                        promotionsMap.set(productId, []);
                    }
                    promotionsMap.get(productId)?.push(this.mapRowToPromotion(row));
                });

                products.forEach(product => {
                    product.images = imagesMap.get(product.id) || [];
                    product.sizes = sizesMap.get(product.id) || [];
                    product.promotions = promotionsMap.get(product.id) || [];
                    product.discount_price = this._findBestDiscount(product);
                });
            }

            return products;
        } catch (error) {
            console.error('Error in getProductsByCategory:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    async createProduct(data: NewProduct): Promise<string> {
        if (!data.name || data.price === undefined) {
            throw new Error('Product name and price are required.');
        }

        let connection: PoolConnection | null = null;
        try {
            connection = await this.pool.getConnection();
            await connection.beginTransaction();

            const newProductId = uuidToBinary(uuidv4());

            const [result] = await connection.execute<ResultSetHeader>(
                `INSERT INTO products (
                    id, name, description, price, brand, color, material, gender,
                    is_best_seller, is_visible, category_id, product_type_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    newProductId,
                    data.name,
                    data.description || null,
                    data.price,
                    data.brand || null,
                    data.color || null,
                    data.material || null,
                    data.gender || null,
                    data.is_best_seller ?? false,
                    data.is_visible ?? true,
                    data.category_id || null,
                    data.product_type_id || null,
                ]
            );

            if (result.affectedRows === 0) {
                throw new Error('Failed to create product.');
            }

            const productIdString = binaryToUuid(newProductId);

            if (data.images && data.images.length > 0) {
                for (const image of data.images) {
                    const newImage: NewProductImage = {
                        product_id: productIdString,
                        image_url: image.image_url,
                        is_thumbnail: image.is_thumbnail
                    };
                    await this.productImageService.createImage(newImage, connection);
                }
            }

            if (data.sizes && data.sizes.length > 0) {
                for (const size of data.sizes) {
                    const newProductSize: NewProductSize = {
                        product_id: productIdString,
                        size_id: size.size_id,
                        stock: size.stock
                    };
                    await this.productSizeService.createProductSize(newProductSize, connection);
                }
            }

            if (data.promotion_ids && data.promotion_ids.length > 0) {
                for (const promoId of data.promotion_ids) {
                    const productPromotionId = uuidToBinary(uuidv4());
                    await connection.execute<ResultSetHeader>(
                        'INSERT INTO product_promotions (id, product_id, promotion_id) VALUES (?, ?, ?)',
                        [productPromotionId, newProductId, uuidToBinary(promoId)]
                    );
                }
            }

            await connection.commit();
            return productIdString;
        } catch (error) {
            if (connection) connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    async updateProduct(id: string, data: UpdateProduct): Promise<boolean> {
        let connection: PoolConnection | null = null;
        try {
            connection = await this.pool.getConnection();
            await connection.beginTransaction();

            const productBinaryId = uuidToBinary(id);

            const updateFields: string[] = [];
            const updateParams: any[] = [];

            if (data.name !== undefined) { updateFields.push('name = ?'); updateParams.push(data.name); }
            if (data.description !== undefined) { updateFields.push('description = ?'); updateParams.push(data.description || null); }
            if (data.price !== undefined) { updateFields.push('price = ?'); updateParams.push(data.price); }
            if (data.brand !== undefined) { updateFields.push('brand = ?'); updateParams.push(data.brand || null); }
            if (data.color !== undefined) { updateFields.push('color = ?'); updateParams.push(data.color || null); }
            if (data.material !== undefined) { updateFields.push('material = ?'); updateParams.push(data.material || null); }
            if (data.gender !== undefined) { updateFields.push('gender = ?'); updateParams.push(data.gender || null); }
            if (data.is_best_seller !== undefined) { updateFields.push('is_best_seller = ?'); updateParams.push(data.is_best_seller); }
            if (data.is_visible !== undefined) { updateFields.push('is_visible = ?'); updateParams.push(data.is_visible); }
            if (data.category_id !== undefined) { updateFields.push('category_id = ?'); updateParams.push(data.category_id || null); }
            if (data.product_type_id !== undefined) { updateFields.push('product_type_id = ?'); updateParams.push(data.product_type_id || null); }

            if (updateFields.length > 0) {
            updateFields.push('updated_at = CURRENT_TIMESTAMP');
            updateParams.push(productBinaryId);
            const updateSql = `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`;
            await connection.execute<ResultSetHeader>(updateSql, updateParams);
            }

            if (data.images !== undefined) {
            await this.productImageService.deleteImagesByProductId(id, connection);
            if (data.images.length > 0) {
                for (const image of data.images) {
                const newImage: NewProductImage = {
                    product_id: id,
                    image_url: image.image_url,
                    is_thumbnail: image.is_thumbnail,
                };
                await this.productImageService.createImage(newImage, connection);
                }
            }
            }

            if (data.sizes !== undefined) {
            await this.productSizeService.deleteProductSizesByProductId(id, connection);
            if (data.sizes.length > 0) {
                for (const size of data.sizes) {
                const newProductSize: NewProductSize = {
                    product_id: id,
                    size_id: size.size_id,
                    stock: size.stock,
                };
                await this.productSizeService.createProductSize(newProductSize, connection);
                }
            }
            }

            if (data.promotions !== undefined) {
            await connection.execute('DELETE FROM product_promotions WHERE product_id = ?', [productBinaryId]);
            if (data.promotions.length > 0) {
                for (const promotion of data.promotions) {
                const productPromotionId = uuidToBinary(uuidv4());
                await connection.execute<ResultSetHeader>(
                    'INSERT INTO product_promotions (id, product_id, promotion_id) VALUES (?, ?, ?)',
                    [productPromotionId, productBinaryId, uuidToBinary(promotion.promotion_id)]
                );
                }
            }
            }

            await connection.commit();
            return true;
        } catch (error) {
            if (connection) connection.rollback();
            console.error('Error updating product:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    async deleteProduct(id: string): Promise<boolean> {
        let connection: PoolConnection | null = null;
        try {
            connection = await this.pool.getConnection();
            await connection.beginTransaction();

            const productBinaryId = uuidToBinary(id);

            const [result] = await connection.execute<ResultSetHeader>(
                'DELETE FROM products WHERE id = ?',
                [productBinaryId]
            );

            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            if (connection) connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }
}
