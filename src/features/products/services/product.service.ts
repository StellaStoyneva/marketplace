import { Db, ObjectId } from 'mongodb';
import { CollectionEnum } from '../../../db/enum/collection.enum';
import { IUser } from 'src/plugins/authentication';
import {
  IInsertProduct,
  IQueryStringProduct,
  IUpdateProduct,
} from '../entities';
import {
  processNewProductRequest,
  processProductUpdateRequestBody,
} from '../utils';
import { productsQueryFilter } from '../utils/queryFilter';

export const productService = function (db: Db) {
  const collection = db.collection(CollectionEnum.Products);

  async function addProducts(user: IUser, data: IInsertProduct[]) {
    const productsArray = processNewProductRequest(user, data);

    return await collection.insertMany(productsArray);
  }

  async function getProducts(queryString: IQueryStringProduct) {
    const resultQuery = Object.entries(queryString).reduce((acc, [k, v]) => {
      return {
        ...acc,
        ...productsQueryFilter[k as keyof typeof productsQueryFilter](
          v as never
        ),
      };
    }, {});

    return await collection.find(resultQuery)?.toArray();
  }

  async function updateProduct(
    productId: ObjectId,
    user: IUser,
    data: IUpdateProduct
  ) {
    const product = processProductUpdateRequestBody(user, data);

    return await collection.updateOne({ _id: productId }, { $set: product });
  }

  async function deleteProduct(id: ObjectId) {
    const result = await collection.deleteOne({ _id: id });

    return result;
  }

  return {
    addProducts,
    updateProduct,
    deleteProduct,
    getProducts,
  };
};
