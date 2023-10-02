import { Db } from 'mongodb';
import { CollectionEnum } from '../enum/collection.enum';
import {
  orderItemSeedData,
  orderSeedData,
  productCategoriesSeedData,
  productsSeedData,
  productTypeSeedData,
  reviewsSeedData,
  storeSeedData,
  usersSeedData,
} from '../seed';
import { seedMultipleCollections } from './seedMultipleCollections';

export const seedAllCollections = async (db: Db) => {
  await seedMultipleCollections(db, [
    {
      collectionName: CollectionEnum.Users,
      seed: usersSeedData,
    },
    {
      collectionName: CollectionEnum.EnumProductTypes,
      seed: productTypeSeedData,
    },
    {
      collectionName: CollectionEnum.OrderItems,
      seed: orderItemSeedData,
    },
    {
      collectionName: CollectionEnum.Orders,
      seed: orderSeedData,
    },
    {
      collectionName: CollectionEnum.ProductCategories,
      seed: productCategoriesSeedData,
    },
    {
      collectionName: CollectionEnum.ProductReviews,
      seed: reviewsSeedData,
    },
    {
      collectionName: CollectionEnum.Products,
      seed: productsSeedData,
    },
    {
      collectionName: CollectionEnum.Stores,
      seed: storeSeedData,
    },
  ]);
};
