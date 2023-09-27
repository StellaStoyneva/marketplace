/* eslint-disable @typescript-eslint/no-explicit-any */
import { register } from '../../../extensions/zod';
register();
import { addProducts as addProductsRoute } from './add.product.route';
import { addProductData } from '../__data__';
import { testData } from '../../../tests.setup';
import { productService } from '../__mocks__';
import { getBaseMockFastify } from '../../../tests.setup/fastify.mock';

const { storeAdminUserId1: userId, store1: store } = testData;

describe('add Product route handler', function () {
  let routeHandler: any;
  let mockFastify: any;

  beforeEach(function () {
    mockFastify = {
      ...getBaseMockFastify(productService),
      post: (_path: any, _opts: any, handler: never) => {
        routeHandler = handler;
      },
    };

    addProductsRoute(mockFastify as never, undefined as never, () => null);
  });

  it('calls productService.addProducts', function () {
    routeHandler({
      body: addProductData.rawInput,
      user: { _id: userId, store },
    });

    expect(mockFastify.services.productService.addProducts).toBeCalled();
    expect(
      mockFastify.services.productService.addProducts.mock.calls[0][1][0]
    ).toMatchObject(addProductData.rawInputMatchObject);
    // expect(mockFastify.db).toBeCalled();
    // expect(collection).toBeCalled();
    // expect(mockFastify.db.collection.insertMany).toBeCalled();
    //expect(insertFn.mock.calls[0][0]).toMatchObject(body);
  });
});
