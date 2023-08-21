import { FastifyPluginCallback, RawServerDefault } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"

export const hello: FastifyPluginCallback<Record<never, never>, RawServerDefault, ZodTypeProvider> = function users(fastify, _opts, done) {

  fastify.get
    ('/',
      {
        schema: {
          querystring: z.object({
            who: z.string()
          })
        }
      }, (req) => {
        return `Hello, ${req.query.who}!`
      })

  done()
}
