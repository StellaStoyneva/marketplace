// operations
export const insertFn = jest.fn();
export const insertMany = { insertMany: insertFn };
export const deleteFn = jest.fn();
export const deleteOne = { deleteOne: deleteFn };

// db operations jest fn
export const insertManyJestFn = jest.fn(() => ({
  insertMany,
}));
export const deleteOneJestFn = jest.fn(() => ({
  deleteOne,
}));

// db core
export const dbName = 'marketplace';

export const collection = jest.fn(() => ({
  insertMany: insertFn,
  deleteOne: deleteFn,
}));

export const db = jest.fn(() => ({
  name: dbName,
  collection: collection,
}));
