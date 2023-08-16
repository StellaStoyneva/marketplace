import { ObjectId } from 'mongodb';

export interface IProduct {
  name: string;
  productCode: string;
  price: number; // decimal
  availableQuantity: number;
  store: ObjectId | string;
  offer: null | ObjectId | string;
  isPromoted?: boolean;
  description?: string;
  images: string[];
  video?: string;
  returnPolicy: { durationDays: number; description?: string; url?: string };
  guaranteeDurationMonths?: number;
  rating?: {
    sum: number;
    count: number;
    oneStars: number;
    twoStars: number;
    threeStars: number;
    fourStars: number;
    fiveStars: number;
  };
  ratingAverage?: number;
  reviews?: {
    rating: number;
    comment?: string | null;
    author: { name: string; id: ObjectId | string };
  }[];
  productCategories: ObjectId | string[];
  productTypes: ObjectId | string[];
  storeName: string;
  createdAt: Date;
  updatedAt: Date | null;
  createdBy: ObjectId | string;
  updatedBy: ObjectId | string | null;
}
