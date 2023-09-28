import { ObjectId } from 'mongodb';
import { IUser } from 'src/plugins/authentication';
import { IInsertProduct } from '..';

export const processNewProductRequest = (
  user: IUser,
  data: IInsertProduct[]
) => {
  const store = new ObjectId(user.store);
  const createdBy = new ObjectId(user._id);

  const productsArray = data.map((product) => ({
    ...product,
    isPromoted: product.isPromoted && product.isPromoted ? true : false,
    productCategories: product.productCategories.map(
      (cat: string | ObjectId) => new ObjectId(cat)
    ),
    productTypes: new ObjectId(product.productType),
    returnPolicy: {
      daysForReturn: product.returnPolicy.daysForReturn ?? 0,
      isReturnable:
        product.returnPolicy.isReturnable ??
        !!product.returnPolicy.daysForReturn,
      description: product.returnPolicy.description ?? null,
      url: product.returnPolicy.description ?? null,
    },

    createdAt: new Date(),
    store,
    createdBy,
  }));

  return productsArray;
};
