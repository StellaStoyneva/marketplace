import { z } from 'zod';
//      returnDeadline based on  delivered date + daysForReturn + deliveryStatus===delivered
//      can be returned

export const updateDeliveryStatusSchema = z.object({
  _id: z.string(),
  deliveryStatus: z.string().optional(),
  items: z
    .array(
      z.object({
        _id: z.string(),
        singlePriceBeforeVAT: z.number().coerce(),
        isReturned: z.number().coerce(),
        status: z.string(), //OrderItemLifeCycleEnum
      })
    )
    .optional(),
});
