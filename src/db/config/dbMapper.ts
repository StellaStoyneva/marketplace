import { dbEnum } from '../enum/db.enum';
import { connectMongoDB } from './mongoDB';

export type dbMapperType = Record<dbEnum, Record<string, () => void>>;

export const dbMapper = {
  [dbEnum.Mongo]: { connectDb: () => connectMongoDB() },
};
