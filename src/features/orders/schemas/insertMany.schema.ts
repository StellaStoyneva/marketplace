import { z } from 'zod';

//invoiceNumber: z.number().coerce();
//return deadline calc - on delivery status delivered

export const insertOrderSchema = z.object({
  //payment
  transactions: z.array(z.string()).optional(),
  totalPriceBeforeVAT: z.number().coerce(),
  totalPriceWithVAT: z.number().coerce(),
  paymentMethod: z.string(),
  invoiceAddress: z.object({
    streetAddress: z.string(),
    zipCode: z.string(),
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
          quantity: z.number().coerce(),
          singlePriceBeforeVAT: z.number().coerce(),
          singlePriceWithVAT: z.number().coerce(),
          finalPriceBeforeVAT: z.number().coerce(),
          finalPriceWithVAT: z.number().coerce(),
          daysForReturn: z.number().coerce(),
        })
      ),
      /**Payment */
      finalPriceBeforeVAT: z.number().coerce(),
      finalPriceWithVAT: z.number().coerce(),
      /**Delivery */
      deliveryDetails: z.object({
        recipient: z.string(),
        phoneNumber: z.string(),
        deliveryType: z.string(),
        address: z.object({
          streetAddress: z.string(),
          zipCode: z.string(),
          city: z.string(),
          country: z.string(),
        }),
      }),
      transaction: z.string().optional(),
    })
  ),
});
