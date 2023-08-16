import { faker } from '@faker-js/faker';
import { DeliveryTypeEnum, PaymentMethodTypeEnum } from 'src/constants/enum';
import { IOrder } from 'src/features/orders/entities/order.entity';

export function createOrderSeedData(): IOrder {
  return {
    customer: faker.database.mongodbObjectId(),
    customerEmail: faker.internet.email(),
    store: faker.database.mongodbObjectId(),
    items: [
      faker.database.mongodbObjectId(),
      faker.database.mongodbObjectId(),
      faker.database.mongodbObjectId(),
      faker.database.mongodbObjectId(),
      faker.database.mongodbObjectId(),
      faker.database.mongodbObjectId(),
    ],
    finalPriceBeforeVAT: faker.number.float({ min: 0.01 }),
    finalPriceWithVAT: faker.number.float({ min: 0.01 + 0.01 * 0.2 }),
    invoiceAddress: {
      streetAddress: faker.location.streetAddress(),
      zipCode: faker.location.zipCode(),
      city: faker.location.city(),
      country: faker.location.country(),
    },
    invoiceNumber: faker.number.int(),
    paymentMethod: faker.helpers.enumValue(PaymentMethodTypeEnum),
    deliveryType: faker.helpers.enumValue(DeliveryTypeEnum),
    deliveryRecipient: {
      name: faker.person.fullName(),
      phoneNumber: faker.phone.number(),
      email: faker.internet.email(),
    },
    createdAt: faker.date.past(),
    updatedAt: faker.helpers.arrayElement([faker.date.past(), null]),
    updatedBy: faker.helpers.arrayElement([
      faker.database.mongodbObjectId(),
      undefined,
    ]),
  };
}

export const orderSeedData = faker.helpers.multiple(createOrderSeedData, {
  count: 260,
});
