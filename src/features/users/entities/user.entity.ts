import { ObjectId } from 'mongodb';
import { UserRoleEnum } from 'src/constants/enum';
import { IAddress } from 'src/constants/types/address';

export interface IUser {
  name: string;
  email: string;
  phoneNumber?: string;
  address?: IAddress;
  role: UserRoleEnum;
  store?: ObjectId | string;
  password: string;
  createdAt: Date;
  updatedAt: Date | null;
}
