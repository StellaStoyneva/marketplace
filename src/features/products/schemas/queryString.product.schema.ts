import { z } from 'zod';

export const queryStringProductSchema = z.object({
  name: z.string().optional(),
  sku: z.string().optional(),
  store: z.string().optional(),
  offer: z.string().optional().nullish(),
  isPromoted: z.number().coerce().optional(),
  productCategories: z.string().optional(),
  productType: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),

  ratingAverage: z
    .array(z.number().coerce())
    .optional()
    .or(z.number().coerce().optional()),
  availableQuantity: z
    .array(z.number().coerce())
    .optional()
    .or(z.number().coerce().optional()),
  singlePriceBeforeVAT: z
    .array(z.number().coerce())
    .optional()
    .or(z.number().coerce().optional()),
  singlePriceWithVAT: z
    .array(z.number().coerce())
    .optional()
    .or(z.number().coerce().optional()),
  createdAt: z.array(z.string()).optional().or(z.string().optional()),
  updatedAt: z.array(z.string()).optional().or(z.string().optional()),
});
