import { z } from 'zod';

export const insertOneBodySchema = z.object({
  name: z.string(),
  productCode: z.string().optional(),
  offer: z.array(z.string().optional()).or(z.string().optional()), //z.nativeEnum(OfferTypeEnum).nullish().optional(),
  isPromoted: z.number().coerce().optional(),
  productCategories: z.array(z.string().optional()).or(z.string().optional()),
  productTypes: z.string().optional(),
  availableQuantity: z.number().coerce().optional(),
  price: z.number().coerce().optional(),
  daysForReturn: z.number().coerce().optional(),
});
