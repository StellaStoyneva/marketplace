import { register } from "../../../extensions/zod";
register()
import { addProduct } from "./add.product.route";

describe('add Product route handler', function() {
  let routeHandler: any;
  let mockFastify: any

  beforeEach(function() {
    mockFastify = {
      post: (_path: any, _opts: any, handler: never) => {
        routeHandler = handler
      },
      db: jest.fn()
    }

    addProduct(mockFastify as never, undefined as never, () => null)
  })

  it('works', function() {
    routeHandler({ body: 'test', user: { _id: 'test', store: 'test' } })

    expect(mockFastify.db).toBeCalledWith('test')
  })
})



