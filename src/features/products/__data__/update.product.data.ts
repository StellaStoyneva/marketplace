import { ObjectId } from 'mongodb';

export const productIdString = '651401ed121d9e4102703bce';
export const productIdObjectId = new ObjectId(productIdString);

export const requestBody = {
  name: 'new name',
  returnPolicy: { daysForReturn: 0 },
};

export const requestBodyProcessed = {
  name: 'new name',
  returnPolicy: {
    daysForReturn: 0,
    isReturnable: false,
  },
};
