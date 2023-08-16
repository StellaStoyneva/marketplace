import { faker } from '@faker-js/faker';
import { UserRoleEnum } from 'src/constants/enum';
import { IUser } from 'src/features/users';

export const usersSeedData = faker.helpers.multiple(createUserSeedData, {
  count: 260,
});

function createUserSeedData(): IUser {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    name: faker.person.fullName(),
    phoneNumber: faker.phone.number(),
    address: {
      streetAddress: faker.location.streetAddress(),
      zipCode: faker.location.zipCode(),
      city: faker.location.city(),
      country: faker.location.country(),
    },
    role: faker.helpers.enumValue(UserRoleEnum),
    store: faker.database.mongodbObjectId(),
    createdAt: faker.date.past(),
    updatedAt: faker.helpers.arrayElement([faker.date.past(), null]),
  };
}
