// src/types/productTypes.ts

export type GenderType = 'male' | 'female' | 'unisex' | null;
export type DiscountType = 'PERCENT' | 'AMOUNT';
export type SizeTypeCode = 'letter' | 'number';

// =====================================================================
// PRODUCT MODULE TYPES
// =====================================================================

export interface ProductImage {
    id: string; // UUID (binary(16))
    product_id: string; // UUID
    image_url: string | null;
    is_thumbnail: boolean;
    created_at: Date | string;
    updated_at: Date | string;
}

export interface NewProductImage {
    product_id: string;
    image_url: string | null;
    is_thumbnail?: boolean;
}

export interface UpdateProductImage {
    image_url?: string;
    is_thumbnail?: boolean;
}

export interface ProductSize {
    id: string; // UUID
    product_id: string; // UUID
    size_id: number; // int, references sizes.id
    size_value: string; // from sizes.value
    product_name?: string | null;
    stock: number;
    size_type_id: number | null; // from sizes.size_type_id
    size_type_name?: string | null; // from size_types.name
    size_type_code?: SizeTypeCode | null; // from size_types.type_code
    created_at: Date | string;
    updated_at: Date | string;
}

export interface NewProductSize {
    product_id: string; // UUID
    size_id: number; // int
    stock: number;
}

export interface UpdateProductSize {
    product_id: string;
    size_id?: number; // int
    stock?: number;
}

export interface Promotion {
    id: string; // UUID
    name: string;
    description: string | null;
    discount_type: DiscountType;
    discount_value: number;
    start_date: Date | string;
    end_date: Date | string;
    created_at: Date | string;
    updated_at: Date | string;
}

export interface NewPromotion {
    name: string;
    description?: string | null;
    discount_type: DiscountType;
    discount_value: number;
    start_date: Date | string;
    end_date: Date | string;
}

export interface UpdatePromotion {
    name?: string;
    description?: string | null;
    discount_type?: DiscountType;
    discount_value?: number;
    start_date?: Date | string;
    end_date?: Date | string;
}

export interface NewProductPromotion {
    product_id: string;
    promotion_id: string; 
}

export interface UpdateProductPromotion {
    product_id?: string;
    promotion_id?: string; 
}

export interface Product {
    id: string; // UUID
    name: string;
    description: string | null;
    price: number;
    discount_price: number | null;
    views: number;
    brand: string | null;
    color: string | null;
    material: string | null;
    gender: GenderType;
    is_best_seller: boolean;
    is_visible: boolean;
    category_id: number | null;
    product_type_id: number | null;
    created_at: Date | string;
    updated_at: Date | string;
    // Joined fields from other tables
    category_name: string | null;
    category_brand_name?: string | null;
    category_type?: string | null;
    product_type_name: string | null;
    product_type_size_type_id?: number | null;

    images: ProductImage[];
    sizes: ProductSize[];
    promotions: Promotion[];
}

export interface NewProduct {
    name: string;
    description?: string | null;
    price: number;
    discount_price?: number | null;
    brand?: string | null;
    color?: string | null;
    material?: string | null;
    gender?: GenderType;
    is_best_seller?: boolean;
    is_visible?: boolean;
    category_id?: number | null;
    product_type_id?: number | null;
    images: NewProductImage[];
    sizes: NewProductSize[];
    promotions?: NewProductPromotion[];
}

export interface UpdateProduct {
    name?: string;
    description?: string | null;
    price: number;
    discount_price?: number | null;
    brand?: string | null;
    color?: string | null;
    material?: string | null;
    gender?: GenderType;
    is_best_seller?: boolean;
    is_visible?: boolean;
    category_id?: number | null;
    product_type_id?: number | null;
    images: (NewProductImage & { id?: string })[];
    sizes?: (NewProductSize & { id?: string })[];
    promotions?: NewProductPromotion[];
}

// =====================================================================
// CATEGORY MODULE TYPES
// =====================================================================
export interface Category {
    id: number;
    name: string;
    slug: string;
    created_at: Date | string;
    updated_at: Date | string;
}

export interface NewCategory {
    name: string;
    slug: string;
}

export interface UpdateCategory {
    name?: string;
    slug?: string;
}

// =====================================================================
// PRODUCT TYPE MODULE TYPES
// =====================================================================
export interface ProductType {
    id: number;
    name: string;
}

export interface NewProductType {
    name: string;
}

export interface UpdateProductType {
    name?: string;
}

// =====================================================================
// SIZE TYPE MODULE TYPES
// =====================================================================
export interface SizeType {
    id: number;
    name: string;
    type_code: SizeTypeCode;
}

export interface NewSizeType {
    name: string;
    type_code: SizeTypeCode;
}

export interface UpdateSizeType {
    name?: string;
    type_code?: SizeTypeCode;
}

// =====================================================================
// SIZE MODULE TYPES
// =====================================================================
export interface Size {
    id: number; // int
    value: string;
    size_type_id: number;
    size_type_name?: string | null; // from size_types.name
    size_type_code?: SizeTypeCode | null; // from size_types.type_code
    created_at: Date | string;
    updated_at: Date | string;
}

export interface NewSize {
    value: string;
    size_type_id: number;
}

export interface UpdateSize {
    value?: string;
    size_type_id?: number;
}