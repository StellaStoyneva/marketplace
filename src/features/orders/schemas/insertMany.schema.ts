import { z } from 'zod';

//invoiceNumber: z.number().coerce();
//return deadline calc - on delivery status delivered

export const insertOrderSchema = z.object({
  priceToPayOnOrderWithVAT: z.number().coerce(),
  invoiceAddress: z.object({
    streetAddress: z.string(),
    zipCode: z.string(),
    city: z.string(),
    country: z.string(),
  }),
  orderItems: z.array(
    z.object({
      finalPriceBeforeVAT: z.number().coerce(),
      finalPriceWithVAT: z.number().coerce(),
      invoiceAddress: z.object({
        streetAddress: z.string(),
        zipCode: z.number().coerce(),
        city: z.string(),
        country: z.string(),
      }),
      paymentMethod: z.string(), //PaymentMethodTypeEnum;
      deliveryType: z.string(), //DeliveryTypeEnum;
      deliveryRecipient: z.string(),
      recipientPhoneNumber: z.string(),
      store: z.string(),
      items: z.array(
        z.object({
          _id: z.string(),
          name: z.string(),
          productCode: z.string(),
          singlePriceBeforeVAT: z.number().coerce(),
          singlePriceWithVAT: z.number().coerce(),
          finalPriceBeforeVAT: z.number().coerce(),
          finalPriceWithVAT: z.number().coerce(),
          quantity: z.number().coerce(),
          daysForReturn: z.number().coerce(),
          images: z.array(z.string()),
        })
      ),
    })
  ),
});
