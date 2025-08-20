// src/models/sizeModel.ts

export interface Size {
    id: number; // int
    value: string;
    size_type_id: number;
    size_type_name: string | null;
    size_type_code: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface NewSize {
    value: string;
    size_type_id: number;
}

export interface UpdateSize {
    value?: string;
    size_type_id?: number;
}