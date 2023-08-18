import { faker } from '@faker-js/faker';
import { OfferTypeEnum } from 'src/constants/enum';
import { IProduct } from 'src/features/products';

const getRatingMockedData = () => {
  const oneStars = faker.number.int();
  const twoStars = faker.number.int();
  const threeStars = faker.number.int();
  const fourStars = faker.number.int();
  const fiveStars = faker.number.int();

  const sum =
    oneStars + twoStars * 2 + threeStars * 3 + fourStars * 4 + fiveStars * 5;
  const count = oneStars + twoStars + threeStars + fourStars + fiveStars;
  const rating = {
    sum,
    count,
    oneStars,
    twoStars,
    threeStars,
    fourStars,
    fiveStars,
  };

  const ratingAverage =
    rating.sum && rating.count
      ? Number((rating.sum / rating.count).toFixed(2))
      : undefined;
  return { rating, ratingAverage };
};

function createProductDocumentSeed(): IProduct {
  return {
    name: faker.string.alphanumeric({ length: { min: 3, max: 60 } }),
    productCode: faker.string.alphanumeric(),
    price: faker.number.float(),
    availableQuantity: faker.number.int({ min: 0 }),
    store: faker.database.mongodbObjectId(),
    offer: faker.helpers.arrayElement([
      faker.helpers.enumValue(OfferTypeEnum),
      null,
    ]),
    isPromoted: faker.helpers.arrayElement([true, false]),
    description: faker.string.alphanumeric({ length: { min: 3, max: 460 } }),

    images: [faker.internet.url(), faker.internet.url(), faker.internet.url()],
    video: faker.internet.url(),
    returnPolicy: {
      durationDays: faker.number.int({ min: 14 }),
      url: faker.internet.url(),
      description: faker.string.alphanumeric({ length: { min: 3, max: 460 } }),
    },
    guaranteeDurationMonths: faker.number.int(),
    rating: getRatingMockedData().rating,
    ratingAverage: getRatingMockedData().ratingAverage,
    fiveMostRecentBestReviews: [
      {
        rating: faker.number.int(),
        comment: faker.helpers.arrayElement([
          faker.string.alphanumeric(),
          null,
        ]),
        author: {
          name: faker.person.fullName(),
          id: faker.database.mongodbObjectId(),
        },
      },
    ],
    productCategories: [
      faker.database.mongodbObjectId(),
      faker.database.mongodbObjectId(),
    ],
    productTypes: [
      faker.database.mongodbObjectId(),
      faker.database.mongodbObjectId(),
    ],
    storeName: faker.string.alphanumeric(),
    createdAt: faker.date.past(),
    updatedAt: faker.helpers.arrayElement([faker.date.past(), null]),
    createdBy: faker.database.mongodbObjectId(),
    updatedBy: faker.database.mongodbObjectId(),
  };
}
export const productsSeedData = faker.helpers.multiple(
  createProductDocumentSeed,
  {
    count: 26000,
  }
);

// export type ProductSchemaType = z.infer<typeof ProductSchema>;

// export const productsSeedData = generateMock(ProductSchema, {
//   seed: 26000,
// });
