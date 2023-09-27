import { ObjectId } from 'mongodb';

export const rawInputMatchObject = {
  name: 'testName',
  sku: 'testCode',
  singlePriceBeforeVAT: 10,
  singlePriceWithVAT: 12.5,
  availableQuantity: 10,
  isPromoted: 1,
  guaranteeDurationMonths: 24,
  images: ['https://www.test-image1.com', 'https://www.test-image2.com'],
  returnPolicy: {
    daysForReturn: 30,
    description: 'testDescription',
    url: 'https://www.test.com',
  },
};

export const rawInput = [
  {
    ...rawInputMatchObject,
    offer: 'sale',

    productCategories: [new ObjectId()],
    productTypes: new ObjectId(),
  },
];
