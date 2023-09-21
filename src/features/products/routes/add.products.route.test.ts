/* eslint-disable @typescript-eslint/no-explicit-any */
import { register } from '../../../extensions/zod';
register();
import { ObjectId } from 'mongodb';
import { addProducts as addProductsRoute } from './add.product.route';

describe('add Product route handler', function () {
  let routeHandler: any;
  let mockFastify: any;
  let collection: any;
  let insertFn: any;
  let userId: any;
  let store: any;
  let addProducts: any;
  let updateProduct: any;
  let deleteProduct: any;
  let productService: any;

  beforeEach(function () {
    insertFn = jest.fn();
    collection = jest.fn(() => ({ insertMany: insertFn }));
    //  productService = jest.fn(() => ({ addProducts }));
    addProducts = jest.fn(() => ({
      insertMany: insertFn,
    }));
    mockFastify = {
      services: {
        productService: {
          addProducts,
        },
      },

      post: (_path: any, _opts: any, handler: never) => {
        routeHandler = handler;
      },
      db: jest.fn(() => ({
        name: 'marketplace',
        collection: collection,
      })),
    };

    userId = new ObjectId();
    store = new ObjectId();

    addProductsRoute(mockFastify as never, undefined as never, () => null);
  });
  it('works', function () {
    const body = [
      {
        name: 'testName',
        sku: 'testCode',
        singlePriceBeforeVAT: 10.0,
        singlePriceWithVAT: 12.5,
        availableQuantity: 10,
        offer: 'sale',
        isPromoted: 1,
        productCategories: [new ObjectId()],
        productTypes: new ObjectId(),
        guaranteeDurationMonths: 24,
        returnPolicy: {
          daysForReturn: 30,
          description: 'testDescription',
          url: 'https://www.test.com',
        },
        images: ['https://www.test-image1.com', 'https://www.test-image2.com'],
      },
    ];
    routeHandler({
      body,
      user: { _id: userId, store },
    });

    expect(mockFastify.services.productService.addProducts).toBeCalled();

    // expect(mockFastify.services.productService).toBeCalled();
    // expect(mockFastify.db).toBeCalled();
    // expect(collection).toBeCalled();
    // expect(insertFn.mock.calls[0][0]).toMatchObject(body);
  });
});
