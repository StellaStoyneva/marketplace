/* eslint-disable @typescript-eslint/no-explicit-any */
import { register } from '../../../extensions/zod';
register();
import { productService as fastifyProductService } from './product.service';
import { updateProductTestData } from '../__data__';
import { getBaseMockFastify } from '../../../../test/fastify.mock';
import { storeAdminObj } from '../../../../test/data';

const { requestBodyProcessed, requestBody, productIdObjectId } =
  updateProductTestData;

describe('product service delete Product', function () {
  let mockFastify: any;

  beforeEach(function async() {
    mockFastify = {
      ...getBaseMockFastify(),
    };

    fastifyProductService(mockFastify.db()).updateProduct(
      productIdObjectId,
      storeAdminObj,
      requestBody
    );
  });

  it('update one to be called with correct product id and processed req body', function () {
    expect(
      mockFastify.db().collection().updateOne.mock.calls[0][1].$set
    ).toMatchObject(requestBodyProcessed);
  });
});
