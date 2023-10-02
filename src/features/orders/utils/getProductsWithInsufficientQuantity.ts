import { Document, ObjectId, WithId } from 'mongodb';
import { TInsertOrderItem } from '../entities';

export const getProductsWithInsufficientQuantity = (
  productsInOrder: {
    _id: ObjectId;
    item: TInsertOrderItem;
    store: ObjectId;
  }[],
  allOrderedProductsArr: WithId<Document>[]
) =>
  productsInOrder.reduce(
    (acc: string[], element: { _id: ObjectId; item: TInsertOrderItem }) => {
      const product = allOrderedProductsArr.find((p: WithId<Document>) => {
        return (
          String(p._id) === String(element._id) &&
          p?.availableQuantity < element.item.quantity
        );
      });
      if (product) {
        acc.push(String(element._id));
      }
      return acc;
    },
    []
  );
