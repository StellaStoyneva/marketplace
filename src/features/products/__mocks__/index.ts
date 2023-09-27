import {
  deleteOneJestFn,
  insertManyJestFn,
} from '../../../tests.setup/db.mocks';

export const productService = {
  productService: {
    addProducts: insertManyJestFn,
    deleteProduct: deleteOneJestFn,
  },
};
