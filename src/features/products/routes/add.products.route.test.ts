import { register } from '../../../extensions/zod';
register();
import { ObjectId } from 'mongodb';
import { addProduct } from './add.product.route';

describe('add Product route handler', function () {
  let routeHandler: any;
  let mockFastify: any;
  let collection: any;
  let insertFn: any;
  let userId: any;
  let store: any;

  beforeEach(function () {
    insertFn = jest.fn();
    collection = jest.fn(() => ({ insertOne: insertFn, insertMany: insertFn }));
    mockFastify = {
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

    addProduct(mockFastify as never, undefined as never, () => null);
  });
  it('works', function () {
    const body = [
      {
        name: 'testName',
        sku: 'testCode',
        productCategories: [new ObjectId()],
        productTypes: new ObjectId(),
      },
    ];
    routeHandler({
      body,
      user: { _id: userId, store },
    });

    expect(mockFastify.db).toBeCalled();
    expect(collection).toBeCalled();
    expect(insertFn.mock.calls[0][0]).toMatchObject(body);
  });
});
