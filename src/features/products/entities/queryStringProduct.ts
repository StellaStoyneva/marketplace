import { ObjectId } from 'mongodb';

export interface IQueryStringProduct {
  name?: string;
  sku?: string;
  store?: ObjectId | string;
  offer?: string | null;
  isPromoted?: number;
  productCategories?: ObjectId | string;
  productType?: ObjectId | string;

  ratingAverage?: number | number[];
  availableQuantity?: number | number[];
  singlePriceBeforeVAT?: number | number[];
  singlePriceWithVAT?: number | number[];

  createdAt?: string | string[];
  updatedAt?: string | string[];
}
