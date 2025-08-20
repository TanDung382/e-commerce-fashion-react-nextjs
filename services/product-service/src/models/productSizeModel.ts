// src/models/sizeModel.ts

export interface ProductSize {
    id: string; // UUID as string
    product_id: string; // UUID as string
    product_name: string | null;
    size_id: number; // int, references sizes.id
    size_value: string; // from sizes.value
    stock: number;
    size_type_id: number; // from sizes.size_type_id
    size_type_name: string | null; // from size_types.name
    size_type_code: string | null; // from size_types.type_code
    created_at: Date;
    updated_at: Date;
}

export interface NewProductSize {
    product_id: string; // UUID as string
    size_id: number; // int
    stock: number;
}

export interface UpdateProductSize {
    size_id?: number; // int
    stock?: number;
}