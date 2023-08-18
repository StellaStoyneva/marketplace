import { CollectionEnum } from 'src/db/enum/collection.enum';

export const indexingMapper: Record<string, Record<string, number>[]> = {
  [CollectionEnum.OrderItems]: [
    { itemName: 1 },
    { store: 1 },
    { deliveryStatus: 1 },
    { isReturned: 1 },
    { order: 1 },
    { refundDeadline: 1 },
  ],
  [CollectionEnum.Orders]: [
    { customerEmail: 1 },
    { store: 1 },
    { deliveryType: 1 },
  ],
  [CollectionEnum.ProductCategories]: [{ productCategory: 1 }],
  [CollectionEnum.ProductReviews]: [{ rating: 1 }, { isReported: 1 }],
  [CollectionEnum.Products]: [
    { categories: 1 },
    { store: 1 },
    { ratingAverage: 1 },
    { name: 1 },
  ],
  [CollectionEnum.Stores]: [{ isVerified: 1 }, { name: 1 }],
  [CollectionEnum.Users]: [{ email: 1 }, { store: 1 }],
};
