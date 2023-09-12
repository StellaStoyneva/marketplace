import { ObjectId } from 'mongodb';
import {
  DeliveryStatusEnum,
  DeliveryTypeEnum,
  PaymentMethodTypeEnum,
} from 'src/constants/enum';
import { IAddress } from 'src/constants/types/address';

/**
  if order to multiple stores and payment cash - accumulate here
  on update check if totalPaid === finalPriceWithVAT
  => is_paid = totalPaid === finalPriceWithVAT
   */
export interface IOrder {
  /**Payment */
  transactions: string[];
  totalPriceBeforeVAT: number;
  totalPriceWithVAT: number;
  paymentMethod: PaymentMethodTypeEnum;
  invoiceAddress: IAddress;
  // handler
  is_paid: boolean;
  totalPaid: number;

  /**Customer */
  // req.user
  customer: ObjectId | string;
  // handler
  customerContact: {
    email: string;
    phoneNumber: string;
  };

  /**Items */
  ordersToStore: {
    /**Store - items */
    store: ObjectId | string;
    items: ObjectId[] | string[];
    /**Payment */
    finalPriceBeforeVAT: number;
    finalPriceWithVAT: number;
    //handler - update when invoice created by store admin
    invoiceNumber: number;
    /**Delivery */
    deliveryDetails: {
      deliveryType: DeliveryTypeEnum;
      recipient: string;
      phoneNumber: string;
      email: string;
      address: IAddress;
      paymentMethod: PaymentMethodTypeEnum;
      //handler OR update
      deliveryStatus: DeliveryStatusEnum;
    };
    // handler
    isCancelable: boolean;
    isCanceled: boolean;
    updatedAt?: Date | null;
    updatedBy?: ObjectId | string;
    transaction: string | null;
  }[];
  // handler
  createdAt: Date;
  updatedAt?: Date | null;
  updatedBy?: ObjectId | string;
}
