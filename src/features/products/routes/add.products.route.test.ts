import { register } from '../../../extensions/zod';
register();
import { addProduct } from './add.product.route';

describe('add Product route handler', function () {
  let routeHandler: any;
  let mockFastify: any;
  let collection: any;
  let insertOne: any;

  beforeEach(function () {
    mockFastify = {
      post: (_path: any, _opts: any, handler: never) => {
        routeHandler = handler;
      },
      db: jest.fn(() => ({
        name: 'marketplace',
        collection: jest.fn(() => ({ insertOne: jest.fn() })),
      })),
    };

    addProduct(mockFastify as never, undefined as never, () => null);
  });
  it('works', function () {
    routeHandler({
      body: [{ name: 'testName', sku: 'testCode' }],
      user: { _id: 'testUserId', store: 'testStore' },
    });

    expect(mockFastify.db).toBeCalled();
    expect(mockFastify.db.collection).toBeCalled();
    // expect(mockFastify.db.collection('products').insertOne.toBeCalledWith({
    //   name: 'testName',
    //   productCode: 'testCode',
    // });
  });
});

// describe('delete Product route handler', function () {
//   let routeHandler: any;
//   let mockFastify: any;

//   beforeEach(function () {
//     mockFastify = {
//       post: (_path: any, _opts: any, handler: never) => {
//         routeHandler = handler;
//       },
//       db: jest.fn(),
//     };

//     deleteProduct(mockFastify as never, undefined as never, () => null);
//   });

//   it('works', function () {
//     routeHandler({
//       params: { id: '123' },
//       user: { _id: 'test', store: 'test' },
//     });

//     expect(mockFastify.db).toBeCalledWith('marketplace');
//   });
// });

// describe('delete Product route handler', function () {
//   let routeHandler: any;
//   let mockFastify: any;

//   beforeEach(function () {
//     mockFastify = {
//       post: (_path: any, _opts: any, handler: never) => {
//         routeHandler = handler;
//       },
//       db: jest.fn(),
//     };

//     deleteProduct(mockFastify as never, undefined as never, () => null);
//   });

//   it('works', function () {
//     routeHandler({
//       params: { id: '65665655' },
//       user: { _id: 'someID', store: 'test' },
//     });

//     expect(mockFastify.db).toBeCalledWith('65665655');
//   });
// });
