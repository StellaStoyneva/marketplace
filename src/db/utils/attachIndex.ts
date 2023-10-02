import { Db } from 'mongodb';
import { CollectionEnum } from 'src/db/enum/collection.enum';

export const attachIndex = (
  db: Db,
  collection: CollectionEnum,
  indexingMapper: Record<string, Record<string, number>[]>
) => {
  indexingMapper[collection].forEach((idx: Record<string, number>) => {
    db.collection(collection).createIndex(idx);
  });
};
