export enum DeliveryStatusEnum {
  ordered = 'ordered',
  delivered = 'delivered', // return date should be calculated
  shipped = 'shipped',
  canceled = 'canceled', // rollback quantity
}

export enum ReturnStatusEnum {
  shippedBack = 'shipped back', // itemsQualityCheckDeadline to be calculated
  deliveredBack = 'received back in store', // refund date should be calculated
  itemsQualityChecked = 'items quality is being checked',
  itemsQualityApproved = 'items quality is approved', // rollback quantity + and update isRefundable:true
  refundInitiated = 'refund initiated',
  refundCompleted = 'refund completed',
}

export const DeliveryStatus = {
  ordered: 'ordered',
  delivered: 'delivered', // return date should be calculated
  shipped: 'shipped',
  canceled: 'canceled',
};

export type TDeliveryStatus = 'ordered' | 'delivered' | 'shipped' | 'canceled';
