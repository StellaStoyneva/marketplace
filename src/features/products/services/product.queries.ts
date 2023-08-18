import { request } from 'express';
import {
  FastifyPluginAsync,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
  RequestGenericInterface,
  RequestQuerystringDefault,
  RouteHandlerMethod,
} from 'fastify';
import { FastifyInstance } from 'fastify/types/instance';
import { RegisterOptions } from 'fastify/types/register';
import { ObjectId } from 'mongodb';
import { OfferTypeEnum } from 'src/constants/enum';
//import { requestQuerystring } from 'src/api/interfaces/requestQuerystring.interface';
import { mongoDB } from 'src/db/config/mongoDB';
import { CollectionEnum } from 'src/db/enum/collection.enum';
import { withTimestamps, _id } from 'src/utils/validation';
import { TypeOf, z } from 'zod';

/**
 * count?type=ratingAvg&value=3
count?type=ratingMin&value=3
products/:someId?type=storeId

fastify-qs

 */

const getCountWithQuerystringCriteriaSchema = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          productsCount: { type: 'number' },
        },
      },
    },
  },
};

const baseUrl = 'products';

interface requestRangeQuerystring {
  price: number; // decimal
  availableQuantity: number;
  ratingAverage: number;
  createdAt: Date;
  updatedAt: Date | null;
}

interface requestQuerystring {
  //exact
  name?: string;
  productCode?: string;
  store?: string | ObjectId;
  offer?: string | null;
  isPromoted?: string | boolean;
  productCategories?: string[];
  productTypes?: string[];
  storeName?: string;
  createdBy?: string | ObjectId;
  updatedBy?: string | ObjectId;
  //ranges
  price: string | number; // decimal
  availableQuantity: string | number;
  ratingAverage: string | number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

const requestQuerystringTypeHandler = (request: {
  query: requestQuerystring;
}) => {
  if (request.query.isPromoted) {
    request.query.isPromoted = Boolean(Number(request.query.isPromoted));
  }
  if (
    request.query.offer &&
    !(<any>Object).values(OfferTypeEnum).includes(request.query.offer)
  ) {
    throw new Error('Offer is wrong type');
  }
  return request;
};

export const queryStringProductSchema = z.object({
  name: z.string().min(5).max(200).optional(),
  productCode: z.string().max(50).optional(),
  store: z.string().optional(),
  offer: z.string().nullable(), //z.nativeEnum(OfferTypeEnum).nullish().optional(),
  isPromoted: z.coerce.boolean().optional(),
  ratingAverage: z.coerce.number().nonnegative().optional(),
  productCategories: z.string().optional(),
  productTypes: z.string().optional(),
  storeName: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),

  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const getProductsCountRoute = (
  fastify: any,
  _opts: FastifyPluginOptions,
  done: () => void
) => {
  fastify.get(
    `/${baseUrl}/count`,
    getCountWithQuerystringCriteriaSchema,
    async (
      //request: { query: typeof queryStringProductSchema },
      request: { query: requestQuerystring },
      reply: FastifyReply
    ) => {
      const resultRequest = requestQuerystringTypeHandler(request);
      console.log(resultRequest.query);

      reply.send({
        productsCount: await mongoDB
          .collection(CollectionEnum.Products)
          .countDocuments(resultRequest.query),
      });
    }
  );
  done();
};

//${baseUrl}/range?ratingAverage=[4.5,5]&isPromoted=1
export const getProductsRangeRoute = (
  fastify: any, //  FastifyInstance does not accept the handler
  _opts: FastifyPluginOptions,
  done: () => void
) => {
  fastify.get(
    `/${baseUrl}/range`,
    getCountWithQuerystringCriteriaSchema,
    async (
      //request: { query: typeof queryStringProductSchema }, // 'queryStringProductSchema' refers to a value, but is being used as a type here. Did you mean 'typeof queryStringProductSchema'
      // request:  FastifyRequest
      request: { query: requestQuerystring },
      reply: FastifyReply
    ) => {
      try {
        const requestQueryTyped = requestQuerystringTypeHandler(request);
        console.log({ requestQueryTyped });

        const result = Object.entries(requestQueryTyped.query).reduce(
          (acc: any, [k, v]) => {
            if (v[0] === '[') {
              const val = v.substring(1, v.length - 1).split(',');

              console.log({ val });

              acc[k] = { $gt: Number(val[0]) || 0 };
              if (val[1]) {
                acc[k].$lt = Number(val[1]);
              }
            } else {
              acc[k] = v;
            }
            return acc;
          },
          {}
        );

        console.log(result);

        reply.send({
          productsCount: await mongoDB
            .collection(CollectionEnum.Products)
            .countDocuments(result),
        });
      } catch (error) {
        console.log(error);
        reply.code(400).send({ message: error });
      }
    }
  );
  done();
};
