import { z } from 'zod';

export const insertProductsBodySchema = z.array(
  z.object({
    name: z.string(),
    sku: z.string(),
    description: z.string().optional(),
    singlePriceBeforeVAT: z.number().coerce(),
    singlePriceWithVAT: z.number().coerce(),
    availableQuantity: z.number().coerce(),
    offer: z.string().optional(), //z.nativeEnum(OfferTypeEnum).nullish().optional(),
    isPromoted: z.number().coerce().optional(),
    images: z.array(z.string()).optional(),
    video: z.string().optional(),
    returnPolicy: z.object({
      daysForReturn: z.number().coerce().optional(),
      description: z.string().optional(),
      url: z.string().optional(),
    }),
    guaranteeDurationMonths: z.number().coerce(),
    productCategories: z.array(z.string()),
    productType: z.string(),
  })
);
