import { z } from 'zod';

export const updateProductBodySchema = z.object({
  name: z.string().optional(),
  sku: z.string().optional(),
  description: z.string().optional(),
  singlePriceBeforeVAT: z.number().coerce().optional(),
  singlePriceWithVAT: z.number().coerce().optional(),
  availableQuantity: z.number().coerce().optional(),
  offer: z.string().optional().nullable(),
  isPromoted: z.number().coerce().optional(),
  images: z.array(z.string()).optional(),
  video: z.string().optional(),
  returnPolicy: z
    .object({
      daysForReturn: z.number().coerce().optional(),
      description: z.string().optional(),
      url: z.string().optional(),
    })
    .optional(),
  guaranteeDurationMonths: z.number().coerce().optional(),
  productCategories: z.array(z.string()).optional(),
  productTypes: z.string().optional(),
});
