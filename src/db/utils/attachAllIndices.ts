import { Db } from 'mongodb';
import { CollectionEnum } from 'src/constants/enum/collection.enum';

export const attachAllIndices = (
  db: Db,
  indexingMapper: Record<string, Record<string, number>[]>,
  attachIndex: (
    db: Db,
    collection: CollectionEnum,
    indexingMapper: Record<string, Record<string, number>[]>
  ) => void
) => {
  Object.keys(indexingMapper).forEach((collection: string) => {
    attachIndex(db, collection as CollectionEnum, indexingMapper);
  });
};
