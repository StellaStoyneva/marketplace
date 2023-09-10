import { z } from 'zod';
//      returnDeadline based on  delivered date + daysForReturn + deliveryStatus===delivered
//      can be returned

export const updateOrderSchema = z.object({
  finalPriceBeforeVAT: z.number().coerce().optional(),
  finalPriceWithVAT: z.number().coerce().optional(),
  deliveryType: z.string(), //DeliveryTypeEnum;
  deliveryRecipient: z.string().optional(),
  recipientPhoneNumber: z.string().optional(),
  deliveryStatus: z.string().optional(),
  items: z.array(
    z.object({
      _id: z.string().optional(),
      singlePriceBeforeVAT: z.number().coerce().optional(),
      singlePriceWithVAT: z.number().coerce().optional(),
      finalPriceBeforeVAT: z.number().coerce().optional(),
      finalPriceWithVAT: z.number().coerce().optional(),
      isReturned: z.number().coerce().optional(),
    })
  ),
});
