import { Db } from 'mongodb';

export const productService = function(db: Db) {
  async function addProducts(products: any[]) {
    return await db.collection('products').insertMany(products)
  }

  return {
    addProducts
  }
}
