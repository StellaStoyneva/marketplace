import { ObjectId } from 'mongodb';

export interface IProduct {
  name: string;
  sku: string;
  description?: string;
  singlePriceBeforeVAT: number;
  singlePriceWithVAT: number;
  availableQuantity: number;
  store: ObjectId | string;
  offer: null | ObjectId | string;
  isPromoted?: boolean;
  images: string[];
  video?: string;
  returnPolicy: {
    daysForReturn: number;
    isReturnable: boolean;
    description?: string;
    url?: string;
  };
  guaranteeDurationMonths: number;
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
  fiveMostRecentBestReviews?: {
    rating: number;
    comment?: string | null;
    author: { name: string; id: ObjectId | string };
  }[];
  productCategories: ObjectId | string[];
  productType: ObjectId | string;
  storeName: string;
  createdAt: Date;
  updatedAt: Date | null;
  createdBy: ObjectId | string;
  updatedBy: ObjectId | string | null;
}
