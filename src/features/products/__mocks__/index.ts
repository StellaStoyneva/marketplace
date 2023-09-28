import {
  deleteOneJestFn,
  getJestFn,
  insertManyJestFn,
  updateOneJestFn,
} from '../../../../test/db.mocks';

export const productService = {
  productService: {
    addProducts: insertManyJestFn,
    deleteProduct: deleteOneJestFn,
    getProducts: getJestFn,
    updateProduct: updateOneJestFn,
  },
};
