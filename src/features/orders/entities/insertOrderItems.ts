import { Insert } from 'src/db/operations';
import { IOrderItem } from './orderItem.entity';

export type TInsertOrderItem = Insert<
  Pick<
    IOrderItem,
    | 'name'
    | 'sku'
    | 'image'
    | 'singlePriceBeforeVAT'
    | 'singlePriceWithVAT'
    | 'finalPriceBeforeVAT'
    | 'finalPriceWithVAT'
    | 'quantity'
    | 'deliveryStatus'
    | 'daysForReturn'
    | 'product'
    | 'status'
    | 'isReturnable'
    | 'isReturned'
    | 'isRefundable'
    | 'isRefunded'
    | 'returnDeadline'
    | 'refundDeadline'
  >
>;
