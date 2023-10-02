import { ObjectId } from 'mongodb';

export const getProductsReqQueryInput = {
  store: '64da22bb79c2ec46b8592890',
  isPromoted: 0,
  availableQuantity: [5, 100],
  singlePriceWithVAT: 2.4,
};

export const getProductsReqQueryProcessed = {
  store: { $eq: new ObjectId('64da22bb79c2ec46b8592890') },
  isPromoted: { $eq: false },
  availableQuantity: { $gte: 5, $lte: 100 },
  singlePriceWithVAT: { $eq: 2.4 },
};
