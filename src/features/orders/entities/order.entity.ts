import { ObjectId } from 'mongodb';
import { DeliveryTypeEnum, PaymentMethodTypeEnum } from 'src/constants/enum';
import { IAddress } from 'src/constants/types/address';

export interface IOrder {
  customer: ObjectId | string;
  customerEmail: string;
  store: ObjectId | string;
  items: ObjectId | string[];
  finalPriceBeforeVAT: number;
  finalPriceWithVAT: number;
  invoiceAddress: IAddress;
  invoiceNumber: number;
  paymentMethod: PaymentMethodTypeEnum;
  deliveryType: DeliveryTypeEnum;
  deliveryRecipient: { name: string; phoneNumber: string; email: string };
  createdAt: Date;
  updatedAt?: Date | null;
  updatedBy?: ObjectId | string;
}
