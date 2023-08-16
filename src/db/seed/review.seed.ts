import { faker } from '@faker-js/faker';
import { IProductReview } from 'src/features/products';

export function createReviewsSeedData(): IProductReview {
  return {
    user: faker.database.mongodbObjectId(),
    content: faker.string.alphanumeric(),
    images: [faker.internet.url(), faker.internet.url()],
    video: faker.internet.url(),
    rating: faker.number.int({ min: 1, max: 5 }),
    isReported: faker.helpers.arrayElement([true, false]),
    createdAt: faker.date.past(),
  };
}

export const reviewsSeedData = faker.helpers.multiple(createReviewsSeedData, {
  count: 260,
});
