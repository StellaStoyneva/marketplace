/* eslint-disable @typescript-eslint/no-explicit-any */
import { register } from '../../../extensions/zod';
register();
import { productService as fastifyProductService } from './product.service';
import { getProductTestData } from '../__data__';
import { getBaseMockFastify } from '../../../../test/fastify.mock';

describe('product service delete Product', function () {
  let mockFastify: any;

  beforeEach(function async() {
    mockFastify = {
      ...getBaseMockFastify(),
    };

    fastifyProductService(mockFastify.db()).getProducts(
      getProductTestData.getProductsReqQueryInput
    );
  });

  it('delete one to be called with correct product id', function () {
    expect(mockFastify.db().collection().find).toBeCalledWith(
      getProductTestData.getProductsReqQueryProcessed
    );
  });
});
