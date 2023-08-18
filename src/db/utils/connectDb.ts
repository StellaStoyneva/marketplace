import { dbMapperType } from '../config/dbMapper';
import { dbEnum } from '../enum/db.enum';

export async function connectDb(db: dbEnum, dbMapper: dbMapperType) {
  dbMapper[db].connectDb();
}
