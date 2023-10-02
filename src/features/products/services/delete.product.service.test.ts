/* eslint-disable @typescript-eslint/no-explicit-any */
import { productsQueryFilter } from './../utils/queryFilter';
import { register } from '../../../extensions/zod';
register();
import { productService as fastifyProductService } from './product.service';
import { deleteProductData } from '../__data__';
import { getBaseMockFastify } from '../../../../test/fastify.mock';

const { productIdObjectId: productId } = deleteProductData;

describe('product service delete Product', function () {
  let mockFastify: any;

  beforeEach(function async() {
    mockFastify = {
      ...getBaseMockFastify(),
    };

    fastifyProductService(mockFastify.db()).deleteProduct(productId);
  });

  it('delete one to be called with correct product id', function () {
    expect(mockFastify.db().collection().deleteOne).toBeCalledWith({
      _id: productId,
    });
  });
});
