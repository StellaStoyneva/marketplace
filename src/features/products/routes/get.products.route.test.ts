/* eslint-disable @typescript-eslint/no-explicit-any */
import { register } from '../../../extensions/zod';
register();
import { getProducts as getProductsRoute } from './get.products.route';
import { getBaseMockFastify } from '../../../../test/fastify.mock';
import { productService } from '../__mocks__';
import { getProductTestData } from '../__data__';

describe('delete Product route handler', function () {
  let routeHandler: any;
  let mockFastify: any;

  beforeEach(function async() {
    mockFastify = {
      ...getBaseMockFastify(productService),

      get: (_path: any, _opts: any, handler: never) => {
        routeHandler = handler;
      },
    };

    getProductsRoute(mockFastify as never, undefined as never, () => null);
  });

  it('calls services.productService.getProducts', async function () {
    await routeHandler({ query: getProductTestData.getProductsReqQueryInput });
    expect(mockFastify.services.productService.getProducts).toBeCalled();
  });
});
