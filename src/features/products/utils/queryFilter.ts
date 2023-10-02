import { ObjectId } from 'mongodb';

const exactMatchQuery = (
  filter: keyof typeof productsQueryFilter,
  value: string | boolean | number | ObjectId
) => {
  return { [filter]: { $eq: value } };
};

const rangeQuery = (
  filter: keyof typeof productsQueryFilter,
  value: number[]
) => {
  return {
    [filter]: {
      $gte: value[0],
      $lte: value[1],
    },
  };
};

// TODO install moment and process dates
const dateRangeQuery = (
  filter: keyof typeof productsQueryFilter,
  value: string[]
) => {
  return {
    [filter]: {
      $gte: value[0],
      $lte: value[1],
    },
  };
};

export const productsQueryFilter = {
  //exact strings
  name: (value: string) => exactMatchQuery('name', value),
  sku: (value: string) => exactMatchQuery('sku', value),
  store: (value: string) => exactMatchQuery('store', new ObjectId(value)),
  offer: (value: string) => exactMatchQuery('offer', new ObjectId(value)),
  productCategories: (value: string) =>
    exactMatchQuery('productCategories', new ObjectId(value)),
  productType: (value: string) =>
    exactMatchQuery('productType', new ObjectId(value)),
  createdBy: (value: string) => exactMatchQuery('createdBy', value),
  updatedBy: (value: string) => exactMatchQuery('updatedBy', value),

  //exact bool
  isPromoted: (value: string) => exactMatchQuery('isPromoted', Boolean(value)),

  //range or exact number
  singlePriceWithVAT: (value: number | number[]) => {
    if (Array.isArray(value)) {
      return rangeQuery('singlePriceWithVAT', value);
    } else {
      return { singlePriceWithVAT: { $eq: value } };
    }
  },
  singlePriceBeforeVAT: (value: number | number[]) => {
    if (Array.isArray(value)) {
      return rangeQuery('singlePriceWithVAT', value);
    } else {
      return { singlePriceWithVAT: { $eq: value } };
    }
  },
  availableQuantity: (value: number | number[]) => {
    if (Array.isArray(value)) {
      return rangeQuery('availableQuantity', value);
    } else {
      return exactMatchQuery('availableQuantity', value);
    }
  },
  ratingAverage: (value: number | number[]) => {
    if (Array.isArray(value)) {
      return rangeQuery('ratingAverage', value);
    } else {
      return exactMatchQuery('ratingAverage', value);
    }
  },

  //TODO range or exact Date
  // createdAt: (value: string | string[]) => {
  //   if (Array.isArray(value)) {
  //     return dateRangeQuery('createdAt', value);
  //   } else {
  //     return exactMatchQuery('createdAt', value);
  //   }
  // },
  // updatedAt: (value: string | string[]) => {
  //   if (Array.isArray(value)) {
  //     return dateRangeQuery('updatedAt', value);
  //   } else {
  //     return exactMatchQuery('updatedAt', value);
  //   }
  // },
};
