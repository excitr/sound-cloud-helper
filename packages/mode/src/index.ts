export enum Environment {
  Production = 'production',
  Development = 'development',
  Test = 'test',
}

export const isEnvironment = (val: string): val is Environment =>
  Object.values(Environment).includes(val as Environment);

export const NODE_ENV =
  !process.env.NODE_ENV || !isEnvironment(process.env.NODE_ENV) ? Environment.Development : process.env.NODE_ENV;
