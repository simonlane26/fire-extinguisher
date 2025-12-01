
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Tenant
 * 
 */
export type Tenant = $Result.DefaultSelection<Prisma.$TenantPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Extinguisher
 * 
 */
export type Extinguisher = $Result.DefaultSelection<Prisma.$ExtinguisherPayload>
/**
 * Model Inspection
 * 
 */
export type Inspection = $Result.DefaultSelection<Prisma.$InspectionPayload>
/**
 * Model Subscription
 * 
 */
export type Subscription = $Result.DefaultSelection<Prisma.$SubscriptionPayload>
/**
 * Model Invoice
 * 
 */
export type Invoice = $Result.DefaultSelection<Prisma.$InvoicePayload>
/**
 * Model ServiceJob
 * 
 */
export type ServiceJob = $Result.DefaultSelection<Prisma.$ServiceJobPayload>
/**
 * Model InspectionPhoto
 * 
 */
export type InspectionPhoto = $Result.DefaultSelection<Prisma.$InspectionPhotoPayload>
/**
 * Model ServiceReport
 * 
 */
export type ServiceReport = $Result.DefaultSelection<Prisma.$ServiceReportPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Tenants
 * const tenants = await prisma.tenant.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Tenants
   * const tenants = await prisma.tenant.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.tenant`: Exposes CRUD operations for the **Tenant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tenants
    * const tenants = await prisma.tenant.findMany()
    * ```
    */
  get tenant(): Prisma.TenantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.extinguisher`: Exposes CRUD operations for the **Extinguisher** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Extinguishers
    * const extinguishers = await prisma.extinguisher.findMany()
    * ```
    */
  get extinguisher(): Prisma.ExtinguisherDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.inspection`: Exposes CRUD operations for the **Inspection** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Inspections
    * const inspections = await prisma.inspection.findMany()
    * ```
    */
  get inspection(): Prisma.InspectionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subscription`: Exposes CRUD operations for the **Subscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subscriptions
    * const subscriptions = await prisma.subscription.findMany()
    * ```
    */
  get subscription(): Prisma.SubscriptionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.invoice`: Exposes CRUD operations for the **Invoice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Invoices
    * const invoices = await prisma.invoice.findMany()
    * ```
    */
  get invoice(): Prisma.InvoiceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.serviceJob`: Exposes CRUD operations for the **ServiceJob** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ServiceJobs
    * const serviceJobs = await prisma.serviceJob.findMany()
    * ```
    */
  get serviceJob(): Prisma.ServiceJobDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.inspectionPhoto`: Exposes CRUD operations for the **InspectionPhoto** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InspectionPhotos
    * const inspectionPhotos = await prisma.inspectionPhoto.findMany()
    * ```
    */
  get inspectionPhoto(): Prisma.InspectionPhotoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.serviceReport`: Exposes CRUD operations for the **ServiceReport** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ServiceReports
    * const serviceReports = await prisma.serviceReport.findMany()
    * ```
    */
  get serviceReport(): Prisma.ServiceReportDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.17.1
   * Query Engine version: 272a37d34178c2894197e17273bf937f25acdeac
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Tenant: 'Tenant',
    User: 'User',
    Extinguisher: 'Extinguisher',
    Inspection: 'Inspection',
    Subscription: 'Subscription',
    Invoice: 'Invoice',
    ServiceJob: 'ServiceJob',
    InspectionPhoto: 'InspectionPhoto',
    ServiceReport: 'ServiceReport'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "tenant" | "user" | "extinguisher" | "inspection" | "subscription" | "invoice" | "serviceJob" | "inspectionPhoto" | "serviceReport"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Tenant: {
        payload: Prisma.$TenantPayload<ExtArgs>
        fields: Prisma.TenantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findFirst: {
            args: Prisma.TenantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findMany: {
            args: Prisma.TenantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          create: {
            args: Prisma.TenantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          createMany: {
            args: Prisma.TenantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          delete: {
            args: Prisma.TenantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          update: {
            args: Prisma.TenantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          deleteMany: {
            args: Prisma.TenantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TenantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          upsert: {
            args: Prisma.TenantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          aggregate: {
            args: Prisma.TenantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenant>
          }
          groupBy: {
            args: Prisma.TenantGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantCountArgs<ExtArgs>
            result: $Utils.Optional<TenantCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Extinguisher: {
        payload: Prisma.$ExtinguisherPayload<ExtArgs>
        fields: Prisma.ExtinguisherFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExtinguisherFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtinguisherPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExtinguisherFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtinguisherPayload>
          }
          findFirst: {
            args: Prisma.ExtinguisherFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtinguisherPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExtinguisherFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtinguisherPayload>
          }
          findMany: {
            args: Prisma.ExtinguisherFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtinguisherPayload>[]
          }
          create: {
            args: Prisma.ExtinguisherCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtinguisherPayload>
          }
          createMany: {
            args: Prisma.ExtinguisherCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExtinguisherCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtinguisherPayload>[]
          }
          delete: {
            args: Prisma.ExtinguisherDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtinguisherPayload>
          }
          update: {
            args: Prisma.ExtinguisherUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtinguisherPayload>
          }
          deleteMany: {
            args: Prisma.ExtinguisherDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExtinguisherUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExtinguisherUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtinguisherPayload>[]
          }
          upsert: {
            args: Prisma.ExtinguisherUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtinguisherPayload>
          }
          aggregate: {
            args: Prisma.ExtinguisherAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExtinguisher>
          }
          groupBy: {
            args: Prisma.ExtinguisherGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExtinguisherGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExtinguisherCountArgs<ExtArgs>
            result: $Utils.Optional<ExtinguisherCountAggregateOutputType> | number
          }
        }
      }
      Inspection: {
        payload: Prisma.$InspectionPayload<ExtArgs>
        fields: Prisma.InspectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InspectionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InspectionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionPayload>
          }
          findFirst: {
            args: Prisma.InspectionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InspectionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionPayload>
          }
          findMany: {
            args: Prisma.InspectionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionPayload>[]
          }
          create: {
            args: Prisma.InspectionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionPayload>
          }
          createMany: {
            args: Prisma.InspectionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InspectionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionPayload>[]
          }
          delete: {
            args: Prisma.InspectionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionPayload>
          }
          update: {
            args: Prisma.InspectionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionPayload>
          }
          deleteMany: {
            args: Prisma.InspectionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InspectionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InspectionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionPayload>[]
          }
          upsert: {
            args: Prisma.InspectionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionPayload>
          }
          aggregate: {
            args: Prisma.InspectionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInspection>
          }
          groupBy: {
            args: Prisma.InspectionGroupByArgs<ExtArgs>
            result: $Utils.Optional<InspectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.InspectionCountArgs<ExtArgs>
            result: $Utils.Optional<InspectionCountAggregateOutputType> | number
          }
        }
      }
      Subscription: {
        payload: Prisma.$SubscriptionPayload<ExtArgs>
        fields: Prisma.SubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findMany: {
            args: Prisma.SubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          create: {
            args: Prisma.SubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          createMany: {
            args: Prisma.SubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubscriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          delete: {
            args: Prisma.SubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          update: {
            args: Prisma.SubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SubscriptionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          upsert: {
            args: Prisma.SubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscription>
          }
          groupBy: {
            args: Prisma.SubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionCountAggregateOutputType> | number
          }
        }
      }
      Invoice: {
        payload: Prisma.$InvoicePayload<ExtArgs>
        fields: Prisma.InvoiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvoiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvoiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          findFirst: {
            args: Prisma.InvoiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvoiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          findMany: {
            args: Prisma.InvoiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          create: {
            args: Prisma.InvoiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          createMany: {
            args: Prisma.InvoiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InvoiceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          delete: {
            args: Prisma.InvoiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          update: {
            args: Prisma.InvoiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          deleteMany: {
            args: Prisma.InvoiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvoiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InvoiceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          upsert: {
            args: Prisma.InvoiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          aggregate: {
            args: Prisma.InvoiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvoice>
          }
          groupBy: {
            args: Prisma.InvoiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvoiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvoiceCountArgs<ExtArgs>
            result: $Utils.Optional<InvoiceCountAggregateOutputType> | number
          }
        }
      }
      ServiceJob: {
        payload: Prisma.$ServiceJobPayload<ExtArgs>
        fields: Prisma.ServiceJobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ServiceJobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceJobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ServiceJobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceJobPayload>
          }
          findFirst: {
            args: Prisma.ServiceJobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceJobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ServiceJobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceJobPayload>
          }
          findMany: {
            args: Prisma.ServiceJobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceJobPayload>[]
          }
          create: {
            args: Prisma.ServiceJobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceJobPayload>
          }
          createMany: {
            args: Prisma.ServiceJobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ServiceJobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceJobPayload>[]
          }
          delete: {
            args: Prisma.ServiceJobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceJobPayload>
          }
          update: {
            args: Prisma.ServiceJobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceJobPayload>
          }
          deleteMany: {
            args: Prisma.ServiceJobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ServiceJobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ServiceJobUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceJobPayload>[]
          }
          upsert: {
            args: Prisma.ServiceJobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceJobPayload>
          }
          aggregate: {
            args: Prisma.ServiceJobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateServiceJob>
          }
          groupBy: {
            args: Prisma.ServiceJobGroupByArgs<ExtArgs>
            result: $Utils.Optional<ServiceJobGroupByOutputType>[]
          }
          count: {
            args: Prisma.ServiceJobCountArgs<ExtArgs>
            result: $Utils.Optional<ServiceJobCountAggregateOutputType> | number
          }
        }
      }
      InspectionPhoto: {
        payload: Prisma.$InspectionPhotoPayload<ExtArgs>
        fields: Prisma.InspectionPhotoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InspectionPhotoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionPhotoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InspectionPhotoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionPhotoPayload>
          }
          findFirst: {
            args: Prisma.InspectionPhotoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionPhotoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InspectionPhotoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionPhotoPayload>
          }
          findMany: {
            args: Prisma.InspectionPhotoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionPhotoPayload>[]
          }
          create: {
            args: Prisma.InspectionPhotoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionPhotoPayload>
          }
          createMany: {
            args: Prisma.InspectionPhotoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InspectionPhotoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionPhotoPayload>[]
          }
          delete: {
            args: Prisma.InspectionPhotoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionPhotoPayload>
          }
          update: {
            args: Prisma.InspectionPhotoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionPhotoPayload>
          }
          deleteMany: {
            args: Prisma.InspectionPhotoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InspectionPhotoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InspectionPhotoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionPhotoPayload>[]
          }
          upsert: {
            args: Prisma.InspectionPhotoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InspectionPhotoPayload>
          }
          aggregate: {
            args: Prisma.InspectionPhotoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInspectionPhoto>
          }
          groupBy: {
            args: Prisma.InspectionPhotoGroupByArgs<ExtArgs>
            result: $Utils.Optional<InspectionPhotoGroupByOutputType>[]
          }
          count: {
            args: Prisma.InspectionPhotoCountArgs<ExtArgs>
            result: $Utils.Optional<InspectionPhotoCountAggregateOutputType> | number
          }
        }
      }
      ServiceReport: {
        payload: Prisma.$ServiceReportPayload<ExtArgs>
        fields: Prisma.ServiceReportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ServiceReportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceReportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ServiceReportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceReportPayload>
          }
          findFirst: {
            args: Prisma.ServiceReportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceReportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ServiceReportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceReportPayload>
          }
          findMany: {
            args: Prisma.ServiceReportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceReportPayload>[]
          }
          create: {
            args: Prisma.ServiceReportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceReportPayload>
          }
          createMany: {
            args: Prisma.ServiceReportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ServiceReportCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceReportPayload>[]
          }
          delete: {
            args: Prisma.ServiceReportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceReportPayload>
          }
          update: {
            args: Prisma.ServiceReportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceReportPayload>
          }
          deleteMany: {
            args: Prisma.ServiceReportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ServiceReportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ServiceReportUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceReportPayload>[]
          }
          upsert: {
            args: Prisma.ServiceReportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceReportPayload>
          }
          aggregate: {
            args: Prisma.ServiceReportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateServiceReport>
          }
          groupBy: {
            args: Prisma.ServiceReportGroupByArgs<ExtArgs>
            result: $Utils.Optional<ServiceReportGroupByOutputType>[]
          }
          count: {
            args: Prisma.ServiceReportCountArgs<ExtArgs>
            result: $Utils.Optional<ServiceReportCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    tenant?: TenantOmit
    user?: UserOmit
    extinguisher?: ExtinguisherOmit
    inspection?: InspectionOmit
    subscription?: SubscriptionOmit
    invoice?: InvoiceOmit
    serviceJob?: ServiceJobOmit
    inspectionPhoto?: InspectionPhotoOmit
    serviceReport?: ServiceReportOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type TenantCountOutputType
   */

  export type TenantCountOutputType = {
    users: number
    extinguishers: number
    inspections: number
    subscriptions: number
    invoices: number
    serviceJobs: number
    inspectionPhotos: number
    serviceReports: number
  }

  export type TenantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | TenantCountOutputTypeCountUsersArgs
    extinguishers?: boolean | TenantCountOutputTypeCountExtinguishersArgs
    inspections?: boolean | TenantCountOutputTypeCountInspectionsArgs
    subscriptions?: boolean | TenantCountOutputTypeCountSubscriptionsArgs
    invoices?: boolean | TenantCountOutputTypeCountInvoicesArgs
    serviceJobs?: boolean | TenantCountOutputTypeCountServiceJobsArgs
    inspectionPhotos?: boolean | TenantCountOutputTypeCountInspectionPhotosArgs
    serviceReports?: boolean | TenantCountOutputTypeCountServiceReportsArgs
  }

  // Custom InputTypes
  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantCountOutputType
     */
    select?: TenantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountExtinguishersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExtinguisherWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountInspectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InspectionWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountSubscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountServiceJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ServiceJobWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountInspectionPhotosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InspectionPhotoWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountServiceReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ServiceReportWhereInput
  }


  /**
   * Count Type ExtinguisherCountOutputType
   */

  export type ExtinguisherCountOutputType = {
    inspections: number
  }

  export type ExtinguisherCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inspections?: boolean | ExtinguisherCountOutputTypeCountInspectionsArgs
  }

  // Custom InputTypes
  /**
   * ExtinguisherCountOutputType without action
   */
  export type ExtinguisherCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtinguisherCountOutputType
     */
    select?: ExtinguisherCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ExtinguisherCountOutputType without action
   */
  export type ExtinguisherCountOutputTypeCountInspectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InspectionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Tenant
   */

  export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  export type TenantMinAggregateOutputType = {
    id: string | null
    companyName: string | null
    subdomain: string | null
    logoUrl: string | null
    subscriptionPlan: string | null
    subscriptionStatus: string | null
    createdAt: Date | null
  }

  export type TenantMaxAggregateOutputType = {
    id: string | null
    companyName: string | null
    subdomain: string | null
    logoUrl: string | null
    subscriptionPlan: string | null
    subscriptionStatus: string | null
    createdAt: Date | null
  }

  export type TenantCountAggregateOutputType = {
    id: number
    companyName: number
    subdomain: number
    logoUrl: number
    subscriptionPlan: number
    subscriptionStatus: number
    createdAt: number
    _all: number
  }


  export type TenantMinAggregateInputType = {
    id?: true
    companyName?: true
    subdomain?: true
    logoUrl?: true
    subscriptionPlan?: true
    subscriptionStatus?: true
    createdAt?: true
  }

  export type TenantMaxAggregateInputType = {
    id?: true
    companyName?: true
    subdomain?: true
    logoUrl?: true
    subscriptionPlan?: true
    subscriptionStatus?: true
    createdAt?: true
  }

  export type TenantCountAggregateInputType = {
    id?: true
    companyName?: true
    subdomain?: true
    logoUrl?: true
    subscriptionPlan?: true
    subscriptionStatus?: true
    createdAt?: true
    _all?: true
  }

  export type TenantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenant to aggregate.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tenants
    **/
    _count?: true | TenantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantMaxAggregateInputType
  }

  export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
        [P in keyof T & keyof AggregateTenant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenant[P]>
      : GetScalarType<T[P], AggregateTenant[P]>
  }




  export type TenantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantWhereInput
    orderBy?: TenantOrderByWithAggregationInput | TenantOrderByWithAggregationInput[]
    by: TenantScalarFieldEnum[] | TenantScalarFieldEnum
    having?: TenantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantCountAggregateInputType | true
    _min?: TenantMinAggregateInputType
    _max?: TenantMaxAggregateInputType
  }

  export type TenantGroupByOutputType = {
    id: string
    companyName: string
    subdomain: string
    logoUrl: string | null
    subscriptionPlan: string
    subscriptionStatus: string
    createdAt: Date
    _count: TenantCountAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantGroupByOutputType[P]>
            : GetScalarType<T[P], TenantGroupByOutputType[P]>
        }
      >
    >


  export type TenantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyName?: boolean
    subdomain?: boolean
    logoUrl?: boolean
    subscriptionPlan?: boolean
    subscriptionStatus?: boolean
    createdAt?: boolean
    users?: boolean | Tenant$usersArgs<ExtArgs>
    extinguishers?: boolean | Tenant$extinguishersArgs<ExtArgs>
    inspections?: boolean | Tenant$inspectionsArgs<ExtArgs>
    subscriptions?: boolean | Tenant$subscriptionsArgs<ExtArgs>
    invoices?: boolean | Tenant$invoicesArgs<ExtArgs>
    serviceJobs?: boolean | Tenant$serviceJobsArgs<ExtArgs>
    inspectionPhotos?: boolean | Tenant$inspectionPhotosArgs<ExtArgs>
    serviceReports?: boolean | Tenant$serviceReportsArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyName?: boolean
    subdomain?: boolean
    logoUrl?: boolean
    subscriptionPlan?: boolean
    subscriptionStatus?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyName?: boolean
    subdomain?: boolean
    logoUrl?: boolean
    subscriptionPlan?: boolean
    subscriptionStatus?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectScalar = {
    id?: boolean
    companyName?: boolean
    subdomain?: boolean
    logoUrl?: boolean
    subscriptionPlan?: boolean
    subscriptionStatus?: boolean
    createdAt?: boolean
  }

  export type TenantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "companyName" | "subdomain" | "logoUrl" | "subscriptionPlan" | "subscriptionStatus" | "createdAt", ExtArgs["result"]["tenant"]>
  export type TenantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Tenant$usersArgs<ExtArgs>
    extinguishers?: boolean | Tenant$extinguishersArgs<ExtArgs>
    inspections?: boolean | Tenant$inspectionsArgs<ExtArgs>
    subscriptions?: boolean | Tenant$subscriptionsArgs<ExtArgs>
    invoices?: boolean | Tenant$invoicesArgs<ExtArgs>
    serviceJobs?: boolean | Tenant$serviceJobsArgs<ExtArgs>
    inspectionPhotos?: boolean | Tenant$inspectionPhotosArgs<ExtArgs>
    serviceReports?: boolean | Tenant$serviceReportsArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TenantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TenantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TenantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tenant"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
      extinguishers: Prisma.$ExtinguisherPayload<ExtArgs>[]
      inspections: Prisma.$InspectionPayload<ExtArgs>[]
      subscriptions: Prisma.$SubscriptionPayload<ExtArgs>[]
      invoices: Prisma.$InvoicePayload<ExtArgs>[]
      serviceJobs: Prisma.$ServiceJobPayload<ExtArgs>[]
      inspectionPhotos: Prisma.$InspectionPhotoPayload<ExtArgs>[]
      serviceReports: Prisma.$ServiceReportPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      companyName: string
      subdomain: string
      logoUrl: string | null
      subscriptionPlan: string
      subscriptionStatus: string
      createdAt: Date
    }, ExtArgs["result"]["tenant"]>
    composites: {}
  }

  type TenantGetPayload<S extends boolean | null | undefined | TenantDefaultArgs> = $Result.GetResult<Prisma.$TenantPayload, S>

  type TenantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TenantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TenantCountAggregateInputType | true
    }

  export interface TenantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tenant'], meta: { name: 'Tenant' } }
    /**
     * Find zero or one Tenant that matches the filter.
     * @param {TenantFindUniqueArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantFindUniqueArgs>(args: SelectSubset<T, TenantFindUniqueArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tenant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantFindUniqueOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantFindFirstArgs>(args?: SelectSubset<T, TenantFindFirstArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tenants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tenants
     * const tenants = await prisma.tenant.findMany()
     * 
     * // Get first 10 Tenants
     * const tenants = await prisma.tenant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantWithIdOnly = await prisma.tenant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TenantFindManyArgs>(args?: SelectSubset<T, TenantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tenant.
     * @param {TenantCreateArgs} args - Arguments to create a Tenant.
     * @example
     * // Create one Tenant
     * const Tenant = await prisma.tenant.create({
     *   data: {
     *     // ... data to create a Tenant
     *   }
     * })
     * 
     */
    create<T extends TenantCreateArgs>(args: SelectSubset<T, TenantCreateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tenants.
     * @param {TenantCreateManyArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantCreateManyArgs>(args?: SelectSubset<T, TenantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tenants and returns the data saved in the database.
     * @param {TenantCreateManyAndReturnArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TenantCreateManyAndReturnArgs>(args?: SelectSubset<T, TenantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Tenant.
     * @param {TenantDeleteArgs} args - Arguments to delete one Tenant.
     * @example
     * // Delete one Tenant
     * const Tenant = await prisma.tenant.delete({
     *   where: {
     *     // ... filter to delete one Tenant
     *   }
     * })
     * 
     */
    delete<T extends TenantDeleteArgs>(args: SelectSubset<T, TenantDeleteArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tenant.
     * @param {TenantUpdateArgs} args - Arguments to update one Tenant.
     * @example
     * // Update one Tenant
     * const tenant = await prisma.tenant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantUpdateArgs>(args: SelectSubset<T, TenantUpdateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tenants.
     * @param {TenantDeleteManyArgs} args - Arguments to filter Tenants to delete.
     * @example
     * // Delete a few Tenants
     * const { count } = await prisma.tenant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantDeleteManyArgs>(args?: SelectSubset<T, TenantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantUpdateManyArgs>(args: SelectSubset<T, TenantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants and returns the data updated in the database.
     * @param {TenantUpdateManyAndReturnArgs} args - Arguments to update many Tenants.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TenantUpdateManyAndReturnArgs>(args: SelectSubset<T, TenantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Tenant.
     * @param {TenantUpsertArgs} args - Arguments to update or create a Tenant.
     * @example
     * // Update or create a Tenant
     * const tenant = await prisma.tenant.upsert({
     *   create: {
     *     // ... data to create a Tenant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tenant we want to update
     *   }
     * })
     */
    upsert<T extends TenantUpsertArgs>(args: SelectSubset<T, TenantUpsertArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantCountArgs} args - Arguments to filter Tenants to count.
     * @example
     * // Count the number of Tenants
     * const count = await prisma.tenant.count({
     *   where: {
     *     // ... the filter for the Tenants we want to count
     *   }
     * })
    **/
    count<T extends TenantCountArgs>(
      args?: Subset<T, TenantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantAggregateArgs>(args: Subset<T, TenantAggregateArgs>): Prisma.PrismaPromise<GetTenantAggregateType<T>>

    /**
     * Group by Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantGroupByArgs['orderBy'] }
        : { orderBy?: TenantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tenant model
   */
  readonly fields: TenantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tenant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Tenant$usersArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    extinguishers<T extends Tenant$extinguishersArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$extinguishersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExtinguisherPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    inspections<T extends Tenant$inspectionsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$inspectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InspectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    subscriptions<T extends Tenant$subscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    invoices<T extends Tenant$invoicesArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$invoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    serviceJobs<T extends Tenant$serviceJobsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$serviceJobsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServiceJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    inspectionPhotos<T extends Tenant$inspectionPhotosArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$inspectionPhotosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InspectionPhotoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    serviceReports<T extends Tenant$serviceReportsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$serviceReportsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServiceReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tenant model
   */
  interface TenantFieldRefs {
    readonly id: FieldRef<"Tenant", 'String'>
    readonly companyName: FieldRef<"Tenant", 'String'>
    readonly subdomain: FieldRef<"Tenant", 'String'>
    readonly logoUrl: FieldRef<"Tenant", 'String'>
    readonly subscriptionPlan: FieldRef<"Tenant", 'String'>
    readonly subscriptionStatus: FieldRef<"Tenant", 'String'>
    readonly createdAt: FieldRef<"Tenant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Tenant findUnique
   */
  export type TenantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findUniqueOrThrow
   */
  export type TenantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findFirst
   */
  export type TenantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findFirstOrThrow
   */
  export type TenantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findMany
   */
  export type TenantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenants to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant create
   */
  export type TenantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to create a Tenant.
     */
    data: XOR<TenantCreateInput, TenantUncheckedCreateInput>
  }

  /**
   * Tenant createMany
   */
  export type TenantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant createManyAndReturn
   */
  export type TenantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant update
   */
  export type TenantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to update a Tenant.
     */
    data: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
    /**
     * Choose, which Tenant to update.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant updateMany
   */
  export type TenantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to update.
     */
    limit?: number
  }

  /**
   * Tenant updateManyAndReturn
   */
  export type TenantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to update.
     */
    limit?: number
  }

  /**
   * Tenant upsert
   */
  export type TenantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The filter to search for the Tenant to update in case it exists.
     */
    where: TenantWhereUniqueInput
    /**
     * In case the Tenant found by the `where` argument doesn't exist, create a new Tenant with this data.
     */
    create: XOR<TenantCreateInput, TenantUncheckedCreateInput>
    /**
     * In case the Tenant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
  }

  /**
   * Tenant delete
   */
  export type TenantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter which Tenant to delete.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant deleteMany
   */
  export type TenantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenants to delete
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to delete.
     */
    limit?: number
  }

  /**
   * Tenant.users
   */
  export type Tenant$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Tenant.extinguishers
   */
  export type Tenant$extinguishersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extinguisher
     */
    select?: ExtinguisherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Extinguisher
     */
    omit?: ExtinguisherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtinguisherInclude<ExtArgs> | null
    where?: ExtinguisherWhereInput
    orderBy?: ExtinguisherOrderByWithRelationInput | ExtinguisherOrderByWithRelationInput[]
    cursor?: ExtinguisherWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExtinguisherScalarFieldEnum | ExtinguisherScalarFieldEnum[]
  }

  /**
   * Tenant.inspections
   */
  export type Tenant$inspectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inspection
     */
    select?: InspectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inspection
     */
    omit?: InspectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionInclude<ExtArgs> | null
    where?: InspectionWhereInput
    orderBy?: InspectionOrderByWithRelationInput | InspectionOrderByWithRelationInput[]
    cursor?: InspectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InspectionScalarFieldEnum | InspectionScalarFieldEnum[]
  }

  /**
   * Tenant.subscriptions
   */
  export type Tenant$subscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    cursor?: SubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Tenant.invoices
   */
  export type Tenant$invoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    where?: InvoiceWhereInput
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    cursor?: InvoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Tenant.serviceJobs
   */
  export type Tenant$serviceJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceJob
     */
    select?: ServiceJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceJob
     */
    omit?: ServiceJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceJobInclude<ExtArgs> | null
    where?: ServiceJobWhereInput
    orderBy?: ServiceJobOrderByWithRelationInput | ServiceJobOrderByWithRelationInput[]
    cursor?: ServiceJobWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ServiceJobScalarFieldEnum | ServiceJobScalarFieldEnum[]
  }

  /**
   * Tenant.inspectionPhotos
   */
  export type Tenant$inspectionPhotosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionPhoto
     */
    select?: InspectionPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InspectionPhoto
     */
    omit?: InspectionPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionPhotoInclude<ExtArgs> | null
    where?: InspectionPhotoWhereInput
    orderBy?: InspectionPhotoOrderByWithRelationInput | InspectionPhotoOrderByWithRelationInput[]
    cursor?: InspectionPhotoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InspectionPhotoScalarFieldEnum | InspectionPhotoScalarFieldEnum[]
  }

  /**
   * Tenant.serviceReports
   */
  export type Tenant$serviceReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceReport
     */
    select?: ServiceReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceReport
     */
    omit?: ServiceReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceReportInclude<ExtArgs> | null
    where?: ServiceReportWhereInput
    orderBy?: ServiceReportOrderByWithRelationInput | ServiceReportOrderByWithRelationInput[]
    cursor?: ServiceReportWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ServiceReportScalarFieldEnum | ServiceReportScalarFieldEnum[]
  }

  /**
   * Tenant without action
   */
  export type TenantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    name: string | null
    email: string | null
    passwordHash: string | null
    role: string | null
    status: string | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    name: string | null
    email: string | null
    passwordHash: string | null
    role: string | null
    status: string | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    tenantId: number
    name: number
    email: number
    passwordHash: number
    role: number
    status: number
    createdAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    email?: true
    passwordHash?: true
    role?: true
    status?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    email?: true
    passwordHash?: true
    role?: true
    status?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    email?: true
    passwordHash?: true
    role?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    tenantId: string
    name: string
    email: string
    passwordHash: string
    role: string
    status: string
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    tenantId?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "name" | "email" | "passwordHash" | "role" | "status" | "createdAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      name: string
      email: string
      passwordHash: string
      role: string
      status: string
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly tenantId: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly status: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Extinguisher
   */

  export type AggregateExtinguisher = {
    _count: ExtinguisherCountAggregateOutputType | null
    _min: ExtinguisherMinAggregateOutputType | null
    _max: ExtinguisherMaxAggregateOutputType | null
  }

  export type ExtinguisherMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    externalId: string | null
    location: string | null
    building: string | null
    floor: string | null
    type: string | null
    capacity: string | null
    manufacturer: string | null
    model: string | null
    serialNumber: string | null
    installDate: Date | null
    expiryDate: Date | null
    lastInspection: Date | null
    nextInspection: Date | null
    lastMaintenance: Date | null
    nextMaintenance: Date | null
    status: string | null
    condition: string | null
    serviceType: string | null
    inspector: string | null
    notes: string | null
    createdAt: Date | null
  }

  export type ExtinguisherMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    externalId: string | null
    location: string | null
    building: string | null
    floor: string | null
    type: string | null
    capacity: string | null
    manufacturer: string | null
    model: string | null
    serialNumber: string | null
    installDate: Date | null
    expiryDate: Date | null
    lastInspection: Date | null
    nextInspection: Date | null
    lastMaintenance: Date | null
    nextMaintenance: Date | null
    status: string | null
    condition: string | null
    serviceType: string | null
    inspector: string | null
    notes: string | null
    createdAt: Date | null
  }

  export type ExtinguisherCountAggregateOutputType = {
    id: number
    tenantId: number
    externalId: number
    location: number
    building: number
    floor: number
    type: number
    capacity: number
    manufacturer: number
    model: number
    serialNumber: number
    installDate: number
    expiryDate: number
    lastInspection: number
    nextInspection: number
    lastMaintenance: number
    nextMaintenance: number
    status: number
    condition: number
    serviceType: number
    inspector: number
    notes: number
    createdAt: number
    _all: number
  }


  export type ExtinguisherMinAggregateInputType = {
    id?: true
    tenantId?: true
    externalId?: true
    location?: true
    building?: true
    floor?: true
    type?: true
    capacity?: true
    manufacturer?: true
    model?: true
    serialNumber?: true
    installDate?: true
    expiryDate?: true
    lastInspection?: true
    nextInspection?: true
    lastMaintenance?: true
    nextMaintenance?: true
    status?: true
    condition?: true
    serviceType?: true
    inspector?: true
    notes?: true
    createdAt?: true
  }

  export type ExtinguisherMaxAggregateInputType = {
    id?: true
    tenantId?: true
    externalId?: true
    location?: true
    building?: true
    floor?: true
    type?: true
    capacity?: true
    manufacturer?: true
    model?: true
    serialNumber?: true
    installDate?: true
    expiryDate?: true
    lastInspection?: true
    nextInspection?: true
    lastMaintenance?: true
    nextMaintenance?: true
    status?: true
    condition?: true
    serviceType?: true
    inspector?: true
    notes?: true
    createdAt?: true
  }

  export type ExtinguisherCountAggregateInputType = {
    id?: true
    tenantId?: true
    externalId?: true
    location?: true
    building?: true
    floor?: true
    type?: true
    capacity?: true
    manufacturer?: true
    model?: true
    serialNumber?: true
    installDate?: true
    expiryDate?: true
    lastInspection?: true
    nextInspection?: true
    lastMaintenance?: true
    nextMaintenance?: true
    status?: true
    condition?: true
    serviceType?: true
    inspector?: true
    notes?: true
    createdAt?: true
    _all?: true
  }

  export type ExtinguisherAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Extinguisher to aggregate.
     */
    where?: ExtinguisherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Extinguishers to fetch.
     */
    orderBy?: ExtinguisherOrderByWithRelationInput | ExtinguisherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExtinguisherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Extinguishers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Extinguishers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Extinguishers
    **/
    _count?: true | ExtinguisherCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExtinguisherMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExtinguisherMaxAggregateInputType
  }

  export type GetExtinguisherAggregateType<T extends ExtinguisherAggregateArgs> = {
        [P in keyof T & keyof AggregateExtinguisher]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExtinguisher[P]>
      : GetScalarType<T[P], AggregateExtinguisher[P]>
  }




  export type ExtinguisherGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExtinguisherWhereInput
    orderBy?: ExtinguisherOrderByWithAggregationInput | ExtinguisherOrderByWithAggregationInput[]
    by: ExtinguisherScalarFieldEnum[] | ExtinguisherScalarFieldEnum
    having?: ExtinguisherScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExtinguisherCountAggregateInputType | true
    _min?: ExtinguisherMinAggregateInputType
    _max?: ExtinguisherMaxAggregateInputType
  }

  export type ExtinguisherGroupByOutputType = {
    id: string
    tenantId: string
    externalId: string | null
    location: string
    building: string
    floor: string | null
    type: string
    capacity: string | null
    manufacturer: string | null
    model: string | null
    serialNumber: string | null
    installDate: Date | null
    expiryDate: Date | null
    lastInspection: Date | null
    nextInspection: Date | null
    lastMaintenance: Date | null
    nextMaintenance: Date | null
    status: string
    condition: string
    serviceType: string | null
    inspector: string | null
    notes: string | null
    createdAt: Date
    _count: ExtinguisherCountAggregateOutputType | null
    _min: ExtinguisherMinAggregateOutputType | null
    _max: ExtinguisherMaxAggregateOutputType | null
  }

  type GetExtinguisherGroupByPayload<T extends ExtinguisherGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExtinguisherGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExtinguisherGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExtinguisherGroupByOutputType[P]>
            : GetScalarType<T[P], ExtinguisherGroupByOutputType[P]>
        }
      >
    >


  export type ExtinguisherSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    externalId?: boolean
    location?: boolean
    building?: boolean
    floor?: boolean
    type?: boolean
    capacity?: boolean
    manufacturer?: boolean
    model?: boolean
    serialNumber?: boolean
    installDate?: boolean
    expiryDate?: boolean
    lastInspection?: boolean
    nextInspection?: boolean
    lastMaintenance?: boolean
    nextMaintenance?: boolean
    status?: boolean
    condition?: boolean
    serviceType?: boolean
    inspector?: boolean
    notes?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    inspections?: boolean | Extinguisher$inspectionsArgs<ExtArgs>
    _count?: boolean | ExtinguisherCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["extinguisher"]>

  export type ExtinguisherSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    externalId?: boolean
    location?: boolean
    building?: boolean
    floor?: boolean
    type?: boolean
    capacity?: boolean
    manufacturer?: boolean
    model?: boolean
    serialNumber?: boolean
    installDate?: boolean
    expiryDate?: boolean
    lastInspection?: boolean
    nextInspection?: boolean
    lastMaintenance?: boolean
    nextMaintenance?: boolean
    status?: boolean
    condition?: boolean
    serviceType?: boolean
    inspector?: boolean
    notes?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["extinguisher"]>

  export type ExtinguisherSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    externalId?: boolean
    location?: boolean
    building?: boolean
    floor?: boolean
    type?: boolean
    capacity?: boolean
    manufacturer?: boolean
    model?: boolean
    serialNumber?: boolean
    installDate?: boolean
    expiryDate?: boolean
    lastInspection?: boolean
    nextInspection?: boolean
    lastMaintenance?: boolean
    nextMaintenance?: boolean
    status?: boolean
    condition?: boolean
    serviceType?: boolean
    inspector?: boolean
    notes?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["extinguisher"]>

  export type ExtinguisherSelectScalar = {
    id?: boolean
    tenantId?: boolean
    externalId?: boolean
    location?: boolean
    building?: boolean
    floor?: boolean
    type?: boolean
    capacity?: boolean
    manufacturer?: boolean
    model?: boolean
    serialNumber?: boolean
    installDate?: boolean
    expiryDate?: boolean
    lastInspection?: boolean
    nextInspection?: boolean
    lastMaintenance?: boolean
    nextMaintenance?: boolean
    status?: boolean
    condition?: boolean
    serviceType?: boolean
    inspector?: boolean
    notes?: boolean
    createdAt?: boolean
  }

  export type ExtinguisherOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "externalId" | "location" | "building" | "floor" | "type" | "capacity" | "manufacturer" | "model" | "serialNumber" | "installDate" | "expiryDate" | "lastInspection" | "nextInspection" | "lastMaintenance" | "nextMaintenance" | "status" | "condition" | "serviceType" | "inspector" | "notes" | "createdAt", ExtArgs["result"]["extinguisher"]>
  export type ExtinguisherInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    inspections?: boolean | Extinguisher$inspectionsArgs<ExtArgs>
    _count?: boolean | ExtinguisherCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ExtinguisherIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type ExtinguisherIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $ExtinguisherPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Extinguisher"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      inspections: Prisma.$InspectionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      externalId: string | null
      location: string
      building: string
      floor: string | null
      type: string
      capacity: string | null
      manufacturer: string | null
      model: string | null
      serialNumber: string | null
      installDate: Date | null
      expiryDate: Date | null
      lastInspection: Date | null
      nextInspection: Date | null
      lastMaintenance: Date | null
      nextMaintenance: Date | null
      status: string
      condition: string
      serviceType: string | null
      inspector: string | null
      notes: string | null
      createdAt: Date
    }, ExtArgs["result"]["extinguisher"]>
    composites: {}
  }

  type ExtinguisherGetPayload<S extends boolean | null | undefined | ExtinguisherDefaultArgs> = $Result.GetResult<Prisma.$ExtinguisherPayload, S>

  type ExtinguisherCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExtinguisherFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExtinguisherCountAggregateInputType | true
    }

  export interface ExtinguisherDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Extinguisher'], meta: { name: 'Extinguisher' } }
    /**
     * Find zero or one Extinguisher that matches the filter.
     * @param {ExtinguisherFindUniqueArgs} args - Arguments to find a Extinguisher
     * @example
     * // Get one Extinguisher
     * const extinguisher = await prisma.extinguisher.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExtinguisherFindUniqueArgs>(args: SelectSubset<T, ExtinguisherFindUniqueArgs<ExtArgs>>): Prisma__ExtinguisherClient<$Result.GetResult<Prisma.$ExtinguisherPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Extinguisher that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExtinguisherFindUniqueOrThrowArgs} args - Arguments to find a Extinguisher
     * @example
     * // Get one Extinguisher
     * const extinguisher = await prisma.extinguisher.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExtinguisherFindUniqueOrThrowArgs>(args: SelectSubset<T, ExtinguisherFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExtinguisherClient<$Result.GetResult<Prisma.$ExtinguisherPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Extinguisher that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtinguisherFindFirstArgs} args - Arguments to find a Extinguisher
     * @example
     * // Get one Extinguisher
     * const extinguisher = await prisma.extinguisher.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExtinguisherFindFirstArgs>(args?: SelectSubset<T, ExtinguisherFindFirstArgs<ExtArgs>>): Prisma__ExtinguisherClient<$Result.GetResult<Prisma.$ExtinguisherPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Extinguisher that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtinguisherFindFirstOrThrowArgs} args - Arguments to find a Extinguisher
     * @example
     * // Get one Extinguisher
     * const extinguisher = await prisma.extinguisher.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExtinguisherFindFirstOrThrowArgs>(args?: SelectSubset<T, ExtinguisherFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExtinguisherClient<$Result.GetResult<Prisma.$ExtinguisherPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Extinguishers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtinguisherFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Extinguishers
     * const extinguishers = await prisma.extinguisher.findMany()
     * 
     * // Get first 10 Extinguishers
     * const extinguishers = await prisma.extinguisher.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const extinguisherWithIdOnly = await prisma.extinguisher.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExtinguisherFindManyArgs>(args?: SelectSubset<T, ExtinguisherFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExtinguisherPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Extinguisher.
     * @param {ExtinguisherCreateArgs} args - Arguments to create a Extinguisher.
     * @example
     * // Create one Extinguisher
     * const Extinguisher = await prisma.extinguisher.create({
     *   data: {
     *     // ... data to create a Extinguisher
     *   }
     * })
     * 
     */
    create<T extends ExtinguisherCreateArgs>(args: SelectSubset<T, ExtinguisherCreateArgs<ExtArgs>>): Prisma__ExtinguisherClient<$Result.GetResult<Prisma.$ExtinguisherPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Extinguishers.
     * @param {ExtinguisherCreateManyArgs} args - Arguments to create many Extinguishers.
     * @example
     * // Create many Extinguishers
     * const extinguisher = await prisma.extinguisher.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExtinguisherCreateManyArgs>(args?: SelectSubset<T, ExtinguisherCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Extinguishers and returns the data saved in the database.
     * @param {ExtinguisherCreateManyAndReturnArgs} args - Arguments to create many Extinguishers.
     * @example
     * // Create many Extinguishers
     * const extinguisher = await prisma.extinguisher.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Extinguishers and only return the `id`
     * const extinguisherWithIdOnly = await prisma.extinguisher.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExtinguisherCreateManyAndReturnArgs>(args?: SelectSubset<T, ExtinguisherCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExtinguisherPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Extinguisher.
     * @param {ExtinguisherDeleteArgs} args - Arguments to delete one Extinguisher.
     * @example
     * // Delete one Extinguisher
     * const Extinguisher = await prisma.extinguisher.delete({
     *   where: {
     *     // ... filter to delete one Extinguisher
     *   }
     * })
     * 
     */
    delete<T extends ExtinguisherDeleteArgs>(args: SelectSubset<T, ExtinguisherDeleteArgs<ExtArgs>>): Prisma__ExtinguisherClient<$Result.GetResult<Prisma.$ExtinguisherPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Extinguisher.
     * @param {ExtinguisherUpdateArgs} args - Arguments to update one Extinguisher.
     * @example
     * // Update one Extinguisher
     * const extinguisher = await prisma.extinguisher.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExtinguisherUpdateArgs>(args: SelectSubset<T, ExtinguisherUpdateArgs<ExtArgs>>): Prisma__ExtinguisherClient<$Result.GetResult<Prisma.$ExtinguisherPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Extinguishers.
     * @param {ExtinguisherDeleteManyArgs} args - Arguments to filter Extinguishers to delete.
     * @example
     * // Delete a few Extinguishers
     * const { count } = await prisma.extinguisher.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExtinguisherDeleteManyArgs>(args?: SelectSubset<T, ExtinguisherDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Extinguishers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtinguisherUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Extinguishers
     * const extinguisher = await prisma.extinguisher.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExtinguisherUpdateManyArgs>(args: SelectSubset<T, ExtinguisherUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Extinguishers and returns the data updated in the database.
     * @param {ExtinguisherUpdateManyAndReturnArgs} args - Arguments to update many Extinguishers.
     * @example
     * // Update many Extinguishers
     * const extinguisher = await prisma.extinguisher.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Extinguishers and only return the `id`
     * const extinguisherWithIdOnly = await prisma.extinguisher.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExtinguisherUpdateManyAndReturnArgs>(args: SelectSubset<T, ExtinguisherUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExtinguisherPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Extinguisher.
     * @param {ExtinguisherUpsertArgs} args - Arguments to update or create a Extinguisher.
     * @example
     * // Update or create a Extinguisher
     * const extinguisher = await prisma.extinguisher.upsert({
     *   create: {
     *     // ... data to create a Extinguisher
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Extinguisher we want to update
     *   }
     * })
     */
    upsert<T extends ExtinguisherUpsertArgs>(args: SelectSubset<T, ExtinguisherUpsertArgs<ExtArgs>>): Prisma__ExtinguisherClient<$Result.GetResult<Prisma.$ExtinguisherPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Extinguishers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtinguisherCountArgs} args - Arguments to filter Extinguishers to count.
     * @example
     * // Count the number of Extinguishers
     * const count = await prisma.extinguisher.count({
     *   where: {
     *     // ... the filter for the Extinguishers we want to count
     *   }
     * })
    **/
    count<T extends ExtinguisherCountArgs>(
      args?: Subset<T, ExtinguisherCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExtinguisherCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Extinguisher.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtinguisherAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExtinguisherAggregateArgs>(args: Subset<T, ExtinguisherAggregateArgs>): Prisma.PrismaPromise<GetExtinguisherAggregateType<T>>

    /**
     * Group by Extinguisher.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtinguisherGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExtinguisherGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExtinguisherGroupByArgs['orderBy'] }
        : { orderBy?: ExtinguisherGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExtinguisherGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExtinguisherGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Extinguisher model
   */
  readonly fields: ExtinguisherFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Extinguisher.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExtinguisherClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    inspections<T extends Extinguisher$inspectionsArgs<ExtArgs> = {}>(args?: Subset<T, Extinguisher$inspectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InspectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Extinguisher model
   */
  interface ExtinguisherFieldRefs {
    readonly id: FieldRef<"Extinguisher", 'String'>
    readonly tenantId: FieldRef<"Extinguisher", 'String'>
    readonly externalId: FieldRef<"Extinguisher", 'String'>
    readonly location: FieldRef<"Extinguisher", 'String'>
    readonly building: FieldRef<"Extinguisher", 'String'>
    readonly floor: FieldRef<"Extinguisher", 'String'>
    readonly type: FieldRef<"Extinguisher", 'String'>
    readonly capacity: FieldRef<"Extinguisher", 'String'>
    readonly manufacturer: FieldRef<"Extinguisher", 'String'>
    readonly model: FieldRef<"Extinguisher", 'String'>
    readonly serialNumber: FieldRef<"Extinguisher", 'String'>
    readonly installDate: FieldRef<"Extinguisher", 'DateTime'>
    readonly expiryDate: FieldRef<"Extinguisher", 'DateTime'>
    readonly lastInspection: FieldRef<"Extinguisher", 'DateTime'>
    readonly nextInspection: FieldRef<"Extinguisher", 'DateTime'>
    readonly lastMaintenance: FieldRef<"Extinguisher", 'DateTime'>
    readonly nextMaintenance: FieldRef<"Extinguisher", 'DateTime'>
    readonly status: FieldRef<"Extinguisher", 'String'>
    readonly condition: FieldRef<"Extinguisher", 'String'>
    readonly serviceType: FieldRef<"Extinguisher", 'String'>
    readonly inspector: FieldRef<"Extinguisher", 'String'>
    readonly notes: FieldRef<"Extinguisher", 'String'>
    readonly createdAt: FieldRef<"Extinguisher", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Extinguisher findUnique
   */
  export type ExtinguisherFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extinguisher
     */
    select?: ExtinguisherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Extinguisher
     */
    omit?: ExtinguisherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtinguisherInclude<ExtArgs> | null
    /**
     * Filter, which Extinguisher to fetch.
     */
    where: ExtinguisherWhereUniqueInput
  }

  /**
   * Extinguisher findUniqueOrThrow
   */
  export type ExtinguisherFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extinguisher
     */
    select?: ExtinguisherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Extinguisher
     */
    omit?: ExtinguisherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtinguisherInclude<ExtArgs> | null
    /**
     * Filter, which Extinguisher to fetch.
     */
    where: ExtinguisherWhereUniqueInput
  }

  /**
   * Extinguisher findFirst
   */
  export type ExtinguisherFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extinguisher
     */
    select?: ExtinguisherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Extinguisher
     */
    omit?: ExtinguisherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtinguisherInclude<ExtArgs> | null
    /**
     * Filter, which Extinguisher to fetch.
     */
    where?: ExtinguisherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Extinguishers to fetch.
     */
    orderBy?: ExtinguisherOrderByWithRelationInput | ExtinguisherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Extinguishers.
     */
    cursor?: ExtinguisherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Extinguishers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Extinguishers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Extinguishers.
     */
    distinct?: ExtinguisherScalarFieldEnum | ExtinguisherScalarFieldEnum[]
  }

  /**
   * Extinguisher findFirstOrThrow
   */
  export type ExtinguisherFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extinguisher
     */
    select?: ExtinguisherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Extinguisher
     */
    omit?: ExtinguisherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtinguisherInclude<ExtArgs> | null
    /**
     * Filter, which Extinguisher to fetch.
     */
    where?: ExtinguisherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Extinguishers to fetch.
     */
    orderBy?: ExtinguisherOrderByWithRelationInput | ExtinguisherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Extinguishers.
     */
    cursor?: ExtinguisherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Extinguishers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Extinguishers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Extinguishers.
     */
    distinct?: ExtinguisherScalarFieldEnum | ExtinguisherScalarFieldEnum[]
  }

  /**
   * Extinguisher findMany
   */
  export type ExtinguisherFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extinguisher
     */
    select?: ExtinguisherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Extinguisher
     */
    omit?: ExtinguisherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtinguisherInclude<ExtArgs> | null
    /**
     * Filter, which Extinguishers to fetch.
     */
    where?: ExtinguisherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Extinguishers to fetch.
     */
    orderBy?: ExtinguisherOrderByWithRelationInput | ExtinguisherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Extinguishers.
     */
    cursor?: ExtinguisherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Extinguishers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Extinguishers.
     */
    skip?: number
    distinct?: ExtinguisherScalarFieldEnum | ExtinguisherScalarFieldEnum[]
  }

  /**
   * Extinguisher create
   */
  export type ExtinguisherCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extinguisher
     */
    select?: ExtinguisherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Extinguisher
     */
    omit?: ExtinguisherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtinguisherInclude<ExtArgs> | null
    /**
     * The data needed to create a Extinguisher.
     */
    data: XOR<ExtinguisherCreateInput, ExtinguisherUncheckedCreateInput>
  }

  /**
   * Extinguisher createMany
   */
  export type ExtinguisherCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Extinguishers.
     */
    data: ExtinguisherCreateManyInput | ExtinguisherCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Extinguisher createManyAndReturn
   */
  export type ExtinguisherCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extinguisher
     */
    select?: ExtinguisherSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Extinguisher
     */
    omit?: ExtinguisherOmit<ExtArgs> | null
    /**
     * The data used to create many Extinguishers.
     */
    data: ExtinguisherCreateManyInput | ExtinguisherCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtinguisherIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Extinguisher update
   */
  export type ExtinguisherUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extinguisher
     */
    select?: ExtinguisherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Extinguisher
     */
    omit?: ExtinguisherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtinguisherInclude<ExtArgs> | null
    /**
     * The data needed to update a Extinguisher.
     */
    data: XOR<ExtinguisherUpdateInput, ExtinguisherUncheckedUpdateInput>
    /**
     * Choose, which Extinguisher to update.
     */
    where: ExtinguisherWhereUniqueInput
  }

  /**
   * Extinguisher updateMany
   */
  export type ExtinguisherUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Extinguishers.
     */
    data: XOR<ExtinguisherUpdateManyMutationInput, ExtinguisherUncheckedUpdateManyInput>
    /**
     * Filter which Extinguishers to update
     */
    where?: ExtinguisherWhereInput
    /**
     * Limit how many Extinguishers to update.
     */
    limit?: number
  }

  /**
   * Extinguisher updateManyAndReturn
   */
  export type ExtinguisherUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extinguisher
     */
    select?: ExtinguisherSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Extinguisher
     */
    omit?: ExtinguisherOmit<ExtArgs> | null
    /**
     * The data used to update Extinguishers.
     */
    data: XOR<ExtinguisherUpdateManyMutationInput, ExtinguisherUncheckedUpdateManyInput>
    /**
     * Filter which Extinguishers to update
     */
    where?: ExtinguisherWhereInput
    /**
     * Limit how many Extinguishers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtinguisherIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Extinguisher upsert
   */
  export type ExtinguisherUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extinguisher
     */
    select?: ExtinguisherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Extinguisher
     */
    omit?: ExtinguisherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtinguisherInclude<ExtArgs> | null
    /**
     * The filter to search for the Extinguisher to update in case it exists.
     */
    where: ExtinguisherWhereUniqueInput
    /**
     * In case the Extinguisher found by the `where` argument doesn't exist, create a new Extinguisher with this data.
     */
    create: XOR<ExtinguisherCreateInput, ExtinguisherUncheckedCreateInput>
    /**
     * In case the Extinguisher was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExtinguisherUpdateInput, ExtinguisherUncheckedUpdateInput>
  }

  /**
   * Extinguisher delete
   */
  export type ExtinguisherDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extinguisher
     */
    select?: ExtinguisherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Extinguisher
     */
    omit?: ExtinguisherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtinguisherInclude<ExtArgs> | null
    /**
     * Filter which Extinguisher to delete.
     */
    where: ExtinguisherWhereUniqueInput
  }

  /**
   * Extinguisher deleteMany
   */
  export type ExtinguisherDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Extinguishers to delete
     */
    where?: ExtinguisherWhereInput
    /**
     * Limit how many Extinguishers to delete.
     */
    limit?: number
  }

  /**
   * Extinguisher.inspections
   */
  export type Extinguisher$inspectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inspection
     */
    select?: InspectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inspection
     */
    omit?: InspectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionInclude<ExtArgs> | null
    where?: InspectionWhereInput
    orderBy?: InspectionOrderByWithRelationInput | InspectionOrderByWithRelationInput[]
    cursor?: InspectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InspectionScalarFieldEnum | InspectionScalarFieldEnum[]
  }

  /**
   * Extinguisher without action
   */
  export type ExtinguisherDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extinguisher
     */
    select?: ExtinguisherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Extinguisher
     */
    omit?: ExtinguisherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtinguisherInclude<ExtArgs> | null
  }


  /**
   * Model Inspection
   */

  export type AggregateInspection = {
    _count: InspectionCountAggregateOutputType | null
    _min: InspectionMinAggregateOutputType | null
    _max: InspectionMaxAggregateOutputType | null
  }

  export type InspectionMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    extinguisherId: string | null
    serviceDate: Date | null
    serviceType: string | null
    technician: string | null
    condition: string | null
    notes: string | null
    partsReplaced: string | null
    nextServiceDate: Date | null
    createdAt: Date | null
  }

  export type InspectionMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    extinguisherId: string | null
    serviceDate: Date | null
    serviceType: string | null
    technician: string | null
    condition: string | null
    notes: string | null
    partsReplaced: string | null
    nextServiceDate: Date | null
    createdAt: Date | null
  }

  export type InspectionCountAggregateOutputType = {
    id: number
    tenantId: number
    extinguisherId: number
    serviceDate: number
    serviceType: number
    technician: number
    condition: number
    notes: number
    partsReplaced: number
    nextServiceDate: number
    createdAt: number
    _all: number
  }


  export type InspectionMinAggregateInputType = {
    id?: true
    tenantId?: true
    extinguisherId?: true
    serviceDate?: true
    serviceType?: true
    technician?: true
    condition?: true
    notes?: true
    partsReplaced?: true
    nextServiceDate?: true
    createdAt?: true
  }

  export type InspectionMaxAggregateInputType = {
    id?: true
    tenantId?: true
    extinguisherId?: true
    serviceDate?: true
    serviceType?: true
    technician?: true
    condition?: true
    notes?: true
    partsReplaced?: true
    nextServiceDate?: true
    createdAt?: true
  }

  export type InspectionCountAggregateInputType = {
    id?: true
    tenantId?: true
    extinguisherId?: true
    serviceDate?: true
    serviceType?: true
    technician?: true
    condition?: true
    notes?: true
    partsReplaced?: true
    nextServiceDate?: true
    createdAt?: true
    _all?: true
  }

  export type InspectionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inspection to aggregate.
     */
    where?: InspectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inspections to fetch.
     */
    orderBy?: InspectionOrderByWithRelationInput | InspectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InspectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inspections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inspections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Inspections
    **/
    _count?: true | InspectionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InspectionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InspectionMaxAggregateInputType
  }

  export type GetInspectionAggregateType<T extends InspectionAggregateArgs> = {
        [P in keyof T & keyof AggregateInspection]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInspection[P]>
      : GetScalarType<T[P], AggregateInspection[P]>
  }




  export type InspectionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InspectionWhereInput
    orderBy?: InspectionOrderByWithAggregationInput | InspectionOrderByWithAggregationInput[]
    by: InspectionScalarFieldEnum[] | InspectionScalarFieldEnum
    having?: InspectionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InspectionCountAggregateInputType | true
    _min?: InspectionMinAggregateInputType
    _max?: InspectionMaxAggregateInputType
  }

  export type InspectionGroupByOutputType = {
    id: string
    tenantId: string
    extinguisherId: string
    serviceDate: Date
    serviceType: string
    technician: string | null
    condition: string
    notes: string | null
    partsReplaced: string | null
    nextServiceDate: Date | null
    createdAt: Date
    _count: InspectionCountAggregateOutputType | null
    _min: InspectionMinAggregateOutputType | null
    _max: InspectionMaxAggregateOutputType | null
  }

  type GetInspectionGroupByPayload<T extends InspectionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InspectionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InspectionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InspectionGroupByOutputType[P]>
            : GetScalarType<T[P], InspectionGroupByOutputType[P]>
        }
      >
    >


  export type InspectionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    extinguisherId?: boolean
    serviceDate?: boolean
    serviceType?: boolean
    technician?: boolean
    condition?: boolean
    notes?: boolean
    partsReplaced?: boolean
    nextServiceDate?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    extinguisher?: boolean | ExtinguisherDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inspection"]>

  export type InspectionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    extinguisherId?: boolean
    serviceDate?: boolean
    serviceType?: boolean
    technician?: boolean
    condition?: boolean
    notes?: boolean
    partsReplaced?: boolean
    nextServiceDate?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    extinguisher?: boolean | ExtinguisherDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inspection"]>

  export type InspectionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    extinguisherId?: boolean
    serviceDate?: boolean
    serviceType?: boolean
    technician?: boolean
    condition?: boolean
    notes?: boolean
    partsReplaced?: boolean
    nextServiceDate?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    extinguisher?: boolean | ExtinguisherDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inspection"]>

  export type InspectionSelectScalar = {
    id?: boolean
    tenantId?: boolean
    extinguisherId?: boolean
    serviceDate?: boolean
    serviceType?: boolean
    technician?: boolean
    condition?: boolean
    notes?: boolean
    partsReplaced?: boolean
    nextServiceDate?: boolean
    createdAt?: boolean
  }

  export type InspectionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "extinguisherId" | "serviceDate" | "serviceType" | "technician" | "condition" | "notes" | "partsReplaced" | "nextServiceDate" | "createdAt", ExtArgs["result"]["inspection"]>
  export type InspectionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    extinguisher?: boolean | ExtinguisherDefaultArgs<ExtArgs>
  }
  export type InspectionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    extinguisher?: boolean | ExtinguisherDefaultArgs<ExtArgs>
  }
  export type InspectionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    extinguisher?: boolean | ExtinguisherDefaultArgs<ExtArgs>
  }

  export type $InspectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Inspection"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      extinguisher: Prisma.$ExtinguisherPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      extinguisherId: string
      serviceDate: Date
      serviceType: string
      technician: string | null
      condition: string
      notes: string | null
      partsReplaced: string | null
      nextServiceDate: Date | null
      createdAt: Date
    }, ExtArgs["result"]["inspection"]>
    composites: {}
  }

  type InspectionGetPayload<S extends boolean | null | undefined | InspectionDefaultArgs> = $Result.GetResult<Prisma.$InspectionPayload, S>

  type InspectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InspectionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InspectionCountAggregateInputType | true
    }

  export interface InspectionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Inspection'], meta: { name: 'Inspection' } }
    /**
     * Find zero or one Inspection that matches the filter.
     * @param {InspectionFindUniqueArgs} args - Arguments to find a Inspection
     * @example
     * // Get one Inspection
     * const inspection = await prisma.inspection.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InspectionFindUniqueArgs>(args: SelectSubset<T, InspectionFindUniqueArgs<ExtArgs>>): Prisma__InspectionClient<$Result.GetResult<Prisma.$InspectionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Inspection that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InspectionFindUniqueOrThrowArgs} args - Arguments to find a Inspection
     * @example
     * // Get one Inspection
     * const inspection = await prisma.inspection.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InspectionFindUniqueOrThrowArgs>(args: SelectSubset<T, InspectionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InspectionClient<$Result.GetResult<Prisma.$InspectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Inspection that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InspectionFindFirstArgs} args - Arguments to find a Inspection
     * @example
     * // Get one Inspection
     * const inspection = await prisma.inspection.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InspectionFindFirstArgs>(args?: SelectSubset<T, InspectionFindFirstArgs<ExtArgs>>): Prisma__InspectionClient<$Result.GetResult<Prisma.$InspectionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Inspection that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InspectionFindFirstOrThrowArgs} args - Arguments to find a Inspection
     * @example
     * // Get one Inspection
     * const inspection = await prisma.inspection.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InspectionFindFirstOrThrowArgs>(args?: SelectSubset<T, InspectionFindFirstOrThrowArgs<ExtArgs>>): Prisma__InspectionClient<$Result.GetResult<Prisma.$InspectionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Inspections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InspectionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Inspections
     * const inspections = await prisma.inspection.findMany()
     * 
     * // Get first 10 Inspections
     * const inspections = await prisma.inspection.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inspectionWithIdOnly = await prisma.inspection.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InspectionFindManyArgs>(args?: SelectSubset<T, InspectionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InspectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Inspection.
     * @param {InspectionCreateArgs} args - Arguments to create a Inspection.
     * @example
     * // Create one Inspection
     * const Inspection = await prisma.inspection.create({
     *   data: {
     *     // ... data to create a Inspection
     *   }
     * })
     * 
     */
    create<T extends InspectionCreateArgs>(args: SelectSubset<T, InspectionCreateArgs<ExtArgs>>): Prisma__InspectionClient<$Result.GetResult<Prisma.$InspectionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Inspections.
     * @param {InspectionCreateManyArgs} args - Arguments to create many Inspections.
     * @example
     * // Create many Inspections
     * const inspection = await prisma.inspection.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InspectionCreateManyArgs>(args?: SelectSubset<T, InspectionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Inspections and returns the data saved in the database.
     * @param {InspectionCreateManyAndReturnArgs} args - Arguments to create many Inspections.
     * @example
     * // Create many Inspections
     * const inspection = await prisma.inspection.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Inspections and only return the `id`
     * const inspectionWithIdOnly = await prisma.inspection.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InspectionCreateManyAndReturnArgs>(args?: SelectSubset<T, InspectionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InspectionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Inspection.
     * @param {InspectionDeleteArgs} args - Arguments to delete one Inspection.
     * @example
     * // Delete one Inspection
     * const Inspection = await prisma.inspection.delete({
     *   where: {
     *     // ... filter to delete one Inspection
     *   }
     * })
     * 
     */
    delete<T extends InspectionDeleteArgs>(args: SelectSubset<T, InspectionDeleteArgs<ExtArgs>>): Prisma__InspectionClient<$Result.GetResult<Prisma.$InspectionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Inspection.
     * @param {InspectionUpdateArgs} args - Arguments to update one Inspection.
     * @example
     * // Update one Inspection
     * const inspection = await prisma.inspection.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InspectionUpdateArgs>(args: SelectSubset<T, InspectionUpdateArgs<ExtArgs>>): Prisma__InspectionClient<$Result.GetResult<Prisma.$InspectionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Inspections.
     * @param {InspectionDeleteManyArgs} args - Arguments to filter Inspections to delete.
     * @example
     * // Delete a few Inspections
     * const { count } = await prisma.inspection.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InspectionDeleteManyArgs>(args?: SelectSubset<T, InspectionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inspections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InspectionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Inspections
     * const inspection = await prisma.inspection.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InspectionUpdateManyArgs>(args: SelectSubset<T, InspectionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inspections and returns the data updated in the database.
     * @param {InspectionUpdateManyAndReturnArgs} args - Arguments to update many Inspections.
     * @example
     * // Update many Inspections
     * const inspection = await prisma.inspection.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Inspections and only return the `id`
     * const inspectionWithIdOnly = await prisma.inspection.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InspectionUpdateManyAndReturnArgs>(args: SelectSubset<T, InspectionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InspectionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Inspection.
     * @param {InspectionUpsertArgs} args - Arguments to update or create a Inspection.
     * @example
     * // Update or create a Inspection
     * const inspection = await prisma.inspection.upsert({
     *   create: {
     *     // ... data to create a Inspection
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Inspection we want to update
     *   }
     * })
     */
    upsert<T extends InspectionUpsertArgs>(args: SelectSubset<T, InspectionUpsertArgs<ExtArgs>>): Prisma__InspectionClient<$Result.GetResult<Prisma.$InspectionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Inspections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InspectionCountArgs} args - Arguments to filter Inspections to count.
     * @example
     * // Count the number of Inspections
     * const count = await prisma.inspection.count({
     *   where: {
     *     // ... the filter for the Inspections we want to count
     *   }
     * })
    **/
    count<T extends InspectionCountArgs>(
      args?: Subset<T, InspectionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InspectionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Inspection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InspectionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InspectionAggregateArgs>(args: Subset<T, InspectionAggregateArgs>): Prisma.PrismaPromise<GetInspectionAggregateType<T>>

    /**
     * Group by Inspection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InspectionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InspectionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InspectionGroupByArgs['orderBy'] }
        : { orderBy?: InspectionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InspectionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInspectionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Inspection model
   */
  readonly fields: InspectionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Inspection.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InspectionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    extinguisher<T extends ExtinguisherDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ExtinguisherDefaultArgs<ExtArgs>>): Prisma__ExtinguisherClient<$Result.GetResult<Prisma.$ExtinguisherPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Inspection model
   */
  interface InspectionFieldRefs {
    readonly id: FieldRef<"Inspection", 'String'>
    readonly tenantId: FieldRef<"Inspection", 'String'>
    readonly extinguisherId: FieldRef<"Inspection", 'String'>
    readonly serviceDate: FieldRef<"Inspection", 'DateTime'>
    readonly serviceType: FieldRef<"Inspection", 'String'>
    readonly technician: FieldRef<"Inspection", 'String'>
    readonly condition: FieldRef<"Inspection", 'String'>
    readonly notes: FieldRef<"Inspection", 'String'>
    readonly partsReplaced: FieldRef<"Inspection", 'String'>
    readonly nextServiceDate: FieldRef<"Inspection", 'DateTime'>
    readonly createdAt: FieldRef<"Inspection", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Inspection findUnique
   */
  export type InspectionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inspection
     */
    select?: InspectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inspection
     */
    omit?: InspectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionInclude<ExtArgs> | null
    /**
     * Filter, which Inspection to fetch.
     */
    where: InspectionWhereUniqueInput
  }

  /**
   * Inspection findUniqueOrThrow
   */
  export type InspectionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inspection
     */
    select?: InspectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inspection
     */
    omit?: InspectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionInclude<ExtArgs> | null
    /**
     * Filter, which Inspection to fetch.
     */
    where: InspectionWhereUniqueInput
  }

  /**
   * Inspection findFirst
   */
  export type InspectionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inspection
     */
    select?: InspectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inspection
     */
    omit?: InspectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionInclude<ExtArgs> | null
    /**
     * Filter, which Inspection to fetch.
     */
    where?: InspectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inspections to fetch.
     */
    orderBy?: InspectionOrderByWithRelationInput | InspectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inspections.
     */
    cursor?: InspectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inspections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inspections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inspections.
     */
    distinct?: InspectionScalarFieldEnum | InspectionScalarFieldEnum[]
  }

  /**
   * Inspection findFirstOrThrow
   */
  export type InspectionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inspection
     */
    select?: InspectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inspection
     */
    omit?: InspectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionInclude<ExtArgs> | null
    /**
     * Filter, which Inspection to fetch.
     */
    where?: InspectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inspections to fetch.
     */
    orderBy?: InspectionOrderByWithRelationInput | InspectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inspections.
     */
    cursor?: InspectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inspections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inspections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inspections.
     */
    distinct?: InspectionScalarFieldEnum | InspectionScalarFieldEnum[]
  }

  /**
   * Inspection findMany
   */
  export type InspectionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inspection
     */
    select?: InspectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inspection
     */
    omit?: InspectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionInclude<ExtArgs> | null
    /**
     * Filter, which Inspections to fetch.
     */
    where?: InspectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inspections to fetch.
     */
    orderBy?: InspectionOrderByWithRelationInput | InspectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Inspections.
     */
    cursor?: InspectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inspections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inspections.
     */
    skip?: number
    distinct?: InspectionScalarFieldEnum | InspectionScalarFieldEnum[]
  }

  /**
   * Inspection create
   */
  export type InspectionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inspection
     */
    select?: InspectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inspection
     */
    omit?: InspectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionInclude<ExtArgs> | null
    /**
     * The data needed to create a Inspection.
     */
    data: XOR<InspectionCreateInput, InspectionUncheckedCreateInput>
  }

  /**
   * Inspection createMany
   */
  export type InspectionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Inspections.
     */
    data: InspectionCreateManyInput | InspectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Inspection createManyAndReturn
   */
  export type InspectionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inspection
     */
    select?: InspectionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Inspection
     */
    omit?: InspectionOmit<ExtArgs> | null
    /**
     * The data used to create many Inspections.
     */
    data: InspectionCreateManyInput | InspectionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Inspection update
   */
  export type InspectionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inspection
     */
    select?: InspectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inspection
     */
    omit?: InspectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionInclude<ExtArgs> | null
    /**
     * The data needed to update a Inspection.
     */
    data: XOR<InspectionUpdateInput, InspectionUncheckedUpdateInput>
    /**
     * Choose, which Inspection to update.
     */
    where: InspectionWhereUniqueInput
  }

  /**
   * Inspection updateMany
   */
  export type InspectionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Inspections.
     */
    data: XOR<InspectionUpdateManyMutationInput, InspectionUncheckedUpdateManyInput>
    /**
     * Filter which Inspections to update
     */
    where?: InspectionWhereInput
    /**
     * Limit how many Inspections to update.
     */
    limit?: number
  }

  /**
   * Inspection updateManyAndReturn
   */
  export type InspectionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inspection
     */
    select?: InspectionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Inspection
     */
    omit?: InspectionOmit<ExtArgs> | null
    /**
     * The data used to update Inspections.
     */
    data: XOR<InspectionUpdateManyMutationInput, InspectionUncheckedUpdateManyInput>
    /**
     * Filter which Inspections to update
     */
    where?: InspectionWhereInput
    /**
     * Limit how many Inspections to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Inspection upsert
   */
  export type InspectionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inspection
     */
    select?: InspectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inspection
     */
    omit?: InspectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionInclude<ExtArgs> | null
    /**
     * The filter to search for the Inspection to update in case it exists.
     */
    where: InspectionWhereUniqueInput
    /**
     * In case the Inspection found by the `where` argument doesn't exist, create a new Inspection with this data.
     */
    create: XOR<InspectionCreateInput, InspectionUncheckedCreateInput>
    /**
     * In case the Inspection was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InspectionUpdateInput, InspectionUncheckedUpdateInput>
  }

  /**
   * Inspection delete
   */
  export type InspectionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inspection
     */
    select?: InspectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inspection
     */
    omit?: InspectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionInclude<ExtArgs> | null
    /**
     * Filter which Inspection to delete.
     */
    where: InspectionWhereUniqueInput
  }

  /**
   * Inspection deleteMany
   */
  export type InspectionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inspections to delete
     */
    where?: InspectionWhereInput
    /**
     * Limit how many Inspections to delete.
     */
    limit?: number
  }

  /**
   * Inspection without action
   */
  export type InspectionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inspection
     */
    select?: InspectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inspection
     */
    omit?: InspectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionInclude<ExtArgs> | null
  }


  /**
   * Model Subscription
   */

  export type AggregateSubscription = {
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  export type SubscriptionMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    plan: string | null
    status: string | null
    currentPeriodStart: Date | null
    currentPeriodEnd: Date | null
    trialEnd: Date | null
    createdAt: Date | null
  }

  export type SubscriptionMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    plan: string | null
    status: string | null
    currentPeriodStart: Date | null
    currentPeriodEnd: Date | null
    trialEnd: Date | null
    createdAt: Date | null
  }

  export type SubscriptionCountAggregateOutputType = {
    id: number
    tenantId: number
    stripeCustomerId: number
    stripeSubscriptionId: number
    plan: number
    status: number
    currentPeriodStart: number
    currentPeriodEnd: number
    trialEnd: number
    createdAt: number
    _all: number
  }


  export type SubscriptionMinAggregateInputType = {
    id?: true
    tenantId?: true
    stripeCustomerId?: true
    stripeSubscriptionId?: true
    plan?: true
    status?: true
    currentPeriodStart?: true
    currentPeriodEnd?: true
    trialEnd?: true
    createdAt?: true
  }

  export type SubscriptionMaxAggregateInputType = {
    id?: true
    tenantId?: true
    stripeCustomerId?: true
    stripeSubscriptionId?: true
    plan?: true
    status?: true
    currentPeriodStart?: true
    currentPeriodEnd?: true
    trialEnd?: true
    createdAt?: true
  }

  export type SubscriptionCountAggregateInputType = {
    id?: true
    tenantId?: true
    stripeCustomerId?: true
    stripeSubscriptionId?: true
    plan?: true
    status?: true
    currentPeriodStart?: true
    currentPeriodEnd?: true
    trialEnd?: true
    createdAt?: true
    _all?: true
  }

  export type SubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscription to aggregate.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Subscriptions
    **/
    _count?: true | SubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionMaxAggregateInputType
  }

  export type GetSubscriptionAggregateType<T extends SubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscription[P]>
      : GetScalarType<T[P], AggregateSubscription[P]>
  }




  export type SubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithAggregationInput | SubscriptionOrderByWithAggregationInput[]
    by: SubscriptionScalarFieldEnum[] | SubscriptionScalarFieldEnum
    having?: SubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionCountAggregateInputType | true
    _min?: SubscriptionMinAggregateInputType
    _max?: SubscriptionMaxAggregateInputType
  }

  export type SubscriptionGroupByOutputType = {
    id: string
    tenantId: string
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    plan: string
    status: string
    currentPeriodStart: Date | null
    currentPeriodEnd: Date | null
    trialEnd: Date | null
    createdAt: Date
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  type GetSubscriptionGroupByPayload<T extends SubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    plan?: boolean
    status?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    trialEnd?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    plan?: boolean
    status?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    trialEnd?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    plan?: boolean
    status?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    trialEnd?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectScalar = {
    id?: boolean
    tenantId?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    plan?: boolean
    status?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    trialEnd?: boolean
    createdAt?: boolean
  }

  export type SubscriptionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "stripeCustomerId" | "stripeSubscriptionId" | "plan" | "status" | "currentPeriodStart" | "currentPeriodEnd" | "trialEnd" | "createdAt", ExtArgs["result"]["subscription"]>
  export type SubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type SubscriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type SubscriptionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $SubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Subscription"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      stripeCustomerId: string | null
      stripeSubscriptionId: string | null
      plan: string
      status: string
      currentPeriodStart: Date | null
      currentPeriodEnd: Date | null
      trialEnd: Date | null
      createdAt: Date
    }, ExtArgs["result"]["subscription"]>
    composites: {}
  }

  type SubscriptionGetPayload<S extends boolean | null | undefined | SubscriptionDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionPayload, S>

  type SubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubscriptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubscriptionCountAggregateInputType | true
    }

  export interface SubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Subscription'], meta: { name: 'Subscription' } }
    /**
     * Find zero or one Subscription that matches the filter.
     * @param {SubscriptionFindUniqueArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionFindUniqueArgs>(args: SelectSubset<T, SubscriptionFindUniqueArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Subscription that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubscriptionFindUniqueOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, SubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionFindFirstArgs>(args?: SelectSubset<T, SubscriptionFindFirstArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, SubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subscriptions
     * const subscriptions = await prisma.subscription.findMany()
     * 
     * // Get first 10 Subscriptions
     * const subscriptions = await prisma.subscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubscriptionFindManyArgs>(args?: SelectSubset<T, SubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Subscription.
     * @param {SubscriptionCreateArgs} args - Arguments to create a Subscription.
     * @example
     * // Create one Subscription
     * const Subscription = await prisma.subscription.create({
     *   data: {
     *     // ... data to create a Subscription
     *   }
     * })
     * 
     */
    create<T extends SubscriptionCreateArgs>(args: SelectSubset<T, SubscriptionCreateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Subscriptions.
     * @param {SubscriptionCreateManyArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubscriptionCreateManyArgs>(args?: SelectSubset<T, SubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Subscriptions and returns the data saved in the database.
     * @param {SubscriptionCreateManyAndReturnArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Subscriptions and only return the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubscriptionCreateManyAndReturnArgs>(args?: SelectSubset<T, SubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Subscription.
     * @param {SubscriptionDeleteArgs} args - Arguments to delete one Subscription.
     * @example
     * // Delete one Subscription
     * const Subscription = await prisma.subscription.delete({
     *   where: {
     *     // ... filter to delete one Subscription
     *   }
     * })
     * 
     */
    delete<T extends SubscriptionDeleteArgs>(args: SelectSubset<T, SubscriptionDeleteArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Subscription.
     * @param {SubscriptionUpdateArgs} args - Arguments to update one Subscription.
     * @example
     * // Update one Subscription
     * const subscription = await prisma.subscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubscriptionUpdateArgs>(args: SelectSubset<T, SubscriptionUpdateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Subscriptions.
     * @param {SubscriptionDeleteManyArgs} args - Arguments to filter Subscriptions to delete.
     * @example
     * // Delete a few Subscriptions
     * const { count } = await prisma.subscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubscriptionDeleteManyArgs>(args?: SelectSubset<T, SubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subscriptions
     * const subscription = await prisma.subscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubscriptionUpdateManyArgs>(args: SelectSubset<T, SubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions and returns the data updated in the database.
     * @param {SubscriptionUpdateManyAndReturnArgs} args - Arguments to update many Subscriptions.
     * @example
     * // Update many Subscriptions
     * const subscription = await prisma.subscription.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Subscriptions and only return the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SubscriptionUpdateManyAndReturnArgs>(args: SelectSubset<T, SubscriptionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Subscription.
     * @param {SubscriptionUpsertArgs} args - Arguments to update or create a Subscription.
     * @example
     * // Update or create a Subscription
     * const subscription = await prisma.subscription.upsert({
     *   create: {
     *     // ... data to create a Subscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subscription we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionUpsertArgs>(args: SelectSubset<T, SubscriptionUpsertArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionCountArgs} args - Arguments to filter Subscriptions to count.
     * @example
     * // Count the number of Subscriptions
     * const count = await prisma.subscription.count({
     *   where: {
     *     // ... the filter for the Subscriptions we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionCountArgs>(
      args?: Subset<T, SubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionAggregateArgs>(args: Subset<T, SubscriptionAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionAggregateType<T>>

    /**
     * Group by Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Subscription model
   */
  readonly fields: SubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Subscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Subscription model
   */
  interface SubscriptionFieldRefs {
    readonly id: FieldRef<"Subscription", 'String'>
    readonly tenantId: FieldRef<"Subscription", 'String'>
    readonly stripeCustomerId: FieldRef<"Subscription", 'String'>
    readonly stripeSubscriptionId: FieldRef<"Subscription", 'String'>
    readonly plan: FieldRef<"Subscription", 'String'>
    readonly status: FieldRef<"Subscription", 'String'>
    readonly currentPeriodStart: FieldRef<"Subscription", 'DateTime'>
    readonly currentPeriodEnd: FieldRef<"Subscription", 'DateTime'>
    readonly trialEnd: FieldRef<"Subscription", 'DateTime'>
    readonly createdAt: FieldRef<"Subscription", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Subscription findUnique
   */
  export type SubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findUniqueOrThrow
   */
  export type SubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findFirst
   */
  export type SubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findFirstOrThrow
   */
  export type SubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findMany
   */
  export type SubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscriptions to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription create
   */
  export type SubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a Subscription.
     */
    data: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
  }

  /**
   * Subscription createMany
   */
  export type SubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Subscription createManyAndReturn
   */
  export type SubscriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Subscription update
   */
  export type SubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a Subscription.
     */
    data: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
    /**
     * Choose, which Subscription to update.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription updateMany
   */
  export type SubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to update.
     */
    limit?: number
  }

  /**
   * Subscription updateManyAndReturn
   */
  export type SubscriptionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Subscription upsert
   */
  export type SubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the Subscription to update in case it exists.
     */
    where: SubscriptionWhereUniqueInput
    /**
     * In case the Subscription found by the `where` argument doesn't exist, create a new Subscription with this data.
     */
    create: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
    /**
     * In case the Subscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
  }

  /**
   * Subscription delete
   */
  export type SubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter which Subscription to delete.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription deleteMany
   */
  export type SubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscriptions to delete
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to delete.
     */
    limit?: number
  }

  /**
   * Subscription without action
   */
  export type SubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
  }


  /**
   * Model Invoice
   */

  export type AggregateInvoice = {
    _count: InvoiceCountAggregateOutputType | null
    _avg: InvoiceAvgAggregateOutputType | null
    _sum: InvoiceSumAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  export type InvoiceAvgAggregateOutputType = {
    amount: number | null
  }

  export type InvoiceSumAggregateOutputType = {
    amount: number | null
  }

  export type InvoiceMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    stripeInvoiceId: string | null
    amount: number | null
    status: string | null
    createdAt: Date | null
  }

  export type InvoiceMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    stripeInvoiceId: string | null
    amount: number | null
    status: string | null
    createdAt: Date | null
  }

  export type InvoiceCountAggregateOutputType = {
    id: number
    tenantId: number
    stripeInvoiceId: number
    amount: number
    status: number
    createdAt: number
    _all: number
  }


  export type InvoiceAvgAggregateInputType = {
    amount?: true
  }

  export type InvoiceSumAggregateInputType = {
    amount?: true
  }

  export type InvoiceMinAggregateInputType = {
    id?: true
    tenantId?: true
    stripeInvoiceId?: true
    amount?: true
    status?: true
    createdAt?: true
  }

  export type InvoiceMaxAggregateInputType = {
    id?: true
    tenantId?: true
    stripeInvoiceId?: true
    amount?: true
    status?: true
    createdAt?: true
  }

  export type InvoiceCountAggregateInputType = {
    id?: true
    tenantId?: true
    stripeInvoiceId?: true
    amount?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type InvoiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invoice to aggregate.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Invoices
    **/
    _count?: true | InvoiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InvoiceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InvoiceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvoiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvoiceMaxAggregateInputType
  }

  export type GetInvoiceAggregateType<T extends InvoiceAggregateArgs> = {
        [P in keyof T & keyof AggregateInvoice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvoice[P]>
      : GetScalarType<T[P], AggregateInvoice[P]>
  }




  export type InvoiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceWhereInput
    orderBy?: InvoiceOrderByWithAggregationInput | InvoiceOrderByWithAggregationInput[]
    by: InvoiceScalarFieldEnum[] | InvoiceScalarFieldEnum
    having?: InvoiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvoiceCountAggregateInputType | true
    _avg?: InvoiceAvgAggregateInputType
    _sum?: InvoiceSumAggregateInputType
    _min?: InvoiceMinAggregateInputType
    _max?: InvoiceMaxAggregateInputType
  }

  export type InvoiceGroupByOutputType = {
    id: string
    tenantId: string
    stripeInvoiceId: string | null
    amount: number
    status: string
    createdAt: Date
    _count: InvoiceCountAggregateOutputType | null
    _avg: InvoiceAvgAggregateOutputType | null
    _sum: InvoiceSumAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  type GetInvoiceGroupByPayload<T extends InvoiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvoiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvoiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
            : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
        }
      >
    >


  export type InvoiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    stripeInvoiceId?: boolean
    amount?: boolean
    status?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>

  export type InvoiceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    stripeInvoiceId?: boolean
    amount?: boolean
    status?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>

  export type InvoiceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    stripeInvoiceId?: boolean
    amount?: boolean
    status?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>

  export type InvoiceSelectScalar = {
    id?: boolean
    tenantId?: boolean
    stripeInvoiceId?: boolean
    amount?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type InvoiceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "stripeInvoiceId" | "amount" | "status" | "createdAt", ExtArgs["result"]["invoice"]>
  export type InvoiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type InvoiceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type InvoiceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $InvoicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Invoice"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      stripeInvoiceId: string | null
      amount: number
      status: string
      createdAt: Date
    }, ExtArgs["result"]["invoice"]>
    composites: {}
  }

  type InvoiceGetPayload<S extends boolean | null | undefined | InvoiceDefaultArgs> = $Result.GetResult<Prisma.$InvoicePayload, S>

  type InvoiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InvoiceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InvoiceCountAggregateInputType | true
    }

  export interface InvoiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Invoice'], meta: { name: 'Invoice' } }
    /**
     * Find zero or one Invoice that matches the filter.
     * @param {InvoiceFindUniqueArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvoiceFindUniqueArgs>(args: SelectSubset<T, InvoiceFindUniqueArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Invoice that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InvoiceFindUniqueOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvoiceFindUniqueOrThrowArgs>(args: SelectSubset<T, InvoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Invoice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindFirstArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvoiceFindFirstArgs>(args?: SelectSubset<T, InvoiceFindFirstArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Invoice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindFirstOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvoiceFindFirstOrThrowArgs>(args?: SelectSubset<T, InvoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Invoices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Invoices
     * const invoices = await prisma.invoice.findMany()
     * 
     * // Get first 10 Invoices
     * const invoices = await prisma.invoice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const invoiceWithIdOnly = await prisma.invoice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvoiceFindManyArgs>(args?: SelectSubset<T, InvoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Invoice.
     * @param {InvoiceCreateArgs} args - Arguments to create a Invoice.
     * @example
     * // Create one Invoice
     * const Invoice = await prisma.invoice.create({
     *   data: {
     *     // ... data to create a Invoice
     *   }
     * })
     * 
     */
    create<T extends InvoiceCreateArgs>(args: SelectSubset<T, InvoiceCreateArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Invoices.
     * @param {InvoiceCreateManyArgs} args - Arguments to create many Invoices.
     * @example
     * // Create many Invoices
     * const invoice = await prisma.invoice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvoiceCreateManyArgs>(args?: SelectSubset<T, InvoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Invoices and returns the data saved in the database.
     * @param {InvoiceCreateManyAndReturnArgs} args - Arguments to create many Invoices.
     * @example
     * // Create many Invoices
     * const invoice = await prisma.invoice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Invoices and only return the `id`
     * const invoiceWithIdOnly = await prisma.invoice.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InvoiceCreateManyAndReturnArgs>(args?: SelectSubset<T, InvoiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Invoice.
     * @param {InvoiceDeleteArgs} args - Arguments to delete one Invoice.
     * @example
     * // Delete one Invoice
     * const Invoice = await prisma.invoice.delete({
     *   where: {
     *     // ... filter to delete one Invoice
     *   }
     * })
     * 
     */
    delete<T extends InvoiceDeleteArgs>(args: SelectSubset<T, InvoiceDeleteArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Invoice.
     * @param {InvoiceUpdateArgs} args - Arguments to update one Invoice.
     * @example
     * // Update one Invoice
     * const invoice = await prisma.invoice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvoiceUpdateArgs>(args: SelectSubset<T, InvoiceUpdateArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Invoices.
     * @param {InvoiceDeleteManyArgs} args - Arguments to filter Invoices to delete.
     * @example
     * // Delete a few Invoices
     * const { count } = await prisma.invoice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvoiceDeleteManyArgs>(args?: SelectSubset<T, InvoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Invoices
     * const invoice = await prisma.invoice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvoiceUpdateManyArgs>(args: SelectSubset<T, InvoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Invoices and returns the data updated in the database.
     * @param {InvoiceUpdateManyAndReturnArgs} args - Arguments to update many Invoices.
     * @example
     * // Update many Invoices
     * const invoice = await prisma.invoice.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Invoices and only return the `id`
     * const invoiceWithIdOnly = await prisma.invoice.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InvoiceUpdateManyAndReturnArgs>(args: SelectSubset<T, InvoiceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Invoice.
     * @param {InvoiceUpsertArgs} args - Arguments to update or create a Invoice.
     * @example
     * // Update or create a Invoice
     * const invoice = await prisma.invoice.upsert({
     *   create: {
     *     // ... data to create a Invoice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Invoice we want to update
     *   }
     * })
     */
    upsert<T extends InvoiceUpsertArgs>(args: SelectSubset<T, InvoiceUpsertArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceCountArgs} args - Arguments to filter Invoices to count.
     * @example
     * // Count the number of Invoices
     * const count = await prisma.invoice.count({
     *   where: {
     *     // ... the filter for the Invoices we want to count
     *   }
     * })
    **/
    count<T extends InvoiceCountArgs>(
      args?: Subset<T, InvoiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvoiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvoiceAggregateArgs>(args: Subset<T, InvoiceAggregateArgs>): Prisma.PrismaPromise<GetInvoiceAggregateType<T>>

    /**
     * Group by Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvoiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvoiceGroupByArgs['orderBy'] }
        : { orderBy?: InvoiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Invoice model
   */
  readonly fields: InvoiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Invoice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvoiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Invoice model
   */
  interface InvoiceFieldRefs {
    readonly id: FieldRef<"Invoice", 'String'>
    readonly tenantId: FieldRef<"Invoice", 'String'>
    readonly stripeInvoiceId: FieldRef<"Invoice", 'String'>
    readonly amount: FieldRef<"Invoice", 'Int'>
    readonly status: FieldRef<"Invoice", 'String'>
    readonly createdAt: FieldRef<"Invoice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Invoice findUnique
   */
  export type InvoiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice findUniqueOrThrow
   */
  export type InvoiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice findFirst
   */
  export type InvoiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice findFirstOrThrow
   */
  export type InvoiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice findMany
   */
  export type InvoiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoices to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice create
   */
  export type InvoiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The data needed to create a Invoice.
     */
    data: XOR<InvoiceCreateInput, InvoiceUncheckedCreateInput>
  }

  /**
   * Invoice createMany
   */
  export type InvoiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Invoices.
     */
    data: InvoiceCreateManyInput | InvoiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Invoice createManyAndReturn
   */
  export type InvoiceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * The data used to create many Invoices.
     */
    data: InvoiceCreateManyInput | InvoiceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Invoice update
   */
  export type InvoiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The data needed to update a Invoice.
     */
    data: XOR<InvoiceUpdateInput, InvoiceUncheckedUpdateInput>
    /**
     * Choose, which Invoice to update.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice updateMany
   */
  export type InvoiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Invoices.
     */
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyInput>
    /**
     * Filter which Invoices to update
     */
    where?: InvoiceWhereInput
    /**
     * Limit how many Invoices to update.
     */
    limit?: number
  }

  /**
   * Invoice updateManyAndReturn
   */
  export type InvoiceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * The data used to update Invoices.
     */
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyInput>
    /**
     * Filter which Invoices to update
     */
    where?: InvoiceWhereInput
    /**
     * Limit how many Invoices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Invoice upsert
   */
  export type InvoiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The filter to search for the Invoice to update in case it exists.
     */
    where: InvoiceWhereUniqueInput
    /**
     * In case the Invoice found by the `where` argument doesn't exist, create a new Invoice with this data.
     */
    create: XOR<InvoiceCreateInput, InvoiceUncheckedCreateInput>
    /**
     * In case the Invoice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvoiceUpdateInput, InvoiceUncheckedUpdateInput>
  }

  /**
   * Invoice delete
   */
  export type InvoiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter which Invoice to delete.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice deleteMany
   */
  export type InvoiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invoices to delete
     */
    where?: InvoiceWhereInput
    /**
     * Limit how many Invoices to delete.
     */
    limit?: number
  }

  /**
   * Invoice without action
   */
  export type InvoiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invoice
     */
    omit?: InvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
  }


  /**
   * Model ServiceJob
   */

  export type AggregateServiceJob = {
    _count: ServiceJobCountAggregateOutputType | null
    _min: ServiceJobMinAggregateOutputType | null
    _max: ServiceJobMaxAggregateOutputType | null
  }

  export type ServiceJobMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    extinguisherId: string | null
    location: string | null
    building: string | null
    type: string | null
    serviceType: string | null
    status: string | null
    notes: string | null
    scheduledDate: Date | null
    completedDate: Date | null
    technician: string | null
    createdAt: Date | null
  }

  export type ServiceJobMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    extinguisherId: string | null
    location: string | null
    building: string | null
    type: string | null
    serviceType: string | null
    status: string | null
    notes: string | null
    scheduledDate: Date | null
    completedDate: Date | null
    technician: string | null
    createdAt: Date | null
  }

  export type ServiceJobCountAggregateOutputType = {
    id: number
    tenantId: number
    extinguisherId: number
    location: number
    building: number
    type: number
    serviceType: number
    status: number
    notes: number
    scheduledDate: number
    completedDate: number
    technician: number
    createdAt: number
    _all: number
  }


  export type ServiceJobMinAggregateInputType = {
    id?: true
    tenantId?: true
    extinguisherId?: true
    location?: true
    building?: true
    type?: true
    serviceType?: true
    status?: true
    notes?: true
    scheduledDate?: true
    completedDate?: true
    technician?: true
    createdAt?: true
  }

  export type ServiceJobMaxAggregateInputType = {
    id?: true
    tenantId?: true
    extinguisherId?: true
    location?: true
    building?: true
    type?: true
    serviceType?: true
    status?: true
    notes?: true
    scheduledDate?: true
    completedDate?: true
    technician?: true
    createdAt?: true
  }

  export type ServiceJobCountAggregateInputType = {
    id?: true
    tenantId?: true
    extinguisherId?: true
    location?: true
    building?: true
    type?: true
    serviceType?: true
    status?: true
    notes?: true
    scheduledDate?: true
    completedDate?: true
    technician?: true
    createdAt?: true
    _all?: true
  }

  export type ServiceJobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ServiceJob to aggregate.
     */
    where?: ServiceJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServiceJobs to fetch.
     */
    orderBy?: ServiceJobOrderByWithRelationInput | ServiceJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ServiceJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServiceJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServiceJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ServiceJobs
    **/
    _count?: true | ServiceJobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ServiceJobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ServiceJobMaxAggregateInputType
  }

  export type GetServiceJobAggregateType<T extends ServiceJobAggregateArgs> = {
        [P in keyof T & keyof AggregateServiceJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateServiceJob[P]>
      : GetScalarType<T[P], AggregateServiceJob[P]>
  }




  export type ServiceJobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ServiceJobWhereInput
    orderBy?: ServiceJobOrderByWithAggregationInput | ServiceJobOrderByWithAggregationInput[]
    by: ServiceJobScalarFieldEnum[] | ServiceJobScalarFieldEnum
    having?: ServiceJobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ServiceJobCountAggregateInputType | true
    _min?: ServiceJobMinAggregateInputType
    _max?: ServiceJobMaxAggregateInputType
  }

  export type ServiceJobGroupByOutputType = {
    id: string
    tenantId: string
    extinguisherId: string | null
    location: string
    building: string
    type: string
    serviceType: string
    status: string
    notes: string | null
    scheduledDate: Date | null
    completedDate: Date | null
    technician: string | null
    createdAt: Date
    _count: ServiceJobCountAggregateOutputType | null
    _min: ServiceJobMinAggregateOutputType | null
    _max: ServiceJobMaxAggregateOutputType | null
  }

  type GetServiceJobGroupByPayload<T extends ServiceJobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ServiceJobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ServiceJobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ServiceJobGroupByOutputType[P]>
            : GetScalarType<T[P], ServiceJobGroupByOutputType[P]>
        }
      >
    >


  export type ServiceJobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    extinguisherId?: boolean
    location?: boolean
    building?: boolean
    type?: boolean
    serviceType?: boolean
    status?: boolean
    notes?: boolean
    scheduledDate?: boolean
    completedDate?: boolean
    technician?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["serviceJob"]>

  export type ServiceJobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    extinguisherId?: boolean
    location?: boolean
    building?: boolean
    type?: boolean
    serviceType?: boolean
    status?: boolean
    notes?: boolean
    scheduledDate?: boolean
    completedDate?: boolean
    technician?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["serviceJob"]>

  export type ServiceJobSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    extinguisherId?: boolean
    location?: boolean
    building?: boolean
    type?: boolean
    serviceType?: boolean
    status?: boolean
    notes?: boolean
    scheduledDate?: boolean
    completedDate?: boolean
    technician?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["serviceJob"]>

  export type ServiceJobSelectScalar = {
    id?: boolean
    tenantId?: boolean
    extinguisherId?: boolean
    location?: boolean
    building?: boolean
    type?: boolean
    serviceType?: boolean
    status?: boolean
    notes?: boolean
    scheduledDate?: boolean
    completedDate?: boolean
    technician?: boolean
    createdAt?: boolean
  }

  export type ServiceJobOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "extinguisherId" | "location" | "building" | "type" | "serviceType" | "status" | "notes" | "scheduledDate" | "completedDate" | "technician" | "createdAt", ExtArgs["result"]["serviceJob"]>
  export type ServiceJobInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type ServiceJobIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type ServiceJobIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $ServiceJobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ServiceJob"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      extinguisherId: string | null
      location: string
      building: string
      type: string
      serviceType: string
      status: string
      notes: string | null
      scheduledDate: Date | null
      completedDate: Date | null
      technician: string | null
      createdAt: Date
    }, ExtArgs["result"]["serviceJob"]>
    composites: {}
  }

  type ServiceJobGetPayload<S extends boolean | null | undefined | ServiceJobDefaultArgs> = $Result.GetResult<Prisma.$ServiceJobPayload, S>

  type ServiceJobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ServiceJobFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ServiceJobCountAggregateInputType | true
    }

  export interface ServiceJobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ServiceJob'], meta: { name: 'ServiceJob' } }
    /**
     * Find zero or one ServiceJob that matches the filter.
     * @param {ServiceJobFindUniqueArgs} args - Arguments to find a ServiceJob
     * @example
     * // Get one ServiceJob
     * const serviceJob = await prisma.serviceJob.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ServiceJobFindUniqueArgs>(args: SelectSubset<T, ServiceJobFindUniqueArgs<ExtArgs>>): Prisma__ServiceJobClient<$Result.GetResult<Prisma.$ServiceJobPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ServiceJob that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ServiceJobFindUniqueOrThrowArgs} args - Arguments to find a ServiceJob
     * @example
     * // Get one ServiceJob
     * const serviceJob = await prisma.serviceJob.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ServiceJobFindUniqueOrThrowArgs>(args: SelectSubset<T, ServiceJobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ServiceJobClient<$Result.GetResult<Prisma.$ServiceJobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ServiceJob that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceJobFindFirstArgs} args - Arguments to find a ServiceJob
     * @example
     * // Get one ServiceJob
     * const serviceJob = await prisma.serviceJob.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ServiceJobFindFirstArgs>(args?: SelectSubset<T, ServiceJobFindFirstArgs<ExtArgs>>): Prisma__ServiceJobClient<$Result.GetResult<Prisma.$ServiceJobPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ServiceJob that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceJobFindFirstOrThrowArgs} args - Arguments to find a ServiceJob
     * @example
     * // Get one ServiceJob
     * const serviceJob = await prisma.serviceJob.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ServiceJobFindFirstOrThrowArgs>(args?: SelectSubset<T, ServiceJobFindFirstOrThrowArgs<ExtArgs>>): Prisma__ServiceJobClient<$Result.GetResult<Prisma.$ServiceJobPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ServiceJobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceJobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ServiceJobs
     * const serviceJobs = await prisma.serviceJob.findMany()
     * 
     * // Get first 10 ServiceJobs
     * const serviceJobs = await prisma.serviceJob.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const serviceJobWithIdOnly = await prisma.serviceJob.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ServiceJobFindManyArgs>(args?: SelectSubset<T, ServiceJobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServiceJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ServiceJob.
     * @param {ServiceJobCreateArgs} args - Arguments to create a ServiceJob.
     * @example
     * // Create one ServiceJob
     * const ServiceJob = await prisma.serviceJob.create({
     *   data: {
     *     // ... data to create a ServiceJob
     *   }
     * })
     * 
     */
    create<T extends ServiceJobCreateArgs>(args: SelectSubset<T, ServiceJobCreateArgs<ExtArgs>>): Prisma__ServiceJobClient<$Result.GetResult<Prisma.$ServiceJobPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ServiceJobs.
     * @param {ServiceJobCreateManyArgs} args - Arguments to create many ServiceJobs.
     * @example
     * // Create many ServiceJobs
     * const serviceJob = await prisma.serviceJob.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ServiceJobCreateManyArgs>(args?: SelectSubset<T, ServiceJobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ServiceJobs and returns the data saved in the database.
     * @param {ServiceJobCreateManyAndReturnArgs} args - Arguments to create many ServiceJobs.
     * @example
     * // Create many ServiceJobs
     * const serviceJob = await prisma.serviceJob.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ServiceJobs and only return the `id`
     * const serviceJobWithIdOnly = await prisma.serviceJob.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ServiceJobCreateManyAndReturnArgs>(args?: SelectSubset<T, ServiceJobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServiceJobPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ServiceJob.
     * @param {ServiceJobDeleteArgs} args - Arguments to delete one ServiceJob.
     * @example
     * // Delete one ServiceJob
     * const ServiceJob = await prisma.serviceJob.delete({
     *   where: {
     *     // ... filter to delete one ServiceJob
     *   }
     * })
     * 
     */
    delete<T extends ServiceJobDeleteArgs>(args: SelectSubset<T, ServiceJobDeleteArgs<ExtArgs>>): Prisma__ServiceJobClient<$Result.GetResult<Prisma.$ServiceJobPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ServiceJob.
     * @param {ServiceJobUpdateArgs} args - Arguments to update one ServiceJob.
     * @example
     * // Update one ServiceJob
     * const serviceJob = await prisma.serviceJob.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ServiceJobUpdateArgs>(args: SelectSubset<T, ServiceJobUpdateArgs<ExtArgs>>): Prisma__ServiceJobClient<$Result.GetResult<Prisma.$ServiceJobPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ServiceJobs.
     * @param {ServiceJobDeleteManyArgs} args - Arguments to filter ServiceJobs to delete.
     * @example
     * // Delete a few ServiceJobs
     * const { count } = await prisma.serviceJob.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ServiceJobDeleteManyArgs>(args?: SelectSubset<T, ServiceJobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ServiceJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceJobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ServiceJobs
     * const serviceJob = await prisma.serviceJob.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ServiceJobUpdateManyArgs>(args: SelectSubset<T, ServiceJobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ServiceJobs and returns the data updated in the database.
     * @param {ServiceJobUpdateManyAndReturnArgs} args - Arguments to update many ServiceJobs.
     * @example
     * // Update many ServiceJobs
     * const serviceJob = await prisma.serviceJob.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ServiceJobs and only return the `id`
     * const serviceJobWithIdOnly = await prisma.serviceJob.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ServiceJobUpdateManyAndReturnArgs>(args: SelectSubset<T, ServiceJobUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServiceJobPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ServiceJob.
     * @param {ServiceJobUpsertArgs} args - Arguments to update or create a ServiceJob.
     * @example
     * // Update or create a ServiceJob
     * const serviceJob = await prisma.serviceJob.upsert({
     *   create: {
     *     // ... data to create a ServiceJob
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ServiceJob we want to update
     *   }
     * })
     */
    upsert<T extends ServiceJobUpsertArgs>(args: SelectSubset<T, ServiceJobUpsertArgs<ExtArgs>>): Prisma__ServiceJobClient<$Result.GetResult<Prisma.$ServiceJobPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ServiceJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceJobCountArgs} args - Arguments to filter ServiceJobs to count.
     * @example
     * // Count the number of ServiceJobs
     * const count = await prisma.serviceJob.count({
     *   where: {
     *     // ... the filter for the ServiceJobs we want to count
     *   }
     * })
    **/
    count<T extends ServiceJobCountArgs>(
      args?: Subset<T, ServiceJobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ServiceJobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ServiceJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceJobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ServiceJobAggregateArgs>(args: Subset<T, ServiceJobAggregateArgs>): Prisma.PrismaPromise<GetServiceJobAggregateType<T>>

    /**
     * Group by ServiceJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceJobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ServiceJobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ServiceJobGroupByArgs['orderBy'] }
        : { orderBy?: ServiceJobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ServiceJobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetServiceJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ServiceJob model
   */
  readonly fields: ServiceJobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ServiceJob.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ServiceJobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ServiceJob model
   */
  interface ServiceJobFieldRefs {
    readonly id: FieldRef<"ServiceJob", 'String'>
    readonly tenantId: FieldRef<"ServiceJob", 'String'>
    readonly extinguisherId: FieldRef<"ServiceJob", 'String'>
    readonly location: FieldRef<"ServiceJob", 'String'>
    readonly building: FieldRef<"ServiceJob", 'String'>
    readonly type: FieldRef<"ServiceJob", 'String'>
    readonly serviceType: FieldRef<"ServiceJob", 'String'>
    readonly status: FieldRef<"ServiceJob", 'String'>
    readonly notes: FieldRef<"ServiceJob", 'String'>
    readonly scheduledDate: FieldRef<"ServiceJob", 'DateTime'>
    readonly completedDate: FieldRef<"ServiceJob", 'DateTime'>
    readonly technician: FieldRef<"ServiceJob", 'String'>
    readonly createdAt: FieldRef<"ServiceJob", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ServiceJob findUnique
   */
  export type ServiceJobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceJob
     */
    select?: ServiceJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceJob
     */
    omit?: ServiceJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceJobInclude<ExtArgs> | null
    /**
     * Filter, which ServiceJob to fetch.
     */
    where: ServiceJobWhereUniqueInput
  }

  /**
   * ServiceJob findUniqueOrThrow
   */
  export type ServiceJobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceJob
     */
    select?: ServiceJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceJob
     */
    omit?: ServiceJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceJobInclude<ExtArgs> | null
    /**
     * Filter, which ServiceJob to fetch.
     */
    where: ServiceJobWhereUniqueInput
  }

  /**
   * ServiceJob findFirst
   */
  export type ServiceJobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceJob
     */
    select?: ServiceJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceJob
     */
    omit?: ServiceJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceJobInclude<ExtArgs> | null
    /**
     * Filter, which ServiceJob to fetch.
     */
    where?: ServiceJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServiceJobs to fetch.
     */
    orderBy?: ServiceJobOrderByWithRelationInput | ServiceJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ServiceJobs.
     */
    cursor?: ServiceJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServiceJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServiceJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ServiceJobs.
     */
    distinct?: ServiceJobScalarFieldEnum | ServiceJobScalarFieldEnum[]
  }

  /**
   * ServiceJob findFirstOrThrow
   */
  export type ServiceJobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceJob
     */
    select?: ServiceJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceJob
     */
    omit?: ServiceJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceJobInclude<ExtArgs> | null
    /**
     * Filter, which ServiceJob to fetch.
     */
    where?: ServiceJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServiceJobs to fetch.
     */
    orderBy?: ServiceJobOrderByWithRelationInput | ServiceJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ServiceJobs.
     */
    cursor?: ServiceJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServiceJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServiceJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ServiceJobs.
     */
    distinct?: ServiceJobScalarFieldEnum | ServiceJobScalarFieldEnum[]
  }

  /**
   * ServiceJob findMany
   */
  export type ServiceJobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceJob
     */
    select?: ServiceJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceJob
     */
    omit?: ServiceJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceJobInclude<ExtArgs> | null
    /**
     * Filter, which ServiceJobs to fetch.
     */
    where?: ServiceJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServiceJobs to fetch.
     */
    orderBy?: ServiceJobOrderByWithRelationInput | ServiceJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ServiceJobs.
     */
    cursor?: ServiceJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServiceJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServiceJobs.
     */
    skip?: number
    distinct?: ServiceJobScalarFieldEnum | ServiceJobScalarFieldEnum[]
  }

  /**
   * ServiceJob create
   */
  export type ServiceJobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceJob
     */
    select?: ServiceJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceJob
     */
    omit?: ServiceJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceJobInclude<ExtArgs> | null
    /**
     * The data needed to create a ServiceJob.
     */
    data: XOR<ServiceJobCreateInput, ServiceJobUncheckedCreateInput>
  }

  /**
   * ServiceJob createMany
   */
  export type ServiceJobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ServiceJobs.
     */
    data: ServiceJobCreateManyInput | ServiceJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ServiceJob createManyAndReturn
   */
  export type ServiceJobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceJob
     */
    select?: ServiceJobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceJob
     */
    omit?: ServiceJobOmit<ExtArgs> | null
    /**
     * The data used to create many ServiceJobs.
     */
    data: ServiceJobCreateManyInput | ServiceJobCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceJobIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ServiceJob update
   */
  export type ServiceJobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceJob
     */
    select?: ServiceJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceJob
     */
    omit?: ServiceJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceJobInclude<ExtArgs> | null
    /**
     * The data needed to update a ServiceJob.
     */
    data: XOR<ServiceJobUpdateInput, ServiceJobUncheckedUpdateInput>
    /**
     * Choose, which ServiceJob to update.
     */
    where: ServiceJobWhereUniqueInput
  }

  /**
   * ServiceJob updateMany
   */
  export type ServiceJobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ServiceJobs.
     */
    data: XOR<ServiceJobUpdateManyMutationInput, ServiceJobUncheckedUpdateManyInput>
    /**
     * Filter which ServiceJobs to update
     */
    where?: ServiceJobWhereInput
    /**
     * Limit how many ServiceJobs to update.
     */
    limit?: number
  }

  /**
   * ServiceJob updateManyAndReturn
   */
  export type ServiceJobUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceJob
     */
    select?: ServiceJobSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceJob
     */
    omit?: ServiceJobOmit<ExtArgs> | null
    /**
     * The data used to update ServiceJobs.
     */
    data: XOR<ServiceJobUpdateManyMutationInput, ServiceJobUncheckedUpdateManyInput>
    /**
     * Filter which ServiceJobs to update
     */
    where?: ServiceJobWhereInput
    /**
     * Limit how many ServiceJobs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceJobIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ServiceJob upsert
   */
  export type ServiceJobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceJob
     */
    select?: ServiceJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceJob
     */
    omit?: ServiceJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceJobInclude<ExtArgs> | null
    /**
     * The filter to search for the ServiceJob to update in case it exists.
     */
    where: ServiceJobWhereUniqueInput
    /**
     * In case the ServiceJob found by the `where` argument doesn't exist, create a new ServiceJob with this data.
     */
    create: XOR<ServiceJobCreateInput, ServiceJobUncheckedCreateInput>
    /**
     * In case the ServiceJob was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ServiceJobUpdateInput, ServiceJobUncheckedUpdateInput>
  }

  /**
   * ServiceJob delete
   */
  export type ServiceJobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceJob
     */
    select?: ServiceJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceJob
     */
    omit?: ServiceJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceJobInclude<ExtArgs> | null
    /**
     * Filter which ServiceJob to delete.
     */
    where: ServiceJobWhereUniqueInput
  }

  /**
   * ServiceJob deleteMany
   */
  export type ServiceJobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ServiceJobs to delete
     */
    where?: ServiceJobWhereInput
    /**
     * Limit how many ServiceJobs to delete.
     */
    limit?: number
  }

  /**
   * ServiceJob without action
   */
  export type ServiceJobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceJob
     */
    select?: ServiceJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceJob
     */
    omit?: ServiceJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceJobInclude<ExtArgs> | null
  }


  /**
   * Model InspectionPhoto
   */

  export type AggregateInspectionPhoto = {
    _count: InspectionPhotoCountAggregateOutputType | null
    _min: InspectionPhotoMinAggregateOutputType | null
    _max: InspectionPhotoMaxAggregateOutputType | null
  }

  export type InspectionPhotoMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    extinguisherId: string | null
    inspectionId: string | null
    photoUrl: string | null
    caption: string | null
    uploadedBy: string | null
    createdAt: Date | null
  }

  export type InspectionPhotoMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    extinguisherId: string | null
    inspectionId: string | null
    photoUrl: string | null
    caption: string | null
    uploadedBy: string | null
    createdAt: Date | null
  }

  export type InspectionPhotoCountAggregateOutputType = {
    id: number
    tenantId: number
    extinguisherId: number
    inspectionId: number
    photoUrl: number
    caption: number
    uploadedBy: number
    createdAt: number
    _all: number
  }


  export type InspectionPhotoMinAggregateInputType = {
    id?: true
    tenantId?: true
    extinguisherId?: true
    inspectionId?: true
    photoUrl?: true
    caption?: true
    uploadedBy?: true
    createdAt?: true
  }

  export type InspectionPhotoMaxAggregateInputType = {
    id?: true
    tenantId?: true
    extinguisherId?: true
    inspectionId?: true
    photoUrl?: true
    caption?: true
    uploadedBy?: true
    createdAt?: true
  }

  export type InspectionPhotoCountAggregateInputType = {
    id?: true
    tenantId?: true
    extinguisherId?: true
    inspectionId?: true
    photoUrl?: true
    caption?: true
    uploadedBy?: true
    createdAt?: true
    _all?: true
  }

  export type InspectionPhotoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InspectionPhoto to aggregate.
     */
    where?: InspectionPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InspectionPhotos to fetch.
     */
    orderBy?: InspectionPhotoOrderByWithRelationInput | InspectionPhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InspectionPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InspectionPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InspectionPhotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InspectionPhotos
    **/
    _count?: true | InspectionPhotoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InspectionPhotoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InspectionPhotoMaxAggregateInputType
  }

  export type GetInspectionPhotoAggregateType<T extends InspectionPhotoAggregateArgs> = {
        [P in keyof T & keyof AggregateInspectionPhoto]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInspectionPhoto[P]>
      : GetScalarType<T[P], AggregateInspectionPhoto[P]>
  }




  export type InspectionPhotoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InspectionPhotoWhereInput
    orderBy?: InspectionPhotoOrderByWithAggregationInput | InspectionPhotoOrderByWithAggregationInput[]
    by: InspectionPhotoScalarFieldEnum[] | InspectionPhotoScalarFieldEnum
    having?: InspectionPhotoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InspectionPhotoCountAggregateInputType | true
    _min?: InspectionPhotoMinAggregateInputType
    _max?: InspectionPhotoMaxAggregateInputType
  }

  export type InspectionPhotoGroupByOutputType = {
    id: string
    tenantId: string
    extinguisherId: string | null
    inspectionId: string | null
    photoUrl: string
    caption: string | null
    uploadedBy: string | null
    createdAt: Date
    _count: InspectionPhotoCountAggregateOutputType | null
    _min: InspectionPhotoMinAggregateOutputType | null
    _max: InspectionPhotoMaxAggregateOutputType | null
  }

  type GetInspectionPhotoGroupByPayload<T extends InspectionPhotoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InspectionPhotoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InspectionPhotoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InspectionPhotoGroupByOutputType[P]>
            : GetScalarType<T[P], InspectionPhotoGroupByOutputType[P]>
        }
      >
    >


  export type InspectionPhotoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    extinguisherId?: boolean
    inspectionId?: boolean
    photoUrl?: boolean
    caption?: boolean
    uploadedBy?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inspectionPhoto"]>

  export type InspectionPhotoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    extinguisherId?: boolean
    inspectionId?: boolean
    photoUrl?: boolean
    caption?: boolean
    uploadedBy?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inspectionPhoto"]>

  export type InspectionPhotoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    extinguisherId?: boolean
    inspectionId?: boolean
    photoUrl?: boolean
    caption?: boolean
    uploadedBy?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inspectionPhoto"]>

  export type InspectionPhotoSelectScalar = {
    id?: boolean
    tenantId?: boolean
    extinguisherId?: boolean
    inspectionId?: boolean
    photoUrl?: boolean
    caption?: boolean
    uploadedBy?: boolean
    createdAt?: boolean
  }

  export type InspectionPhotoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "extinguisherId" | "inspectionId" | "photoUrl" | "caption" | "uploadedBy" | "createdAt", ExtArgs["result"]["inspectionPhoto"]>
  export type InspectionPhotoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type InspectionPhotoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type InspectionPhotoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $InspectionPhotoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InspectionPhoto"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      extinguisherId: string | null
      inspectionId: string | null
      photoUrl: string
      caption: string | null
      uploadedBy: string | null
      createdAt: Date
    }, ExtArgs["result"]["inspectionPhoto"]>
    composites: {}
  }

  type InspectionPhotoGetPayload<S extends boolean | null | undefined | InspectionPhotoDefaultArgs> = $Result.GetResult<Prisma.$InspectionPhotoPayload, S>

  type InspectionPhotoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InspectionPhotoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InspectionPhotoCountAggregateInputType | true
    }

  export interface InspectionPhotoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InspectionPhoto'], meta: { name: 'InspectionPhoto' } }
    /**
     * Find zero or one InspectionPhoto that matches the filter.
     * @param {InspectionPhotoFindUniqueArgs} args - Arguments to find a InspectionPhoto
     * @example
     * // Get one InspectionPhoto
     * const inspectionPhoto = await prisma.inspectionPhoto.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InspectionPhotoFindUniqueArgs>(args: SelectSubset<T, InspectionPhotoFindUniqueArgs<ExtArgs>>): Prisma__InspectionPhotoClient<$Result.GetResult<Prisma.$InspectionPhotoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InspectionPhoto that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InspectionPhotoFindUniqueOrThrowArgs} args - Arguments to find a InspectionPhoto
     * @example
     * // Get one InspectionPhoto
     * const inspectionPhoto = await prisma.inspectionPhoto.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InspectionPhotoFindUniqueOrThrowArgs>(args: SelectSubset<T, InspectionPhotoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InspectionPhotoClient<$Result.GetResult<Prisma.$InspectionPhotoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InspectionPhoto that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InspectionPhotoFindFirstArgs} args - Arguments to find a InspectionPhoto
     * @example
     * // Get one InspectionPhoto
     * const inspectionPhoto = await prisma.inspectionPhoto.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InspectionPhotoFindFirstArgs>(args?: SelectSubset<T, InspectionPhotoFindFirstArgs<ExtArgs>>): Prisma__InspectionPhotoClient<$Result.GetResult<Prisma.$InspectionPhotoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InspectionPhoto that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InspectionPhotoFindFirstOrThrowArgs} args - Arguments to find a InspectionPhoto
     * @example
     * // Get one InspectionPhoto
     * const inspectionPhoto = await prisma.inspectionPhoto.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InspectionPhotoFindFirstOrThrowArgs>(args?: SelectSubset<T, InspectionPhotoFindFirstOrThrowArgs<ExtArgs>>): Prisma__InspectionPhotoClient<$Result.GetResult<Prisma.$InspectionPhotoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InspectionPhotos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InspectionPhotoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InspectionPhotos
     * const inspectionPhotos = await prisma.inspectionPhoto.findMany()
     * 
     * // Get first 10 InspectionPhotos
     * const inspectionPhotos = await prisma.inspectionPhoto.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inspectionPhotoWithIdOnly = await prisma.inspectionPhoto.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InspectionPhotoFindManyArgs>(args?: SelectSubset<T, InspectionPhotoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InspectionPhotoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InspectionPhoto.
     * @param {InspectionPhotoCreateArgs} args - Arguments to create a InspectionPhoto.
     * @example
     * // Create one InspectionPhoto
     * const InspectionPhoto = await prisma.inspectionPhoto.create({
     *   data: {
     *     // ... data to create a InspectionPhoto
     *   }
     * })
     * 
     */
    create<T extends InspectionPhotoCreateArgs>(args: SelectSubset<T, InspectionPhotoCreateArgs<ExtArgs>>): Prisma__InspectionPhotoClient<$Result.GetResult<Prisma.$InspectionPhotoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InspectionPhotos.
     * @param {InspectionPhotoCreateManyArgs} args - Arguments to create many InspectionPhotos.
     * @example
     * // Create many InspectionPhotos
     * const inspectionPhoto = await prisma.inspectionPhoto.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InspectionPhotoCreateManyArgs>(args?: SelectSubset<T, InspectionPhotoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InspectionPhotos and returns the data saved in the database.
     * @param {InspectionPhotoCreateManyAndReturnArgs} args - Arguments to create many InspectionPhotos.
     * @example
     * // Create many InspectionPhotos
     * const inspectionPhoto = await prisma.inspectionPhoto.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InspectionPhotos and only return the `id`
     * const inspectionPhotoWithIdOnly = await prisma.inspectionPhoto.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InspectionPhotoCreateManyAndReturnArgs>(args?: SelectSubset<T, InspectionPhotoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InspectionPhotoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a InspectionPhoto.
     * @param {InspectionPhotoDeleteArgs} args - Arguments to delete one InspectionPhoto.
     * @example
     * // Delete one InspectionPhoto
     * const InspectionPhoto = await prisma.inspectionPhoto.delete({
     *   where: {
     *     // ... filter to delete one InspectionPhoto
     *   }
     * })
     * 
     */
    delete<T extends InspectionPhotoDeleteArgs>(args: SelectSubset<T, InspectionPhotoDeleteArgs<ExtArgs>>): Prisma__InspectionPhotoClient<$Result.GetResult<Prisma.$InspectionPhotoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InspectionPhoto.
     * @param {InspectionPhotoUpdateArgs} args - Arguments to update one InspectionPhoto.
     * @example
     * // Update one InspectionPhoto
     * const inspectionPhoto = await prisma.inspectionPhoto.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InspectionPhotoUpdateArgs>(args: SelectSubset<T, InspectionPhotoUpdateArgs<ExtArgs>>): Prisma__InspectionPhotoClient<$Result.GetResult<Prisma.$InspectionPhotoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InspectionPhotos.
     * @param {InspectionPhotoDeleteManyArgs} args - Arguments to filter InspectionPhotos to delete.
     * @example
     * // Delete a few InspectionPhotos
     * const { count } = await prisma.inspectionPhoto.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InspectionPhotoDeleteManyArgs>(args?: SelectSubset<T, InspectionPhotoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InspectionPhotos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InspectionPhotoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InspectionPhotos
     * const inspectionPhoto = await prisma.inspectionPhoto.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InspectionPhotoUpdateManyArgs>(args: SelectSubset<T, InspectionPhotoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InspectionPhotos and returns the data updated in the database.
     * @param {InspectionPhotoUpdateManyAndReturnArgs} args - Arguments to update many InspectionPhotos.
     * @example
     * // Update many InspectionPhotos
     * const inspectionPhoto = await prisma.inspectionPhoto.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more InspectionPhotos and only return the `id`
     * const inspectionPhotoWithIdOnly = await prisma.inspectionPhoto.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InspectionPhotoUpdateManyAndReturnArgs>(args: SelectSubset<T, InspectionPhotoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InspectionPhotoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one InspectionPhoto.
     * @param {InspectionPhotoUpsertArgs} args - Arguments to update or create a InspectionPhoto.
     * @example
     * // Update or create a InspectionPhoto
     * const inspectionPhoto = await prisma.inspectionPhoto.upsert({
     *   create: {
     *     // ... data to create a InspectionPhoto
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InspectionPhoto we want to update
     *   }
     * })
     */
    upsert<T extends InspectionPhotoUpsertArgs>(args: SelectSubset<T, InspectionPhotoUpsertArgs<ExtArgs>>): Prisma__InspectionPhotoClient<$Result.GetResult<Prisma.$InspectionPhotoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InspectionPhotos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InspectionPhotoCountArgs} args - Arguments to filter InspectionPhotos to count.
     * @example
     * // Count the number of InspectionPhotos
     * const count = await prisma.inspectionPhoto.count({
     *   where: {
     *     // ... the filter for the InspectionPhotos we want to count
     *   }
     * })
    **/
    count<T extends InspectionPhotoCountArgs>(
      args?: Subset<T, InspectionPhotoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InspectionPhotoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InspectionPhoto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InspectionPhotoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InspectionPhotoAggregateArgs>(args: Subset<T, InspectionPhotoAggregateArgs>): Prisma.PrismaPromise<GetInspectionPhotoAggregateType<T>>

    /**
     * Group by InspectionPhoto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InspectionPhotoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InspectionPhotoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InspectionPhotoGroupByArgs['orderBy'] }
        : { orderBy?: InspectionPhotoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InspectionPhotoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInspectionPhotoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InspectionPhoto model
   */
  readonly fields: InspectionPhotoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InspectionPhoto.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InspectionPhotoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InspectionPhoto model
   */
  interface InspectionPhotoFieldRefs {
    readonly id: FieldRef<"InspectionPhoto", 'String'>
    readonly tenantId: FieldRef<"InspectionPhoto", 'String'>
    readonly extinguisherId: FieldRef<"InspectionPhoto", 'String'>
    readonly inspectionId: FieldRef<"InspectionPhoto", 'String'>
    readonly photoUrl: FieldRef<"InspectionPhoto", 'String'>
    readonly caption: FieldRef<"InspectionPhoto", 'String'>
    readonly uploadedBy: FieldRef<"InspectionPhoto", 'String'>
    readonly createdAt: FieldRef<"InspectionPhoto", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InspectionPhoto findUnique
   */
  export type InspectionPhotoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionPhoto
     */
    select?: InspectionPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InspectionPhoto
     */
    omit?: InspectionPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionPhotoInclude<ExtArgs> | null
    /**
     * Filter, which InspectionPhoto to fetch.
     */
    where: InspectionPhotoWhereUniqueInput
  }

  /**
   * InspectionPhoto findUniqueOrThrow
   */
  export type InspectionPhotoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionPhoto
     */
    select?: InspectionPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InspectionPhoto
     */
    omit?: InspectionPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionPhotoInclude<ExtArgs> | null
    /**
     * Filter, which InspectionPhoto to fetch.
     */
    where: InspectionPhotoWhereUniqueInput
  }

  /**
   * InspectionPhoto findFirst
   */
  export type InspectionPhotoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionPhoto
     */
    select?: InspectionPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InspectionPhoto
     */
    omit?: InspectionPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionPhotoInclude<ExtArgs> | null
    /**
     * Filter, which InspectionPhoto to fetch.
     */
    where?: InspectionPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InspectionPhotos to fetch.
     */
    orderBy?: InspectionPhotoOrderByWithRelationInput | InspectionPhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InspectionPhotos.
     */
    cursor?: InspectionPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InspectionPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InspectionPhotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InspectionPhotos.
     */
    distinct?: InspectionPhotoScalarFieldEnum | InspectionPhotoScalarFieldEnum[]
  }

  /**
   * InspectionPhoto findFirstOrThrow
   */
  export type InspectionPhotoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionPhoto
     */
    select?: InspectionPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InspectionPhoto
     */
    omit?: InspectionPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionPhotoInclude<ExtArgs> | null
    /**
     * Filter, which InspectionPhoto to fetch.
     */
    where?: InspectionPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InspectionPhotos to fetch.
     */
    orderBy?: InspectionPhotoOrderByWithRelationInput | InspectionPhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InspectionPhotos.
     */
    cursor?: InspectionPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InspectionPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InspectionPhotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InspectionPhotos.
     */
    distinct?: InspectionPhotoScalarFieldEnum | InspectionPhotoScalarFieldEnum[]
  }

  /**
   * InspectionPhoto findMany
   */
  export type InspectionPhotoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionPhoto
     */
    select?: InspectionPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InspectionPhoto
     */
    omit?: InspectionPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionPhotoInclude<ExtArgs> | null
    /**
     * Filter, which InspectionPhotos to fetch.
     */
    where?: InspectionPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InspectionPhotos to fetch.
     */
    orderBy?: InspectionPhotoOrderByWithRelationInput | InspectionPhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InspectionPhotos.
     */
    cursor?: InspectionPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InspectionPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InspectionPhotos.
     */
    skip?: number
    distinct?: InspectionPhotoScalarFieldEnum | InspectionPhotoScalarFieldEnum[]
  }

  /**
   * InspectionPhoto create
   */
  export type InspectionPhotoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionPhoto
     */
    select?: InspectionPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InspectionPhoto
     */
    omit?: InspectionPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionPhotoInclude<ExtArgs> | null
    /**
     * The data needed to create a InspectionPhoto.
     */
    data: XOR<InspectionPhotoCreateInput, InspectionPhotoUncheckedCreateInput>
  }

  /**
   * InspectionPhoto createMany
   */
  export type InspectionPhotoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InspectionPhotos.
     */
    data: InspectionPhotoCreateManyInput | InspectionPhotoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InspectionPhoto createManyAndReturn
   */
  export type InspectionPhotoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionPhoto
     */
    select?: InspectionPhotoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InspectionPhoto
     */
    omit?: InspectionPhotoOmit<ExtArgs> | null
    /**
     * The data used to create many InspectionPhotos.
     */
    data: InspectionPhotoCreateManyInput | InspectionPhotoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionPhotoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InspectionPhoto update
   */
  export type InspectionPhotoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionPhoto
     */
    select?: InspectionPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InspectionPhoto
     */
    omit?: InspectionPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionPhotoInclude<ExtArgs> | null
    /**
     * The data needed to update a InspectionPhoto.
     */
    data: XOR<InspectionPhotoUpdateInput, InspectionPhotoUncheckedUpdateInput>
    /**
     * Choose, which InspectionPhoto to update.
     */
    where: InspectionPhotoWhereUniqueInput
  }

  /**
   * InspectionPhoto updateMany
   */
  export type InspectionPhotoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InspectionPhotos.
     */
    data: XOR<InspectionPhotoUpdateManyMutationInput, InspectionPhotoUncheckedUpdateManyInput>
    /**
     * Filter which InspectionPhotos to update
     */
    where?: InspectionPhotoWhereInput
    /**
     * Limit how many InspectionPhotos to update.
     */
    limit?: number
  }

  /**
   * InspectionPhoto updateManyAndReturn
   */
  export type InspectionPhotoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionPhoto
     */
    select?: InspectionPhotoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InspectionPhoto
     */
    omit?: InspectionPhotoOmit<ExtArgs> | null
    /**
     * The data used to update InspectionPhotos.
     */
    data: XOR<InspectionPhotoUpdateManyMutationInput, InspectionPhotoUncheckedUpdateManyInput>
    /**
     * Filter which InspectionPhotos to update
     */
    where?: InspectionPhotoWhereInput
    /**
     * Limit how many InspectionPhotos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionPhotoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * InspectionPhoto upsert
   */
  export type InspectionPhotoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionPhoto
     */
    select?: InspectionPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InspectionPhoto
     */
    omit?: InspectionPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionPhotoInclude<ExtArgs> | null
    /**
     * The filter to search for the InspectionPhoto to update in case it exists.
     */
    where: InspectionPhotoWhereUniqueInput
    /**
     * In case the InspectionPhoto found by the `where` argument doesn't exist, create a new InspectionPhoto with this data.
     */
    create: XOR<InspectionPhotoCreateInput, InspectionPhotoUncheckedCreateInput>
    /**
     * In case the InspectionPhoto was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InspectionPhotoUpdateInput, InspectionPhotoUncheckedUpdateInput>
  }

  /**
   * InspectionPhoto delete
   */
  export type InspectionPhotoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionPhoto
     */
    select?: InspectionPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InspectionPhoto
     */
    omit?: InspectionPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionPhotoInclude<ExtArgs> | null
    /**
     * Filter which InspectionPhoto to delete.
     */
    where: InspectionPhotoWhereUniqueInput
  }

  /**
   * InspectionPhoto deleteMany
   */
  export type InspectionPhotoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InspectionPhotos to delete
     */
    where?: InspectionPhotoWhereInput
    /**
     * Limit how many InspectionPhotos to delete.
     */
    limit?: number
  }

  /**
   * InspectionPhoto without action
   */
  export type InspectionPhotoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InspectionPhoto
     */
    select?: InspectionPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InspectionPhoto
     */
    omit?: InspectionPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InspectionPhotoInclude<ExtArgs> | null
  }


  /**
   * Model ServiceReport
   */

  export type AggregateServiceReport = {
    _count: ServiceReportCountAggregateOutputType | null
    _min: ServiceReportMinAggregateOutputType | null
    _max: ServiceReportMaxAggregateOutputType | null
  }

  export type ServiceReportMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    visitDate: Date | null
    technician: string | null
    pdfUrl: string | null
    createdAt: Date | null
  }

  export type ServiceReportMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    visitDate: Date | null
    technician: string | null
    pdfUrl: string | null
    createdAt: Date | null
  }

  export type ServiceReportCountAggregateOutputType = {
    id: number
    tenantId: number
    visitDate: number
    technician: number
    jobIds: number
    pdfUrl: number
    createdAt: number
    _all: number
  }


  export type ServiceReportMinAggregateInputType = {
    id?: true
    tenantId?: true
    visitDate?: true
    technician?: true
    pdfUrl?: true
    createdAt?: true
  }

  export type ServiceReportMaxAggregateInputType = {
    id?: true
    tenantId?: true
    visitDate?: true
    technician?: true
    pdfUrl?: true
    createdAt?: true
  }

  export type ServiceReportCountAggregateInputType = {
    id?: true
    tenantId?: true
    visitDate?: true
    technician?: true
    jobIds?: true
    pdfUrl?: true
    createdAt?: true
    _all?: true
  }

  export type ServiceReportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ServiceReport to aggregate.
     */
    where?: ServiceReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServiceReports to fetch.
     */
    orderBy?: ServiceReportOrderByWithRelationInput | ServiceReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ServiceReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServiceReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServiceReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ServiceReports
    **/
    _count?: true | ServiceReportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ServiceReportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ServiceReportMaxAggregateInputType
  }

  export type GetServiceReportAggregateType<T extends ServiceReportAggregateArgs> = {
        [P in keyof T & keyof AggregateServiceReport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateServiceReport[P]>
      : GetScalarType<T[P], AggregateServiceReport[P]>
  }




  export type ServiceReportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ServiceReportWhereInput
    orderBy?: ServiceReportOrderByWithAggregationInput | ServiceReportOrderByWithAggregationInput[]
    by: ServiceReportScalarFieldEnum[] | ServiceReportScalarFieldEnum
    having?: ServiceReportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ServiceReportCountAggregateInputType | true
    _min?: ServiceReportMinAggregateInputType
    _max?: ServiceReportMaxAggregateInputType
  }

  export type ServiceReportGroupByOutputType = {
    id: string
    tenantId: string
    visitDate: Date
    technician: string | null
    jobIds: string[]
    pdfUrl: string
    createdAt: Date
    _count: ServiceReportCountAggregateOutputType | null
    _min: ServiceReportMinAggregateOutputType | null
    _max: ServiceReportMaxAggregateOutputType | null
  }

  type GetServiceReportGroupByPayload<T extends ServiceReportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ServiceReportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ServiceReportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ServiceReportGroupByOutputType[P]>
            : GetScalarType<T[P], ServiceReportGroupByOutputType[P]>
        }
      >
    >


  export type ServiceReportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    visitDate?: boolean
    technician?: boolean
    jobIds?: boolean
    pdfUrl?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["serviceReport"]>

  export type ServiceReportSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    visitDate?: boolean
    technician?: boolean
    jobIds?: boolean
    pdfUrl?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["serviceReport"]>

  export type ServiceReportSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    visitDate?: boolean
    technician?: boolean
    jobIds?: boolean
    pdfUrl?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["serviceReport"]>

  export type ServiceReportSelectScalar = {
    id?: boolean
    tenantId?: boolean
    visitDate?: boolean
    technician?: boolean
    jobIds?: boolean
    pdfUrl?: boolean
    createdAt?: boolean
  }

  export type ServiceReportOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "visitDate" | "technician" | "jobIds" | "pdfUrl" | "createdAt", ExtArgs["result"]["serviceReport"]>
  export type ServiceReportInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type ServiceReportIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type ServiceReportIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $ServiceReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ServiceReport"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      visitDate: Date
      technician: string | null
      jobIds: string[]
      pdfUrl: string
      createdAt: Date
    }, ExtArgs["result"]["serviceReport"]>
    composites: {}
  }

  type ServiceReportGetPayload<S extends boolean | null | undefined | ServiceReportDefaultArgs> = $Result.GetResult<Prisma.$ServiceReportPayload, S>

  type ServiceReportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ServiceReportFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ServiceReportCountAggregateInputType | true
    }

  export interface ServiceReportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ServiceReport'], meta: { name: 'ServiceReport' } }
    /**
     * Find zero or one ServiceReport that matches the filter.
     * @param {ServiceReportFindUniqueArgs} args - Arguments to find a ServiceReport
     * @example
     * // Get one ServiceReport
     * const serviceReport = await prisma.serviceReport.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ServiceReportFindUniqueArgs>(args: SelectSubset<T, ServiceReportFindUniqueArgs<ExtArgs>>): Prisma__ServiceReportClient<$Result.GetResult<Prisma.$ServiceReportPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ServiceReport that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ServiceReportFindUniqueOrThrowArgs} args - Arguments to find a ServiceReport
     * @example
     * // Get one ServiceReport
     * const serviceReport = await prisma.serviceReport.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ServiceReportFindUniqueOrThrowArgs>(args: SelectSubset<T, ServiceReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ServiceReportClient<$Result.GetResult<Prisma.$ServiceReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ServiceReport that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceReportFindFirstArgs} args - Arguments to find a ServiceReport
     * @example
     * // Get one ServiceReport
     * const serviceReport = await prisma.serviceReport.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ServiceReportFindFirstArgs>(args?: SelectSubset<T, ServiceReportFindFirstArgs<ExtArgs>>): Prisma__ServiceReportClient<$Result.GetResult<Prisma.$ServiceReportPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ServiceReport that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceReportFindFirstOrThrowArgs} args - Arguments to find a ServiceReport
     * @example
     * // Get one ServiceReport
     * const serviceReport = await prisma.serviceReport.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ServiceReportFindFirstOrThrowArgs>(args?: SelectSubset<T, ServiceReportFindFirstOrThrowArgs<ExtArgs>>): Prisma__ServiceReportClient<$Result.GetResult<Prisma.$ServiceReportPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ServiceReports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceReportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ServiceReports
     * const serviceReports = await prisma.serviceReport.findMany()
     * 
     * // Get first 10 ServiceReports
     * const serviceReports = await prisma.serviceReport.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const serviceReportWithIdOnly = await prisma.serviceReport.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ServiceReportFindManyArgs>(args?: SelectSubset<T, ServiceReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServiceReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ServiceReport.
     * @param {ServiceReportCreateArgs} args - Arguments to create a ServiceReport.
     * @example
     * // Create one ServiceReport
     * const ServiceReport = await prisma.serviceReport.create({
     *   data: {
     *     // ... data to create a ServiceReport
     *   }
     * })
     * 
     */
    create<T extends ServiceReportCreateArgs>(args: SelectSubset<T, ServiceReportCreateArgs<ExtArgs>>): Prisma__ServiceReportClient<$Result.GetResult<Prisma.$ServiceReportPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ServiceReports.
     * @param {ServiceReportCreateManyArgs} args - Arguments to create many ServiceReports.
     * @example
     * // Create many ServiceReports
     * const serviceReport = await prisma.serviceReport.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ServiceReportCreateManyArgs>(args?: SelectSubset<T, ServiceReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ServiceReports and returns the data saved in the database.
     * @param {ServiceReportCreateManyAndReturnArgs} args - Arguments to create many ServiceReports.
     * @example
     * // Create many ServiceReports
     * const serviceReport = await prisma.serviceReport.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ServiceReports and only return the `id`
     * const serviceReportWithIdOnly = await prisma.serviceReport.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ServiceReportCreateManyAndReturnArgs>(args?: SelectSubset<T, ServiceReportCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServiceReportPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ServiceReport.
     * @param {ServiceReportDeleteArgs} args - Arguments to delete one ServiceReport.
     * @example
     * // Delete one ServiceReport
     * const ServiceReport = await prisma.serviceReport.delete({
     *   where: {
     *     // ... filter to delete one ServiceReport
     *   }
     * })
     * 
     */
    delete<T extends ServiceReportDeleteArgs>(args: SelectSubset<T, ServiceReportDeleteArgs<ExtArgs>>): Prisma__ServiceReportClient<$Result.GetResult<Prisma.$ServiceReportPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ServiceReport.
     * @param {ServiceReportUpdateArgs} args - Arguments to update one ServiceReport.
     * @example
     * // Update one ServiceReport
     * const serviceReport = await prisma.serviceReport.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ServiceReportUpdateArgs>(args: SelectSubset<T, ServiceReportUpdateArgs<ExtArgs>>): Prisma__ServiceReportClient<$Result.GetResult<Prisma.$ServiceReportPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ServiceReports.
     * @param {ServiceReportDeleteManyArgs} args - Arguments to filter ServiceReports to delete.
     * @example
     * // Delete a few ServiceReports
     * const { count } = await prisma.serviceReport.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ServiceReportDeleteManyArgs>(args?: SelectSubset<T, ServiceReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ServiceReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceReportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ServiceReports
     * const serviceReport = await prisma.serviceReport.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ServiceReportUpdateManyArgs>(args: SelectSubset<T, ServiceReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ServiceReports and returns the data updated in the database.
     * @param {ServiceReportUpdateManyAndReturnArgs} args - Arguments to update many ServiceReports.
     * @example
     * // Update many ServiceReports
     * const serviceReport = await prisma.serviceReport.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ServiceReports and only return the `id`
     * const serviceReportWithIdOnly = await prisma.serviceReport.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ServiceReportUpdateManyAndReturnArgs>(args: SelectSubset<T, ServiceReportUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServiceReportPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ServiceReport.
     * @param {ServiceReportUpsertArgs} args - Arguments to update or create a ServiceReport.
     * @example
     * // Update or create a ServiceReport
     * const serviceReport = await prisma.serviceReport.upsert({
     *   create: {
     *     // ... data to create a ServiceReport
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ServiceReport we want to update
     *   }
     * })
     */
    upsert<T extends ServiceReportUpsertArgs>(args: SelectSubset<T, ServiceReportUpsertArgs<ExtArgs>>): Prisma__ServiceReportClient<$Result.GetResult<Prisma.$ServiceReportPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ServiceReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceReportCountArgs} args - Arguments to filter ServiceReports to count.
     * @example
     * // Count the number of ServiceReports
     * const count = await prisma.serviceReport.count({
     *   where: {
     *     // ... the filter for the ServiceReports we want to count
     *   }
     * })
    **/
    count<T extends ServiceReportCountArgs>(
      args?: Subset<T, ServiceReportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ServiceReportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ServiceReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceReportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ServiceReportAggregateArgs>(args: Subset<T, ServiceReportAggregateArgs>): Prisma.PrismaPromise<GetServiceReportAggregateType<T>>

    /**
     * Group by ServiceReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceReportGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ServiceReportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ServiceReportGroupByArgs['orderBy'] }
        : { orderBy?: ServiceReportGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ServiceReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetServiceReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ServiceReport model
   */
  readonly fields: ServiceReportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ServiceReport.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ServiceReportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ServiceReport model
   */
  interface ServiceReportFieldRefs {
    readonly id: FieldRef<"ServiceReport", 'String'>
    readonly tenantId: FieldRef<"ServiceReport", 'String'>
    readonly visitDate: FieldRef<"ServiceReport", 'DateTime'>
    readonly technician: FieldRef<"ServiceReport", 'String'>
    readonly jobIds: FieldRef<"ServiceReport", 'String[]'>
    readonly pdfUrl: FieldRef<"ServiceReport", 'String'>
    readonly createdAt: FieldRef<"ServiceReport", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ServiceReport findUnique
   */
  export type ServiceReportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceReport
     */
    select?: ServiceReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceReport
     */
    omit?: ServiceReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceReportInclude<ExtArgs> | null
    /**
     * Filter, which ServiceReport to fetch.
     */
    where: ServiceReportWhereUniqueInput
  }

  /**
   * ServiceReport findUniqueOrThrow
   */
  export type ServiceReportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceReport
     */
    select?: ServiceReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceReport
     */
    omit?: ServiceReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceReportInclude<ExtArgs> | null
    /**
     * Filter, which ServiceReport to fetch.
     */
    where: ServiceReportWhereUniqueInput
  }

  /**
   * ServiceReport findFirst
   */
  export type ServiceReportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceReport
     */
    select?: ServiceReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceReport
     */
    omit?: ServiceReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceReportInclude<ExtArgs> | null
    /**
     * Filter, which ServiceReport to fetch.
     */
    where?: ServiceReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServiceReports to fetch.
     */
    orderBy?: ServiceReportOrderByWithRelationInput | ServiceReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ServiceReports.
     */
    cursor?: ServiceReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServiceReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServiceReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ServiceReports.
     */
    distinct?: ServiceReportScalarFieldEnum | ServiceReportScalarFieldEnum[]
  }

  /**
   * ServiceReport findFirstOrThrow
   */
  export type ServiceReportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceReport
     */
    select?: ServiceReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceReport
     */
    omit?: ServiceReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceReportInclude<ExtArgs> | null
    /**
     * Filter, which ServiceReport to fetch.
     */
    where?: ServiceReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServiceReports to fetch.
     */
    orderBy?: ServiceReportOrderByWithRelationInput | ServiceReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ServiceReports.
     */
    cursor?: ServiceReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServiceReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServiceReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ServiceReports.
     */
    distinct?: ServiceReportScalarFieldEnum | ServiceReportScalarFieldEnum[]
  }

  /**
   * ServiceReport findMany
   */
  export type ServiceReportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceReport
     */
    select?: ServiceReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceReport
     */
    omit?: ServiceReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceReportInclude<ExtArgs> | null
    /**
     * Filter, which ServiceReports to fetch.
     */
    where?: ServiceReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServiceReports to fetch.
     */
    orderBy?: ServiceReportOrderByWithRelationInput | ServiceReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ServiceReports.
     */
    cursor?: ServiceReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServiceReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServiceReports.
     */
    skip?: number
    distinct?: ServiceReportScalarFieldEnum | ServiceReportScalarFieldEnum[]
  }

  /**
   * ServiceReport create
   */
  export type ServiceReportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceReport
     */
    select?: ServiceReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceReport
     */
    omit?: ServiceReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceReportInclude<ExtArgs> | null
    /**
     * The data needed to create a ServiceReport.
     */
    data: XOR<ServiceReportCreateInput, ServiceReportUncheckedCreateInput>
  }

  /**
   * ServiceReport createMany
   */
  export type ServiceReportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ServiceReports.
     */
    data: ServiceReportCreateManyInput | ServiceReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ServiceReport createManyAndReturn
   */
  export type ServiceReportCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceReport
     */
    select?: ServiceReportSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceReport
     */
    omit?: ServiceReportOmit<ExtArgs> | null
    /**
     * The data used to create many ServiceReports.
     */
    data: ServiceReportCreateManyInput | ServiceReportCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceReportIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ServiceReport update
   */
  export type ServiceReportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceReport
     */
    select?: ServiceReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceReport
     */
    omit?: ServiceReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceReportInclude<ExtArgs> | null
    /**
     * The data needed to update a ServiceReport.
     */
    data: XOR<ServiceReportUpdateInput, ServiceReportUncheckedUpdateInput>
    /**
     * Choose, which ServiceReport to update.
     */
    where: ServiceReportWhereUniqueInput
  }

  /**
   * ServiceReport updateMany
   */
  export type ServiceReportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ServiceReports.
     */
    data: XOR<ServiceReportUpdateManyMutationInput, ServiceReportUncheckedUpdateManyInput>
    /**
     * Filter which ServiceReports to update
     */
    where?: ServiceReportWhereInput
    /**
     * Limit how many ServiceReports to update.
     */
    limit?: number
  }

  /**
   * ServiceReport updateManyAndReturn
   */
  export type ServiceReportUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceReport
     */
    select?: ServiceReportSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceReport
     */
    omit?: ServiceReportOmit<ExtArgs> | null
    /**
     * The data used to update ServiceReports.
     */
    data: XOR<ServiceReportUpdateManyMutationInput, ServiceReportUncheckedUpdateManyInput>
    /**
     * Filter which ServiceReports to update
     */
    where?: ServiceReportWhereInput
    /**
     * Limit how many ServiceReports to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceReportIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ServiceReport upsert
   */
  export type ServiceReportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceReport
     */
    select?: ServiceReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceReport
     */
    omit?: ServiceReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceReportInclude<ExtArgs> | null
    /**
     * The filter to search for the ServiceReport to update in case it exists.
     */
    where: ServiceReportWhereUniqueInput
    /**
     * In case the ServiceReport found by the `where` argument doesn't exist, create a new ServiceReport with this data.
     */
    create: XOR<ServiceReportCreateInput, ServiceReportUncheckedCreateInput>
    /**
     * In case the ServiceReport was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ServiceReportUpdateInput, ServiceReportUncheckedUpdateInput>
  }

  /**
   * ServiceReport delete
   */
  export type ServiceReportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceReport
     */
    select?: ServiceReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceReport
     */
    omit?: ServiceReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceReportInclude<ExtArgs> | null
    /**
     * Filter which ServiceReport to delete.
     */
    where: ServiceReportWhereUniqueInput
  }

  /**
   * ServiceReport deleteMany
   */
  export type ServiceReportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ServiceReports to delete
     */
    where?: ServiceReportWhereInput
    /**
     * Limit how many ServiceReports to delete.
     */
    limit?: number
  }

  /**
   * ServiceReport without action
   */
  export type ServiceReportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceReport
     */
    select?: ServiceReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ServiceReport
     */
    omit?: ServiceReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceReportInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TenantScalarFieldEnum: {
    id: 'id',
    companyName: 'companyName',
    subdomain: 'subdomain',
    logoUrl: 'logoUrl',
    subscriptionPlan: 'subscriptionPlan',
    subscriptionStatus: 'subscriptionStatus',
    createdAt: 'createdAt'
  };

  export type TenantScalarFieldEnum = (typeof TenantScalarFieldEnum)[keyof typeof TenantScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    name: 'name',
    email: 'email',
    passwordHash: 'passwordHash',
    role: 'role',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ExtinguisherScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    externalId: 'externalId',
    location: 'location',
    building: 'building',
    floor: 'floor',
    type: 'type',
    capacity: 'capacity',
    manufacturer: 'manufacturer',
    model: 'model',
    serialNumber: 'serialNumber',
    installDate: 'installDate',
    expiryDate: 'expiryDate',
    lastInspection: 'lastInspection',
    nextInspection: 'nextInspection',
    lastMaintenance: 'lastMaintenance',
    nextMaintenance: 'nextMaintenance',
    status: 'status',
    condition: 'condition',
    serviceType: 'serviceType',
    inspector: 'inspector',
    notes: 'notes',
    createdAt: 'createdAt'
  };

  export type ExtinguisherScalarFieldEnum = (typeof ExtinguisherScalarFieldEnum)[keyof typeof ExtinguisherScalarFieldEnum]


  export const InspectionScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    extinguisherId: 'extinguisherId',
    serviceDate: 'serviceDate',
    serviceType: 'serviceType',
    technician: 'technician',
    condition: 'condition',
    notes: 'notes',
    partsReplaced: 'partsReplaced',
    nextServiceDate: 'nextServiceDate',
    createdAt: 'createdAt'
  };

  export type InspectionScalarFieldEnum = (typeof InspectionScalarFieldEnum)[keyof typeof InspectionScalarFieldEnum]


  export const SubscriptionScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    stripeCustomerId: 'stripeCustomerId',
    stripeSubscriptionId: 'stripeSubscriptionId',
    plan: 'plan',
    status: 'status',
    currentPeriodStart: 'currentPeriodStart',
    currentPeriodEnd: 'currentPeriodEnd',
    trialEnd: 'trialEnd',
    createdAt: 'createdAt'
  };

  export type SubscriptionScalarFieldEnum = (typeof SubscriptionScalarFieldEnum)[keyof typeof SubscriptionScalarFieldEnum]


  export const InvoiceScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    stripeInvoiceId: 'stripeInvoiceId',
    amount: 'amount',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type InvoiceScalarFieldEnum = (typeof InvoiceScalarFieldEnum)[keyof typeof InvoiceScalarFieldEnum]


  export const ServiceJobScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    extinguisherId: 'extinguisherId',
    location: 'location',
    building: 'building',
    type: 'type',
    serviceType: 'serviceType',
    status: 'status',
    notes: 'notes',
    scheduledDate: 'scheduledDate',
    completedDate: 'completedDate',
    technician: 'technician',
    createdAt: 'createdAt'
  };

  export type ServiceJobScalarFieldEnum = (typeof ServiceJobScalarFieldEnum)[keyof typeof ServiceJobScalarFieldEnum]


  export const InspectionPhotoScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    extinguisherId: 'extinguisherId',
    inspectionId: 'inspectionId',
    photoUrl: 'photoUrl',
    caption: 'caption',
    uploadedBy: 'uploadedBy',
    createdAt: 'createdAt'
  };

  export type InspectionPhotoScalarFieldEnum = (typeof InspectionPhotoScalarFieldEnum)[keyof typeof InspectionPhotoScalarFieldEnum]


  export const ServiceReportScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    visitDate: 'visitDate',
    technician: 'technician',
    jobIds: 'jobIds',
    pdfUrl: 'pdfUrl',
    createdAt: 'createdAt'
  };

  export type ServiceReportScalarFieldEnum = (typeof ServiceReportScalarFieldEnum)[keyof typeof ServiceReportScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type TenantWhereInput = {
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    id?: StringFilter<"Tenant"> | string
    companyName?: StringFilter<"Tenant"> | string
    subdomain?: StringFilter<"Tenant"> | string
    logoUrl?: StringNullableFilter<"Tenant"> | string | null
    subscriptionPlan?: StringFilter<"Tenant"> | string
    subscriptionStatus?: StringFilter<"Tenant"> | string
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    users?: UserListRelationFilter
    extinguishers?: ExtinguisherListRelationFilter
    inspections?: InspectionListRelationFilter
    subscriptions?: SubscriptionListRelationFilter
    invoices?: InvoiceListRelationFilter
    serviceJobs?: ServiceJobListRelationFilter
    inspectionPhotos?: InspectionPhotoListRelationFilter
    serviceReports?: ServiceReportListRelationFilter
  }

  export type TenantOrderByWithRelationInput = {
    id?: SortOrder
    companyName?: SortOrder
    subdomain?: SortOrder
    logoUrl?: SortOrderInput | SortOrder
    subscriptionPlan?: SortOrder
    subscriptionStatus?: SortOrder
    createdAt?: SortOrder
    users?: UserOrderByRelationAggregateInput
    extinguishers?: ExtinguisherOrderByRelationAggregateInput
    inspections?: InspectionOrderByRelationAggregateInput
    subscriptions?: SubscriptionOrderByRelationAggregateInput
    invoices?: InvoiceOrderByRelationAggregateInput
    serviceJobs?: ServiceJobOrderByRelationAggregateInput
    inspectionPhotos?: InspectionPhotoOrderByRelationAggregateInput
    serviceReports?: ServiceReportOrderByRelationAggregateInput
  }

  export type TenantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    subdomain?: string
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    companyName?: StringFilter<"Tenant"> | string
    logoUrl?: StringNullableFilter<"Tenant"> | string | null
    subscriptionPlan?: StringFilter<"Tenant"> | string
    subscriptionStatus?: StringFilter<"Tenant"> | string
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    users?: UserListRelationFilter
    extinguishers?: ExtinguisherListRelationFilter
    inspections?: InspectionListRelationFilter
    subscriptions?: SubscriptionListRelationFilter
    invoices?: InvoiceListRelationFilter
    serviceJobs?: ServiceJobListRelationFilter
    inspectionPhotos?: InspectionPhotoListRelationFilter
    serviceReports?: ServiceReportListRelationFilter
  }, "id" | "subdomain">

  export type TenantOrderByWithAggregationInput = {
    id?: SortOrder
    companyName?: SortOrder
    subdomain?: SortOrder
    logoUrl?: SortOrderInput | SortOrder
    subscriptionPlan?: SortOrder
    subscriptionStatus?: SortOrder
    createdAt?: SortOrder
    _count?: TenantCountOrderByAggregateInput
    _max?: TenantMaxOrderByAggregateInput
    _min?: TenantMinOrderByAggregateInput
  }

  export type TenantScalarWhereWithAggregatesInput = {
    AND?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    OR?: TenantScalarWhereWithAggregatesInput[]
    NOT?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tenant"> | string
    companyName?: StringWithAggregatesFilter<"Tenant"> | string
    subdomain?: StringWithAggregatesFilter<"Tenant"> | string
    logoUrl?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    subscriptionPlan?: StringWithAggregatesFilter<"Tenant"> | string
    subscriptionStatus?: StringWithAggregatesFilter<"Tenant"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    tenantId?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    status?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    tenantId?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    status?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    tenantId?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    status?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type ExtinguisherWhereInput = {
    AND?: ExtinguisherWhereInput | ExtinguisherWhereInput[]
    OR?: ExtinguisherWhereInput[]
    NOT?: ExtinguisherWhereInput | ExtinguisherWhereInput[]
    id?: StringFilter<"Extinguisher"> | string
    tenantId?: StringFilter<"Extinguisher"> | string
    externalId?: StringNullableFilter<"Extinguisher"> | string | null
    location?: StringFilter<"Extinguisher"> | string
    building?: StringFilter<"Extinguisher"> | string
    floor?: StringNullableFilter<"Extinguisher"> | string | null
    type?: StringFilter<"Extinguisher"> | string
    capacity?: StringNullableFilter<"Extinguisher"> | string | null
    manufacturer?: StringNullableFilter<"Extinguisher"> | string | null
    model?: StringNullableFilter<"Extinguisher"> | string | null
    serialNumber?: StringNullableFilter<"Extinguisher"> | string | null
    installDate?: DateTimeNullableFilter<"Extinguisher"> | Date | string | null
    expiryDate?: DateTimeNullableFilter<"Extinguisher"> | Date | string | null
    lastInspection?: DateTimeNullableFilter<"Extinguisher"> | Date | string | null
    nextInspection?: DateTimeNullableFilter<"Extinguisher"> | Date | string | null
    lastMaintenance?: DateTimeNullableFilter<"Extinguisher"> | Date | string | null
    nextMaintenance?: DateTimeNullableFilter<"Extinguisher"> | Date | string | null
    status?: StringFilter<"Extinguisher"> | string
    condition?: StringFilter<"Extinguisher"> | string
    serviceType?: StringNullableFilter<"Extinguisher"> | string | null
    inspector?: StringNullableFilter<"Extinguisher"> | string | null
    notes?: StringNullableFilter<"Extinguisher"> | string | null
    createdAt?: DateTimeFilter<"Extinguisher"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    inspections?: InspectionListRelationFilter
  }

  export type ExtinguisherOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    externalId?: SortOrderInput | SortOrder
    location?: SortOrder
    building?: SortOrder
    floor?: SortOrderInput | SortOrder
    type?: SortOrder
    capacity?: SortOrderInput | SortOrder
    manufacturer?: SortOrderInput | SortOrder
    model?: SortOrderInput | SortOrder
    serialNumber?: SortOrderInput | SortOrder
    installDate?: SortOrderInput | SortOrder
    expiryDate?: SortOrderInput | SortOrder
    lastInspection?: SortOrderInput | SortOrder
    nextInspection?: SortOrderInput | SortOrder
    lastMaintenance?: SortOrderInput | SortOrder
    nextMaintenance?: SortOrderInput | SortOrder
    status?: SortOrder
    condition?: SortOrder
    serviceType?: SortOrderInput | SortOrder
    inspector?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    inspections?: InspectionOrderByRelationAggregateInput
  }

  export type ExtinguisherWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExtinguisherWhereInput | ExtinguisherWhereInput[]
    OR?: ExtinguisherWhereInput[]
    NOT?: ExtinguisherWhereInput | ExtinguisherWhereInput[]
    tenantId?: StringFilter<"Extinguisher"> | string
    externalId?: StringNullableFilter<"Extinguisher"> | string | null
    location?: StringFilter<"Extinguisher"> | string
    building?: StringFilter<"Extinguisher"> | string
    floor?: StringNullableFilter<"Extinguisher"> | string | null
    type?: StringFilter<"Extinguisher"> | string
    capacity?: StringNullableFilter<"Extinguisher"> | string | null
    manufacturer?: StringNullableFilter<"Extinguisher"> | string | null
    model?: StringNullableFilter<"Extinguisher"> | string | null
    serialNumber?: StringNullableFilter<"Extinguisher"> | string | null
    installDate?: DateTimeNullableFilter<"Extinguisher"> | Date | string | null
    expiryDate?: DateTimeNullableFilter<"Extinguisher"> | Date | string | null
    lastInspection?: DateTimeNullableFilter<"Extinguisher"> | Date | string | null
    nextInspection?: DateTimeNullableFilter<"Extinguisher"> | Date | string | null
    lastMaintenance?: DateTimeNullableFilter<"Extinguisher"> | Date | string | null
    nextMaintenance?: DateTimeNullableFilter<"Extinguisher"> | Date | string | null
    status?: StringFilter<"Extinguisher"> | string
    condition?: StringFilter<"Extinguisher"> | string
    serviceType?: StringNullableFilter<"Extinguisher"> | string | null
    inspector?: StringNullableFilter<"Extinguisher"> | string | null
    notes?: StringNullableFilter<"Extinguisher"> | string | null
    createdAt?: DateTimeFilter<"Extinguisher"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    inspections?: InspectionListRelationFilter
  }, "id">

  export type ExtinguisherOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    externalId?: SortOrderInput | SortOrder
    location?: SortOrder
    building?: SortOrder
    floor?: SortOrderInput | SortOrder
    type?: SortOrder
    capacity?: SortOrderInput | SortOrder
    manufacturer?: SortOrderInput | SortOrder
    model?: SortOrderInput | SortOrder
    serialNumber?: SortOrderInput | SortOrder
    installDate?: SortOrderInput | SortOrder
    expiryDate?: SortOrderInput | SortOrder
    lastInspection?: SortOrderInput | SortOrder
    nextInspection?: SortOrderInput | SortOrder
    lastMaintenance?: SortOrderInput | SortOrder
    nextMaintenance?: SortOrderInput | SortOrder
    status?: SortOrder
    condition?: SortOrder
    serviceType?: SortOrderInput | SortOrder
    inspector?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ExtinguisherCountOrderByAggregateInput
    _max?: ExtinguisherMaxOrderByAggregateInput
    _min?: ExtinguisherMinOrderByAggregateInput
  }

  export type ExtinguisherScalarWhereWithAggregatesInput = {
    AND?: ExtinguisherScalarWhereWithAggregatesInput | ExtinguisherScalarWhereWithAggregatesInput[]
    OR?: ExtinguisherScalarWhereWithAggregatesInput[]
    NOT?: ExtinguisherScalarWhereWithAggregatesInput | ExtinguisherScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Extinguisher"> | string
    tenantId?: StringWithAggregatesFilter<"Extinguisher"> | string
    externalId?: StringNullableWithAggregatesFilter<"Extinguisher"> | string | null
    location?: StringWithAggregatesFilter<"Extinguisher"> | string
    building?: StringWithAggregatesFilter<"Extinguisher"> | string
    floor?: StringNullableWithAggregatesFilter<"Extinguisher"> | string | null
    type?: StringWithAggregatesFilter<"Extinguisher"> | string
    capacity?: StringNullableWithAggregatesFilter<"Extinguisher"> | string | null
    manufacturer?: StringNullableWithAggregatesFilter<"Extinguisher"> | string | null
    model?: StringNullableWithAggregatesFilter<"Extinguisher"> | string | null
    serialNumber?: StringNullableWithAggregatesFilter<"Extinguisher"> | string | null
    installDate?: DateTimeNullableWithAggregatesFilter<"Extinguisher"> | Date | string | null
    expiryDate?: DateTimeNullableWithAggregatesFilter<"Extinguisher"> | Date | string | null
    lastInspection?: DateTimeNullableWithAggregatesFilter<"Extinguisher"> | Date | string | null
    nextInspection?: DateTimeNullableWithAggregatesFilter<"Extinguisher"> | Date | string | null
    lastMaintenance?: DateTimeNullableWithAggregatesFilter<"Extinguisher"> | Date | string | null
    nextMaintenance?: DateTimeNullableWithAggregatesFilter<"Extinguisher"> | Date | string | null
    status?: StringWithAggregatesFilter<"Extinguisher"> | string
    condition?: StringWithAggregatesFilter<"Extinguisher"> | string
    serviceType?: StringNullableWithAggregatesFilter<"Extinguisher"> | string | null
    inspector?: StringNullableWithAggregatesFilter<"Extinguisher"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Extinguisher"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Extinguisher"> | Date | string
  }

  export type InspectionWhereInput = {
    AND?: InspectionWhereInput | InspectionWhereInput[]
    OR?: InspectionWhereInput[]
    NOT?: InspectionWhereInput | InspectionWhereInput[]
    id?: StringFilter<"Inspection"> | string
    tenantId?: StringFilter<"Inspection"> | string
    extinguisherId?: StringFilter<"Inspection"> | string
    serviceDate?: DateTimeFilter<"Inspection"> | Date | string
    serviceType?: StringFilter<"Inspection"> | string
    technician?: StringNullableFilter<"Inspection"> | string | null
    condition?: StringFilter<"Inspection"> | string
    notes?: StringNullableFilter<"Inspection"> | string | null
    partsReplaced?: StringNullableFilter<"Inspection"> | string | null
    nextServiceDate?: DateTimeNullableFilter<"Inspection"> | Date | string | null
    createdAt?: DateTimeFilter<"Inspection"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    extinguisher?: XOR<ExtinguisherScalarRelationFilter, ExtinguisherWhereInput>
  }

  export type InspectionOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    extinguisherId?: SortOrder
    serviceDate?: SortOrder
    serviceType?: SortOrder
    technician?: SortOrderInput | SortOrder
    condition?: SortOrder
    notes?: SortOrderInput | SortOrder
    partsReplaced?: SortOrderInput | SortOrder
    nextServiceDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    extinguisher?: ExtinguisherOrderByWithRelationInput
  }

  export type InspectionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InspectionWhereInput | InspectionWhereInput[]
    OR?: InspectionWhereInput[]
    NOT?: InspectionWhereInput | InspectionWhereInput[]
    tenantId?: StringFilter<"Inspection"> | string
    extinguisherId?: StringFilter<"Inspection"> | string
    serviceDate?: DateTimeFilter<"Inspection"> | Date | string
    serviceType?: StringFilter<"Inspection"> | string
    technician?: StringNullableFilter<"Inspection"> | string | null
    condition?: StringFilter<"Inspection"> | string
    notes?: StringNullableFilter<"Inspection"> | string | null
    partsReplaced?: StringNullableFilter<"Inspection"> | string | null
    nextServiceDate?: DateTimeNullableFilter<"Inspection"> | Date | string | null
    createdAt?: DateTimeFilter<"Inspection"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    extinguisher?: XOR<ExtinguisherScalarRelationFilter, ExtinguisherWhereInput>
  }, "id">

  export type InspectionOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    extinguisherId?: SortOrder
    serviceDate?: SortOrder
    serviceType?: SortOrder
    technician?: SortOrderInput | SortOrder
    condition?: SortOrder
    notes?: SortOrderInput | SortOrder
    partsReplaced?: SortOrderInput | SortOrder
    nextServiceDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: InspectionCountOrderByAggregateInput
    _max?: InspectionMaxOrderByAggregateInput
    _min?: InspectionMinOrderByAggregateInput
  }

  export type InspectionScalarWhereWithAggregatesInput = {
    AND?: InspectionScalarWhereWithAggregatesInput | InspectionScalarWhereWithAggregatesInput[]
    OR?: InspectionScalarWhereWithAggregatesInput[]
    NOT?: InspectionScalarWhereWithAggregatesInput | InspectionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Inspection"> | string
    tenantId?: StringWithAggregatesFilter<"Inspection"> | string
    extinguisherId?: StringWithAggregatesFilter<"Inspection"> | string
    serviceDate?: DateTimeWithAggregatesFilter<"Inspection"> | Date | string
    serviceType?: StringWithAggregatesFilter<"Inspection"> | string
    technician?: StringNullableWithAggregatesFilter<"Inspection"> | string | null
    condition?: StringWithAggregatesFilter<"Inspection"> | string
    notes?: StringNullableWithAggregatesFilter<"Inspection"> | string | null
    partsReplaced?: StringNullableWithAggregatesFilter<"Inspection"> | string | null
    nextServiceDate?: DateTimeNullableWithAggregatesFilter<"Inspection"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Inspection"> | Date | string
  }

  export type SubscriptionWhereInput = {
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    id?: StringFilter<"Subscription"> | string
    tenantId?: StringFilter<"Subscription"> | string
    stripeCustomerId?: StringNullableFilter<"Subscription"> | string | null
    stripeSubscriptionId?: StringNullableFilter<"Subscription"> | string | null
    plan?: StringFilter<"Subscription"> | string
    status?: StringFilter<"Subscription"> | string
    currentPeriodStart?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    currentPeriodEnd?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    trialEnd?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type SubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    stripeSubscriptionId?: SortOrderInput | SortOrder
    plan?: SortOrder
    status?: SortOrder
    currentPeriodStart?: SortOrderInput | SortOrder
    currentPeriodEnd?: SortOrderInput | SortOrder
    trialEnd?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type SubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    tenantId?: StringFilter<"Subscription"> | string
    stripeCustomerId?: StringNullableFilter<"Subscription"> | string | null
    stripeSubscriptionId?: StringNullableFilter<"Subscription"> | string | null
    plan?: StringFilter<"Subscription"> | string
    status?: StringFilter<"Subscription"> | string
    currentPeriodStart?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    currentPeriodEnd?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    trialEnd?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id">

  export type SubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    stripeSubscriptionId?: SortOrderInput | SortOrder
    plan?: SortOrder
    status?: SortOrder
    currentPeriodStart?: SortOrderInput | SortOrder
    currentPeriodEnd?: SortOrderInput | SortOrder
    trialEnd?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: SubscriptionCountOrderByAggregateInput
    _max?: SubscriptionMaxOrderByAggregateInput
    _min?: SubscriptionMinOrderByAggregateInput
  }

  export type SubscriptionScalarWhereWithAggregatesInput = {
    AND?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    OR?: SubscriptionScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Subscription"> | string
    tenantId?: StringWithAggregatesFilter<"Subscription"> | string
    stripeCustomerId?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    stripeSubscriptionId?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    plan?: StringWithAggregatesFilter<"Subscription"> | string
    status?: StringWithAggregatesFilter<"Subscription"> | string
    currentPeriodStart?: DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null
    currentPeriodEnd?: DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null
    trialEnd?: DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
  }

  export type InvoiceWhereInput = {
    AND?: InvoiceWhereInput | InvoiceWhereInput[]
    OR?: InvoiceWhereInput[]
    NOT?: InvoiceWhereInput | InvoiceWhereInput[]
    id?: StringFilter<"Invoice"> | string
    tenantId?: StringFilter<"Invoice"> | string
    stripeInvoiceId?: StringNullableFilter<"Invoice"> | string | null
    amount?: IntFilter<"Invoice"> | number
    status?: StringFilter<"Invoice"> | string
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type InvoiceOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    stripeInvoiceId?: SortOrderInput | SortOrder
    amount?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type InvoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InvoiceWhereInput | InvoiceWhereInput[]
    OR?: InvoiceWhereInput[]
    NOT?: InvoiceWhereInput | InvoiceWhereInput[]
    tenantId?: StringFilter<"Invoice"> | string
    stripeInvoiceId?: StringNullableFilter<"Invoice"> | string | null
    amount?: IntFilter<"Invoice"> | number
    status?: StringFilter<"Invoice"> | string
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id">

  export type InvoiceOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    stripeInvoiceId?: SortOrderInput | SortOrder
    amount?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: InvoiceCountOrderByAggregateInput
    _avg?: InvoiceAvgOrderByAggregateInput
    _max?: InvoiceMaxOrderByAggregateInput
    _min?: InvoiceMinOrderByAggregateInput
    _sum?: InvoiceSumOrderByAggregateInput
  }

  export type InvoiceScalarWhereWithAggregatesInput = {
    AND?: InvoiceScalarWhereWithAggregatesInput | InvoiceScalarWhereWithAggregatesInput[]
    OR?: InvoiceScalarWhereWithAggregatesInput[]
    NOT?: InvoiceScalarWhereWithAggregatesInput | InvoiceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Invoice"> | string
    tenantId?: StringWithAggregatesFilter<"Invoice"> | string
    stripeInvoiceId?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    amount?: IntWithAggregatesFilter<"Invoice"> | number
    status?: StringWithAggregatesFilter<"Invoice"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
  }

  export type ServiceJobWhereInput = {
    AND?: ServiceJobWhereInput | ServiceJobWhereInput[]
    OR?: ServiceJobWhereInput[]
    NOT?: ServiceJobWhereInput | ServiceJobWhereInput[]
    id?: StringFilter<"ServiceJob"> | string
    tenantId?: StringFilter<"ServiceJob"> | string
    extinguisherId?: StringNullableFilter<"ServiceJob"> | string | null
    location?: StringFilter<"ServiceJob"> | string
    building?: StringFilter<"ServiceJob"> | string
    type?: StringFilter<"ServiceJob"> | string
    serviceType?: StringFilter<"ServiceJob"> | string
    status?: StringFilter<"ServiceJob"> | string
    notes?: StringNullableFilter<"ServiceJob"> | string | null
    scheduledDate?: DateTimeNullableFilter<"ServiceJob"> | Date | string | null
    completedDate?: DateTimeNullableFilter<"ServiceJob"> | Date | string | null
    technician?: StringNullableFilter<"ServiceJob"> | string | null
    createdAt?: DateTimeFilter<"ServiceJob"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type ServiceJobOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    extinguisherId?: SortOrderInput | SortOrder
    location?: SortOrder
    building?: SortOrder
    type?: SortOrder
    serviceType?: SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    scheduledDate?: SortOrderInput | SortOrder
    completedDate?: SortOrderInput | SortOrder
    technician?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type ServiceJobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ServiceJobWhereInput | ServiceJobWhereInput[]
    OR?: ServiceJobWhereInput[]
    NOT?: ServiceJobWhereInput | ServiceJobWhereInput[]
    tenantId?: StringFilter<"ServiceJob"> | string
    extinguisherId?: StringNullableFilter<"ServiceJob"> | string | null
    location?: StringFilter<"ServiceJob"> | string
    building?: StringFilter<"ServiceJob"> | string
    type?: StringFilter<"ServiceJob"> | string
    serviceType?: StringFilter<"ServiceJob"> | string
    status?: StringFilter<"ServiceJob"> | string
    notes?: StringNullableFilter<"ServiceJob"> | string | null
    scheduledDate?: DateTimeNullableFilter<"ServiceJob"> | Date | string | null
    completedDate?: DateTimeNullableFilter<"ServiceJob"> | Date | string | null
    technician?: StringNullableFilter<"ServiceJob"> | string | null
    createdAt?: DateTimeFilter<"ServiceJob"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id">

  export type ServiceJobOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    extinguisherId?: SortOrderInput | SortOrder
    location?: SortOrder
    building?: SortOrder
    type?: SortOrder
    serviceType?: SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    scheduledDate?: SortOrderInput | SortOrder
    completedDate?: SortOrderInput | SortOrder
    technician?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ServiceJobCountOrderByAggregateInput
    _max?: ServiceJobMaxOrderByAggregateInput
    _min?: ServiceJobMinOrderByAggregateInput
  }

  export type ServiceJobScalarWhereWithAggregatesInput = {
    AND?: ServiceJobScalarWhereWithAggregatesInput | ServiceJobScalarWhereWithAggregatesInput[]
    OR?: ServiceJobScalarWhereWithAggregatesInput[]
    NOT?: ServiceJobScalarWhereWithAggregatesInput | ServiceJobScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ServiceJob"> | string
    tenantId?: StringWithAggregatesFilter<"ServiceJob"> | string
    extinguisherId?: StringNullableWithAggregatesFilter<"ServiceJob"> | string | null
    location?: StringWithAggregatesFilter<"ServiceJob"> | string
    building?: StringWithAggregatesFilter<"ServiceJob"> | string
    type?: StringWithAggregatesFilter<"ServiceJob"> | string
    serviceType?: StringWithAggregatesFilter<"ServiceJob"> | string
    status?: StringWithAggregatesFilter<"ServiceJob"> | string
    notes?: StringNullableWithAggregatesFilter<"ServiceJob"> | string | null
    scheduledDate?: DateTimeNullableWithAggregatesFilter<"ServiceJob"> | Date | string | null
    completedDate?: DateTimeNullableWithAggregatesFilter<"ServiceJob"> | Date | string | null
    technician?: StringNullableWithAggregatesFilter<"ServiceJob"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ServiceJob"> | Date | string
  }

  export type InspectionPhotoWhereInput = {
    AND?: InspectionPhotoWhereInput | InspectionPhotoWhereInput[]
    OR?: InspectionPhotoWhereInput[]
    NOT?: InspectionPhotoWhereInput | InspectionPhotoWhereInput[]
    id?: StringFilter<"InspectionPhoto"> | string
    tenantId?: StringFilter<"InspectionPhoto"> | string
    extinguisherId?: StringNullableFilter<"InspectionPhoto"> | string | null
    inspectionId?: StringNullableFilter<"InspectionPhoto"> | string | null
    photoUrl?: StringFilter<"InspectionPhoto"> | string
    caption?: StringNullableFilter<"InspectionPhoto"> | string | null
    uploadedBy?: StringNullableFilter<"InspectionPhoto"> | string | null
    createdAt?: DateTimeFilter<"InspectionPhoto"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type InspectionPhotoOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    extinguisherId?: SortOrderInput | SortOrder
    inspectionId?: SortOrderInput | SortOrder
    photoUrl?: SortOrder
    caption?: SortOrderInput | SortOrder
    uploadedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type InspectionPhotoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InspectionPhotoWhereInput | InspectionPhotoWhereInput[]
    OR?: InspectionPhotoWhereInput[]
    NOT?: InspectionPhotoWhereInput | InspectionPhotoWhereInput[]
    tenantId?: StringFilter<"InspectionPhoto"> | string
    extinguisherId?: StringNullableFilter<"InspectionPhoto"> | string | null
    inspectionId?: StringNullableFilter<"InspectionPhoto"> | string | null
    photoUrl?: StringFilter<"InspectionPhoto"> | string
    caption?: StringNullableFilter<"InspectionPhoto"> | string | null
    uploadedBy?: StringNullableFilter<"InspectionPhoto"> | string | null
    createdAt?: DateTimeFilter<"InspectionPhoto"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id">

  export type InspectionPhotoOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    extinguisherId?: SortOrderInput | SortOrder
    inspectionId?: SortOrderInput | SortOrder
    photoUrl?: SortOrder
    caption?: SortOrderInput | SortOrder
    uploadedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: InspectionPhotoCountOrderByAggregateInput
    _max?: InspectionPhotoMaxOrderByAggregateInput
    _min?: InspectionPhotoMinOrderByAggregateInput
  }

  export type InspectionPhotoScalarWhereWithAggregatesInput = {
    AND?: InspectionPhotoScalarWhereWithAggregatesInput | InspectionPhotoScalarWhereWithAggregatesInput[]
    OR?: InspectionPhotoScalarWhereWithAggregatesInput[]
    NOT?: InspectionPhotoScalarWhereWithAggregatesInput | InspectionPhotoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InspectionPhoto"> | string
    tenantId?: StringWithAggregatesFilter<"InspectionPhoto"> | string
    extinguisherId?: StringNullableWithAggregatesFilter<"InspectionPhoto"> | string | null
    inspectionId?: StringNullableWithAggregatesFilter<"InspectionPhoto"> | string | null
    photoUrl?: StringWithAggregatesFilter<"InspectionPhoto"> | string
    caption?: StringNullableWithAggregatesFilter<"InspectionPhoto"> | string | null
    uploadedBy?: StringNullableWithAggregatesFilter<"InspectionPhoto"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"InspectionPhoto"> | Date | string
  }

  export type ServiceReportWhereInput = {
    AND?: ServiceReportWhereInput | ServiceReportWhereInput[]
    OR?: ServiceReportWhereInput[]
    NOT?: ServiceReportWhereInput | ServiceReportWhereInput[]
    id?: StringFilter<"ServiceReport"> | string
    tenantId?: StringFilter<"ServiceReport"> | string
    visitDate?: DateTimeFilter<"ServiceReport"> | Date | string
    technician?: StringNullableFilter<"ServiceReport"> | string | null
    jobIds?: StringNullableListFilter<"ServiceReport">
    pdfUrl?: StringFilter<"ServiceReport"> | string
    createdAt?: DateTimeFilter<"ServiceReport"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type ServiceReportOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    visitDate?: SortOrder
    technician?: SortOrderInput | SortOrder
    jobIds?: SortOrder
    pdfUrl?: SortOrder
    createdAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type ServiceReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ServiceReportWhereInput | ServiceReportWhereInput[]
    OR?: ServiceReportWhereInput[]
    NOT?: ServiceReportWhereInput | ServiceReportWhereInput[]
    tenantId?: StringFilter<"ServiceReport"> | string
    visitDate?: DateTimeFilter<"ServiceReport"> | Date | string
    technician?: StringNullableFilter<"ServiceReport"> | string | null
    jobIds?: StringNullableListFilter<"ServiceReport">
    pdfUrl?: StringFilter<"ServiceReport"> | string
    createdAt?: DateTimeFilter<"ServiceReport"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id">

  export type ServiceReportOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    visitDate?: SortOrder
    technician?: SortOrderInput | SortOrder
    jobIds?: SortOrder
    pdfUrl?: SortOrder
    createdAt?: SortOrder
    _count?: ServiceReportCountOrderByAggregateInput
    _max?: ServiceReportMaxOrderByAggregateInput
    _min?: ServiceReportMinOrderByAggregateInput
  }

  export type ServiceReportScalarWhereWithAggregatesInput = {
    AND?: ServiceReportScalarWhereWithAggregatesInput | ServiceReportScalarWhereWithAggregatesInput[]
    OR?: ServiceReportScalarWhereWithAggregatesInput[]
    NOT?: ServiceReportScalarWhereWithAggregatesInput | ServiceReportScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ServiceReport"> | string
    tenantId?: StringWithAggregatesFilter<"ServiceReport"> | string
    visitDate?: DateTimeWithAggregatesFilter<"ServiceReport"> | Date | string
    technician?: StringNullableWithAggregatesFilter<"ServiceReport"> | string | null
    jobIds?: StringNullableListFilter<"ServiceReport">
    pdfUrl?: StringWithAggregatesFilter<"ServiceReport"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ServiceReport"> | Date | string
  }

  export type TenantCreateInput = {
    id?: string
    companyName: string
    subdomain: string
    logoUrl?: string | null
    subscriptionPlan?: string
    subscriptionStatus?: string
    createdAt?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    extinguishers?: ExtinguisherCreateNestedManyWithoutTenantInput
    inspections?: InspectionCreateNestedManyWithoutTenantInput
    subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput
    invoices?: InvoiceCreateNestedManyWithoutTenantInput
    serviceJobs?: ServiceJobCreateNestedManyWithoutTenantInput
    inspectionPhotos?: InspectionPhotoCreateNestedManyWithoutTenantInput
    serviceReports?: ServiceReportCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateInput = {
    id?: string
    companyName: string
    subdomain: string
    logoUrl?: string | null
    subscriptionPlan?: string
    subscriptionStatus?: string
    createdAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    extinguishers?: ExtinguisherUncheckedCreateNestedManyWithoutTenantInput
    inspections?: InspectionUncheckedCreateNestedManyWithoutTenantInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutTenantInput
    serviceJobs?: ServiceJobUncheckedCreateNestedManyWithoutTenantInput
    inspectionPhotos?: InspectionPhotoUncheckedCreateNestedManyWithoutTenantInput
    serviceReports?: ServiceReportUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionPlan?: StringFieldUpdateOperationsInput | string
    subscriptionStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    extinguishers?: ExtinguisherUpdateManyWithoutTenantNestedInput
    inspections?: InspectionUpdateManyWithoutTenantNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUpdateManyWithoutTenantNestedInput
    serviceJobs?: ServiceJobUpdateManyWithoutTenantNestedInput
    inspectionPhotos?: InspectionPhotoUpdateManyWithoutTenantNestedInput
    serviceReports?: ServiceReportUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionPlan?: StringFieldUpdateOperationsInput | string
    subscriptionStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    extinguishers?: ExtinguisherUncheckedUpdateManyWithoutTenantNestedInput
    inspections?: InspectionUncheckedUpdateManyWithoutTenantNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutTenantNestedInput
    serviceJobs?: ServiceJobUncheckedUpdateManyWithoutTenantNestedInput
    inspectionPhotos?: InspectionPhotoUncheckedUpdateManyWithoutTenantNestedInput
    serviceReports?: ServiceReportUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateManyInput = {
    id?: string
    companyName: string
    subdomain: string
    logoUrl?: string | null
    subscriptionPlan?: string
    subscriptionStatus?: string
    createdAt?: Date | string
  }

  export type TenantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionPlan?: StringFieldUpdateOperationsInput | string
    subscriptionStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionPlan?: StringFieldUpdateOperationsInput | string
    subscriptionStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: string
    status?: string
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutUsersInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    tenantId: string
    name: string
    email: string
    passwordHash: string
    role: string
    status?: string
    createdAt?: Date | string
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutUsersNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyInput = {
    id?: string
    tenantId: string
    name: string
    email: string
    passwordHash: string
    role: string
    status?: string
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExtinguisherCreateInput = {
    id?: string
    externalId?: string | null
    location: string
    building: string
    floor?: string | null
    type: string
    capacity?: string | null
    manufacturer?: string | null
    model?: string | null
    serialNumber?: string | null
    installDate?: Date | string | null
    expiryDate?: Date | string | null
    lastInspection?: Date | string | null
    nextInspection?: Date | string | null
    lastMaintenance?: Date | string | null
    nextMaintenance?: Date | string | null
    status?: string
    condition?: string
    serviceType?: string | null
    inspector?: string | null
    notes?: string | null
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutExtinguishersInput
    inspections?: InspectionCreateNestedManyWithoutExtinguisherInput
  }

  export type ExtinguisherUncheckedCreateInput = {
    id?: string
    tenantId: string
    externalId?: string | null
    location: string
    building: string
    floor?: string | null
    type: string
    capacity?: string | null
    manufacturer?: string | null
    model?: string | null
    serialNumber?: string | null
    installDate?: Date | string | null
    expiryDate?: Date | string | null
    lastInspection?: Date | string | null
    nextInspection?: Date | string | null
    lastMaintenance?: Date | string | null
    nextMaintenance?: Date | string | null
    status?: string
    condition?: string
    serviceType?: string | null
    inspector?: string | null
    notes?: string | null
    createdAt?: Date | string
    inspections?: InspectionUncheckedCreateNestedManyWithoutExtinguisherInput
  }

  export type ExtinguisherUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    location?: StringFieldUpdateOperationsInput | string
    building?: StringFieldUpdateOperationsInput | string
    floor?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    capacity?: NullableStringFieldUpdateOperationsInput | string | null
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    installDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInspection?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextInspection?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMaintenance?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextMaintenance?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    condition?: StringFieldUpdateOperationsInput | string
    serviceType?: NullableStringFieldUpdateOperationsInput | string | null
    inspector?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutExtinguishersNestedInput
    inspections?: InspectionUpdateManyWithoutExtinguisherNestedInput
  }

  export type ExtinguisherUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    location?: StringFieldUpdateOperationsInput | string
    building?: StringFieldUpdateOperationsInput | string
    floor?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    capacity?: NullableStringFieldUpdateOperationsInput | string | null
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    installDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInspection?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextInspection?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMaintenance?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextMaintenance?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    condition?: StringFieldUpdateOperationsInput | string
    serviceType?: NullableStringFieldUpdateOperationsInput | string | null
    inspector?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inspections?: InspectionUncheckedUpdateManyWithoutExtinguisherNestedInput
  }

  export type ExtinguisherCreateManyInput = {
    id?: string
    tenantId: string
    externalId?: string | null
    location: string
    building: string
    floor?: string | null
    type: string
    capacity?: string | null
    manufacturer?: string | null
    model?: string | null
    serialNumber?: string | null
    installDate?: Date | string | null
    expiryDate?: Date | string | null
    lastInspection?: Date | string | null
    nextInspection?: Date | string | null
    lastMaintenance?: Date | string | null
    nextMaintenance?: Date | string | null
    status?: string
    condition?: string
    serviceType?: string | null
    inspector?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type ExtinguisherUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    location?: StringFieldUpdateOperationsInput | string
    building?: StringFieldUpdateOperationsInput | string
    floor?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    capacity?: NullableStringFieldUpdateOperationsInput | string | null
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    installDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInspection?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextInspection?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMaintenance?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextMaintenance?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    condition?: StringFieldUpdateOperationsInput | string
    serviceType?: NullableStringFieldUpdateOperationsInput | string | null
    inspector?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExtinguisherUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    location?: StringFieldUpdateOperationsInput | string
    building?: StringFieldUpdateOperationsInput | string
    floor?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    capacity?: NullableStringFieldUpdateOperationsInput | string | null
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    installDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInspection?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextInspection?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMaintenance?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextMaintenance?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    condition?: StringFieldUpdateOperationsInput | string
    serviceType?: NullableStringFieldUpdateOperationsInput | string | null
    inspector?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InspectionCreateInput = {
    id?: string
    serviceDate: Date | string
    serviceType: string
    technician?: string | null
    condition: string
    notes?: string | null
    partsReplaced?: string | null
    nextServiceDate?: Date | string | null
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutInspectionsInput
    extinguisher: ExtinguisherCreateNestedOneWithoutInspectionsInput
  }

  export type InspectionUncheckedCreateInput = {
    id?: string
    tenantId: string
    extinguisherId: string
    serviceDate: Date | string
    serviceType: string
    technician?: string | null
    condition: string
    notes?: string | null
    partsReplaced?: string | null
    nextServiceDate?: Date | string | null
    createdAt?: Date | string
  }

  export type InspectionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceType?: StringFieldUpdateOperationsInput | string
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    condition?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    partsReplaced?: NullableStringFieldUpdateOperationsInput | string | null
    nextServiceDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutInspectionsNestedInput
    extinguisher?: ExtinguisherUpdateOneRequiredWithoutInspectionsNestedInput
  }

  export type InspectionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    extinguisherId?: StringFieldUpdateOperationsInput | string
    serviceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceType?: StringFieldUpdateOperationsInput | string
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    condition?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    partsReplaced?: NullableStringFieldUpdateOperationsInput | string | null
    nextServiceDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InspectionCreateManyInput = {
    id?: string
    tenantId: string
    extinguisherId: string
    serviceDate: Date | string
    serviceType: string
    technician?: string | null
    condition: string
    notes?: string | null
    partsReplaced?: string | null
    nextServiceDate?: Date | string | null
    createdAt?: Date | string
  }

  export type InspectionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceType?: StringFieldUpdateOperationsInput | string
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    condition?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    partsReplaced?: NullableStringFieldUpdateOperationsInput | string | null
    nextServiceDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InspectionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    extinguisherId?: StringFieldUpdateOperationsInput | string
    serviceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceType?: StringFieldUpdateOperationsInput | string
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    condition?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    partsReplaced?: NullableStringFieldUpdateOperationsInput | string | null
    nextServiceDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionCreateInput = {
    id?: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    plan: string
    status: string
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    trialEnd?: Date | string | null
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutSubscriptionsInput
  }

  export type SubscriptionUncheckedCreateInput = {
    id?: string
    tenantId: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    plan: string
    status: string
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    trialEnd?: Date | string | null
    createdAt?: Date | string
  }

  export type SubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    plan?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutSubscriptionsNestedInput
  }

  export type SubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    plan?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionCreateManyInput = {
    id?: string
    tenantId: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    plan: string
    status: string
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    trialEnd?: Date | string | null
    createdAt?: Date | string
  }

  export type SubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    plan?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    plan?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceCreateInput = {
    id?: string
    stripeInvoiceId?: string | null
    amount: number
    status: string
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutInvoicesInput
  }

  export type InvoiceUncheckedCreateInput = {
    id?: string
    tenantId: string
    stripeInvoiceId?: string | null
    amount: number
    status: string
    createdAt?: Date | string
  }

  export type InvoiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutInvoicesNestedInput
  }

  export type InvoiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    stripeInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceCreateManyInput = {
    id?: string
    tenantId: string
    stripeInvoiceId?: string | null
    amount: number
    status: string
    createdAt?: Date | string
  }

  export type InvoiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    stripeInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceJobCreateInput = {
    id?: string
    extinguisherId?: string | null
    location: string
    building: string
    type: string
    serviceType: string
    status?: string
    notes?: string | null
    scheduledDate?: Date | string | null
    completedDate?: Date | string | null
    technician?: string | null
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutServiceJobsInput
  }

  export type ServiceJobUncheckedCreateInput = {
    id?: string
    tenantId: string
    extinguisherId?: string | null
    location: string
    building: string
    type: string
    serviceType: string
    status?: string
    notes?: string | null
    scheduledDate?: Date | string | null
    completedDate?: Date | string | null
    technician?: string | null
    createdAt?: Date | string
  }

  export type ServiceJobUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    extinguisherId?: NullableStringFieldUpdateOperationsInput | string | null
    location?: StringFieldUpdateOperationsInput | string
    building?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    serviceType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutServiceJobsNestedInput
  }

  export type ServiceJobUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    extinguisherId?: NullableStringFieldUpdateOperationsInput | string | null
    location?: StringFieldUpdateOperationsInput | string
    building?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    serviceType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceJobCreateManyInput = {
    id?: string
    tenantId: string
    extinguisherId?: string | null
    location: string
    building: string
    type: string
    serviceType: string
    status?: string
    notes?: string | null
    scheduledDate?: Date | string | null
    completedDate?: Date | string | null
    technician?: string | null
    createdAt?: Date | string
  }

  export type ServiceJobUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    extinguisherId?: NullableStringFieldUpdateOperationsInput | string | null
    location?: StringFieldUpdateOperationsInput | string
    building?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    serviceType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceJobUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    extinguisherId?: NullableStringFieldUpdateOperationsInput | string | null
    location?: StringFieldUpdateOperationsInput | string
    building?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    serviceType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InspectionPhotoCreateInput = {
    id?: string
    extinguisherId?: string | null
    inspectionId?: string | null
    photoUrl: string
    caption?: string | null
    uploadedBy?: string | null
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutInspectionPhotosInput
  }

  export type InspectionPhotoUncheckedCreateInput = {
    id?: string
    tenantId: string
    extinguisherId?: string | null
    inspectionId?: string | null
    photoUrl: string
    caption?: string | null
    uploadedBy?: string | null
    createdAt?: Date | string
  }

  export type InspectionPhotoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    extinguisherId?: NullableStringFieldUpdateOperationsInput | string | null
    inspectionId?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutInspectionPhotosNestedInput
  }

  export type InspectionPhotoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    extinguisherId?: NullableStringFieldUpdateOperationsInput | string | null
    inspectionId?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InspectionPhotoCreateManyInput = {
    id?: string
    tenantId: string
    extinguisherId?: string | null
    inspectionId?: string | null
    photoUrl: string
    caption?: string | null
    uploadedBy?: string | null
    createdAt?: Date | string
  }

  export type InspectionPhotoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    extinguisherId?: NullableStringFieldUpdateOperationsInput | string | null
    inspectionId?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InspectionPhotoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    extinguisherId?: NullableStringFieldUpdateOperationsInput | string | null
    inspectionId?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceReportCreateInput = {
    id?: string
    visitDate: Date | string
    technician?: string | null
    jobIds?: ServiceReportCreatejobIdsInput | string[]
    pdfUrl: string
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutServiceReportsInput
  }

  export type ServiceReportUncheckedCreateInput = {
    id?: string
    tenantId: string
    visitDate: Date | string
    technician?: string | null
    jobIds?: ServiceReportCreatejobIdsInput | string[]
    pdfUrl: string
    createdAt?: Date | string
  }

  export type ServiceReportUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    jobIds?: ServiceReportUpdatejobIdsInput | string[]
    pdfUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutServiceReportsNestedInput
  }

  export type ServiceReportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    jobIds?: ServiceReportUpdatejobIdsInput | string[]
    pdfUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceReportCreateManyInput = {
    id?: string
    tenantId: string
    visitDate: Date | string
    technician?: string | null
    jobIds?: ServiceReportCreatejobIdsInput | string[]
    pdfUrl: string
    createdAt?: Date | string
  }

  export type ServiceReportUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    jobIds?: ServiceReportUpdatejobIdsInput | string[]
    pdfUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceReportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    jobIds?: ServiceReportUpdatejobIdsInput | string[]
    pdfUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type ExtinguisherListRelationFilter = {
    every?: ExtinguisherWhereInput
    some?: ExtinguisherWhereInput
    none?: ExtinguisherWhereInput
  }

  export type InspectionListRelationFilter = {
    every?: InspectionWhereInput
    some?: InspectionWhereInput
    none?: InspectionWhereInput
  }

  export type SubscriptionListRelationFilter = {
    every?: SubscriptionWhereInput
    some?: SubscriptionWhereInput
    none?: SubscriptionWhereInput
  }

  export type InvoiceListRelationFilter = {
    every?: InvoiceWhereInput
    some?: InvoiceWhereInput
    none?: InvoiceWhereInput
  }

  export type ServiceJobListRelationFilter = {
    every?: ServiceJobWhereInput
    some?: ServiceJobWhereInput
    none?: ServiceJobWhereInput
  }

  export type InspectionPhotoListRelationFilter = {
    every?: InspectionPhotoWhereInput
    some?: InspectionPhotoWhereInput
    none?: InspectionPhotoWhereInput
  }

  export type ServiceReportListRelationFilter = {
    every?: ServiceReportWhereInput
    some?: ServiceReportWhereInput
    none?: ServiceReportWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExtinguisherOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InspectionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SubscriptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InvoiceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ServiceJobOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InspectionPhotoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ServiceReportOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantCountOrderByAggregateInput = {
    id?: SortOrder
    companyName?: SortOrder
    subdomain?: SortOrder
    logoUrl?: SortOrder
    subscriptionPlan?: SortOrder
    subscriptionStatus?: SortOrder
    createdAt?: SortOrder
  }

  export type TenantMaxOrderByAggregateInput = {
    id?: SortOrder
    companyName?: SortOrder
    subdomain?: SortOrder
    logoUrl?: SortOrder
    subscriptionPlan?: SortOrder
    subscriptionStatus?: SortOrder
    createdAt?: SortOrder
  }

  export type TenantMinOrderByAggregateInput = {
    id?: SortOrder
    companyName?: SortOrder
    subdomain?: SortOrder
    logoUrl?: SortOrder
    subscriptionPlan?: SortOrder
    subscriptionStatus?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type TenantScalarRelationFilter = {
    is?: TenantWhereInput
    isNot?: TenantWhereInput
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ExtinguisherCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    externalId?: SortOrder
    location?: SortOrder
    building?: SortOrder
    floor?: SortOrder
    type?: SortOrder
    capacity?: SortOrder
    manufacturer?: SortOrder
    model?: SortOrder
    serialNumber?: SortOrder
    installDate?: SortOrder
    expiryDate?: SortOrder
    lastInspection?: SortOrder
    nextInspection?: SortOrder
    lastMaintenance?: SortOrder
    nextMaintenance?: SortOrder
    status?: SortOrder
    condition?: SortOrder
    serviceType?: SortOrder
    inspector?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type ExtinguisherMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    externalId?: SortOrder
    location?: SortOrder
    building?: SortOrder
    floor?: SortOrder
    type?: SortOrder
    capacity?: SortOrder
    manufacturer?: SortOrder
    model?: SortOrder
    serialNumber?: SortOrder
    installDate?: SortOrder
    expiryDate?: SortOrder
    lastInspection?: SortOrder
    nextInspection?: SortOrder
    lastMaintenance?: SortOrder
    nextMaintenance?: SortOrder
    status?: SortOrder
    condition?: SortOrder
    serviceType?: SortOrder
    inspector?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type ExtinguisherMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    externalId?: SortOrder
    location?: SortOrder
    building?: SortOrder
    floor?: SortOrder
    type?: SortOrder
    capacity?: SortOrder
    manufacturer?: SortOrder
    model?: SortOrder
    serialNumber?: SortOrder
    installDate?: SortOrder
    expiryDate?: SortOrder
    lastInspection?: SortOrder
    nextInspection?: SortOrder
    lastMaintenance?: SortOrder
    nextMaintenance?: SortOrder
    status?: SortOrder
    condition?: SortOrder
    serviceType?: SortOrder
    inspector?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ExtinguisherScalarRelationFilter = {
    is?: ExtinguisherWhereInput
    isNot?: ExtinguisherWhereInput
  }

  export type InspectionCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    extinguisherId?: SortOrder
    serviceDate?: SortOrder
    serviceType?: SortOrder
    technician?: SortOrder
    condition?: SortOrder
    notes?: SortOrder
    partsReplaced?: SortOrder
    nextServiceDate?: SortOrder
    createdAt?: SortOrder
  }

  export type InspectionMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    extinguisherId?: SortOrder
    serviceDate?: SortOrder
    serviceType?: SortOrder
    technician?: SortOrder
    condition?: SortOrder
    notes?: SortOrder
    partsReplaced?: SortOrder
    nextServiceDate?: SortOrder
    createdAt?: SortOrder
  }

  export type InspectionMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    extinguisherId?: SortOrder
    serviceDate?: SortOrder
    serviceType?: SortOrder
    technician?: SortOrder
    condition?: SortOrder
    notes?: SortOrder
    partsReplaced?: SortOrder
    nextServiceDate?: SortOrder
    createdAt?: SortOrder
  }

  export type SubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubscriptionId?: SortOrder
    plan?: SortOrder
    status?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    trialEnd?: SortOrder
    createdAt?: SortOrder
  }

  export type SubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubscriptionId?: SortOrder
    plan?: SortOrder
    status?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    trialEnd?: SortOrder
    createdAt?: SortOrder
  }

  export type SubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubscriptionId?: SortOrder
    plan?: SortOrder
    status?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    trialEnd?: SortOrder
    createdAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type InvoiceCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    stripeInvoiceId?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type InvoiceAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type InvoiceMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    stripeInvoiceId?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type InvoiceMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    stripeInvoiceId?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type InvoiceSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type ServiceJobCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    extinguisherId?: SortOrder
    location?: SortOrder
    building?: SortOrder
    type?: SortOrder
    serviceType?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    scheduledDate?: SortOrder
    completedDate?: SortOrder
    technician?: SortOrder
    createdAt?: SortOrder
  }

  export type ServiceJobMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    extinguisherId?: SortOrder
    location?: SortOrder
    building?: SortOrder
    type?: SortOrder
    serviceType?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    scheduledDate?: SortOrder
    completedDate?: SortOrder
    technician?: SortOrder
    createdAt?: SortOrder
  }

  export type ServiceJobMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    extinguisherId?: SortOrder
    location?: SortOrder
    building?: SortOrder
    type?: SortOrder
    serviceType?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    scheduledDate?: SortOrder
    completedDate?: SortOrder
    technician?: SortOrder
    createdAt?: SortOrder
  }

  export type InspectionPhotoCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    extinguisherId?: SortOrder
    inspectionId?: SortOrder
    photoUrl?: SortOrder
    caption?: SortOrder
    uploadedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type InspectionPhotoMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    extinguisherId?: SortOrder
    inspectionId?: SortOrder
    photoUrl?: SortOrder
    caption?: SortOrder
    uploadedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type InspectionPhotoMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    extinguisherId?: SortOrder
    inspectionId?: SortOrder
    photoUrl?: SortOrder
    caption?: SortOrder
    uploadedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type ServiceReportCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    visitDate?: SortOrder
    technician?: SortOrder
    jobIds?: SortOrder
    pdfUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type ServiceReportMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    visitDate?: SortOrder
    technician?: SortOrder
    pdfUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type ServiceReportMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    visitDate?: SortOrder
    technician?: SortOrder
    pdfUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type UserCreateNestedManyWithoutTenantInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type ExtinguisherCreateNestedManyWithoutTenantInput = {
    create?: XOR<ExtinguisherCreateWithoutTenantInput, ExtinguisherUncheckedCreateWithoutTenantInput> | ExtinguisherCreateWithoutTenantInput[] | ExtinguisherUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ExtinguisherCreateOrConnectWithoutTenantInput | ExtinguisherCreateOrConnectWithoutTenantInput[]
    createMany?: ExtinguisherCreateManyTenantInputEnvelope
    connect?: ExtinguisherWhereUniqueInput | ExtinguisherWhereUniqueInput[]
  }

  export type InspectionCreateNestedManyWithoutTenantInput = {
    create?: XOR<InspectionCreateWithoutTenantInput, InspectionUncheckedCreateWithoutTenantInput> | InspectionCreateWithoutTenantInput[] | InspectionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: InspectionCreateOrConnectWithoutTenantInput | InspectionCreateOrConnectWithoutTenantInput[]
    createMany?: InspectionCreateManyTenantInputEnvelope
    connect?: InspectionWhereUniqueInput | InspectionWhereUniqueInput[]
  }

  export type SubscriptionCreateNestedManyWithoutTenantInput = {
    create?: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput> | SubscriptionCreateWithoutTenantInput[] | SubscriptionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutTenantInput | SubscriptionCreateOrConnectWithoutTenantInput[]
    createMany?: SubscriptionCreateManyTenantInputEnvelope
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
  }

  export type InvoiceCreateNestedManyWithoutTenantInput = {
    create?: XOR<InvoiceCreateWithoutTenantInput, InvoiceUncheckedCreateWithoutTenantInput> | InvoiceCreateWithoutTenantInput[] | InvoiceUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutTenantInput | InvoiceCreateOrConnectWithoutTenantInput[]
    createMany?: InvoiceCreateManyTenantInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type ServiceJobCreateNestedManyWithoutTenantInput = {
    create?: XOR<ServiceJobCreateWithoutTenantInput, ServiceJobUncheckedCreateWithoutTenantInput> | ServiceJobCreateWithoutTenantInput[] | ServiceJobUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ServiceJobCreateOrConnectWithoutTenantInput | ServiceJobCreateOrConnectWithoutTenantInput[]
    createMany?: ServiceJobCreateManyTenantInputEnvelope
    connect?: ServiceJobWhereUniqueInput | ServiceJobWhereUniqueInput[]
  }

  export type InspectionPhotoCreateNestedManyWithoutTenantInput = {
    create?: XOR<InspectionPhotoCreateWithoutTenantInput, InspectionPhotoUncheckedCreateWithoutTenantInput> | InspectionPhotoCreateWithoutTenantInput[] | InspectionPhotoUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: InspectionPhotoCreateOrConnectWithoutTenantInput | InspectionPhotoCreateOrConnectWithoutTenantInput[]
    createMany?: InspectionPhotoCreateManyTenantInputEnvelope
    connect?: InspectionPhotoWhereUniqueInput | InspectionPhotoWhereUniqueInput[]
  }

  export type ServiceReportCreateNestedManyWithoutTenantInput = {
    create?: XOR<ServiceReportCreateWithoutTenantInput, ServiceReportUncheckedCreateWithoutTenantInput> | ServiceReportCreateWithoutTenantInput[] | ServiceReportUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ServiceReportCreateOrConnectWithoutTenantInput | ServiceReportCreateOrConnectWithoutTenantInput[]
    createMany?: ServiceReportCreateManyTenantInputEnvelope
    connect?: ServiceReportWhereUniqueInput | ServiceReportWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type ExtinguisherUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<ExtinguisherCreateWithoutTenantInput, ExtinguisherUncheckedCreateWithoutTenantInput> | ExtinguisherCreateWithoutTenantInput[] | ExtinguisherUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ExtinguisherCreateOrConnectWithoutTenantInput | ExtinguisherCreateOrConnectWithoutTenantInput[]
    createMany?: ExtinguisherCreateManyTenantInputEnvelope
    connect?: ExtinguisherWhereUniqueInput | ExtinguisherWhereUniqueInput[]
  }

  export type InspectionUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<InspectionCreateWithoutTenantInput, InspectionUncheckedCreateWithoutTenantInput> | InspectionCreateWithoutTenantInput[] | InspectionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: InspectionCreateOrConnectWithoutTenantInput | InspectionCreateOrConnectWithoutTenantInput[]
    createMany?: InspectionCreateManyTenantInputEnvelope
    connect?: InspectionWhereUniqueInput | InspectionWhereUniqueInput[]
  }

  export type SubscriptionUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput> | SubscriptionCreateWithoutTenantInput[] | SubscriptionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutTenantInput | SubscriptionCreateOrConnectWithoutTenantInput[]
    createMany?: SubscriptionCreateManyTenantInputEnvelope
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
  }

  export type InvoiceUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<InvoiceCreateWithoutTenantInput, InvoiceUncheckedCreateWithoutTenantInput> | InvoiceCreateWithoutTenantInput[] | InvoiceUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutTenantInput | InvoiceCreateOrConnectWithoutTenantInput[]
    createMany?: InvoiceCreateManyTenantInputEnvelope
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
  }

  export type ServiceJobUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<ServiceJobCreateWithoutTenantInput, ServiceJobUncheckedCreateWithoutTenantInput> | ServiceJobCreateWithoutTenantInput[] | ServiceJobUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ServiceJobCreateOrConnectWithoutTenantInput | ServiceJobCreateOrConnectWithoutTenantInput[]
    createMany?: ServiceJobCreateManyTenantInputEnvelope
    connect?: ServiceJobWhereUniqueInput | ServiceJobWhereUniqueInput[]
  }

  export type InspectionPhotoUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<InspectionPhotoCreateWithoutTenantInput, InspectionPhotoUncheckedCreateWithoutTenantInput> | InspectionPhotoCreateWithoutTenantInput[] | InspectionPhotoUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: InspectionPhotoCreateOrConnectWithoutTenantInput | InspectionPhotoCreateOrConnectWithoutTenantInput[]
    createMany?: InspectionPhotoCreateManyTenantInputEnvelope
    connect?: InspectionPhotoWhereUniqueInput | InspectionPhotoWhereUniqueInput[]
  }

  export type ServiceReportUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<ServiceReportCreateWithoutTenantInput, ServiceReportUncheckedCreateWithoutTenantInput> | ServiceReportCreateWithoutTenantInput[] | ServiceReportUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ServiceReportCreateOrConnectWithoutTenantInput | ServiceReportCreateOrConnectWithoutTenantInput[]
    createMany?: ServiceReportCreateManyTenantInputEnvelope
    connect?: ServiceReportWhereUniqueInput | ServiceReportWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdateManyWithoutTenantNestedInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutTenantInput | UserUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutTenantInput | UserUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: UserUpdateManyWithWhereWithoutTenantInput | UserUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type ExtinguisherUpdateManyWithoutTenantNestedInput = {
    create?: XOR<ExtinguisherCreateWithoutTenantInput, ExtinguisherUncheckedCreateWithoutTenantInput> | ExtinguisherCreateWithoutTenantInput[] | ExtinguisherUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ExtinguisherCreateOrConnectWithoutTenantInput | ExtinguisherCreateOrConnectWithoutTenantInput[]
    upsert?: ExtinguisherUpsertWithWhereUniqueWithoutTenantInput | ExtinguisherUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: ExtinguisherCreateManyTenantInputEnvelope
    set?: ExtinguisherWhereUniqueInput | ExtinguisherWhereUniqueInput[]
    disconnect?: ExtinguisherWhereUniqueInput | ExtinguisherWhereUniqueInput[]
    delete?: ExtinguisherWhereUniqueInput | ExtinguisherWhereUniqueInput[]
    connect?: ExtinguisherWhereUniqueInput | ExtinguisherWhereUniqueInput[]
    update?: ExtinguisherUpdateWithWhereUniqueWithoutTenantInput | ExtinguisherUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: ExtinguisherUpdateManyWithWhereWithoutTenantInput | ExtinguisherUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: ExtinguisherScalarWhereInput | ExtinguisherScalarWhereInput[]
  }

  export type InspectionUpdateManyWithoutTenantNestedInput = {
    create?: XOR<InspectionCreateWithoutTenantInput, InspectionUncheckedCreateWithoutTenantInput> | InspectionCreateWithoutTenantInput[] | InspectionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: InspectionCreateOrConnectWithoutTenantInput | InspectionCreateOrConnectWithoutTenantInput[]
    upsert?: InspectionUpsertWithWhereUniqueWithoutTenantInput | InspectionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: InspectionCreateManyTenantInputEnvelope
    set?: InspectionWhereUniqueInput | InspectionWhereUniqueInput[]
    disconnect?: InspectionWhereUniqueInput | InspectionWhereUniqueInput[]
    delete?: InspectionWhereUniqueInput | InspectionWhereUniqueInput[]
    connect?: InspectionWhereUniqueInput | InspectionWhereUniqueInput[]
    update?: InspectionUpdateWithWhereUniqueWithoutTenantInput | InspectionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: InspectionUpdateManyWithWhereWithoutTenantInput | InspectionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: InspectionScalarWhereInput | InspectionScalarWhereInput[]
  }

  export type SubscriptionUpdateManyWithoutTenantNestedInput = {
    create?: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput> | SubscriptionCreateWithoutTenantInput[] | SubscriptionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutTenantInput | SubscriptionCreateOrConnectWithoutTenantInput[]
    upsert?: SubscriptionUpsertWithWhereUniqueWithoutTenantInput | SubscriptionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: SubscriptionCreateManyTenantInputEnvelope
    set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    update?: SubscriptionUpdateWithWhereUniqueWithoutTenantInput | SubscriptionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: SubscriptionUpdateManyWithWhereWithoutTenantInput | SubscriptionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
  }

  export type InvoiceUpdateManyWithoutTenantNestedInput = {
    create?: XOR<InvoiceCreateWithoutTenantInput, InvoiceUncheckedCreateWithoutTenantInput> | InvoiceCreateWithoutTenantInput[] | InvoiceUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutTenantInput | InvoiceCreateOrConnectWithoutTenantInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutTenantInput | InvoiceUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: InvoiceCreateManyTenantInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutTenantInput | InvoiceUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutTenantInput | InvoiceUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type ServiceJobUpdateManyWithoutTenantNestedInput = {
    create?: XOR<ServiceJobCreateWithoutTenantInput, ServiceJobUncheckedCreateWithoutTenantInput> | ServiceJobCreateWithoutTenantInput[] | ServiceJobUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ServiceJobCreateOrConnectWithoutTenantInput | ServiceJobCreateOrConnectWithoutTenantInput[]
    upsert?: ServiceJobUpsertWithWhereUniqueWithoutTenantInput | ServiceJobUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: ServiceJobCreateManyTenantInputEnvelope
    set?: ServiceJobWhereUniqueInput | ServiceJobWhereUniqueInput[]
    disconnect?: ServiceJobWhereUniqueInput | ServiceJobWhereUniqueInput[]
    delete?: ServiceJobWhereUniqueInput | ServiceJobWhereUniqueInput[]
    connect?: ServiceJobWhereUniqueInput | ServiceJobWhereUniqueInput[]
    update?: ServiceJobUpdateWithWhereUniqueWithoutTenantInput | ServiceJobUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: ServiceJobUpdateManyWithWhereWithoutTenantInput | ServiceJobUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: ServiceJobScalarWhereInput | ServiceJobScalarWhereInput[]
  }

  export type InspectionPhotoUpdateManyWithoutTenantNestedInput = {
    create?: XOR<InspectionPhotoCreateWithoutTenantInput, InspectionPhotoUncheckedCreateWithoutTenantInput> | InspectionPhotoCreateWithoutTenantInput[] | InspectionPhotoUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: InspectionPhotoCreateOrConnectWithoutTenantInput | InspectionPhotoCreateOrConnectWithoutTenantInput[]
    upsert?: InspectionPhotoUpsertWithWhereUniqueWithoutTenantInput | InspectionPhotoUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: InspectionPhotoCreateManyTenantInputEnvelope
    set?: InspectionPhotoWhereUniqueInput | InspectionPhotoWhereUniqueInput[]
    disconnect?: InspectionPhotoWhereUniqueInput | InspectionPhotoWhereUniqueInput[]
    delete?: InspectionPhotoWhereUniqueInput | InspectionPhotoWhereUniqueInput[]
    connect?: InspectionPhotoWhereUniqueInput | InspectionPhotoWhereUniqueInput[]
    update?: InspectionPhotoUpdateWithWhereUniqueWithoutTenantInput | InspectionPhotoUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: InspectionPhotoUpdateManyWithWhereWithoutTenantInput | InspectionPhotoUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: InspectionPhotoScalarWhereInput | InspectionPhotoScalarWhereInput[]
  }

  export type ServiceReportUpdateManyWithoutTenantNestedInput = {
    create?: XOR<ServiceReportCreateWithoutTenantInput, ServiceReportUncheckedCreateWithoutTenantInput> | ServiceReportCreateWithoutTenantInput[] | ServiceReportUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ServiceReportCreateOrConnectWithoutTenantInput | ServiceReportCreateOrConnectWithoutTenantInput[]
    upsert?: ServiceReportUpsertWithWhereUniqueWithoutTenantInput | ServiceReportUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: ServiceReportCreateManyTenantInputEnvelope
    set?: ServiceReportWhereUniqueInput | ServiceReportWhereUniqueInput[]
    disconnect?: ServiceReportWhereUniqueInput | ServiceReportWhereUniqueInput[]
    delete?: ServiceReportWhereUniqueInput | ServiceReportWhereUniqueInput[]
    connect?: ServiceReportWhereUniqueInput | ServiceReportWhereUniqueInput[]
    update?: ServiceReportUpdateWithWhereUniqueWithoutTenantInput | ServiceReportUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: ServiceReportUpdateManyWithWhereWithoutTenantInput | ServiceReportUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: ServiceReportScalarWhereInput | ServiceReportScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput> | UserCreateWithoutTenantInput[] | UserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTenantInput | UserCreateOrConnectWithoutTenantInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutTenantInput | UserUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: UserCreateManyTenantInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutTenantInput | UserUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: UserUpdateManyWithWhereWithoutTenantInput | UserUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type ExtinguisherUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<ExtinguisherCreateWithoutTenantInput, ExtinguisherUncheckedCreateWithoutTenantInput> | ExtinguisherCreateWithoutTenantInput[] | ExtinguisherUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ExtinguisherCreateOrConnectWithoutTenantInput | ExtinguisherCreateOrConnectWithoutTenantInput[]
    upsert?: ExtinguisherUpsertWithWhereUniqueWithoutTenantInput | ExtinguisherUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: ExtinguisherCreateManyTenantInputEnvelope
    set?: ExtinguisherWhereUniqueInput | ExtinguisherWhereUniqueInput[]
    disconnect?: ExtinguisherWhereUniqueInput | ExtinguisherWhereUniqueInput[]
    delete?: ExtinguisherWhereUniqueInput | ExtinguisherWhereUniqueInput[]
    connect?: ExtinguisherWhereUniqueInput | ExtinguisherWhereUniqueInput[]
    update?: ExtinguisherUpdateWithWhereUniqueWithoutTenantInput | ExtinguisherUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: ExtinguisherUpdateManyWithWhereWithoutTenantInput | ExtinguisherUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: ExtinguisherScalarWhereInput | ExtinguisherScalarWhereInput[]
  }

  export type InspectionUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<InspectionCreateWithoutTenantInput, InspectionUncheckedCreateWithoutTenantInput> | InspectionCreateWithoutTenantInput[] | InspectionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: InspectionCreateOrConnectWithoutTenantInput | InspectionCreateOrConnectWithoutTenantInput[]
    upsert?: InspectionUpsertWithWhereUniqueWithoutTenantInput | InspectionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: InspectionCreateManyTenantInputEnvelope
    set?: InspectionWhereUniqueInput | InspectionWhereUniqueInput[]
    disconnect?: InspectionWhereUniqueInput | InspectionWhereUniqueInput[]
    delete?: InspectionWhereUniqueInput | InspectionWhereUniqueInput[]
    connect?: InspectionWhereUniqueInput | InspectionWhereUniqueInput[]
    update?: InspectionUpdateWithWhereUniqueWithoutTenantInput | InspectionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: InspectionUpdateManyWithWhereWithoutTenantInput | InspectionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: InspectionScalarWhereInput | InspectionScalarWhereInput[]
  }

  export type SubscriptionUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput> | SubscriptionCreateWithoutTenantInput[] | SubscriptionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutTenantInput | SubscriptionCreateOrConnectWithoutTenantInput[]
    upsert?: SubscriptionUpsertWithWhereUniqueWithoutTenantInput | SubscriptionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: SubscriptionCreateManyTenantInputEnvelope
    set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    update?: SubscriptionUpdateWithWhereUniqueWithoutTenantInput | SubscriptionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: SubscriptionUpdateManyWithWhereWithoutTenantInput | SubscriptionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
  }

  export type InvoiceUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<InvoiceCreateWithoutTenantInput, InvoiceUncheckedCreateWithoutTenantInput> | InvoiceCreateWithoutTenantInput[] | InvoiceUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: InvoiceCreateOrConnectWithoutTenantInput | InvoiceCreateOrConnectWithoutTenantInput[]
    upsert?: InvoiceUpsertWithWhereUniqueWithoutTenantInput | InvoiceUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: InvoiceCreateManyTenantInputEnvelope
    set?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    disconnect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    delete?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    connect?: InvoiceWhereUniqueInput | InvoiceWhereUniqueInput[]
    update?: InvoiceUpdateWithWhereUniqueWithoutTenantInput | InvoiceUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: InvoiceUpdateManyWithWhereWithoutTenantInput | InvoiceUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
  }

  export type ServiceJobUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<ServiceJobCreateWithoutTenantInput, ServiceJobUncheckedCreateWithoutTenantInput> | ServiceJobCreateWithoutTenantInput[] | ServiceJobUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ServiceJobCreateOrConnectWithoutTenantInput | ServiceJobCreateOrConnectWithoutTenantInput[]
    upsert?: ServiceJobUpsertWithWhereUniqueWithoutTenantInput | ServiceJobUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: ServiceJobCreateManyTenantInputEnvelope
    set?: ServiceJobWhereUniqueInput | ServiceJobWhereUniqueInput[]
    disconnect?: ServiceJobWhereUniqueInput | ServiceJobWhereUniqueInput[]
    delete?: ServiceJobWhereUniqueInput | ServiceJobWhereUniqueInput[]
    connect?: ServiceJobWhereUniqueInput | ServiceJobWhereUniqueInput[]
    update?: ServiceJobUpdateWithWhereUniqueWithoutTenantInput | ServiceJobUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: ServiceJobUpdateManyWithWhereWithoutTenantInput | ServiceJobUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: ServiceJobScalarWhereInput | ServiceJobScalarWhereInput[]
  }

  export type InspectionPhotoUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<InspectionPhotoCreateWithoutTenantInput, InspectionPhotoUncheckedCreateWithoutTenantInput> | InspectionPhotoCreateWithoutTenantInput[] | InspectionPhotoUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: InspectionPhotoCreateOrConnectWithoutTenantInput | InspectionPhotoCreateOrConnectWithoutTenantInput[]
    upsert?: InspectionPhotoUpsertWithWhereUniqueWithoutTenantInput | InspectionPhotoUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: InspectionPhotoCreateManyTenantInputEnvelope
    set?: InspectionPhotoWhereUniqueInput | InspectionPhotoWhereUniqueInput[]
    disconnect?: InspectionPhotoWhereUniqueInput | InspectionPhotoWhereUniqueInput[]
    delete?: InspectionPhotoWhereUniqueInput | InspectionPhotoWhereUniqueInput[]
    connect?: InspectionPhotoWhereUniqueInput | InspectionPhotoWhereUniqueInput[]
    update?: InspectionPhotoUpdateWithWhereUniqueWithoutTenantInput | InspectionPhotoUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: InspectionPhotoUpdateManyWithWhereWithoutTenantInput | InspectionPhotoUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: InspectionPhotoScalarWhereInput | InspectionPhotoScalarWhereInput[]
  }

  export type ServiceReportUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<ServiceReportCreateWithoutTenantInput, ServiceReportUncheckedCreateWithoutTenantInput> | ServiceReportCreateWithoutTenantInput[] | ServiceReportUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ServiceReportCreateOrConnectWithoutTenantInput | ServiceReportCreateOrConnectWithoutTenantInput[]
    upsert?: ServiceReportUpsertWithWhereUniqueWithoutTenantInput | ServiceReportUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: ServiceReportCreateManyTenantInputEnvelope
    set?: ServiceReportWhereUniqueInput | ServiceReportWhereUniqueInput[]
    disconnect?: ServiceReportWhereUniqueInput | ServiceReportWhereUniqueInput[]
    delete?: ServiceReportWhereUniqueInput | ServiceReportWhereUniqueInput[]
    connect?: ServiceReportWhereUniqueInput | ServiceReportWhereUniqueInput[]
    update?: ServiceReportUpdateWithWhereUniqueWithoutTenantInput | ServiceReportUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: ServiceReportUpdateManyWithWhereWithoutTenantInput | ServiceReportUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: ServiceReportScalarWhereInput | ServiceReportScalarWhereInput[]
  }

  export type TenantCreateNestedOneWithoutUsersInput = {
    create?: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUsersInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUsersInput
    upsert?: TenantUpsertWithoutUsersInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutUsersInput, TenantUpdateWithoutUsersInput>, TenantUncheckedUpdateWithoutUsersInput>
  }

  export type TenantCreateNestedOneWithoutExtinguishersInput = {
    create?: XOR<TenantCreateWithoutExtinguishersInput, TenantUncheckedCreateWithoutExtinguishersInput>
    connectOrCreate?: TenantCreateOrConnectWithoutExtinguishersInput
    connect?: TenantWhereUniqueInput
  }

  export type InspectionCreateNestedManyWithoutExtinguisherInput = {
    create?: XOR<InspectionCreateWithoutExtinguisherInput, InspectionUncheckedCreateWithoutExtinguisherInput> | InspectionCreateWithoutExtinguisherInput[] | InspectionUncheckedCreateWithoutExtinguisherInput[]
    connectOrCreate?: InspectionCreateOrConnectWithoutExtinguisherInput | InspectionCreateOrConnectWithoutExtinguisherInput[]
    createMany?: InspectionCreateManyExtinguisherInputEnvelope
    connect?: InspectionWhereUniqueInput | InspectionWhereUniqueInput[]
  }

  export type InspectionUncheckedCreateNestedManyWithoutExtinguisherInput = {
    create?: XOR<InspectionCreateWithoutExtinguisherInput, InspectionUncheckedCreateWithoutExtinguisherInput> | InspectionCreateWithoutExtinguisherInput[] | InspectionUncheckedCreateWithoutExtinguisherInput[]
    connectOrCreate?: InspectionCreateOrConnectWithoutExtinguisherInput | InspectionCreateOrConnectWithoutExtinguisherInput[]
    createMany?: InspectionCreateManyExtinguisherInputEnvelope
    connect?: InspectionWhereUniqueInput | InspectionWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type TenantUpdateOneRequiredWithoutExtinguishersNestedInput = {
    create?: XOR<TenantCreateWithoutExtinguishersInput, TenantUncheckedCreateWithoutExtinguishersInput>
    connectOrCreate?: TenantCreateOrConnectWithoutExtinguishersInput
    upsert?: TenantUpsertWithoutExtinguishersInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutExtinguishersInput, TenantUpdateWithoutExtinguishersInput>, TenantUncheckedUpdateWithoutExtinguishersInput>
  }

  export type InspectionUpdateManyWithoutExtinguisherNestedInput = {
    create?: XOR<InspectionCreateWithoutExtinguisherInput, InspectionUncheckedCreateWithoutExtinguisherInput> | InspectionCreateWithoutExtinguisherInput[] | InspectionUncheckedCreateWithoutExtinguisherInput[]
    connectOrCreate?: InspectionCreateOrConnectWithoutExtinguisherInput | InspectionCreateOrConnectWithoutExtinguisherInput[]
    upsert?: InspectionUpsertWithWhereUniqueWithoutExtinguisherInput | InspectionUpsertWithWhereUniqueWithoutExtinguisherInput[]
    createMany?: InspectionCreateManyExtinguisherInputEnvelope
    set?: InspectionWhereUniqueInput | InspectionWhereUniqueInput[]
    disconnect?: InspectionWhereUniqueInput | InspectionWhereUniqueInput[]
    delete?: InspectionWhereUniqueInput | InspectionWhereUniqueInput[]
    connect?: InspectionWhereUniqueInput | InspectionWhereUniqueInput[]
    update?: InspectionUpdateWithWhereUniqueWithoutExtinguisherInput | InspectionUpdateWithWhereUniqueWithoutExtinguisherInput[]
    updateMany?: InspectionUpdateManyWithWhereWithoutExtinguisherInput | InspectionUpdateManyWithWhereWithoutExtinguisherInput[]
    deleteMany?: InspectionScalarWhereInput | InspectionScalarWhereInput[]
  }

  export type InspectionUncheckedUpdateManyWithoutExtinguisherNestedInput = {
    create?: XOR<InspectionCreateWithoutExtinguisherInput, InspectionUncheckedCreateWithoutExtinguisherInput> | InspectionCreateWithoutExtinguisherInput[] | InspectionUncheckedCreateWithoutExtinguisherInput[]
    connectOrCreate?: InspectionCreateOrConnectWithoutExtinguisherInput | InspectionCreateOrConnectWithoutExtinguisherInput[]
    upsert?: InspectionUpsertWithWhereUniqueWithoutExtinguisherInput | InspectionUpsertWithWhereUniqueWithoutExtinguisherInput[]
    createMany?: InspectionCreateManyExtinguisherInputEnvelope
    set?: InspectionWhereUniqueInput | InspectionWhereUniqueInput[]
    disconnect?: InspectionWhereUniqueInput | InspectionWhereUniqueInput[]
    delete?: InspectionWhereUniqueInput | InspectionWhereUniqueInput[]
    connect?: InspectionWhereUniqueInput | InspectionWhereUniqueInput[]
    update?: InspectionUpdateWithWhereUniqueWithoutExtinguisherInput | InspectionUpdateWithWhereUniqueWithoutExtinguisherInput[]
    updateMany?: InspectionUpdateManyWithWhereWithoutExtinguisherInput | InspectionUpdateManyWithWhereWithoutExtinguisherInput[]
    deleteMany?: InspectionScalarWhereInput | InspectionScalarWhereInput[]
  }

  export type TenantCreateNestedOneWithoutInspectionsInput = {
    create?: XOR<TenantCreateWithoutInspectionsInput, TenantUncheckedCreateWithoutInspectionsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutInspectionsInput
    connect?: TenantWhereUniqueInput
  }

  export type ExtinguisherCreateNestedOneWithoutInspectionsInput = {
    create?: XOR<ExtinguisherCreateWithoutInspectionsInput, ExtinguisherUncheckedCreateWithoutInspectionsInput>
    connectOrCreate?: ExtinguisherCreateOrConnectWithoutInspectionsInput
    connect?: ExtinguisherWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutInspectionsNestedInput = {
    create?: XOR<TenantCreateWithoutInspectionsInput, TenantUncheckedCreateWithoutInspectionsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutInspectionsInput
    upsert?: TenantUpsertWithoutInspectionsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutInspectionsInput, TenantUpdateWithoutInspectionsInput>, TenantUncheckedUpdateWithoutInspectionsInput>
  }

  export type ExtinguisherUpdateOneRequiredWithoutInspectionsNestedInput = {
    create?: XOR<ExtinguisherCreateWithoutInspectionsInput, ExtinguisherUncheckedCreateWithoutInspectionsInput>
    connectOrCreate?: ExtinguisherCreateOrConnectWithoutInspectionsInput
    upsert?: ExtinguisherUpsertWithoutInspectionsInput
    connect?: ExtinguisherWhereUniqueInput
    update?: XOR<XOR<ExtinguisherUpdateToOneWithWhereWithoutInspectionsInput, ExtinguisherUpdateWithoutInspectionsInput>, ExtinguisherUncheckedUpdateWithoutInspectionsInput>
  }

  export type TenantCreateNestedOneWithoutSubscriptionsInput = {
    create?: XOR<TenantCreateWithoutSubscriptionsInput, TenantUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutSubscriptionsInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutSubscriptionsNestedInput = {
    create?: XOR<TenantCreateWithoutSubscriptionsInput, TenantUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutSubscriptionsInput
    upsert?: TenantUpsertWithoutSubscriptionsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutSubscriptionsInput, TenantUpdateWithoutSubscriptionsInput>, TenantUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type TenantCreateNestedOneWithoutInvoicesInput = {
    create?: XOR<TenantCreateWithoutInvoicesInput, TenantUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutInvoicesInput
    connect?: TenantWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TenantUpdateOneRequiredWithoutInvoicesNestedInput = {
    create?: XOR<TenantCreateWithoutInvoicesInput, TenantUncheckedCreateWithoutInvoicesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutInvoicesInput
    upsert?: TenantUpsertWithoutInvoicesInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutInvoicesInput, TenantUpdateWithoutInvoicesInput>, TenantUncheckedUpdateWithoutInvoicesInput>
  }

  export type TenantCreateNestedOneWithoutServiceJobsInput = {
    create?: XOR<TenantCreateWithoutServiceJobsInput, TenantUncheckedCreateWithoutServiceJobsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutServiceJobsInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutServiceJobsNestedInput = {
    create?: XOR<TenantCreateWithoutServiceJobsInput, TenantUncheckedCreateWithoutServiceJobsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutServiceJobsInput
    upsert?: TenantUpsertWithoutServiceJobsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutServiceJobsInput, TenantUpdateWithoutServiceJobsInput>, TenantUncheckedUpdateWithoutServiceJobsInput>
  }

  export type TenantCreateNestedOneWithoutInspectionPhotosInput = {
    create?: XOR<TenantCreateWithoutInspectionPhotosInput, TenantUncheckedCreateWithoutInspectionPhotosInput>
    connectOrCreate?: TenantCreateOrConnectWithoutInspectionPhotosInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutInspectionPhotosNestedInput = {
    create?: XOR<TenantCreateWithoutInspectionPhotosInput, TenantUncheckedCreateWithoutInspectionPhotosInput>
    connectOrCreate?: TenantCreateOrConnectWithoutInspectionPhotosInput
    upsert?: TenantUpsertWithoutInspectionPhotosInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutInspectionPhotosInput, TenantUpdateWithoutInspectionPhotosInput>, TenantUncheckedUpdateWithoutInspectionPhotosInput>
  }

  export type ServiceReportCreatejobIdsInput = {
    set: string[]
  }

  export type TenantCreateNestedOneWithoutServiceReportsInput = {
    create?: XOR<TenantCreateWithoutServiceReportsInput, TenantUncheckedCreateWithoutServiceReportsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutServiceReportsInput
    connect?: TenantWhereUniqueInput
  }

  export type ServiceReportUpdatejobIdsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type TenantUpdateOneRequiredWithoutServiceReportsNestedInput = {
    create?: XOR<TenantCreateWithoutServiceReportsInput, TenantUncheckedCreateWithoutServiceReportsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutServiceReportsInput
    upsert?: TenantUpsertWithoutServiceReportsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutServiceReportsInput, TenantUpdateWithoutServiceReportsInput>, TenantUncheckedUpdateWithoutServiceReportsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type UserCreateWithoutTenantInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: string
    status?: string
    createdAt?: Date | string
  }

  export type UserUncheckedCreateWithoutTenantInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: string
    status?: string
    createdAt?: Date | string
  }

  export type UserCreateOrConnectWithoutTenantInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput>
  }

  export type UserCreateManyTenantInputEnvelope = {
    data: UserCreateManyTenantInput | UserCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type ExtinguisherCreateWithoutTenantInput = {
    id?: string
    externalId?: string | null
    location: string
    building: string
    floor?: string | null
    type: string
    capacity?: string | null
    manufacturer?: string | null
    model?: string | null
    serialNumber?: string | null
    installDate?: Date | string | null
    expiryDate?: Date | string | null
    lastInspection?: Date | string | null
    nextInspection?: Date | string | null
    lastMaintenance?: Date | string | null
    nextMaintenance?: Date | string | null
    status?: string
    condition?: string
    serviceType?: string | null
    inspector?: string | null
    notes?: string | null
    createdAt?: Date | string
    inspections?: InspectionCreateNestedManyWithoutExtinguisherInput
  }

  export type ExtinguisherUncheckedCreateWithoutTenantInput = {
    id?: string
    externalId?: string | null
    location: string
    building: string
    floor?: string | null
    type: string
    capacity?: string | null
    manufacturer?: string | null
    model?: string | null
    serialNumber?: string | null
    installDate?: Date | string | null
    expiryDate?: Date | string | null
    lastInspection?: Date | string | null
    nextInspection?: Date | string | null
    lastMaintenance?: Date | string | null
    nextMaintenance?: Date | string | null
    status?: string
    condition?: string
    serviceType?: string | null
    inspector?: string | null
    notes?: string | null
    createdAt?: Date | string
    inspections?: InspectionUncheckedCreateNestedManyWithoutExtinguisherInput
  }

  export type ExtinguisherCreateOrConnectWithoutTenantInput = {
    where: ExtinguisherWhereUniqueInput
    create: XOR<ExtinguisherCreateWithoutTenantInput, ExtinguisherUncheckedCreateWithoutTenantInput>
  }

  export type ExtinguisherCreateManyTenantInputEnvelope = {
    data: ExtinguisherCreateManyTenantInput | ExtinguisherCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type InspectionCreateWithoutTenantInput = {
    id?: string
    serviceDate: Date | string
    serviceType: string
    technician?: string | null
    condition: string
    notes?: string | null
    partsReplaced?: string | null
    nextServiceDate?: Date | string | null
    createdAt?: Date | string
    extinguisher: ExtinguisherCreateNestedOneWithoutInspectionsInput
  }

  export type InspectionUncheckedCreateWithoutTenantInput = {
    id?: string
    extinguisherId: string
    serviceDate: Date | string
    serviceType: string
    technician?: string | null
    condition: string
    notes?: string | null
    partsReplaced?: string | null
    nextServiceDate?: Date | string | null
    createdAt?: Date | string
  }

  export type InspectionCreateOrConnectWithoutTenantInput = {
    where: InspectionWhereUniqueInput
    create: XOR<InspectionCreateWithoutTenantInput, InspectionUncheckedCreateWithoutTenantInput>
  }

  export type InspectionCreateManyTenantInputEnvelope = {
    data: InspectionCreateManyTenantInput | InspectionCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type SubscriptionCreateWithoutTenantInput = {
    id?: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    plan: string
    status: string
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    trialEnd?: Date | string | null
    createdAt?: Date | string
  }

  export type SubscriptionUncheckedCreateWithoutTenantInput = {
    id?: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    plan: string
    status: string
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    trialEnd?: Date | string | null
    createdAt?: Date | string
  }

  export type SubscriptionCreateOrConnectWithoutTenantInput = {
    where: SubscriptionWhereUniqueInput
    create: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput>
  }

  export type SubscriptionCreateManyTenantInputEnvelope = {
    data: SubscriptionCreateManyTenantInput | SubscriptionCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type InvoiceCreateWithoutTenantInput = {
    id?: string
    stripeInvoiceId?: string | null
    amount: number
    status: string
    createdAt?: Date | string
  }

  export type InvoiceUncheckedCreateWithoutTenantInput = {
    id?: string
    stripeInvoiceId?: string | null
    amount: number
    status: string
    createdAt?: Date | string
  }

  export type InvoiceCreateOrConnectWithoutTenantInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutTenantInput, InvoiceUncheckedCreateWithoutTenantInput>
  }

  export type InvoiceCreateManyTenantInputEnvelope = {
    data: InvoiceCreateManyTenantInput | InvoiceCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type ServiceJobCreateWithoutTenantInput = {
    id?: string
    extinguisherId?: string | null
    location: string
    building: string
    type: string
    serviceType: string
    status?: string
    notes?: string | null
    scheduledDate?: Date | string | null
    completedDate?: Date | string | null
    technician?: string | null
    createdAt?: Date | string
  }

  export type ServiceJobUncheckedCreateWithoutTenantInput = {
    id?: string
    extinguisherId?: string | null
    location: string
    building: string
    type: string
    serviceType: string
    status?: string
    notes?: string | null
    scheduledDate?: Date | string | null
    completedDate?: Date | string | null
    technician?: string | null
    createdAt?: Date | string
  }

  export type ServiceJobCreateOrConnectWithoutTenantInput = {
    where: ServiceJobWhereUniqueInput
    create: XOR<ServiceJobCreateWithoutTenantInput, ServiceJobUncheckedCreateWithoutTenantInput>
  }

  export type ServiceJobCreateManyTenantInputEnvelope = {
    data: ServiceJobCreateManyTenantInput | ServiceJobCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type InspectionPhotoCreateWithoutTenantInput = {
    id?: string
    extinguisherId?: string | null
    inspectionId?: string | null
    photoUrl: string
    caption?: string | null
    uploadedBy?: string | null
    createdAt?: Date | string
  }

  export type InspectionPhotoUncheckedCreateWithoutTenantInput = {
    id?: string
    extinguisherId?: string | null
    inspectionId?: string | null
    photoUrl: string
    caption?: string | null
    uploadedBy?: string | null
    createdAt?: Date | string
  }

  export type InspectionPhotoCreateOrConnectWithoutTenantInput = {
    where: InspectionPhotoWhereUniqueInput
    create: XOR<InspectionPhotoCreateWithoutTenantInput, InspectionPhotoUncheckedCreateWithoutTenantInput>
  }

  export type InspectionPhotoCreateManyTenantInputEnvelope = {
    data: InspectionPhotoCreateManyTenantInput | InspectionPhotoCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type ServiceReportCreateWithoutTenantInput = {
    id?: string
    visitDate: Date | string
    technician?: string | null
    jobIds?: ServiceReportCreatejobIdsInput | string[]
    pdfUrl: string
    createdAt?: Date | string
  }

  export type ServiceReportUncheckedCreateWithoutTenantInput = {
    id?: string
    visitDate: Date | string
    technician?: string | null
    jobIds?: ServiceReportCreatejobIdsInput | string[]
    pdfUrl: string
    createdAt?: Date | string
  }

  export type ServiceReportCreateOrConnectWithoutTenantInput = {
    where: ServiceReportWhereUniqueInput
    create: XOR<ServiceReportCreateWithoutTenantInput, ServiceReportUncheckedCreateWithoutTenantInput>
  }

  export type ServiceReportCreateManyTenantInputEnvelope = {
    data: ServiceReportCreateManyTenantInput | ServiceReportCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutTenantInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutTenantInput, UserUncheckedUpdateWithoutTenantInput>
    create: XOR<UserCreateWithoutTenantInput, UserUncheckedCreateWithoutTenantInput>
  }

  export type UserUpdateWithWhereUniqueWithoutTenantInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutTenantInput, UserUncheckedUpdateWithoutTenantInput>
  }

  export type UserUpdateManyWithWhereWithoutTenantInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutTenantInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    tenantId?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    status?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
  }

  export type ExtinguisherUpsertWithWhereUniqueWithoutTenantInput = {
    where: ExtinguisherWhereUniqueInput
    update: XOR<ExtinguisherUpdateWithoutTenantInput, ExtinguisherUncheckedUpdateWithoutTenantInput>
    create: XOR<ExtinguisherCreateWithoutTenantInput, ExtinguisherUncheckedCreateWithoutTenantInput>
  }

  export type ExtinguisherUpdateWithWhereUniqueWithoutTenantInput = {
    where: ExtinguisherWhereUniqueInput
    data: XOR<ExtinguisherUpdateWithoutTenantInput, ExtinguisherUncheckedUpdateWithoutTenantInput>
  }

  export type ExtinguisherUpdateManyWithWhereWithoutTenantInput = {
    where: ExtinguisherScalarWhereInput
    data: XOR<ExtinguisherUpdateManyMutationInput, ExtinguisherUncheckedUpdateManyWithoutTenantInput>
  }

  export type ExtinguisherScalarWhereInput = {
    AND?: ExtinguisherScalarWhereInput | ExtinguisherScalarWhereInput[]
    OR?: ExtinguisherScalarWhereInput[]
    NOT?: ExtinguisherScalarWhereInput | ExtinguisherScalarWhereInput[]
    id?: StringFilter<"Extinguisher"> | string
    tenantId?: StringFilter<"Extinguisher"> | string
    externalId?: StringNullableFilter<"Extinguisher"> | string | null
    location?: StringFilter<"Extinguisher"> | string
    building?: StringFilter<"Extinguisher"> | string
    floor?: StringNullableFilter<"Extinguisher"> | string | null
    type?: StringFilter<"Extinguisher"> | string
    capacity?: StringNullableFilter<"Extinguisher"> | string | null
    manufacturer?: StringNullableFilter<"Extinguisher"> | string | null
    model?: StringNullableFilter<"Extinguisher"> | string | null
    serialNumber?: StringNullableFilter<"Extinguisher"> | string | null
    installDate?: DateTimeNullableFilter<"Extinguisher"> | Date | string | null
    expiryDate?: DateTimeNullableFilter<"Extinguisher"> | Date | string | null
    lastInspection?: DateTimeNullableFilter<"Extinguisher"> | Date | string | null
    nextInspection?: DateTimeNullableFilter<"Extinguisher"> | Date | string | null
    lastMaintenance?: DateTimeNullableFilter<"Extinguisher"> | Date | string | null
    nextMaintenance?: DateTimeNullableFilter<"Extinguisher"> | Date | string | null
    status?: StringFilter<"Extinguisher"> | string
    condition?: StringFilter<"Extinguisher"> | string
    serviceType?: StringNullableFilter<"Extinguisher"> | string | null
    inspector?: StringNullableFilter<"Extinguisher"> | string | null
    notes?: StringNullableFilter<"Extinguisher"> | string | null
    createdAt?: DateTimeFilter<"Extinguisher"> | Date | string
  }

  export type InspectionUpsertWithWhereUniqueWithoutTenantInput = {
    where: InspectionWhereUniqueInput
    update: XOR<InspectionUpdateWithoutTenantInput, InspectionUncheckedUpdateWithoutTenantInput>
    create: XOR<InspectionCreateWithoutTenantInput, InspectionUncheckedCreateWithoutTenantInput>
  }

  export type InspectionUpdateWithWhereUniqueWithoutTenantInput = {
    where: InspectionWhereUniqueInput
    data: XOR<InspectionUpdateWithoutTenantInput, InspectionUncheckedUpdateWithoutTenantInput>
  }

  export type InspectionUpdateManyWithWhereWithoutTenantInput = {
    where: InspectionScalarWhereInput
    data: XOR<InspectionUpdateManyMutationInput, InspectionUncheckedUpdateManyWithoutTenantInput>
  }

  export type InspectionScalarWhereInput = {
    AND?: InspectionScalarWhereInput | InspectionScalarWhereInput[]
    OR?: InspectionScalarWhereInput[]
    NOT?: InspectionScalarWhereInput | InspectionScalarWhereInput[]
    id?: StringFilter<"Inspection"> | string
    tenantId?: StringFilter<"Inspection"> | string
    extinguisherId?: StringFilter<"Inspection"> | string
    serviceDate?: DateTimeFilter<"Inspection"> | Date | string
    serviceType?: StringFilter<"Inspection"> | string
    technician?: StringNullableFilter<"Inspection"> | string | null
    condition?: StringFilter<"Inspection"> | string
    notes?: StringNullableFilter<"Inspection"> | string | null
    partsReplaced?: StringNullableFilter<"Inspection"> | string | null
    nextServiceDate?: DateTimeNullableFilter<"Inspection"> | Date | string | null
    createdAt?: DateTimeFilter<"Inspection"> | Date | string
  }

  export type SubscriptionUpsertWithWhereUniqueWithoutTenantInput = {
    where: SubscriptionWhereUniqueInput
    update: XOR<SubscriptionUpdateWithoutTenantInput, SubscriptionUncheckedUpdateWithoutTenantInput>
    create: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput>
  }

  export type SubscriptionUpdateWithWhereUniqueWithoutTenantInput = {
    where: SubscriptionWhereUniqueInput
    data: XOR<SubscriptionUpdateWithoutTenantInput, SubscriptionUncheckedUpdateWithoutTenantInput>
  }

  export type SubscriptionUpdateManyWithWhereWithoutTenantInput = {
    where: SubscriptionScalarWhereInput
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyWithoutTenantInput>
  }

  export type SubscriptionScalarWhereInput = {
    AND?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
    OR?: SubscriptionScalarWhereInput[]
    NOT?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
    id?: StringFilter<"Subscription"> | string
    tenantId?: StringFilter<"Subscription"> | string
    stripeCustomerId?: StringNullableFilter<"Subscription"> | string | null
    stripeSubscriptionId?: StringNullableFilter<"Subscription"> | string | null
    plan?: StringFilter<"Subscription"> | string
    status?: StringFilter<"Subscription"> | string
    currentPeriodStart?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    currentPeriodEnd?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    trialEnd?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
  }

  export type InvoiceUpsertWithWhereUniqueWithoutTenantInput = {
    where: InvoiceWhereUniqueInput
    update: XOR<InvoiceUpdateWithoutTenantInput, InvoiceUncheckedUpdateWithoutTenantInput>
    create: XOR<InvoiceCreateWithoutTenantInput, InvoiceUncheckedCreateWithoutTenantInput>
  }

  export type InvoiceUpdateWithWhereUniqueWithoutTenantInput = {
    where: InvoiceWhereUniqueInput
    data: XOR<InvoiceUpdateWithoutTenantInput, InvoiceUncheckedUpdateWithoutTenantInput>
  }

  export type InvoiceUpdateManyWithWhereWithoutTenantInput = {
    where: InvoiceScalarWhereInput
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyWithoutTenantInput>
  }

  export type InvoiceScalarWhereInput = {
    AND?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
    OR?: InvoiceScalarWhereInput[]
    NOT?: InvoiceScalarWhereInput | InvoiceScalarWhereInput[]
    id?: StringFilter<"Invoice"> | string
    tenantId?: StringFilter<"Invoice"> | string
    stripeInvoiceId?: StringNullableFilter<"Invoice"> | string | null
    amount?: IntFilter<"Invoice"> | number
    status?: StringFilter<"Invoice"> | string
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
  }

  export type ServiceJobUpsertWithWhereUniqueWithoutTenantInput = {
    where: ServiceJobWhereUniqueInput
    update: XOR<ServiceJobUpdateWithoutTenantInput, ServiceJobUncheckedUpdateWithoutTenantInput>
    create: XOR<ServiceJobCreateWithoutTenantInput, ServiceJobUncheckedCreateWithoutTenantInput>
  }

  export type ServiceJobUpdateWithWhereUniqueWithoutTenantInput = {
    where: ServiceJobWhereUniqueInput
    data: XOR<ServiceJobUpdateWithoutTenantInput, ServiceJobUncheckedUpdateWithoutTenantInput>
  }

  export type ServiceJobUpdateManyWithWhereWithoutTenantInput = {
    where: ServiceJobScalarWhereInput
    data: XOR<ServiceJobUpdateManyMutationInput, ServiceJobUncheckedUpdateManyWithoutTenantInput>
  }

  export type ServiceJobScalarWhereInput = {
    AND?: ServiceJobScalarWhereInput | ServiceJobScalarWhereInput[]
    OR?: ServiceJobScalarWhereInput[]
    NOT?: ServiceJobScalarWhereInput | ServiceJobScalarWhereInput[]
    id?: StringFilter<"ServiceJob"> | string
    tenantId?: StringFilter<"ServiceJob"> | string
    extinguisherId?: StringNullableFilter<"ServiceJob"> | string | null
    location?: StringFilter<"ServiceJob"> | string
    building?: StringFilter<"ServiceJob"> | string
    type?: StringFilter<"ServiceJob"> | string
    serviceType?: StringFilter<"ServiceJob"> | string
    status?: StringFilter<"ServiceJob"> | string
    notes?: StringNullableFilter<"ServiceJob"> | string | null
    scheduledDate?: DateTimeNullableFilter<"ServiceJob"> | Date | string | null
    completedDate?: DateTimeNullableFilter<"ServiceJob"> | Date | string | null
    technician?: StringNullableFilter<"ServiceJob"> | string | null
    createdAt?: DateTimeFilter<"ServiceJob"> | Date | string
  }

  export type InspectionPhotoUpsertWithWhereUniqueWithoutTenantInput = {
    where: InspectionPhotoWhereUniqueInput
    update: XOR<InspectionPhotoUpdateWithoutTenantInput, InspectionPhotoUncheckedUpdateWithoutTenantInput>
    create: XOR<InspectionPhotoCreateWithoutTenantInput, InspectionPhotoUncheckedCreateWithoutTenantInput>
  }

  export type InspectionPhotoUpdateWithWhereUniqueWithoutTenantInput = {
    where: InspectionPhotoWhereUniqueInput
    data: XOR<InspectionPhotoUpdateWithoutTenantInput, InspectionPhotoUncheckedUpdateWithoutTenantInput>
  }

  export type InspectionPhotoUpdateManyWithWhereWithoutTenantInput = {
    where: InspectionPhotoScalarWhereInput
    data: XOR<InspectionPhotoUpdateManyMutationInput, InspectionPhotoUncheckedUpdateManyWithoutTenantInput>
  }

  export type InspectionPhotoScalarWhereInput = {
    AND?: InspectionPhotoScalarWhereInput | InspectionPhotoScalarWhereInput[]
    OR?: InspectionPhotoScalarWhereInput[]
    NOT?: InspectionPhotoScalarWhereInput | InspectionPhotoScalarWhereInput[]
    id?: StringFilter<"InspectionPhoto"> | string
    tenantId?: StringFilter<"InspectionPhoto"> | string
    extinguisherId?: StringNullableFilter<"InspectionPhoto"> | string | null
    inspectionId?: StringNullableFilter<"InspectionPhoto"> | string | null
    photoUrl?: StringFilter<"InspectionPhoto"> | string
    caption?: StringNullableFilter<"InspectionPhoto"> | string | null
    uploadedBy?: StringNullableFilter<"InspectionPhoto"> | string | null
    createdAt?: DateTimeFilter<"InspectionPhoto"> | Date | string
  }

  export type ServiceReportUpsertWithWhereUniqueWithoutTenantInput = {
    where: ServiceReportWhereUniqueInput
    update: XOR<ServiceReportUpdateWithoutTenantInput, ServiceReportUncheckedUpdateWithoutTenantInput>
    create: XOR<ServiceReportCreateWithoutTenantInput, ServiceReportUncheckedCreateWithoutTenantInput>
  }

  export type ServiceReportUpdateWithWhereUniqueWithoutTenantInput = {
    where: ServiceReportWhereUniqueInput
    data: XOR<ServiceReportUpdateWithoutTenantInput, ServiceReportUncheckedUpdateWithoutTenantInput>
  }

  export type ServiceReportUpdateManyWithWhereWithoutTenantInput = {
    where: ServiceReportScalarWhereInput
    data: XOR<ServiceReportUpdateManyMutationInput, ServiceReportUncheckedUpdateManyWithoutTenantInput>
  }

  export type ServiceReportScalarWhereInput = {
    AND?: ServiceReportScalarWhereInput | ServiceReportScalarWhereInput[]
    OR?: ServiceReportScalarWhereInput[]
    NOT?: ServiceReportScalarWhereInput | ServiceReportScalarWhereInput[]
    id?: StringFilter<"ServiceReport"> | string
    tenantId?: StringFilter<"ServiceReport"> | string
    visitDate?: DateTimeFilter<"ServiceReport"> | Date | string
    technician?: StringNullableFilter<"ServiceReport"> | string | null
    jobIds?: StringNullableListFilter<"ServiceReport">
    pdfUrl?: StringFilter<"ServiceReport"> | string
    createdAt?: DateTimeFilter<"ServiceReport"> | Date | string
  }

  export type TenantCreateWithoutUsersInput = {
    id?: string
    companyName: string
    subdomain: string
    logoUrl?: string | null
    subscriptionPlan?: string
    subscriptionStatus?: string
    createdAt?: Date | string
    extinguishers?: ExtinguisherCreateNestedManyWithoutTenantInput
    inspections?: InspectionCreateNestedManyWithoutTenantInput
    subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput
    invoices?: InvoiceCreateNestedManyWithoutTenantInput
    serviceJobs?: ServiceJobCreateNestedManyWithoutTenantInput
    inspectionPhotos?: InspectionPhotoCreateNestedManyWithoutTenantInput
    serviceReports?: ServiceReportCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutUsersInput = {
    id?: string
    companyName: string
    subdomain: string
    logoUrl?: string | null
    subscriptionPlan?: string
    subscriptionStatus?: string
    createdAt?: Date | string
    extinguishers?: ExtinguisherUncheckedCreateNestedManyWithoutTenantInput
    inspections?: InspectionUncheckedCreateNestedManyWithoutTenantInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutTenantInput
    serviceJobs?: ServiceJobUncheckedCreateNestedManyWithoutTenantInput
    inspectionPhotos?: InspectionPhotoUncheckedCreateNestedManyWithoutTenantInput
    serviceReports?: ServiceReportUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutUsersInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
  }

  export type TenantUpsertWithoutUsersInput = {
    update: XOR<TenantUpdateWithoutUsersInput, TenantUncheckedUpdateWithoutUsersInput>
    create: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutUsersInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutUsersInput, TenantUncheckedUpdateWithoutUsersInput>
  }

  export type TenantUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionPlan?: StringFieldUpdateOperationsInput | string
    subscriptionStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    extinguishers?: ExtinguisherUpdateManyWithoutTenantNestedInput
    inspections?: InspectionUpdateManyWithoutTenantNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUpdateManyWithoutTenantNestedInput
    serviceJobs?: ServiceJobUpdateManyWithoutTenantNestedInput
    inspectionPhotos?: InspectionPhotoUpdateManyWithoutTenantNestedInput
    serviceReports?: ServiceReportUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionPlan?: StringFieldUpdateOperationsInput | string
    subscriptionStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    extinguishers?: ExtinguisherUncheckedUpdateManyWithoutTenantNestedInput
    inspections?: InspectionUncheckedUpdateManyWithoutTenantNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutTenantNestedInput
    serviceJobs?: ServiceJobUncheckedUpdateManyWithoutTenantNestedInput
    inspectionPhotos?: InspectionPhotoUncheckedUpdateManyWithoutTenantNestedInput
    serviceReports?: ServiceReportUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutExtinguishersInput = {
    id?: string
    companyName: string
    subdomain: string
    logoUrl?: string | null
    subscriptionPlan?: string
    subscriptionStatus?: string
    createdAt?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    inspections?: InspectionCreateNestedManyWithoutTenantInput
    subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput
    invoices?: InvoiceCreateNestedManyWithoutTenantInput
    serviceJobs?: ServiceJobCreateNestedManyWithoutTenantInput
    inspectionPhotos?: InspectionPhotoCreateNestedManyWithoutTenantInput
    serviceReports?: ServiceReportCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutExtinguishersInput = {
    id?: string
    companyName: string
    subdomain: string
    logoUrl?: string | null
    subscriptionPlan?: string
    subscriptionStatus?: string
    createdAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    inspections?: InspectionUncheckedCreateNestedManyWithoutTenantInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutTenantInput
    serviceJobs?: ServiceJobUncheckedCreateNestedManyWithoutTenantInput
    inspectionPhotos?: InspectionPhotoUncheckedCreateNestedManyWithoutTenantInput
    serviceReports?: ServiceReportUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutExtinguishersInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutExtinguishersInput, TenantUncheckedCreateWithoutExtinguishersInput>
  }

  export type InspectionCreateWithoutExtinguisherInput = {
    id?: string
    serviceDate: Date | string
    serviceType: string
    technician?: string | null
    condition: string
    notes?: string | null
    partsReplaced?: string | null
    nextServiceDate?: Date | string | null
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutInspectionsInput
  }

  export type InspectionUncheckedCreateWithoutExtinguisherInput = {
    id?: string
    tenantId: string
    serviceDate: Date | string
    serviceType: string
    technician?: string | null
    condition: string
    notes?: string | null
    partsReplaced?: string | null
    nextServiceDate?: Date | string | null
    createdAt?: Date | string
  }

  export type InspectionCreateOrConnectWithoutExtinguisherInput = {
    where: InspectionWhereUniqueInput
    create: XOR<InspectionCreateWithoutExtinguisherInput, InspectionUncheckedCreateWithoutExtinguisherInput>
  }

  export type InspectionCreateManyExtinguisherInputEnvelope = {
    data: InspectionCreateManyExtinguisherInput | InspectionCreateManyExtinguisherInput[]
    skipDuplicates?: boolean
  }

  export type TenantUpsertWithoutExtinguishersInput = {
    update: XOR<TenantUpdateWithoutExtinguishersInput, TenantUncheckedUpdateWithoutExtinguishersInput>
    create: XOR<TenantCreateWithoutExtinguishersInput, TenantUncheckedCreateWithoutExtinguishersInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutExtinguishersInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutExtinguishersInput, TenantUncheckedUpdateWithoutExtinguishersInput>
  }

  export type TenantUpdateWithoutExtinguishersInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionPlan?: StringFieldUpdateOperationsInput | string
    subscriptionStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    inspections?: InspectionUpdateManyWithoutTenantNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUpdateManyWithoutTenantNestedInput
    serviceJobs?: ServiceJobUpdateManyWithoutTenantNestedInput
    inspectionPhotos?: InspectionPhotoUpdateManyWithoutTenantNestedInput
    serviceReports?: ServiceReportUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutExtinguishersInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionPlan?: StringFieldUpdateOperationsInput | string
    subscriptionStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    inspections?: InspectionUncheckedUpdateManyWithoutTenantNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutTenantNestedInput
    serviceJobs?: ServiceJobUncheckedUpdateManyWithoutTenantNestedInput
    inspectionPhotos?: InspectionPhotoUncheckedUpdateManyWithoutTenantNestedInput
    serviceReports?: ServiceReportUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type InspectionUpsertWithWhereUniqueWithoutExtinguisherInput = {
    where: InspectionWhereUniqueInput
    update: XOR<InspectionUpdateWithoutExtinguisherInput, InspectionUncheckedUpdateWithoutExtinguisherInput>
    create: XOR<InspectionCreateWithoutExtinguisherInput, InspectionUncheckedCreateWithoutExtinguisherInput>
  }

  export type InspectionUpdateWithWhereUniqueWithoutExtinguisherInput = {
    where: InspectionWhereUniqueInput
    data: XOR<InspectionUpdateWithoutExtinguisherInput, InspectionUncheckedUpdateWithoutExtinguisherInput>
  }

  export type InspectionUpdateManyWithWhereWithoutExtinguisherInput = {
    where: InspectionScalarWhereInput
    data: XOR<InspectionUpdateManyMutationInput, InspectionUncheckedUpdateManyWithoutExtinguisherInput>
  }

  export type TenantCreateWithoutInspectionsInput = {
    id?: string
    companyName: string
    subdomain: string
    logoUrl?: string | null
    subscriptionPlan?: string
    subscriptionStatus?: string
    createdAt?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    extinguishers?: ExtinguisherCreateNestedManyWithoutTenantInput
    subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput
    invoices?: InvoiceCreateNestedManyWithoutTenantInput
    serviceJobs?: ServiceJobCreateNestedManyWithoutTenantInput
    inspectionPhotos?: InspectionPhotoCreateNestedManyWithoutTenantInput
    serviceReports?: ServiceReportCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutInspectionsInput = {
    id?: string
    companyName: string
    subdomain: string
    logoUrl?: string | null
    subscriptionPlan?: string
    subscriptionStatus?: string
    createdAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    extinguishers?: ExtinguisherUncheckedCreateNestedManyWithoutTenantInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutTenantInput
    serviceJobs?: ServiceJobUncheckedCreateNestedManyWithoutTenantInput
    inspectionPhotos?: InspectionPhotoUncheckedCreateNestedManyWithoutTenantInput
    serviceReports?: ServiceReportUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutInspectionsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutInspectionsInput, TenantUncheckedCreateWithoutInspectionsInput>
  }

  export type ExtinguisherCreateWithoutInspectionsInput = {
    id?: string
    externalId?: string | null
    location: string
    building: string
    floor?: string | null
    type: string
    capacity?: string | null
    manufacturer?: string | null
    model?: string | null
    serialNumber?: string | null
    installDate?: Date | string | null
    expiryDate?: Date | string | null
    lastInspection?: Date | string | null
    nextInspection?: Date | string | null
    lastMaintenance?: Date | string | null
    nextMaintenance?: Date | string | null
    status?: string
    condition?: string
    serviceType?: string | null
    inspector?: string | null
    notes?: string | null
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutExtinguishersInput
  }

  export type ExtinguisherUncheckedCreateWithoutInspectionsInput = {
    id?: string
    tenantId: string
    externalId?: string | null
    location: string
    building: string
    floor?: string | null
    type: string
    capacity?: string | null
    manufacturer?: string | null
    model?: string | null
    serialNumber?: string | null
    installDate?: Date | string | null
    expiryDate?: Date | string | null
    lastInspection?: Date | string | null
    nextInspection?: Date | string | null
    lastMaintenance?: Date | string | null
    nextMaintenance?: Date | string | null
    status?: string
    condition?: string
    serviceType?: string | null
    inspector?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type ExtinguisherCreateOrConnectWithoutInspectionsInput = {
    where: ExtinguisherWhereUniqueInput
    create: XOR<ExtinguisherCreateWithoutInspectionsInput, ExtinguisherUncheckedCreateWithoutInspectionsInput>
  }

  export type TenantUpsertWithoutInspectionsInput = {
    update: XOR<TenantUpdateWithoutInspectionsInput, TenantUncheckedUpdateWithoutInspectionsInput>
    create: XOR<TenantCreateWithoutInspectionsInput, TenantUncheckedCreateWithoutInspectionsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutInspectionsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutInspectionsInput, TenantUncheckedUpdateWithoutInspectionsInput>
  }

  export type TenantUpdateWithoutInspectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionPlan?: StringFieldUpdateOperationsInput | string
    subscriptionStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    extinguishers?: ExtinguisherUpdateManyWithoutTenantNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUpdateManyWithoutTenantNestedInput
    serviceJobs?: ServiceJobUpdateManyWithoutTenantNestedInput
    inspectionPhotos?: InspectionPhotoUpdateManyWithoutTenantNestedInput
    serviceReports?: ServiceReportUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutInspectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionPlan?: StringFieldUpdateOperationsInput | string
    subscriptionStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    extinguishers?: ExtinguisherUncheckedUpdateManyWithoutTenantNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutTenantNestedInput
    serviceJobs?: ServiceJobUncheckedUpdateManyWithoutTenantNestedInput
    inspectionPhotos?: InspectionPhotoUncheckedUpdateManyWithoutTenantNestedInput
    serviceReports?: ServiceReportUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type ExtinguisherUpsertWithoutInspectionsInput = {
    update: XOR<ExtinguisherUpdateWithoutInspectionsInput, ExtinguisherUncheckedUpdateWithoutInspectionsInput>
    create: XOR<ExtinguisherCreateWithoutInspectionsInput, ExtinguisherUncheckedCreateWithoutInspectionsInput>
    where?: ExtinguisherWhereInput
  }

  export type ExtinguisherUpdateToOneWithWhereWithoutInspectionsInput = {
    where?: ExtinguisherWhereInput
    data: XOR<ExtinguisherUpdateWithoutInspectionsInput, ExtinguisherUncheckedUpdateWithoutInspectionsInput>
  }

  export type ExtinguisherUpdateWithoutInspectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    location?: StringFieldUpdateOperationsInput | string
    building?: StringFieldUpdateOperationsInput | string
    floor?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    capacity?: NullableStringFieldUpdateOperationsInput | string | null
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    installDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInspection?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextInspection?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMaintenance?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextMaintenance?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    condition?: StringFieldUpdateOperationsInput | string
    serviceType?: NullableStringFieldUpdateOperationsInput | string | null
    inspector?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutExtinguishersNestedInput
  }

  export type ExtinguisherUncheckedUpdateWithoutInspectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    location?: StringFieldUpdateOperationsInput | string
    building?: StringFieldUpdateOperationsInput | string
    floor?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    capacity?: NullableStringFieldUpdateOperationsInput | string | null
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    installDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInspection?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextInspection?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMaintenance?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextMaintenance?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    condition?: StringFieldUpdateOperationsInput | string
    serviceType?: NullableStringFieldUpdateOperationsInput | string | null
    inspector?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantCreateWithoutSubscriptionsInput = {
    id?: string
    companyName: string
    subdomain: string
    logoUrl?: string | null
    subscriptionPlan?: string
    subscriptionStatus?: string
    createdAt?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    extinguishers?: ExtinguisherCreateNestedManyWithoutTenantInput
    inspections?: InspectionCreateNestedManyWithoutTenantInput
    invoices?: InvoiceCreateNestedManyWithoutTenantInput
    serviceJobs?: ServiceJobCreateNestedManyWithoutTenantInput
    inspectionPhotos?: InspectionPhotoCreateNestedManyWithoutTenantInput
    serviceReports?: ServiceReportCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutSubscriptionsInput = {
    id?: string
    companyName: string
    subdomain: string
    logoUrl?: string | null
    subscriptionPlan?: string
    subscriptionStatus?: string
    createdAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    extinguishers?: ExtinguisherUncheckedCreateNestedManyWithoutTenantInput
    inspections?: InspectionUncheckedCreateNestedManyWithoutTenantInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutTenantInput
    serviceJobs?: ServiceJobUncheckedCreateNestedManyWithoutTenantInput
    inspectionPhotos?: InspectionPhotoUncheckedCreateNestedManyWithoutTenantInput
    serviceReports?: ServiceReportUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutSubscriptionsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutSubscriptionsInput, TenantUncheckedCreateWithoutSubscriptionsInput>
  }

  export type TenantUpsertWithoutSubscriptionsInput = {
    update: XOR<TenantUpdateWithoutSubscriptionsInput, TenantUncheckedUpdateWithoutSubscriptionsInput>
    create: XOR<TenantCreateWithoutSubscriptionsInput, TenantUncheckedCreateWithoutSubscriptionsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutSubscriptionsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutSubscriptionsInput, TenantUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type TenantUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionPlan?: StringFieldUpdateOperationsInput | string
    subscriptionStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    extinguishers?: ExtinguisherUpdateManyWithoutTenantNestedInput
    inspections?: InspectionUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUpdateManyWithoutTenantNestedInput
    serviceJobs?: ServiceJobUpdateManyWithoutTenantNestedInput
    inspectionPhotos?: InspectionPhotoUpdateManyWithoutTenantNestedInput
    serviceReports?: ServiceReportUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionPlan?: StringFieldUpdateOperationsInput | string
    subscriptionStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    extinguishers?: ExtinguisherUncheckedUpdateManyWithoutTenantNestedInput
    inspections?: InspectionUncheckedUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutTenantNestedInput
    serviceJobs?: ServiceJobUncheckedUpdateManyWithoutTenantNestedInput
    inspectionPhotos?: InspectionPhotoUncheckedUpdateManyWithoutTenantNestedInput
    serviceReports?: ServiceReportUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutInvoicesInput = {
    id?: string
    companyName: string
    subdomain: string
    logoUrl?: string | null
    subscriptionPlan?: string
    subscriptionStatus?: string
    createdAt?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    extinguishers?: ExtinguisherCreateNestedManyWithoutTenantInput
    inspections?: InspectionCreateNestedManyWithoutTenantInput
    subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput
    serviceJobs?: ServiceJobCreateNestedManyWithoutTenantInput
    inspectionPhotos?: InspectionPhotoCreateNestedManyWithoutTenantInput
    serviceReports?: ServiceReportCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutInvoicesInput = {
    id?: string
    companyName: string
    subdomain: string
    logoUrl?: string | null
    subscriptionPlan?: string
    subscriptionStatus?: string
    createdAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    extinguishers?: ExtinguisherUncheckedCreateNestedManyWithoutTenantInput
    inspections?: InspectionUncheckedCreateNestedManyWithoutTenantInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput
    serviceJobs?: ServiceJobUncheckedCreateNestedManyWithoutTenantInput
    inspectionPhotos?: InspectionPhotoUncheckedCreateNestedManyWithoutTenantInput
    serviceReports?: ServiceReportUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutInvoicesInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutInvoicesInput, TenantUncheckedCreateWithoutInvoicesInput>
  }

  export type TenantUpsertWithoutInvoicesInput = {
    update: XOR<TenantUpdateWithoutInvoicesInput, TenantUncheckedUpdateWithoutInvoicesInput>
    create: XOR<TenantCreateWithoutInvoicesInput, TenantUncheckedCreateWithoutInvoicesInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutInvoicesInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutInvoicesInput, TenantUncheckedUpdateWithoutInvoicesInput>
  }

  export type TenantUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionPlan?: StringFieldUpdateOperationsInput | string
    subscriptionStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    extinguishers?: ExtinguisherUpdateManyWithoutTenantNestedInput
    inspections?: InspectionUpdateManyWithoutTenantNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutTenantNestedInput
    serviceJobs?: ServiceJobUpdateManyWithoutTenantNestedInput
    inspectionPhotos?: InspectionPhotoUpdateManyWithoutTenantNestedInput
    serviceReports?: ServiceReportUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionPlan?: StringFieldUpdateOperationsInput | string
    subscriptionStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    extinguishers?: ExtinguisherUncheckedUpdateManyWithoutTenantNestedInput
    inspections?: InspectionUncheckedUpdateManyWithoutTenantNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    serviceJobs?: ServiceJobUncheckedUpdateManyWithoutTenantNestedInput
    inspectionPhotos?: InspectionPhotoUncheckedUpdateManyWithoutTenantNestedInput
    serviceReports?: ServiceReportUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutServiceJobsInput = {
    id?: string
    companyName: string
    subdomain: string
    logoUrl?: string | null
    subscriptionPlan?: string
    subscriptionStatus?: string
    createdAt?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    extinguishers?: ExtinguisherCreateNestedManyWithoutTenantInput
    inspections?: InspectionCreateNestedManyWithoutTenantInput
    subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput
    invoices?: InvoiceCreateNestedManyWithoutTenantInput
    inspectionPhotos?: InspectionPhotoCreateNestedManyWithoutTenantInput
    serviceReports?: ServiceReportCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutServiceJobsInput = {
    id?: string
    companyName: string
    subdomain: string
    logoUrl?: string | null
    subscriptionPlan?: string
    subscriptionStatus?: string
    createdAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    extinguishers?: ExtinguisherUncheckedCreateNestedManyWithoutTenantInput
    inspections?: InspectionUncheckedCreateNestedManyWithoutTenantInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutTenantInput
    inspectionPhotos?: InspectionPhotoUncheckedCreateNestedManyWithoutTenantInput
    serviceReports?: ServiceReportUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutServiceJobsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutServiceJobsInput, TenantUncheckedCreateWithoutServiceJobsInput>
  }

  export type TenantUpsertWithoutServiceJobsInput = {
    update: XOR<TenantUpdateWithoutServiceJobsInput, TenantUncheckedUpdateWithoutServiceJobsInput>
    create: XOR<TenantCreateWithoutServiceJobsInput, TenantUncheckedCreateWithoutServiceJobsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutServiceJobsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutServiceJobsInput, TenantUncheckedUpdateWithoutServiceJobsInput>
  }

  export type TenantUpdateWithoutServiceJobsInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionPlan?: StringFieldUpdateOperationsInput | string
    subscriptionStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    extinguishers?: ExtinguisherUpdateManyWithoutTenantNestedInput
    inspections?: InspectionUpdateManyWithoutTenantNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUpdateManyWithoutTenantNestedInput
    inspectionPhotos?: InspectionPhotoUpdateManyWithoutTenantNestedInput
    serviceReports?: ServiceReportUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutServiceJobsInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionPlan?: StringFieldUpdateOperationsInput | string
    subscriptionStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    extinguishers?: ExtinguisherUncheckedUpdateManyWithoutTenantNestedInput
    inspections?: InspectionUncheckedUpdateManyWithoutTenantNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutTenantNestedInput
    inspectionPhotos?: InspectionPhotoUncheckedUpdateManyWithoutTenantNestedInput
    serviceReports?: ServiceReportUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutInspectionPhotosInput = {
    id?: string
    companyName: string
    subdomain: string
    logoUrl?: string | null
    subscriptionPlan?: string
    subscriptionStatus?: string
    createdAt?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    extinguishers?: ExtinguisherCreateNestedManyWithoutTenantInput
    inspections?: InspectionCreateNestedManyWithoutTenantInput
    subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput
    invoices?: InvoiceCreateNestedManyWithoutTenantInput
    serviceJobs?: ServiceJobCreateNestedManyWithoutTenantInput
    serviceReports?: ServiceReportCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutInspectionPhotosInput = {
    id?: string
    companyName: string
    subdomain: string
    logoUrl?: string | null
    subscriptionPlan?: string
    subscriptionStatus?: string
    createdAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    extinguishers?: ExtinguisherUncheckedCreateNestedManyWithoutTenantInput
    inspections?: InspectionUncheckedCreateNestedManyWithoutTenantInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutTenantInput
    serviceJobs?: ServiceJobUncheckedCreateNestedManyWithoutTenantInput
    serviceReports?: ServiceReportUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutInspectionPhotosInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutInspectionPhotosInput, TenantUncheckedCreateWithoutInspectionPhotosInput>
  }

  export type TenantUpsertWithoutInspectionPhotosInput = {
    update: XOR<TenantUpdateWithoutInspectionPhotosInput, TenantUncheckedUpdateWithoutInspectionPhotosInput>
    create: XOR<TenantCreateWithoutInspectionPhotosInput, TenantUncheckedCreateWithoutInspectionPhotosInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutInspectionPhotosInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutInspectionPhotosInput, TenantUncheckedUpdateWithoutInspectionPhotosInput>
  }

  export type TenantUpdateWithoutInspectionPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionPlan?: StringFieldUpdateOperationsInput | string
    subscriptionStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    extinguishers?: ExtinguisherUpdateManyWithoutTenantNestedInput
    inspections?: InspectionUpdateManyWithoutTenantNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUpdateManyWithoutTenantNestedInput
    serviceJobs?: ServiceJobUpdateManyWithoutTenantNestedInput
    serviceReports?: ServiceReportUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutInspectionPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionPlan?: StringFieldUpdateOperationsInput | string
    subscriptionStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    extinguishers?: ExtinguisherUncheckedUpdateManyWithoutTenantNestedInput
    inspections?: InspectionUncheckedUpdateManyWithoutTenantNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutTenantNestedInput
    serviceJobs?: ServiceJobUncheckedUpdateManyWithoutTenantNestedInput
    serviceReports?: ServiceReportUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutServiceReportsInput = {
    id?: string
    companyName: string
    subdomain: string
    logoUrl?: string | null
    subscriptionPlan?: string
    subscriptionStatus?: string
    createdAt?: Date | string
    users?: UserCreateNestedManyWithoutTenantInput
    extinguishers?: ExtinguisherCreateNestedManyWithoutTenantInput
    inspections?: InspectionCreateNestedManyWithoutTenantInput
    subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput
    invoices?: InvoiceCreateNestedManyWithoutTenantInput
    serviceJobs?: ServiceJobCreateNestedManyWithoutTenantInput
    inspectionPhotos?: InspectionPhotoCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutServiceReportsInput = {
    id?: string
    companyName: string
    subdomain: string
    logoUrl?: string | null
    subscriptionPlan?: string
    subscriptionStatus?: string
    createdAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTenantInput
    extinguishers?: ExtinguisherUncheckedCreateNestedManyWithoutTenantInput
    inspections?: InspectionUncheckedCreateNestedManyWithoutTenantInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput
    invoices?: InvoiceUncheckedCreateNestedManyWithoutTenantInput
    serviceJobs?: ServiceJobUncheckedCreateNestedManyWithoutTenantInput
    inspectionPhotos?: InspectionPhotoUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutServiceReportsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutServiceReportsInput, TenantUncheckedCreateWithoutServiceReportsInput>
  }

  export type TenantUpsertWithoutServiceReportsInput = {
    update: XOR<TenantUpdateWithoutServiceReportsInput, TenantUncheckedUpdateWithoutServiceReportsInput>
    create: XOR<TenantCreateWithoutServiceReportsInput, TenantUncheckedCreateWithoutServiceReportsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutServiceReportsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutServiceReportsInput, TenantUncheckedUpdateWithoutServiceReportsInput>
  }

  export type TenantUpdateWithoutServiceReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionPlan?: StringFieldUpdateOperationsInput | string
    subscriptionStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTenantNestedInput
    extinguishers?: ExtinguisherUpdateManyWithoutTenantNestedInput
    inspections?: InspectionUpdateManyWithoutTenantNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUpdateManyWithoutTenantNestedInput
    serviceJobs?: ServiceJobUpdateManyWithoutTenantNestedInput
    inspectionPhotos?: InspectionPhotoUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutServiceReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    subdomain?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionPlan?: StringFieldUpdateOperationsInput | string
    subscriptionStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTenantNestedInput
    extinguishers?: ExtinguisherUncheckedUpdateManyWithoutTenantNestedInput
    inspections?: InspectionUncheckedUpdateManyWithoutTenantNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    invoices?: InvoiceUncheckedUpdateManyWithoutTenantNestedInput
    serviceJobs?: ServiceJobUncheckedUpdateManyWithoutTenantNestedInput
    inspectionPhotos?: InspectionPhotoUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type UserCreateManyTenantInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: string
    status?: string
    createdAt?: Date | string
  }

  export type ExtinguisherCreateManyTenantInput = {
    id?: string
    externalId?: string | null
    location: string
    building: string
    floor?: string | null
    type: string
    capacity?: string | null
    manufacturer?: string | null
    model?: string | null
    serialNumber?: string | null
    installDate?: Date | string | null
    expiryDate?: Date | string | null
    lastInspection?: Date | string | null
    nextInspection?: Date | string | null
    lastMaintenance?: Date | string | null
    nextMaintenance?: Date | string | null
    status?: string
    condition?: string
    serviceType?: string | null
    inspector?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type InspectionCreateManyTenantInput = {
    id?: string
    extinguisherId: string
    serviceDate: Date | string
    serviceType: string
    technician?: string | null
    condition: string
    notes?: string | null
    partsReplaced?: string | null
    nextServiceDate?: Date | string | null
    createdAt?: Date | string
  }

  export type SubscriptionCreateManyTenantInput = {
    id?: string
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    plan: string
    status: string
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    trialEnd?: Date | string | null
    createdAt?: Date | string
  }

  export type InvoiceCreateManyTenantInput = {
    id?: string
    stripeInvoiceId?: string | null
    amount: number
    status: string
    createdAt?: Date | string
  }

  export type ServiceJobCreateManyTenantInput = {
    id?: string
    extinguisherId?: string | null
    location: string
    building: string
    type: string
    serviceType: string
    status?: string
    notes?: string | null
    scheduledDate?: Date | string | null
    completedDate?: Date | string | null
    technician?: string | null
    createdAt?: Date | string
  }

  export type InspectionPhotoCreateManyTenantInput = {
    id?: string
    extinguisherId?: string | null
    inspectionId?: string | null
    photoUrl: string
    caption?: string | null
    uploadedBy?: string | null
    createdAt?: Date | string
  }

  export type ServiceReportCreateManyTenantInput = {
    id?: string
    visitDate: Date | string
    technician?: string | null
    jobIds?: ServiceReportCreatejobIdsInput | string[]
    pdfUrl: string
    createdAt?: Date | string
  }

  export type UserUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExtinguisherUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    location?: StringFieldUpdateOperationsInput | string
    building?: StringFieldUpdateOperationsInput | string
    floor?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    capacity?: NullableStringFieldUpdateOperationsInput | string | null
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    installDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInspection?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextInspection?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMaintenance?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextMaintenance?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    condition?: StringFieldUpdateOperationsInput | string
    serviceType?: NullableStringFieldUpdateOperationsInput | string | null
    inspector?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inspections?: InspectionUpdateManyWithoutExtinguisherNestedInput
  }

  export type ExtinguisherUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    location?: StringFieldUpdateOperationsInput | string
    building?: StringFieldUpdateOperationsInput | string
    floor?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    capacity?: NullableStringFieldUpdateOperationsInput | string | null
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    installDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInspection?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextInspection?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMaintenance?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextMaintenance?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    condition?: StringFieldUpdateOperationsInput | string
    serviceType?: NullableStringFieldUpdateOperationsInput | string | null
    inspector?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inspections?: InspectionUncheckedUpdateManyWithoutExtinguisherNestedInput
  }

  export type ExtinguisherUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    location?: StringFieldUpdateOperationsInput | string
    building?: StringFieldUpdateOperationsInput | string
    floor?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    capacity?: NullableStringFieldUpdateOperationsInput | string | null
    manufacturer?: NullableStringFieldUpdateOperationsInput | string | null
    model?: NullableStringFieldUpdateOperationsInput | string | null
    serialNumber?: NullableStringFieldUpdateOperationsInput | string | null
    installDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastInspection?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextInspection?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMaintenance?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextMaintenance?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    condition?: StringFieldUpdateOperationsInput | string
    serviceType?: NullableStringFieldUpdateOperationsInput | string | null
    inspector?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InspectionUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceType?: StringFieldUpdateOperationsInput | string
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    condition?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    partsReplaced?: NullableStringFieldUpdateOperationsInput | string | null
    nextServiceDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    extinguisher?: ExtinguisherUpdateOneRequiredWithoutInspectionsNestedInput
  }

  export type InspectionUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    extinguisherId?: StringFieldUpdateOperationsInput | string
    serviceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceType?: StringFieldUpdateOperationsInput | string
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    condition?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    partsReplaced?: NullableStringFieldUpdateOperationsInput | string | null
    nextServiceDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InspectionUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    extinguisherId?: StringFieldUpdateOperationsInput | string
    serviceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceType?: StringFieldUpdateOperationsInput | string
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    condition?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    partsReplaced?: NullableStringFieldUpdateOperationsInput | string | null
    nextServiceDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    plan?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    plan?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    plan?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceJobUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    extinguisherId?: NullableStringFieldUpdateOperationsInput | string | null
    location?: StringFieldUpdateOperationsInput | string
    building?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    serviceType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceJobUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    extinguisherId?: NullableStringFieldUpdateOperationsInput | string | null
    location?: StringFieldUpdateOperationsInput | string
    building?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    serviceType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceJobUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    extinguisherId?: NullableStringFieldUpdateOperationsInput | string | null
    location?: StringFieldUpdateOperationsInput | string
    building?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    serviceType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InspectionPhotoUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    extinguisherId?: NullableStringFieldUpdateOperationsInput | string | null
    inspectionId?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InspectionPhotoUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    extinguisherId?: NullableStringFieldUpdateOperationsInput | string | null
    inspectionId?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InspectionPhotoUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    extinguisherId?: NullableStringFieldUpdateOperationsInput | string | null
    inspectionId?: NullableStringFieldUpdateOperationsInput | string | null
    photoUrl?: StringFieldUpdateOperationsInput | string
    caption?: NullableStringFieldUpdateOperationsInput | string | null
    uploadedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceReportUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    jobIds?: ServiceReportUpdatejobIdsInput | string[]
    pdfUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceReportUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    jobIds?: ServiceReportUpdatejobIdsInput | string[]
    pdfUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceReportUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    jobIds?: ServiceReportUpdatejobIdsInput | string[]
    pdfUrl?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InspectionCreateManyExtinguisherInput = {
    id?: string
    tenantId: string
    serviceDate: Date | string
    serviceType: string
    technician?: string | null
    condition: string
    notes?: string | null
    partsReplaced?: string | null
    nextServiceDate?: Date | string | null
    createdAt?: Date | string
  }

  export type InspectionUpdateWithoutExtinguisherInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceType?: StringFieldUpdateOperationsInput | string
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    condition?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    partsReplaced?: NullableStringFieldUpdateOperationsInput | string | null
    nextServiceDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutInspectionsNestedInput
  }

  export type InspectionUncheckedUpdateWithoutExtinguisherInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    serviceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceType?: StringFieldUpdateOperationsInput | string
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    condition?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    partsReplaced?: NullableStringFieldUpdateOperationsInput | string | null
    nextServiceDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InspectionUncheckedUpdateManyWithoutExtinguisherInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    serviceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceType?: StringFieldUpdateOperationsInput | string
    technician?: NullableStringFieldUpdateOperationsInput | string | null
    condition?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    partsReplaced?: NullableStringFieldUpdateOperationsInput | string | null
    nextServiceDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}