const exactMatchQuery = (
  filter: keyof typeof productsQueryFilter,
  value: any
) => {
  return { [filter]: { $eq: value } };
};

const rangeQuery = (filter: keyof typeof productsQueryFilter, value: any[]) => {
  return {
    [filter]: {
      $gte: value[0],
      $lte: value[1],
    },
  };
};

export const productsQueryFilter: Record<filterType, any> = {
  //exact strings
  name: (value: string) => exactMatchQuery('name', value),
  productCode: (value: string) => exactMatchQuery('productCode', value),
  store: (value: string) => exactMatchQuery('store', value),
  offer: (value: string) => exactMatchQuery('offer', value),
  productCategories: (value: string) =>
    exactMatchQuery('productCategories', value),
  productTypes: (value: string) => exactMatchQuery('productTypes', value),
  createdBy: (value: string) => exactMatchQuery('createdBy', value),
  updatedBy: (value: string) => exactMatchQuery('updatedBy', value),

  //exact bool
  isPromoted: (value: string) => exactMatchQuery('isPromoted', Boolean(value)),

  //range or exact number
  price: (value: number | number[]) => {
    if (Array.isArray(value)) {
      return rangeQuery('price', value);
    } else {
      return { price: { $eq: value } };
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

  //range or exact Date
  createdAt: (value: number | number[]) => {
    if (Array.isArray(value)) {
      return rangeQuery('createdAt', value);
    } else {
      return exactMatchQuery('createdAt', value);
    }
  },
  updatedAt: (value: number | number[]) => {
    if (Array.isArray(value)) {
      return rangeQuery('updatedAt', value);
    } else {
      return exactMatchQuery('updatedAt', value);
    }
  },
};
