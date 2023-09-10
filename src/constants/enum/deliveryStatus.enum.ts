export enum DeliveryStatusEnum {
  ordered = 'ordered',
  delivered = 'delivered', // return date should be calculated
  shipped = 'shipped',
  canceled = 'canceled', // rollback quantity
  shippedBack = 'shippedBack', // refund date should be calculated
  deliveredBack = 'deliveredBack',
}
