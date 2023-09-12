import { ObjectId } from 'mongodb';

export interface IOrderItem {
  _id: ObjectId;
  order: ObjectId | string;
  store: ObjectId | string;

  //product
  name: string;
  sku: string;
  image: string;

  //pricing
  singlePriceBeforeVAT: number;
  singlePriceWithVAT: number;
  finalPriceBeforeVAT: number;
  finalPriceWithVAT: number;
  quantity: number;

  //status
  deliveryStatus: ObjectId;
  daysForReturn: number;
  isReturnable: boolean;
  isReturned: boolean;
  isRefundable: boolean;
  isRefunded: boolean;
  returnDeadline?: Date;
  refundDeadline?: Date;
}
