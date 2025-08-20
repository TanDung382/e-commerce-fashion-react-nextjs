// src/models/productImageModel.ts

export interface ProductImage {
  id: string; // UUID
  product_id: string; // UUID
  image_url: string | null;
  is_thumbnail: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface NewProductImage {
  product_id: string;
  image_url: string;
  is_thumbnail?: boolean;
}

export interface UpdateProductImage {
  image_url?: string;
  is_thumbnail?: boolean;
}