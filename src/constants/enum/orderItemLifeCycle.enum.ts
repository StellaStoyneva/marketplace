export enum OrderItemLifeCycleEnum {
  ordered = 'ordered',
  shipped = 'shipped',
  delivered = 'delivered', // return date should be calculated
  canceled = 'canceled', // rollback quantity
  shippedBack = 'shippedBack', // refund date should be calculated
  deliveredBack = 'deliveredBack',
}
