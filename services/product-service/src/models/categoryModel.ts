// src/models/categoryModel.ts

export interface Category {
  id: number;
  name: string;
  slug: string,
  created_at: Date;
  updated_at: Date;
}

export interface NewCategory {
  name: string,
  slug: string
}

export interface UpdateCategory {
  name?: string;
  slug?: string,
}