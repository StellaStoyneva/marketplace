import { OfferTypeEnum } from 'src/constants/enum';
import { withId, withTimestamps, _id } from 'src/utils/validation';
import { z } from 'zod';

const returnPolicy = z.object({
  durationDays: z.number().int().nonnegative(),
  description: z.string().trim().min(5).max(1000),
  url: z.string().optional(),
});

const rating = z.object({
  sum: z.number().int().nonnegative().optional(),
  count: z.number().int().nonnegative().optional(),
  oneStars: z.number().int().nonnegative().optional(),
  twoStars: z.number().int().nonnegative().optional(),
  threeStars: z.number().int().nonnegative().optional(),
  fourStars: z.number().int().nonnegative().optional(),
  fiveStars: z.number().int().nonnegative().optional(),
});

const fiveMostRecentBestReviews = z.array(
  z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional(),
    author: z.object({ name: z.string(), id: _id }).readonly(),
  }) // readonly - created by the handler
);

export const ProductSchema = z
  .object({
    name: z.string().min(5).max(200),
    sku: z.string().max(50).optional(),
    singlePriceBeforeVAT: z.number().coerce(),
    singlePriceWithVAT: z.number().coerce(),
    availableQuantity: z.number().int().nonnegative(),
    store: _id,
    offer: z.nativeEnum(OfferTypeEnum).nullish(),
    isPromoted: z.boolean().optional().default(false),
    description: z.string().max(600).optional(),
    images: z.string().array().optional(),
    video: z.string().optional(),
    returnPolicy,
    guaranteeDurationMonths: z.number().int().nonnegative(),
    rating,
    ratingAverage: z.number().nonnegative().optional(),
    fiveMostRecentBestReviews,
    productCategories: z.array(_id),
    productTypes: z.array(_id),
    storeName: z.string(), // readonly?
    createdBy: _id,
    updatedBy: _id.nullish(),
  })
  .merge(withId)
  .merge(withTimestamps);
