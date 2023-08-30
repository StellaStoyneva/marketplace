import { z } from 'zod';

export const registerUserSchema = z.object({
  email: z.string().min(3),
  password: z.string().min(6),
  store: z.string().optional(),
  role: z.string(),
});
