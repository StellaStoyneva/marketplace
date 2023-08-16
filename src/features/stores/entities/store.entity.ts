import { ObjectId } from 'mongodb';
import { IAddress } from 'src/constants/types/address';

export interface IStore {
  name: string;
  address?: IAddress;
  contact_person: { name: string; email: string; phone_number: string };
  mol: { name: string; email: string; phone_number: string };
  vatNumber: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  createdBy: ObjectId | string;
  updatedBy: ObjectId | string | null;
}
