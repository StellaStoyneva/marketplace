import { ObjectId } from 'mongodb';
import { OrderItemLifeCycleEnum } from 'src/constants/enum';

export interface IOrderItem {
  _id: ObjectId | string;
  order?: ObjectId | string;
  store?: ObjectId | string;
  product?: ObjectId | string;

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
  deliveryStatus?: ObjectId;
  daysForReturn: number;
  isReturnable?: boolean;
  isReturned?: boolean;
  isRefundable?: boolean;
  isRefunded?: boolean;
  isCancelable?: boolean;
  isCanceled?: boolean;
  returnDeadline?: Date;
  refundDeadline?: Date;
  status?: OrderItemLifeCycleEnum;
}
