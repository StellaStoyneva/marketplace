import { ObjectId } from 'mongodb';
import { z } from 'zod';
//import type { ObjectId } from 'bson';

export const _id = z.custom<ObjectId>();

export const email = z.string().trim().toLowerCase().max(255).email();

export const password = z.string().min(6).max(255);

export const timestamp = z.string().datetime();
