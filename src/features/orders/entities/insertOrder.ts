import { ObjectId } from 'mongodb';
import { IAddress } from 'src/constants/types/address';
import { TInsertOrderItem } from './insertOrderItems';

export interface IRequestBodyOrderItem {
  _id: string;
  name: string;
  sku: string;
  image: string;
  quantity: number;
  singlePriceBeforeVAT: number;
  singlePriceWithVAT: number;
  finalPriceBeforeVAT: number;
  finalPriceWithVAT: number;
  daysForReturn: number;
}

export interface IOrderToStore {
  store: ObjectId | string;
  items: IRequestBodyOrderItem[];
  finalPriceBeforeVAT: number;
  finalPriceWithVAT: number;
  deliveryDetails: {
    recipient: string;
    phoneNumber: string;
    deliveryType: string;
    address: IAddress;
  };
  transaction?: string;
}
export interface IRequestBodyInsertOrder {
  transactions?: string[];
  totalPriceBeforeVAT: number;
  totalPriceWithVAT: number;
  paymentMethod: string;
  invoiceAddress: IAddress;
  ordersToStore: IOrderToStore[];
}
[];

export interface IInsertOrderData {
  items: TInsertOrderItem[];
  customer: ObjectId;
  customerContact: { email: string; phoneNumber: string };
  store: ObjectId;
  createdAt: Date;
  createdBy: ObjectId;
  deliveryStatus: ObjectId;
  finalPriceBeforeVAT: number;
  finalPriceWithVAT: number;
  deliveryDetails: {
    recipient: string;
    phoneNumber: string;
    deliveryType: string;
    address: IAddress;
  };
  transaction?: string;
}
