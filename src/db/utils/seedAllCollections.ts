import { Db } from 'mongodb';
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
      collectionName: 'users',
      seed: usersSeedData,
    },
    {
      collectionName: 'enum_product_types',
      seed: productTypeSeedData,
    },
    {
      collectionName: 'order_items',
      seed: orderItemSeedData,
    },
    {
      collectionName: 'orders',
      seed: orderSeedData,
    },
    {
      collectionName: 'product_categories',
      seed: productCategoriesSeedData,
    },
    {
      collectionName: 'product_reviews',
      seed: reviewsSeedData,
    },
    {
      collectionName: 'products',
      seed: productsSeedData,
    },
    {
      collectionName: 'stores',
      seed: storeSeedData,
    },
  ]);
};
