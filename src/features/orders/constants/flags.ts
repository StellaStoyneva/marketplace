import { DeliveryStatusEnum } from 'src/constants/enum';

export const flags = {
  [DeliveryStatusEnum.ordered]: {
    isReturned: false,
    isCancelable: true,
    isRefundable: false,
    isCanceled: false,
  },
  [DeliveryStatusEnum.shipped]: {
    isReturned: false,
    isCancelable: false,
    isRefundable: false,
    isCanceled: false,
  },
  [DeliveryStatusEnum.delivered]: {
    isReturned: false,
    isCancelable: false,
    isRefundable: true,
    isCanceled: false,
  },
  [DeliveryStatusEnum.canceled]: {
    isReturned: false,
    isCancelable: false,
    isRefundable: false,
    isCanceled: true,
  },
  [DeliveryStatusEnum.shippedBack]: {
    isReturned: true,
    isCancelable: false,
    isRefundable: true,
    isCanceled: false,
  },
  [DeliveryStatusEnum.deliveredBack]: {
    isReturned: true,
    isCancelable: false,
    isRefundable: true,
    isCanceled: false,
  },
};
