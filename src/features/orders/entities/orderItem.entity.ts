import { ObjectId } from 'mongodb';

export interface IOrderItem {
  itemName: string;
  singlePriceBeforeVAT: number;
  singlePriceWithVAT: number;
  finalPriceBeforeVAT: number;
  finalPriceWithVAT: number;
  quantity: number;
  image: string;
  store: ObjectId | string;
  deliveryStatus: ObjectId | string;
  isReturned: boolean;
  order: ObjectId | string;
  returnDeadline: Date;
  refundDeadline?: Date;
}
