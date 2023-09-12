import { z } from 'zod';

//invoiceNumber: z.number().coerce();
//return deadline calc - on delivery status delivered

export const insertOrderSchema = z.object({
  //payment
  transactions: z.array(z.string().optional()).optional(),
  totalPriceBeforeVAT: z.number().coerce(),
  totalPriceWithVAT: z.number().coerce(),
  paymentMethod: z.string(),
  invoiceAddress: z.object({
    streetAddress: z.string(),
    zipCode: z.number().coerce(),
    city: z.string(),
    country: z.string(),
  }),

  /**Items */
  ordersToStore: z.array(
    z.object({
      /**Store - items */
      store: z.string(),
      items: z.array(
        z.object({
          _id: z.string(),
          name: z.string(),
          sku: z.string(),
          image: z.string(),
          singlePriceBeforeVAT: z.number().coerce(),
          singlePriceWithVAT: z.number().coerce(),
          finalPriceBeforeVAT: z.number().coerce(),
          finalPriceWithVAT: z.number().coerce(),
          quantity: z.number().coerce(),
          daysForReturn: z.number().coerce(),
        })
      ),
      /**Payment */
      finalPriceBeforeVAT: z.number().coerce(),
      finalPriceWithVAT: z.number().coerce(),
      /**Delivery */
      deliveryDetails: z.object({
        deliveryType: z.string(), //DeliveryTypeEnum;
        recipient: z.string(),
        phoneNumber: z.string(),
        address: z.object({
          streetAddress: z.string(),
          zipCode: z.number().coerce(),
          city: z.string(),
          country: z.string(),
        }),
        deliveryStatus: z.string(),
      }),
      transaction: z.string().optional(),
    })
  ),
});
