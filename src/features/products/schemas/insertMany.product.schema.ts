import { z } from 'zod';
import { insertOneBodySchema } from '.';

export const insertManyBodySchema = z.array(insertOneBodySchema);

/**
 *
 * store: z.string().optional(),
 * createdBy: z.string().optional(),
 * createdAt: z.array(z.string().optional()).or(z.string().optional()),
 */
