/* eslint-disable @typescript-eslint/no-explicit-any */
import { register } from '../../../extensions/zod';
register();
import { updateProduct as updateProductRoute } from './update.product.route';
import { getBaseMockFastify } from '../../../../test/fastify.mock';
import { productService } from '../__mocks__';
import { store1, storeAdminUserId1 } from '../../../../test/data';
import { updateProductTestData } from '../__data__';

describe('update Product route handler', function () {
  let routeHandler: any;
  let mockFastify: any;

  beforeEach(function async() {
    mockFastify = {
      ...getBaseMockFastify(productService),

      patch: (_path: any, _opts: any, handler: never) => {
        routeHandler = handler;
      },
    };

    updateProductRoute(mockFastify as never, undefined as never, () => null);
  });

  it('calls updateProducts route handler', async function () {
    await routeHandler({
      params: { id: updateProductTestData.productIdString },
      user: { _id: storeAdminUserId1, store: store1 },
      body: updateProductTestData.requestBody,
    });
    expect(mockFastify.services.productService.updateProduct).toBeCalled();
  });
});
