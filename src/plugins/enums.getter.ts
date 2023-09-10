import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { CollectionEnum } from 'src/db/enum/collection.enum';

declare module 'fastify' {
  interface FastifyInstance {
    deliveryStatusEnum: any;
  }
}

const enumsPlugin: FastifyPluginCallback = async function enumsPlugin(
  fastify,
  opts,
  done
) {
  const deliveryStatusEnum = fastify
    .db(process.env.DB_NAME as string)
    ?.collection(CollectionEnum.EnumDeliveryStatus)
    .find();

  const deliveryTypeEnum = fastify
    .db(process.env.DB_NAME as string)
    ?.collection(CollectionEnum.EnumDeliveryType)
    .find();

  const offerTypeEnum = fastify
    .db(process.env.DB_NAME as string)
    ?.collection(CollectionEnum.EnumOfferType)
    .find();

  const paymentMethodEnum = fastify
    .db(process.env.DB_NAME as string)
    ?.collection(CollectionEnum.EnumPaymentMethod)
    .find();

  const productTypesEnum = fastify
    .db(process.env.DB_NAME as string)
    ?.collection(CollectionEnum.EnumProductTypes)
    .find();

  const userRolesEnum = fastify
    .db(process.env.DB_NAME as string)
    ?.collection(CollectionEnum.EnumUserRoles)
    .find();

  fastify.decorate('deliveryStatusEnum', await deliveryStatusEnum?.toArray());
  fastify.decorate('deliveryTypeEnum', await deliveryTypeEnum?.toArray());
  fastify.decorate('offerTypeEnum', await offerTypeEnum?.toArray());
  fastify.decorate('paymentMethodEnum', await paymentMethodEnum?.toArray());
  fastify.decorate('productTypesEnum', await productTypesEnum?.toArray());
  fastify.decorate('userRolesEnum', await userRolesEnum?.toArray());

  done();
};

export default fp(enumsPlugin);
