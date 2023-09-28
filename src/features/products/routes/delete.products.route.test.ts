/* eslint-disable @typescript-eslint/no-explicit-any */
import { register } from '../../../extensions/zod';
register();
import { deleteProduct as deleteProductRoute } from './delete.product.route';
import { deleteProductData } from '../__data__';
import { getBaseMockFastify } from '../../../../test/fastify.mock';
import { productService } from '../__mocks__';
import { store1, storeAdminUserId1 } from '../../../../test/data';

describe('delete Product route handler', function () {
  let routeHandler: any;
  let mockFastify: any;

  beforeEach(function async() {
    mockFastify = {
      ...getBaseMockFastify(productService),

      delete: (_path: any, _opts: any, handler: never) => {
        routeHandler = handler;
      },
    };

    deleteProductRoute(mockFastify as never, undefined as never, () => null);
  });

  it('calls authorizeStoreAdminForSpecificStore', async function () {
    await routeHandler({
      params: { id: deleteProductData.productIdString },
      user: { _id: storeAdminUserId1, store: store1 },
    });

    expect(mockFastify.authorizeStoreAdminForSpecificStore).toBeCalled();
  });
  it('calls services.productService.deleteProduct', async function () {
    await routeHandler({
      params: { id: deleteProductData.productIdString },
      user: { _id: storeAdminUserId1, store: store1 },
    });
    expect(mockFastify.services.productService.deleteProduct).toBeCalled();
  });
});
