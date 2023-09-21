import { ObjectId } from 'mongodb';

export interface IInsertProduct {
  name: string;
  sku: string;
  description?: string;
  singlePriceBeforeVAT: number;
  singlePriceWithVAT: number;
  availableQuantity: number;
  offer?: ObjectId | string;
  isPromoted?: number | boolean;
  images?: string[];
  video?: string;
  returnPolicy: {
    daysForReturn?: number;
    isReturnable?: boolean;
    description?: string | null;
    url?: string | null;
  };
  guaranteeDurationMonths: number;
  productCategories: string[] | ObjectId[];
  productType: ObjectId | string;
  storeName?: string;
  createdAt?: Date;
  createdBy?: ObjectId | string;
}
