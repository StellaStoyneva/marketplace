import { faker } from '@faker-js/faker/locale/af_ZA';
import { IOrderItem } from 'src/features/orders/entities/orderItem.entity';

function createOrderItemSeedData(): IOrderItem {
  return {
    itemName: faker.string.alphanumeric(),
    singlePriceBeforeVAT: faker.number.float({ min: 0.01 }),
    singlePriceWithVAT: faker.number.float({ min: 0.01 + 0.01 * 0.2 }),
    finalPriceBeforeVAT: faker.number.float({ min: 0.01 }),
    finalPriceWithVAT: faker.number.float({ min: 0.01 + 0.01 * 0.2 }),
    quantity: faker.number.int(),
    image: faker.internet.url(),
    store: faker.database.mongodbObjectId(),
    deliveryStatus: faker.database.mongodbObjectId(),
    isReturned: faker.helpers.arrayElement([true, false]),
    order: faker.database.mongodbObjectId(),
    returnDeadline: faker.helpers.arrayElement([
      faker.date.past(),
      faker.date.future(),
    ]),
    refundDeadline: faker.helpers.arrayElement([faker.date.past(), undefined]),
  };
}

export const orderItemSeedData = faker.helpers.multiple(
  createOrderItemSeedData,
  {
    count: 260,
  }
);
