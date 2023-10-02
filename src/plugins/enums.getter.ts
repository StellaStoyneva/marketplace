import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { ObjectId } from 'mongodb';
import { DeliveryStatusEnum } from 'src/constants/enum';
import { CollectionEnum } from 'src/db/enum/collection.enum';

declare module 'fastify' {
  interface FastifyInstance {
    deliveryStatusEnum?: Record<string, ObjectId>;
    deliveryTypeEnum?: Record<string, ObjectId>;
    offerTypeEnum?: Record<string, ObjectId>;
    paymentMethodEnum?: Record<string, ObjectId>;
    productTypesEnum?: Record<string, ObjectId>;
    userRolesEnum?: Record<string, ObjectId>;
  }
}

const enumsPlugin: FastifyPluginCallback = async function enumsPlugin(
  fastify,
  opts,
  done
) {
  const getEnum = async (dbCollection: CollectionEnum) => {
    const errorMsg = `Enum does not exist for ${dbCollection}`;

    try {
      const foundEnum = fastify
        .db(process.env.DB_NAME as string)
        ?.collection(dbCollection)
        .find();

      if (!foundEnum) {
        throw new Error(errorMsg);
      }
      const enumArr = await foundEnum?.toArray();
      return enumArr.reduce(
        (
          acc: {
            [x: string]: ObjectId;
          },
          element
        ) => {
          acc[element.value] = element._id;
          return acc;
        },
        {}
      );
    } catch (e) {
      console.error(e);
      done(new Error(errorMsg));
    }
  };

  fastify.decorate(
    'deliveryStatusEnum',
    await getEnum(CollectionEnum.EnumDeliveryStatus)
  );
  fastify.decorate(
    'deliveryTypeEnum',
    await getEnum(CollectionEnum.EnumDeliveryType)
  );
  fastify.decorate(
    'offerTypeEnum',
    await getEnum(CollectionEnum.EnumOfferType)
  );
  fastify.decorate(
    'paymentMethodEnum',
    await getEnum(CollectionEnum.EnumPaymentMethod)
  );
  fastify.decorate(
    'productTypesEnum',
    await getEnum(CollectionEnum.EnumProductTypes)
  );
  fastify.decorate(
    'userRolesEnum',
    await getEnum(CollectionEnum.EnumUserRoles)
  );
  fastify.decorate(
    'productCategoriesEnum',
    await getEnum(CollectionEnum.ProductCategories)
  );
  fastify.decorate(
    'productTypeEnum',
    await getEnum(CollectionEnum.EnumProductTypes)
  );
  fastify.decorate(
    'orderItemLifeCycleEnum',
    await getEnum(CollectionEnum.EnumOrderItemLifeCycle)
  );

  done();
};

export default fp(enumsPlugin);
