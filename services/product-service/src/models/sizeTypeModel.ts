// src/models/sizeTypeModel.ts

export type SizeTypeCode = 'letter' | 'number';

export interface SizeType {
  id: number; // int NOT NULL AUTO_INCREMENT
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