// operations
export const insertFn = jest.fn();
export const insertMany = { insertMany: insertFn };
export const deleteFn = jest.fn();
export const deleteOne = { deleteOne: deleteFn };
export const getFn = jest.fn();
export const find = { find: getFn };
export const updateFn = jest.fn();
export const updateOne = { patch: updateFn };

// db operations jest fn
export const insertManyJestFn = jest.fn(() => ({
  insertMany,
}));
export const deleteOneJestFn = jest.fn(() => ({
  deleteOne,
}));

export const getJestFn = jest.fn(() => ({
  find,
}));

export const updateOneJestFn = jest.fn(() => ({
  updateOne,
}));

// db core
export const dbName = 'marketplace';

export const collection = jest.fn(() => ({
  insertMany: insertFn,
  deleteOne: deleteFn,
  find: getFn,
  updateOne: updateFn,
}));

export const db = jest.fn(() => ({
  name: dbName,
  collection: collection,
}));
