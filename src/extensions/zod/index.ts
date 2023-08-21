import { z } from 'zod';
declare module 'zod' {
  interface ZodNumber {
    coerce(): ZodNumber;
  }
  interface ZodBoolean {
    coerce(): ZodBoolean;
  }
  interface ZodBoolean {
    coerce(): ZodBoolean;
  }
  interface ZodDate {
    coerce(): ZodDate;
  }
  interface ZodString {
    coerce(): ZodString;
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
  if (typeof z.ZodBoolean.prototype.coerce === 'undefined') {
    z.ZodBoolean.prototype.coerce = function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return new (this as any).constructor({
        ...this._def,
        coerce: true,
      });
    };
  }
  if (typeof z.ZodString.prototype.coerce === 'undefined') {
    z.ZodString.prototype.coerce = function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return new (this as any).constructor({
        ...this._def,
        coerce: true,
      });
    };
  }
  if (typeof z.ZodDate.prototype.coerce === 'undefined') {
    z.ZodDate.prototype.coerce = function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return new (this as any).constructor({
        ...this._def,
        coerce: true,
      });
    };
  }
};
