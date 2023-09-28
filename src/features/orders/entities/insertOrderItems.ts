import { Insert } from 'src/db/operations';
import { IOrderItem } from './orderItem.entity';

export type TInsertOrderItem = Insert<
  Pick<
    IOrderItem,
    | 'name'
    | 'sku'
    | 'image'
    | 'quantity'
    | 'singlePriceBeforeVAT'
    | 'singlePriceWithVAT'
    | 'finalPriceBeforeVAT'
    | 'finalPriceWithVAT'
    | 'daysForReturn'
    | 'status'
    | 'product'
    | 'isReturned'
    | 'isReturnable'
    | 'isCancelable'
    | 'isRefundable'
    | 'isCanceled'
    | 'returnDeadline'
    | 'refundDeadline'
  >
>;
