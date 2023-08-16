import { ObjectId } from 'mongodb';

export interface IProductReview {
  user: ObjectId | string;
  createdAt: Date;
  content?: string;
  images: string[];
  video: string;
  rating: number;
  isReported: boolean;
}
