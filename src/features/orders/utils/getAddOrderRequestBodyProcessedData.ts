import { Document, ObjectId, WithId } from 'mongodb';
import { DeliveryStatusEnum, OrderItemLifeCycleEnum } from 'src/constants/enum';
import { flags } from '../constants/flags';
import {
  IInsertOrderData,
  IOrderToStore,
  IRequestBodyOrderItem,
} from '../entities';
import { TInsertOrderItem } from '../entities/insertOrderItems';

const getOrderItem = (item: IRequestBodyOrderItem) => {
  const currentDeliveryStatus = DeliveryStatusEnum.ordered;
  const {
    _id,
    name,
    sku,
    image,
    quantity,
    singlePriceBeforeVAT,
    singlePriceWithVAT,
    finalPriceBeforeVAT,
    finalPriceWithVAT,
    daysForReturn,
  } = item;

  return {
    name,
    sku,
    image,
    quantity,
    singlePriceBeforeVAT,
    singlePriceWithVAT,
    finalPriceBeforeVAT,
    finalPriceWithVAT,
    daysForReturn,
    isReturnable: !!daysForReturn,
    ...flags[currentDeliveryStatus as keyof typeof DeliveryStatusEnum],
    status: OrderItemLifeCycleEnum.ordered,
    product: new ObjectId(_id),
  };
};

export const getAddOrderRequestBodyProcessedData = (
  userDetails: WithId<Document>,
  ordersToStore: IOrderToStore[],
  deliveryStatusEnum: Record<string, ObjectId>
) => {
  const productsInOrder: {
    _id: ObjectId;
    item: TInsertOrderItem;
    store: ObjectId;
  }[] = [];
  const productsInOrderIDs: ObjectId[] = [];
  const ordersArr: IInsertOrderData[] = [];
  ordersToStore.forEach((orderToStore: IOrderToStore) => {
    const items: TInsertOrderItem[] = [];
    orderToStore.items.forEach((orderToStoreItem: any) => {
      const item = getOrderItem(orderToStoreItem);
      productsInOrder.push({
        _id: new ObjectId(orderToStoreItem._id),
        item,
        store: new ObjectId(orderToStore.store),
      });
      productsInOrderIDs.push(new ObjectId(orderToStoreItem._id));
      items.push(item);
    });
    ordersArr.push({
      ...orderToStore,
      items,
      customer: userDetails!._id,
      customerContact: {
        email: userDetails!.email,
        phoneNumber: userDetails!.phoneNumber,
      },
      store: new ObjectId(orderToStore.store),
      createdAt: new Date(),
      createdBy: userDetails?._id,
      deliveryStatus: deliveryStatusEnum!.ordered,
    });
  });
  return { productsInOrder, productsInOrderIDs, ordersArr };
};
