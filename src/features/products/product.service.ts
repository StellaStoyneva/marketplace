import { Db, ObjectId } from 'mongodb';
import { CollectionEnum } from 'src/db/enum/collection.enum';
import {
  IInsertProduct,
  IQueryStringProduct,
  IUpdateProduct,
} from './entities';
import { productsQueryFilter } from './utils/queryFilter';

export const productService = function (db: Db) {
  const collection = db.collection(CollectionEnum.Products);

  async function addProducts(products: IInsertProduct[]) {
    return await collection.insertMany(products);
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

    return (await collection.find(resultQuery)?.toArray())?.slice(0, 5);
  }

  async function updateProduct(id: ObjectId, products: IUpdateProduct) {
    return await collection.updateOne({ _id: id }, { $set: products });
  }

  async function deleteProduct(id: ObjectId) {
    const result = await collection.deleteOne({ _id: id });
    console.log({ result });

    return result;
  }

  return {
    addProducts,
    updateProduct,
    deleteProduct,
    getProducts,
  };
};
