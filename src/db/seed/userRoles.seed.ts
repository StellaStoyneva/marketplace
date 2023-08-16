import { UserRoleEnum } from 'src/constants/enum';
import { IUserRole } from 'src/features/users/entities/userRole.entity';

export const userRolesSeedData: IUserRole[] = [
  { role: UserRoleEnum.AppAdmin },
  { role: UserRoleEnum.StoreAdmin },
  { role: UserRoleEnum.Customer },
];
