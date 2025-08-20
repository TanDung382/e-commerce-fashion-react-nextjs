// src/models/promotionModel.ts

export type DiscountType = 'PERCENT' | 'AMOUNT';

export interface Promotion {
  id: string; // UUID
  name: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number;
  start_date: Date;
  end_date: Date;
  created_at: Date;
  updated_at: Date;
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