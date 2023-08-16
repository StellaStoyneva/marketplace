import { ObjectId } from 'mongodb';
import { ProductCategoryEnum } from 'src/constants/enum';

export interface IProductCategory {
  productCategory: ProductCategoryEnum;
  productTypes: ObjectId | string[];
}
