import { Db } from 'mongodb';
import { IDeliveryStatus } from 'src/features/orders/entities/deliveryStatus.entity';
import { IDeliveryType } from 'src/features/orders/entities/deliveryType.entity';
import { IOrder } from 'src/features/orders/entities/order.entity';
import { IOrderItem } from 'src/features/orders/entities/orderItem.entity';
import { IPaymentMethod } from 'src/features/orders/entities/paymentMethod.entity';
import {
  IProduct,
  IProductCategory,
  IProductReview,
  IProductType,
} from 'src/features/products';
import { IStore } from 'src/features/stores/entities/store.entity';
import { IUser } from 'src/features/users';

export const seedCollection = async (
  db: Db,
  collectionName: string,
  seedData:
    | IUser[]
    | IProduct[]
    | IProductCategory[]
    | IProductType[]
    | IProductReview[]
    | IOrderItem[]
    | IOrder[]
    | IStore[]
    | IDeliveryStatus[]
    | IDeliveryType[]
    | IPaymentMethod[]
) => {
  const collectionToSeed = db.collection(collectionName);
  await collectionToSeed.insertMany(seedData);
};
