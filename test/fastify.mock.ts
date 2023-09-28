import { ObjectId } from 'mongodb';
import { dbMocks } from '.';

export const userId = new ObjectId();
export const store = new ObjectId();
export const insertFn = jest.fn();
export const collection = jest.fn(() => ({ insertMany: insertFn }));
const { db } = dbMocks;

export const getBaseMockFastify = (service?: any) => ({
  authorizeStoreAdminForSpecificStore: jest.fn(() =>
    jest.fn().mockResolvedValue(undefined)
  ),
  services: service,

  db,
});
