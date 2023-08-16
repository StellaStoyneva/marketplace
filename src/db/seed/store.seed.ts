import { faker } from '@faker-js/faker';
import { IStore } from 'src/features/stores/entities/store.entity';

export const storeSeedData: IStore[] = faker.helpers.multiple(
  createStoreSeedData,
  {
    count: 260,
  }
);

function createStoreSeedData(): IStore {
  return {
    name: faker.person.fullName(),
    address: {
      streetAddress: faker.location.streetAddress(),
      zipCode: faker.location.zipCode(),
      city: faker.location.city(),
      country: faker.location.country(),
    },
    contact_person: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone_number: faker.phone.number(),
    },
    mol: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone_number: faker.phone.number(),
    },
    vatNumber: faker.number.int({ min: 111111111, max: 999999999 }),
    isVerified: faker.helpers.arrayElement([true, false]),
    createdAt: faker.date.past(),
    updatedAt: faker.helpers.arrayElement([faker.date.past(), null]),
    createdBy: faker.database.mongodbObjectId(),
    updatedBy: faker.database.mongodbObjectId(),
  };
}
