export enum ReturnStatusEnum {
  shippedBack = 'shipped back', // itemsQualityCheckDeadline to be calculated
  deliveredBack = 'received back in store', // refund date should be calculated
  itemsQualityChecked = 'items quality is being checked',
  itemsQualityApproved = 'items quality is approved', // rollback quantity + and update isRefundable:true
  refundInitiated = 'refund initiated',
  refundCompleted = 'refund completed',
}
