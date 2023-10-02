import { z } from 'zod';
declare module 'zod' {
  interface ZodNumber {
    coerce(): ZodNumber;
  }
}

export const register = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (typeof z.ZodNumber.prototype.coerce === 'undefined') {
    z.ZodNumber.prototype.coerce = function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return new (this as any).constructor({
        ...this._def,
        coerce: true,
      });
    };
  }
};
