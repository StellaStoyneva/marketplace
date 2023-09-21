import { ObjectId } from 'mongodb';
import { IUser } from 'src/plugins/authentication';
import { IUpdateProduct } from '../entities';

export const processProductUpdateRequestBody = (
  user: IUser,
  data: IUpdateProduct
) => {
  let body = { ...data };
  if (typeof body.isPromoted === 'number') {
    body = { ...body, isPromoted: !!data.isPromoted };
  }
  if (data.returnPolicy) {
    body = {
      ...body,
      returnPolicy: {
        ...data.returnPolicy,
        isReturnable: !!data.returnPolicy.daysForReturn,
      },
    };
  }
  body = { ...body, updatedAt: new Date(), updatedBy: new ObjectId(user._id) };

  return body;
};
