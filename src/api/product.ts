import { FastifyPluginCallback, RawServerDefault } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"

declare module 'zod' {
  interface ZodNumber {
    coerce(): ZodNumber;
  }
}

export const register = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (typeof z.ZodNumber.prototype.coerce === 'undefined') {
    z.ZodNumber.prototype.coerce = function() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return new (this as any).constructor({
        ...this._def,
        coerce: true,
      });
    };
  }
}

register();


const productsCountQueryFilter: Record<'minRating' | 'avgRating', any> = {
  minRating: (value: number | number[]) => {
    if (Array.isArray(value)) {
      return {
        minRating: {
          $gt: value[0],
          $lt: value[1]
        }
      }
    } else {
      return { minRating: { $eq: value } }
    }
  },
  avgRating: (value: number | number[]) => {
    if (Array.isArray(value)) {
      return {
        avgRating: {
          $gt: value[0],
          $lt: value[1]
        }
      }
    } else {
      return { avgRating: { $eq: 'value' } }
    }
  }
}

export const productsCount: FastifyPluginCallback<Record<never, never>, RawServerDefault, ZodTypeProvider> = function users(fastify, _opts, done) {

  fastify.get
    ('/count',
      {
        schema: {
          querystring: z.object({
            type: z.enum(['minRating', 'avgRating']).optional().default('avgRating'),
            value: z.number().coerce().optional().default(0)
          })
        }
      }, async (req) => {
        const { type, value } = req.query;

        const result = await fastify.db('test')?.collection('products').countDocuments(productsCountQueryFilter[type as keyof typeof productsCountQueryFilter](value) || {});
        // const result = await fastify.db('test')?.collection('products').find({});

        console.log({ result })


        return `Hello, ${req.query}!`
      })

  done()
}
