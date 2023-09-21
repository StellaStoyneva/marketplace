import { ObjectId } from 'mongodb';
import { IAddress } from 'src/constants/types/address';

export interface IUser {
  name: string;
  email: string;
  phoneNumber: string;
  address?: IAddress;
  role: ObjectId;
  store?: ObjectId | string;
  password: string;
  createdAt: Date;
  updatedAt: Date | null;
}
