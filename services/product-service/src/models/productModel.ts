// src/models/productModel.ts

import { NewProductImage, ProductImage } from "./imageModel";
import { Promotion } from "./promotionModel";
import { NewProductSize, ProductSize } from "./productSizeModel";

export type GenderType = 'male' | 'female' | 'unisex';

export interface Product {
  id: string; // UUID
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null; // Sẽ được gán giá trị khi một promotion cụ thể được chọn
  views: number;
  brand: string | null;
  color: string | null;
  material: string | null;
  gender: GenderType | null;
  is_best_seller: boolean;
  is_visible: boolean;
  category_id: number | null;
  product_type_id: number | null;
  created_at: Date;
  updated_at: Date;
  category_name?: string | null;
  product_type_name?: string | null;
  images?: ProductImage[];
  sizes?: ProductSize[];
  promotions?: Promotion[]; // Để hiển thị các promotions liên quan
}

export interface NewProduct {
  name: string;
  description?: string | null;
  price: number;
  brand?: string | null;
  color?: string | null;
  material?: string | null;
  gender?: GenderType | null;
  is_best_seller?: boolean;
  is_visible?: boolean;
  category_id?: number | null;
  product_type_id?: number | null;
  images?: NewProductImage[];
  sizes?: NewProductSize[];
  promotion_ids?: string[]; // Để liên kết với promotions khi tạo sản phẩm
}

export interface UpdateProduct {
  name?: string;
  description?: string | null;
  price?: number;
  brand?: string | null;
  color?: string | null;
  material?: string | null;
  gender?: GenderType | null;
  is_best_seller?: boolean;
  is_visible?: boolean;
  category_id?: number | null;
  product_type_id?: number | null;
  images?: NewProductImage[];
  sizes?: NewProductSize[];
  promotions?: { promotion_id: string; }[];
}

export interface NewProductPromotion {
  product_id: string; // UUID
  promotion_id: string; // UUID
}