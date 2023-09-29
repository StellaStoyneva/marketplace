import { ObjectId } from 'mongodb';

// user id
export const storeAdminUserId1 = new ObjectId();
export const storeAdminUserId2 = new ObjectId();
export const customerUserId = new ObjectId();

// store id
export const store1 = new ObjectId();
export const store2 = new ObjectId();

export const storeAdminObj = {
  _id: String(storeAdminUserId1),
  store: String(store1),
  email: ' test@test.com',
  role: '64d6163a3fce5756116f4f90',
};
