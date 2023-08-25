import { insertManyBodySchema, insertOneBodySchema } from '.';

export const insertBodySchema = insertManyBodySchema.or(insertOneBodySchema);

/**
 *
 * store: z.string().optional(),
 * createdBy: z.string().optional(),
 * createdAt: z.array(z.string().optional()).or(z.string().optional()),
 */
