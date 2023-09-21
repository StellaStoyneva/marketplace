import { ObjectId } from 'mongodb';

export interface IUpdateProduct {
  name?: string;
  sku?: string;
  description?: string;
  singlePriceBeforeVAT?: number;
  singlePriceWithVAT?: number;
  availableQuantity?: number;
  offer?: null | ObjectId | string;
  isPromoted?: boolean | number;
  images?: string[];
  video?: string;
  returnPolicy?: {
    daysForReturn?: number;
    isReturnable?: boolean;
    description?: string;
    url?: string;
  };
  guaranteeDurationMonths?: number;
  productCategories?: ObjectId | string[];
  productType?: ObjectId | string;
  updatedAt?: Date;
  updatedBy?: ObjectId | string;
}
