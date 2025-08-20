// src/models/productTypeModel.ts

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