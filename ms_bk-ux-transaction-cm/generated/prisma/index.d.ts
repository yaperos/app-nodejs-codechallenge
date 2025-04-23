
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
 * Model Transaction
 * 
 */
export type Transaction = $Result.DefaultSelection<Prisma.$TransactionPayload>
/**
 * Model TransactionType
 * 
 */
export type TransactionType = $Result.DefaultSelection<Prisma.$TransactionTypePayload>
/**
 * Model TransactionStatus
 * 
 */
export type TransactionStatus = $Result.DefaultSelection<Prisma.$TransactionStatusPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Transactions
 * const transactions = await prisma.transaction.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
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
   * // Fetch zero or more Transactions
   * const transactions = await prisma.transaction.findMany()
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
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

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
   * `prisma.transaction`: Exposes CRUD operations for the **Transaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transactions
    * const transactions = await prisma.transaction.findMany()
    * ```
    */
  get transaction(): Prisma.TransactionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transactionType`: Exposes CRUD operations for the **TransactionType** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TransactionTypes
    * const transactionTypes = await prisma.transactionType.findMany()
    * ```
    */
  get transactionType(): Prisma.TransactionTypeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transactionStatus`: Exposes CRUD operations for the **TransactionStatus** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TransactionStatuses
    * const transactionStatuses = await prisma.transactionStatus.findMany()
    * ```
    */
  get transactionStatus(): Prisma.TransactionStatusDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
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
    Transaction: 'Transaction',
    TransactionType: 'TransactionType',
    TransactionStatus: 'TransactionStatus'
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
      modelProps: "transaction" | "transactionType" | "transactionStatus"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Transaction: {
        payload: Prisma.$TransactionPayload<ExtArgs>
        fields: Prisma.TransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findFirst: {
            args: Prisma.TransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findMany: {
            args: Prisma.TransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          create: {
            args: Prisma.TransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          createMany: {
            args: Prisma.TransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TransactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          delete: {
            args: Prisma.TransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          update: {
            args: Prisma.TransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          deleteMany: {
            args: Prisma.TransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TransactionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          upsert: {
            args: Prisma.TransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          aggregate: {
            args: Prisma.TransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransaction>
          }
          groupBy: {
            args: Prisma.TransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransactionCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionCountAggregateOutputType> | number
          }
        }
      }
      TransactionType: {
        payload: Prisma.$TransactionTypePayload<ExtArgs>
        fields: Prisma.TransactionTypeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransactionTypeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionTypePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransactionTypeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionTypePayload>
          }
          findFirst: {
            args: Prisma.TransactionTypeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionTypePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransactionTypeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionTypePayload>
          }
          findMany: {
            args: Prisma.TransactionTypeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionTypePayload>[]
          }
          create: {
            args: Prisma.TransactionTypeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionTypePayload>
          }
          createMany: {
            args: Prisma.TransactionTypeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TransactionTypeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionTypePayload>[]
          }
          delete: {
            args: Prisma.TransactionTypeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionTypePayload>
          }
          update: {
            args: Prisma.TransactionTypeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionTypePayload>
          }
          deleteMany: {
            args: Prisma.TransactionTypeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransactionTypeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TransactionTypeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionTypePayload>[]
          }
          upsert: {
            args: Prisma.TransactionTypeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionTypePayload>
          }
          aggregate: {
            args: Prisma.TransactionTypeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransactionType>
          }
          groupBy: {
            args: Prisma.TransactionTypeGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionTypeGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransactionTypeCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionTypeCountAggregateOutputType> | number
          }
        }
      }
      TransactionStatus: {
        payload: Prisma.$TransactionStatusPayload<ExtArgs>
        fields: Prisma.TransactionStatusFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransactionStatusFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionStatusPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransactionStatusFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionStatusPayload>
          }
          findFirst: {
            args: Prisma.TransactionStatusFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionStatusPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransactionStatusFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionStatusPayload>
          }
          findMany: {
            args: Prisma.TransactionStatusFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionStatusPayload>[]
          }
          create: {
            args: Prisma.TransactionStatusCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionStatusPayload>
          }
          createMany: {
            args: Prisma.TransactionStatusCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TransactionStatusCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionStatusPayload>[]
          }
          delete: {
            args: Prisma.TransactionStatusDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionStatusPayload>
          }
          update: {
            args: Prisma.TransactionStatusUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionStatusPayload>
          }
          deleteMany: {
            args: Prisma.TransactionStatusDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransactionStatusUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TransactionStatusUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionStatusPayload>[]
          }
          upsert: {
            args: Prisma.TransactionStatusUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionStatusPayload>
          }
          aggregate: {
            args: Prisma.TransactionStatusAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransactionStatus>
          }
          groupBy: {
            args: Prisma.TransactionStatusGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionStatusGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransactionStatusCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionStatusCountAggregateOutputType> | number
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
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
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
    transaction?: TransactionOmit
    transactionType?: TransactionTypeOmit
    transactionStatus?: TransactionStatusOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

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

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

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
   * Count Type TransactionTypeCountOutputType
   */

  export type TransactionTypeCountOutputType = {
    transactions: number
  }

  export type TransactionTypeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transactions?: boolean | TransactionTypeCountOutputTypeCountTransactionsArgs
  }

  // Custom InputTypes
  /**
   * TransactionTypeCountOutputType without action
   */
  export type TransactionTypeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionTypeCountOutputType
     */
    select?: TransactionTypeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TransactionTypeCountOutputType without action
   */
  export type TransactionTypeCountOutputTypeCountTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }


  /**
   * Count Type TransactionStatusCountOutputType
   */

  export type TransactionStatusCountOutputType = {
    transactions: number
  }

  export type TransactionStatusCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transactions?: boolean | TransactionStatusCountOutputTypeCountTransactionsArgs
  }

  // Custom InputTypes
  /**
   * TransactionStatusCountOutputType without action
   */
  export type TransactionStatusCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionStatusCountOutputType
     */
    select?: TransactionStatusCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TransactionStatusCountOutputType without action
   */
  export type TransactionStatusCountOutputTypeCountTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Transaction
   */

  export type AggregateTransaction = {
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  export type TransactionAvgAggregateOutputType = {
    transferTypeId: number | null
    statusId: number | null
    value: number | null
  }

  export type TransactionSumAggregateOutputType = {
    transferTypeId: number | null
    statusId: number | null
    value: number | null
  }

  export type TransactionMinAggregateOutputType = {
    id: string | null
    accountDebit: string | null
    accountCredit: string | null
    transferTypeId: number | null
    statusId: number | null
    value: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransactionMaxAggregateOutputType = {
    id: string | null
    accountDebit: string | null
    accountCredit: string | null
    transferTypeId: number | null
    statusId: number | null
    value: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransactionCountAggregateOutputType = {
    id: number
    accountDebit: number
    accountCredit: number
    transferTypeId: number
    statusId: number
    value: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TransactionAvgAggregateInputType = {
    transferTypeId?: true
    statusId?: true
    value?: true
  }

  export type TransactionSumAggregateInputType = {
    transferTypeId?: true
    statusId?: true
    value?: true
  }

  export type TransactionMinAggregateInputType = {
    id?: true
    accountDebit?: true
    accountCredit?: true
    transferTypeId?: true
    statusId?: true
    value?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransactionMaxAggregateInputType = {
    id?: true
    accountDebit?: true
    accountCredit?: true
    transferTypeId?: true
    statusId?: true
    value?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransactionCountAggregateInputType = {
    id?: true
    accountDebit?: true
    accountCredit?: true
    transferTypeId?: true
    statusId?: true
    value?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transaction to aggregate.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transactions
    **/
    _count?: true | TransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionMaxAggregateInputType
  }

  export type GetTransactionAggregateType<T extends TransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransaction[P]>
      : GetScalarType<T[P], AggregateTransaction[P]>
  }




  export type TransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithAggregationInput | TransactionOrderByWithAggregationInput[]
    by: TransactionScalarFieldEnum[] | TransactionScalarFieldEnum
    having?: TransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionCountAggregateInputType | true
    _avg?: TransactionAvgAggregateInputType
    _sum?: TransactionSumAggregateInputType
    _min?: TransactionMinAggregateInputType
    _max?: TransactionMaxAggregateInputType
  }

  export type TransactionGroupByOutputType = {
    id: string
    accountDebit: string
    accountCredit: string
    transferTypeId: number
    statusId: number
    value: number
    createdAt: Date
    updatedAt: Date
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  type GetTransactionGroupByPayload<T extends TransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionGroupByOutputType[P]>
        }
      >
    >


  export type TransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountDebit?: boolean
    accountCredit?: boolean
    transferTypeId?: boolean
    statusId?: boolean
    value?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    transferType?: boolean | TransactionTypeDefaultArgs<ExtArgs>
    status?: boolean | TransactionStatusDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountDebit?: boolean
    accountCredit?: boolean
    transferTypeId?: boolean
    statusId?: boolean
    value?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    transferType?: boolean | TransactionTypeDefaultArgs<ExtArgs>
    status?: boolean | TransactionStatusDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountDebit?: boolean
    accountCredit?: boolean
    transferTypeId?: boolean
    statusId?: boolean
    value?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    transferType?: boolean | TransactionTypeDefaultArgs<ExtArgs>
    status?: boolean | TransactionStatusDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectScalar = {
    id?: boolean
    accountDebit?: boolean
    accountCredit?: boolean
    transferTypeId?: boolean
    statusId?: boolean
    value?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TransactionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "accountDebit" | "accountCredit" | "transferTypeId" | "statusId" | "value" | "createdAt" | "updatedAt", ExtArgs["result"]["transaction"]>
  export type TransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transferType?: boolean | TransactionTypeDefaultArgs<ExtArgs>
    status?: boolean | TransactionStatusDefaultArgs<ExtArgs>
  }
  export type TransactionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transferType?: boolean | TransactionTypeDefaultArgs<ExtArgs>
    status?: boolean | TransactionStatusDefaultArgs<ExtArgs>
  }
  export type TransactionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transferType?: boolean | TransactionTypeDefaultArgs<ExtArgs>
    status?: boolean | TransactionStatusDefaultArgs<ExtArgs>
  }

  export type $TransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transaction"
    objects: {
      transferType: Prisma.$TransactionTypePayload<ExtArgs>
      status: Prisma.$TransactionStatusPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accountDebit: string
      accountCredit: string
      transferTypeId: number
      statusId: number
      value: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["transaction"]>
    composites: {}
  }

  type TransactionGetPayload<S extends boolean | null | undefined | TransactionDefaultArgs> = $Result.GetResult<Prisma.$TransactionPayload, S>

  type TransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TransactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TransactionCountAggregateInputType | true
    }

  export interface TransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transaction'], meta: { name: 'Transaction' } }
    /**
     * Find zero or one Transaction that matches the filter.
     * @param {TransactionFindUniqueArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionFindUniqueArgs>(args: SelectSubset<T, TransactionFindUniqueArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Transaction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransactionFindUniqueOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, TransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionFindFirstArgs>(args?: SelectSubset<T, TransactionFindFirstArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, TransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transactions
     * const transactions = await prisma.transaction.findMany()
     * 
     * // Get first 10 Transactions
     * const transactions = await prisma.transaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transactionWithIdOnly = await prisma.transaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransactionFindManyArgs>(args?: SelectSubset<T, TransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Transaction.
     * @param {TransactionCreateArgs} args - Arguments to create a Transaction.
     * @example
     * // Create one Transaction
     * const Transaction = await prisma.transaction.create({
     *   data: {
     *     // ... data to create a Transaction
     *   }
     * })
     * 
     */
    create<T extends TransactionCreateArgs>(args: SelectSubset<T, TransactionCreateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Transactions.
     * @param {TransactionCreateManyArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransactionCreateManyArgs>(args?: SelectSubset<T, TransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Transactions and returns the data saved in the database.
     * @param {TransactionCreateManyAndReturnArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TransactionCreateManyAndReturnArgs>(args?: SelectSubset<T, TransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Transaction.
     * @param {TransactionDeleteArgs} args - Arguments to delete one Transaction.
     * @example
     * // Delete one Transaction
     * const Transaction = await prisma.transaction.delete({
     *   where: {
     *     // ... filter to delete one Transaction
     *   }
     * })
     * 
     */
    delete<T extends TransactionDeleteArgs>(args: SelectSubset<T, TransactionDeleteArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Transaction.
     * @param {TransactionUpdateArgs} args - Arguments to update one Transaction.
     * @example
     * // Update one Transaction
     * const transaction = await prisma.transaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransactionUpdateArgs>(args: SelectSubset<T, TransactionUpdateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Transactions.
     * @param {TransactionDeleteManyArgs} args - Arguments to filter Transactions to delete.
     * @example
     * // Delete a few Transactions
     * const { count } = await prisma.transaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransactionDeleteManyArgs>(args?: SelectSubset<T, TransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransactionUpdateManyArgs>(args: SelectSubset<T, TransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions and returns the data updated in the database.
     * @param {TransactionUpdateManyAndReturnArgs} args - Arguments to update many Transactions.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.updateManyAndReturn({
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
    updateManyAndReturn<T extends TransactionUpdateManyAndReturnArgs>(args: SelectSubset<T, TransactionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Transaction.
     * @param {TransactionUpsertArgs} args - Arguments to update or create a Transaction.
     * @example
     * // Update or create a Transaction
     * const transaction = await prisma.transaction.upsert({
     *   create: {
     *     // ... data to create a Transaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transaction we want to update
     *   }
     * })
     */
    upsert<T extends TransactionUpsertArgs>(args: SelectSubset<T, TransactionUpsertArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCountArgs} args - Arguments to filter Transactions to count.
     * @example
     * // Count the number of Transactions
     * const count = await prisma.transaction.count({
     *   where: {
     *     // ... the filter for the Transactions we want to count
     *   }
     * })
    **/
    count<T extends TransactionCountArgs>(
      args?: Subset<T, TransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TransactionAggregateArgs>(args: Subset<T, TransactionAggregateArgs>): Prisma.PrismaPromise<GetTransactionAggregateType<T>>

    /**
     * Group by Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionGroupByArgs} args - Group by arguments.
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
      T extends TransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionGroupByArgs['orderBy'] }
        : { orderBy?: TransactionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transaction model
   */
  readonly fields: TransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    transferType<T extends TransactionTypeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TransactionTypeDefaultArgs<ExtArgs>>): Prisma__TransactionTypeClient<$Result.GetResult<Prisma.$TransactionTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    status<T extends TransactionStatusDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TransactionStatusDefaultArgs<ExtArgs>>): Prisma__TransactionStatusClient<$Result.GetResult<Prisma.$TransactionStatusPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Transaction model
   */
  interface TransactionFieldRefs {
    readonly id: FieldRef<"Transaction", 'String'>
    readonly accountDebit: FieldRef<"Transaction", 'String'>
    readonly accountCredit: FieldRef<"Transaction", 'String'>
    readonly transferTypeId: FieldRef<"Transaction", 'Int'>
    readonly statusId: FieldRef<"Transaction", 'Int'>
    readonly value: FieldRef<"Transaction", 'Float'>
    readonly createdAt: FieldRef<"Transaction", 'DateTime'>
    readonly updatedAt: FieldRef<"Transaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transaction findUnique
   */
  export type TransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findUniqueOrThrow
   */
  export type TransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findFirst
   */
  export type TransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findFirstOrThrow
   */
  export type TransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findMany
   */
  export type TransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transactions to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction create
   */
  export type TransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a Transaction.
     */
    data: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
  }

  /**
   * Transaction createMany
   */
  export type TransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transaction createManyAndReturn
   */
  export type TransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction update
   */
  export type TransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a Transaction.
     */
    data: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
    /**
     * Choose, which Transaction to update.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction updateMany
   */
  export type TransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
  }

  /**
   * Transaction updateManyAndReturn
   */
  export type TransactionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction upsert
   */
  export type TransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the Transaction to update in case it exists.
     */
    where: TransactionWhereUniqueInput
    /**
     * In case the Transaction found by the `where` argument doesn't exist, create a new Transaction with this data.
     */
    create: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
    /**
     * In case the Transaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
  }

  /**
   * Transaction delete
   */
  export type TransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter which Transaction to delete.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction deleteMany
   */
  export type TransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transactions to delete
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to delete.
     */
    limit?: number
  }

  /**
   * Transaction without action
   */
  export type TransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
  }


  /**
   * Model TransactionType
   */

  export type AggregateTransactionType = {
    _count: TransactionTypeCountAggregateOutputType | null
    _avg: TransactionTypeAvgAggregateOutputType | null
    _sum: TransactionTypeSumAggregateOutputType | null
    _min: TransactionTypeMinAggregateOutputType | null
    _max: TransactionTypeMaxAggregateOutputType | null
  }

  export type TransactionTypeAvgAggregateOutputType = {
    id: number | null
  }

  export type TransactionTypeSumAggregateOutputType = {
    id: number | null
  }

  export type TransactionTypeMinAggregateOutputType = {
    id: number | null
    name: string | null
  }

  export type TransactionTypeMaxAggregateOutputType = {
    id: number | null
    name: string | null
  }

  export type TransactionTypeCountAggregateOutputType = {
    id: number
    name: number
    _all: number
  }


  export type TransactionTypeAvgAggregateInputType = {
    id?: true
  }

  export type TransactionTypeSumAggregateInputType = {
    id?: true
  }

  export type TransactionTypeMinAggregateInputType = {
    id?: true
    name?: true
  }

  export type TransactionTypeMaxAggregateInputType = {
    id?: true
    name?: true
  }

  export type TransactionTypeCountAggregateInputType = {
    id?: true
    name?: true
    _all?: true
  }

  export type TransactionTypeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TransactionType to aggregate.
     */
    where?: TransactionTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TransactionTypes to fetch.
     */
    orderBy?: TransactionTypeOrderByWithRelationInput | TransactionTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransactionTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TransactionTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TransactionTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TransactionTypes
    **/
    _count?: true | TransactionTypeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransactionTypeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransactionTypeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionTypeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionTypeMaxAggregateInputType
  }

  export type GetTransactionTypeAggregateType<T extends TransactionTypeAggregateArgs> = {
        [P in keyof T & keyof AggregateTransactionType]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransactionType[P]>
      : GetScalarType<T[P], AggregateTransactionType[P]>
  }




  export type TransactionTypeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionTypeWhereInput
    orderBy?: TransactionTypeOrderByWithAggregationInput | TransactionTypeOrderByWithAggregationInput[]
    by: TransactionTypeScalarFieldEnum[] | TransactionTypeScalarFieldEnum
    having?: TransactionTypeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionTypeCountAggregateInputType | true
    _avg?: TransactionTypeAvgAggregateInputType
    _sum?: TransactionTypeSumAggregateInputType
    _min?: TransactionTypeMinAggregateInputType
    _max?: TransactionTypeMaxAggregateInputType
  }

  export type TransactionTypeGroupByOutputType = {
    id: number
    name: string
    _count: TransactionTypeCountAggregateOutputType | null
    _avg: TransactionTypeAvgAggregateOutputType | null
    _sum: TransactionTypeSumAggregateOutputType | null
    _min: TransactionTypeMinAggregateOutputType | null
    _max: TransactionTypeMaxAggregateOutputType | null
  }

  type GetTransactionTypeGroupByPayload<T extends TransactionTypeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionTypeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionTypeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionTypeGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionTypeGroupByOutputType[P]>
        }
      >
    >


  export type TransactionTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    transactions?: boolean | TransactionType$transactionsArgs<ExtArgs>
    _count?: boolean | TransactionTypeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transactionType"]>

  export type TransactionTypeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["transactionType"]>

  export type TransactionTypeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["transactionType"]>

  export type TransactionTypeSelectScalar = {
    id?: boolean
    name?: boolean
  }

  export type TransactionTypeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name", ExtArgs["result"]["transactionType"]>
  export type TransactionTypeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transactions?: boolean | TransactionType$transactionsArgs<ExtArgs>
    _count?: boolean | TransactionTypeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TransactionTypeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TransactionTypeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TransactionTypePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TransactionType"
    objects: {
      transactions: Prisma.$TransactionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
    }, ExtArgs["result"]["transactionType"]>
    composites: {}
  }

  type TransactionTypeGetPayload<S extends boolean | null | undefined | TransactionTypeDefaultArgs> = $Result.GetResult<Prisma.$TransactionTypePayload, S>

  type TransactionTypeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TransactionTypeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TransactionTypeCountAggregateInputType | true
    }

  export interface TransactionTypeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TransactionType'], meta: { name: 'TransactionType' } }
    /**
     * Find zero or one TransactionType that matches the filter.
     * @param {TransactionTypeFindUniqueArgs} args - Arguments to find a TransactionType
     * @example
     * // Get one TransactionType
     * const transactionType = await prisma.transactionType.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionTypeFindUniqueArgs>(args: SelectSubset<T, TransactionTypeFindUniqueArgs<ExtArgs>>): Prisma__TransactionTypeClient<$Result.GetResult<Prisma.$TransactionTypePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TransactionType that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransactionTypeFindUniqueOrThrowArgs} args - Arguments to find a TransactionType
     * @example
     * // Get one TransactionType
     * const transactionType = await prisma.transactionType.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionTypeFindUniqueOrThrowArgs>(args: SelectSubset<T, TransactionTypeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransactionTypeClient<$Result.GetResult<Prisma.$TransactionTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TransactionType that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionTypeFindFirstArgs} args - Arguments to find a TransactionType
     * @example
     * // Get one TransactionType
     * const transactionType = await prisma.transactionType.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionTypeFindFirstArgs>(args?: SelectSubset<T, TransactionTypeFindFirstArgs<ExtArgs>>): Prisma__TransactionTypeClient<$Result.GetResult<Prisma.$TransactionTypePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TransactionType that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionTypeFindFirstOrThrowArgs} args - Arguments to find a TransactionType
     * @example
     * // Get one TransactionType
     * const transactionType = await prisma.transactionType.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionTypeFindFirstOrThrowArgs>(args?: SelectSubset<T, TransactionTypeFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransactionTypeClient<$Result.GetResult<Prisma.$TransactionTypePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TransactionTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionTypeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TransactionTypes
     * const transactionTypes = await prisma.transactionType.findMany()
     * 
     * // Get first 10 TransactionTypes
     * const transactionTypes = await prisma.transactionType.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transactionTypeWithIdOnly = await prisma.transactionType.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransactionTypeFindManyArgs>(args?: SelectSubset<T, TransactionTypeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionTypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TransactionType.
     * @param {TransactionTypeCreateArgs} args - Arguments to create a TransactionType.
     * @example
     * // Create one TransactionType
     * const TransactionType = await prisma.transactionType.create({
     *   data: {
     *     // ... data to create a TransactionType
     *   }
     * })
     * 
     */
    create<T extends TransactionTypeCreateArgs>(args: SelectSubset<T, TransactionTypeCreateArgs<ExtArgs>>): Prisma__TransactionTypeClient<$Result.GetResult<Prisma.$TransactionTypePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TransactionTypes.
     * @param {TransactionTypeCreateManyArgs} args - Arguments to create many TransactionTypes.
     * @example
     * // Create many TransactionTypes
     * const transactionType = await prisma.transactionType.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransactionTypeCreateManyArgs>(args?: SelectSubset<T, TransactionTypeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TransactionTypes and returns the data saved in the database.
     * @param {TransactionTypeCreateManyAndReturnArgs} args - Arguments to create many TransactionTypes.
     * @example
     * // Create many TransactionTypes
     * const transactionType = await prisma.transactionType.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TransactionTypes and only return the `id`
     * const transactionTypeWithIdOnly = await prisma.transactionType.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TransactionTypeCreateManyAndReturnArgs>(args?: SelectSubset<T, TransactionTypeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionTypePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TransactionType.
     * @param {TransactionTypeDeleteArgs} args - Arguments to delete one TransactionType.
     * @example
     * // Delete one TransactionType
     * const TransactionType = await prisma.transactionType.delete({
     *   where: {
     *     // ... filter to delete one TransactionType
     *   }
     * })
     * 
     */
    delete<T extends TransactionTypeDeleteArgs>(args: SelectSubset<T, TransactionTypeDeleteArgs<ExtArgs>>): Prisma__TransactionTypeClient<$Result.GetResult<Prisma.$TransactionTypePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TransactionType.
     * @param {TransactionTypeUpdateArgs} args - Arguments to update one TransactionType.
     * @example
     * // Update one TransactionType
     * const transactionType = await prisma.transactionType.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransactionTypeUpdateArgs>(args: SelectSubset<T, TransactionTypeUpdateArgs<ExtArgs>>): Prisma__TransactionTypeClient<$Result.GetResult<Prisma.$TransactionTypePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TransactionTypes.
     * @param {TransactionTypeDeleteManyArgs} args - Arguments to filter TransactionTypes to delete.
     * @example
     * // Delete a few TransactionTypes
     * const { count } = await prisma.transactionType.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransactionTypeDeleteManyArgs>(args?: SelectSubset<T, TransactionTypeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TransactionTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionTypeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TransactionTypes
     * const transactionType = await prisma.transactionType.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransactionTypeUpdateManyArgs>(args: SelectSubset<T, TransactionTypeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TransactionTypes and returns the data updated in the database.
     * @param {TransactionTypeUpdateManyAndReturnArgs} args - Arguments to update many TransactionTypes.
     * @example
     * // Update many TransactionTypes
     * const transactionType = await prisma.transactionType.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TransactionTypes and only return the `id`
     * const transactionTypeWithIdOnly = await prisma.transactionType.updateManyAndReturn({
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
    updateManyAndReturn<T extends TransactionTypeUpdateManyAndReturnArgs>(args: SelectSubset<T, TransactionTypeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionTypePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TransactionType.
     * @param {TransactionTypeUpsertArgs} args - Arguments to update or create a TransactionType.
     * @example
     * // Update or create a TransactionType
     * const transactionType = await prisma.transactionType.upsert({
     *   create: {
     *     // ... data to create a TransactionType
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TransactionType we want to update
     *   }
     * })
     */
    upsert<T extends TransactionTypeUpsertArgs>(args: SelectSubset<T, TransactionTypeUpsertArgs<ExtArgs>>): Prisma__TransactionTypeClient<$Result.GetResult<Prisma.$TransactionTypePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TransactionTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionTypeCountArgs} args - Arguments to filter TransactionTypes to count.
     * @example
     * // Count the number of TransactionTypes
     * const count = await prisma.transactionType.count({
     *   where: {
     *     // ... the filter for the TransactionTypes we want to count
     *   }
     * })
    **/
    count<T extends TransactionTypeCountArgs>(
      args?: Subset<T, TransactionTypeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionTypeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TransactionType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionTypeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TransactionTypeAggregateArgs>(args: Subset<T, TransactionTypeAggregateArgs>): Prisma.PrismaPromise<GetTransactionTypeAggregateType<T>>

    /**
     * Group by TransactionType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionTypeGroupByArgs} args - Group by arguments.
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
      T extends TransactionTypeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionTypeGroupByArgs['orderBy'] }
        : { orderBy?: TransactionTypeGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TransactionTypeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionTypeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TransactionType model
   */
  readonly fields: TransactionTypeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TransactionType.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionTypeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    transactions<T extends TransactionType$transactionsArgs<ExtArgs> = {}>(args?: Subset<T, TransactionType$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the TransactionType model
   */
  interface TransactionTypeFieldRefs {
    readonly id: FieldRef<"TransactionType", 'Int'>
    readonly name: FieldRef<"TransactionType", 'String'>
  }
    

  // Custom InputTypes
  /**
   * TransactionType findUnique
   */
  export type TransactionTypeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionType
     */
    select?: TransactionTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionType
     */
    omit?: TransactionTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionTypeInclude<ExtArgs> | null
    /**
     * Filter, which TransactionType to fetch.
     */
    where: TransactionTypeWhereUniqueInput
  }

  /**
   * TransactionType findUniqueOrThrow
   */
  export type TransactionTypeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionType
     */
    select?: TransactionTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionType
     */
    omit?: TransactionTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionTypeInclude<ExtArgs> | null
    /**
     * Filter, which TransactionType to fetch.
     */
    where: TransactionTypeWhereUniqueInput
  }

  /**
   * TransactionType findFirst
   */
  export type TransactionTypeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionType
     */
    select?: TransactionTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionType
     */
    omit?: TransactionTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionTypeInclude<ExtArgs> | null
    /**
     * Filter, which TransactionType to fetch.
     */
    where?: TransactionTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TransactionTypes to fetch.
     */
    orderBy?: TransactionTypeOrderByWithRelationInput | TransactionTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TransactionTypes.
     */
    cursor?: TransactionTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TransactionTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TransactionTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TransactionTypes.
     */
    distinct?: TransactionTypeScalarFieldEnum | TransactionTypeScalarFieldEnum[]
  }

  /**
   * TransactionType findFirstOrThrow
   */
  export type TransactionTypeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionType
     */
    select?: TransactionTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionType
     */
    omit?: TransactionTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionTypeInclude<ExtArgs> | null
    /**
     * Filter, which TransactionType to fetch.
     */
    where?: TransactionTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TransactionTypes to fetch.
     */
    orderBy?: TransactionTypeOrderByWithRelationInput | TransactionTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TransactionTypes.
     */
    cursor?: TransactionTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TransactionTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TransactionTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TransactionTypes.
     */
    distinct?: TransactionTypeScalarFieldEnum | TransactionTypeScalarFieldEnum[]
  }

  /**
   * TransactionType findMany
   */
  export type TransactionTypeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionType
     */
    select?: TransactionTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionType
     */
    omit?: TransactionTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionTypeInclude<ExtArgs> | null
    /**
     * Filter, which TransactionTypes to fetch.
     */
    where?: TransactionTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TransactionTypes to fetch.
     */
    orderBy?: TransactionTypeOrderByWithRelationInput | TransactionTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TransactionTypes.
     */
    cursor?: TransactionTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TransactionTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TransactionTypes.
     */
    skip?: number
    distinct?: TransactionTypeScalarFieldEnum | TransactionTypeScalarFieldEnum[]
  }

  /**
   * TransactionType create
   */
  export type TransactionTypeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionType
     */
    select?: TransactionTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionType
     */
    omit?: TransactionTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionTypeInclude<ExtArgs> | null
    /**
     * The data needed to create a TransactionType.
     */
    data: XOR<TransactionTypeCreateInput, TransactionTypeUncheckedCreateInput>
  }

  /**
   * TransactionType createMany
   */
  export type TransactionTypeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TransactionTypes.
     */
    data: TransactionTypeCreateManyInput | TransactionTypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TransactionType createManyAndReturn
   */
  export type TransactionTypeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionType
     */
    select?: TransactionTypeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionType
     */
    omit?: TransactionTypeOmit<ExtArgs> | null
    /**
     * The data used to create many TransactionTypes.
     */
    data: TransactionTypeCreateManyInput | TransactionTypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TransactionType update
   */
  export type TransactionTypeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionType
     */
    select?: TransactionTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionType
     */
    omit?: TransactionTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionTypeInclude<ExtArgs> | null
    /**
     * The data needed to update a TransactionType.
     */
    data: XOR<TransactionTypeUpdateInput, TransactionTypeUncheckedUpdateInput>
    /**
     * Choose, which TransactionType to update.
     */
    where: TransactionTypeWhereUniqueInput
  }

  /**
   * TransactionType updateMany
   */
  export type TransactionTypeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TransactionTypes.
     */
    data: XOR<TransactionTypeUpdateManyMutationInput, TransactionTypeUncheckedUpdateManyInput>
    /**
     * Filter which TransactionTypes to update
     */
    where?: TransactionTypeWhereInput
    /**
     * Limit how many TransactionTypes to update.
     */
    limit?: number
  }

  /**
   * TransactionType updateManyAndReturn
   */
  export type TransactionTypeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionType
     */
    select?: TransactionTypeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionType
     */
    omit?: TransactionTypeOmit<ExtArgs> | null
    /**
     * The data used to update TransactionTypes.
     */
    data: XOR<TransactionTypeUpdateManyMutationInput, TransactionTypeUncheckedUpdateManyInput>
    /**
     * Filter which TransactionTypes to update
     */
    where?: TransactionTypeWhereInput
    /**
     * Limit how many TransactionTypes to update.
     */
    limit?: number
  }

  /**
   * TransactionType upsert
   */
  export type TransactionTypeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionType
     */
    select?: TransactionTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionType
     */
    omit?: TransactionTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionTypeInclude<ExtArgs> | null
    /**
     * The filter to search for the TransactionType to update in case it exists.
     */
    where: TransactionTypeWhereUniqueInput
    /**
     * In case the TransactionType found by the `where` argument doesn't exist, create a new TransactionType with this data.
     */
    create: XOR<TransactionTypeCreateInput, TransactionTypeUncheckedCreateInput>
    /**
     * In case the TransactionType was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionTypeUpdateInput, TransactionTypeUncheckedUpdateInput>
  }

  /**
   * TransactionType delete
   */
  export type TransactionTypeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionType
     */
    select?: TransactionTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionType
     */
    omit?: TransactionTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionTypeInclude<ExtArgs> | null
    /**
     * Filter which TransactionType to delete.
     */
    where: TransactionTypeWhereUniqueInput
  }

  /**
   * TransactionType deleteMany
   */
  export type TransactionTypeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TransactionTypes to delete
     */
    where?: TransactionTypeWhereInput
    /**
     * Limit how many TransactionTypes to delete.
     */
    limit?: number
  }

  /**
   * TransactionType.transactions
   */
  export type TransactionType$transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * TransactionType without action
   */
  export type TransactionTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionType
     */
    select?: TransactionTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionType
     */
    omit?: TransactionTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionTypeInclude<ExtArgs> | null
  }


  /**
   * Model TransactionStatus
   */

  export type AggregateTransactionStatus = {
    _count: TransactionStatusCountAggregateOutputType | null
    _avg: TransactionStatusAvgAggregateOutputType | null
    _sum: TransactionStatusSumAggregateOutputType | null
    _min: TransactionStatusMinAggregateOutputType | null
    _max: TransactionStatusMaxAggregateOutputType | null
  }

  export type TransactionStatusAvgAggregateOutputType = {
    id: number | null
  }

  export type TransactionStatusSumAggregateOutputType = {
    id: number | null
  }

  export type TransactionStatusMinAggregateOutputType = {
    id: number | null
    name: string | null
  }

  export type TransactionStatusMaxAggregateOutputType = {
    id: number | null
    name: string | null
  }

  export type TransactionStatusCountAggregateOutputType = {
    id: number
    name: number
    _all: number
  }


  export type TransactionStatusAvgAggregateInputType = {
    id?: true
  }

  export type TransactionStatusSumAggregateInputType = {
    id?: true
  }

  export type TransactionStatusMinAggregateInputType = {
    id?: true
    name?: true
  }

  export type TransactionStatusMaxAggregateInputType = {
    id?: true
    name?: true
  }

  export type TransactionStatusCountAggregateInputType = {
    id?: true
    name?: true
    _all?: true
  }

  export type TransactionStatusAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TransactionStatus to aggregate.
     */
    where?: TransactionStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TransactionStatuses to fetch.
     */
    orderBy?: TransactionStatusOrderByWithRelationInput | TransactionStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransactionStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TransactionStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TransactionStatuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TransactionStatuses
    **/
    _count?: true | TransactionStatusCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransactionStatusAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransactionStatusSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionStatusMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionStatusMaxAggregateInputType
  }

  export type GetTransactionStatusAggregateType<T extends TransactionStatusAggregateArgs> = {
        [P in keyof T & keyof AggregateTransactionStatus]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransactionStatus[P]>
      : GetScalarType<T[P], AggregateTransactionStatus[P]>
  }




  export type TransactionStatusGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionStatusWhereInput
    orderBy?: TransactionStatusOrderByWithAggregationInput | TransactionStatusOrderByWithAggregationInput[]
    by: TransactionStatusScalarFieldEnum[] | TransactionStatusScalarFieldEnum
    having?: TransactionStatusScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionStatusCountAggregateInputType | true
    _avg?: TransactionStatusAvgAggregateInputType
    _sum?: TransactionStatusSumAggregateInputType
    _min?: TransactionStatusMinAggregateInputType
    _max?: TransactionStatusMaxAggregateInputType
  }

  export type TransactionStatusGroupByOutputType = {
    id: number
    name: string
    _count: TransactionStatusCountAggregateOutputType | null
    _avg: TransactionStatusAvgAggregateOutputType | null
    _sum: TransactionStatusSumAggregateOutputType | null
    _min: TransactionStatusMinAggregateOutputType | null
    _max: TransactionStatusMaxAggregateOutputType | null
  }

  type GetTransactionStatusGroupByPayload<T extends TransactionStatusGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionStatusGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionStatusGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionStatusGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionStatusGroupByOutputType[P]>
        }
      >
    >


  export type TransactionStatusSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    transactions?: boolean | TransactionStatus$transactionsArgs<ExtArgs>
    _count?: boolean | TransactionStatusCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transactionStatus"]>

  export type TransactionStatusSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["transactionStatus"]>

  export type TransactionStatusSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["transactionStatus"]>

  export type TransactionStatusSelectScalar = {
    id?: boolean
    name?: boolean
  }

  export type TransactionStatusOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name", ExtArgs["result"]["transactionStatus"]>
  export type TransactionStatusInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transactions?: boolean | TransactionStatus$transactionsArgs<ExtArgs>
    _count?: boolean | TransactionStatusCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TransactionStatusIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TransactionStatusIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TransactionStatusPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TransactionStatus"
    objects: {
      transactions: Prisma.$TransactionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
    }, ExtArgs["result"]["transactionStatus"]>
    composites: {}
  }

  type TransactionStatusGetPayload<S extends boolean | null | undefined | TransactionStatusDefaultArgs> = $Result.GetResult<Prisma.$TransactionStatusPayload, S>

  type TransactionStatusCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TransactionStatusFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TransactionStatusCountAggregateInputType | true
    }

  export interface TransactionStatusDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TransactionStatus'], meta: { name: 'TransactionStatus' } }
    /**
     * Find zero or one TransactionStatus that matches the filter.
     * @param {TransactionStatusFindUniqueArgs} args - Arguments to find a TransactionStatus
     * @example
     * // Get one TransactionStatus
     * const transactionStatus = await prisma.transactionStatus.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionStatusFindUniqueArgs>(args: SelectSubset<T, TransactionStatusFindUniqueArgs<ExtArgs>>): Prisma__TransactionStatusClient<$Result.GetResult<Prisma.$TransactionStatusPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TransactionStatus that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransactionStatusFindUniqueOrThrowArgs} args - Arguments to find a TransactionStatus
     * @example
     * // Get one TransactionStatus
     * const transactionStatus = await prisma.transactionStatus.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionStatusFindUniqueOrThrowArgs>(args: SelectSubset<T, TransactionStatusFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransactionStatusClient<$Result.GetResult<Prisma.$TransactionStatusPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TransactionStatus that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionStatusFindFirstArgs} args - Arguments to find a TransactionStatus
     * @example
     * // Get one TransactionStatus
     * const transactionStatus = await prisma.transactionStatus.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionStatusFindFirstArgs>(args?: SelectSubset<T, TransactionStatusFindFirstArgs<ExtArgs>>): Prisma__TransactionStatusClient<$Result.GetResult<Prisma.$TransactionStatusPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TransactionStatus that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionStatusFindFirstOrThrowArgs} args - Arguments to find a TransactionStatus
     * @example
     * // Get one TransactionStatus
     * const transactionStatus = await prisma.transactionStatus.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionStatusFindFirstOrThrowArgs>(args?: SelectSubset<T, TransactionStatusFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransactionStatusClient<$Result.GetResult<Prisma.$TransactionStatusPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TransactionStatuses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionStatusFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TransactionStatuses
     * const transactionStatuses = await prisma.transactionStatus.findMany()
     * 
     * // Get first 10 TransactionStatuses
     * const transactionStatuses = await prisma.transactionStatus.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transactionStatusWithIdOnly = await prisma.transactionStatus.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransactionStatusFindManyArgs>(args?: SelectSubset<T, TransactionStatusFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionStatusPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TransactionStatus.
     * @param {TransactionStatusCreateArgs} args - Arguments to create a TransactionStatus.
     * @example
     * // Create one TransactionStatus
     * const TransactionStatus = await prisma.transactionStatus.create({
     *   data: {
     *     // ... data to create a TransactionStatus
     *   }
     * })
     * 
     */
    create<T extends TransactionStatusCreateArgs>(args: SelectSubset<T, TransactionStatusCreateArgs<ExtArgs>>): Prisma__TransactionStatusClient<$Result.GetResult<Prisma.$TransactionStatusPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TransactionStatuses.
     * @param {TransactionStatusCreateManyArgs} args - Arguments to create many TransactionStatuses.
     * @example
     * // Create many TransactionStatuses
     * const transactionStatus = await prisma.transactionStatus.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransactionStatusCreateManyArgs>(args?: SelectSubset<T, TransactionStatusCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TransactionStatuses and returns the data saved in the database.
     * @param {TransactionStatusCreateManyAndReturnArgs} args - Arguments to create many TransactionStatuses.
     * @example
     * // Create many TransactionStatuses
     * const transactionStatus = await prisma.transactionStatus.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TransactionStatuses and only return the `id`
     * const transactionStatusWithIdOnly = await prisma.transactionStatus.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TransactionStatusCreateManyAndReturnArgs>(args?: SelectSubset<T, TransactionStatusCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionStatusPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TransactionStatus.
     * @param {TransactionStatusDeleteArgs} args - Arguments to delete one TransactionStatus.
     * @example
     * // Delete one TransactionStatus
     * const TransactionStatus = await prisma.transactionStatus.delete({
     *   where: {
     *     // ... filter to delete one TransactionStatus
     *   }
     * })
     * 
     */
    delete<T extends TransactionStatusDeleteArgs>(args: SelectSubset<T, TransactionStatusDeleteArgs<ExtArgs>>): Prisma__TransactionStatusClient<$Result.GetResult<Prisma.$TransactionStatusPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TransactionStatus.
     * @param {TransactionStatusUpdateArgs} args - Arguments to update one TransactionStatus.
     * @example
     * // Update one TransactionStatus
     * const transactionStatus = await prisma.transactionStatus.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransactionStatusUpdateArgs>(args: SelectSubset<T, TransactionStatusUpdateArgs<ExtArgs>>): Prisma__TransactionStatusClient<$Result.GetResult<Prisma.$TransactionStatusPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TransactionStatuses.
     * @param {TransactionStatusDeleteManyArgs} args - Arguments to filter TransactionStatuses to delete.
     * @example
     * // Delete a few TransactionStatuses
     * const { count } = await prisma.transactionStatus.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransactionStatusDeleteManyArgs>(args?: SelectSubset<T, TransactionStatusDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TransactionStatuses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionStatusUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TransactionStatuses
     * const transactionStatus = await prisma.transactionStatus.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransactionStatusUpdateManyArgs>(args: SelectSubset<T, TransactionStatusUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TransactionStatuses and returns the data updated in the database.
     * @param {TransactionStatusUpdateManyAndReturnArgs} args - Arguments to update many TransactionStatuses.
     * @example
     * // Update many TransactionStatuses
     * const transactionStatus = await prisma.transactionStatus.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TransactionStatuses and only return the `id`
     * const transactionStatusWithIdOnly = await prisma.transactionStatus.updateManyAndReturn({
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
    updateManyAndReturn<T extends TransactionStatusUpdateManyAndReturnArgs>(args: SelectSubset<T, TransactionStatusUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionStatusPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TransactionStatus.
     * @param {TransactionStatusUpsertArgs} args - Arguments to update or create a TransactionStatus.
     * @example
     * // Update or create a TransactionStatus
     * const transactionStatus = await prisma.transactionStatus.upsert({
     *   create: {
     *     // ... data to create a TransactionStatus
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TransactionStatus we want to update
     *   }
     * })
     */
    upsert<T extends TransactionStatusUpsertArgs>(args: SelectSubset<T, TransactionStatusUpsertArgs<ExtArgs>>): Prisma__TransactionStatusClient<$Result.GetResult<Prisma.$TransactionStatusPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TransactionStatuses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionStatusCountArgs} args - Arguments to filter TransactionStatuses to count.
     * @example
     * // Count the number of TransactionStatuses
     * const count = await prisma.transactionStatus.count({
     *   where: {
     *     // ... the filter for the TransactionStatuses we want to count
     *   }
     * })
    **/
    count<T extends TransactionStatusCountArgs>(
      args?: Subset<T, TransactionStatusCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionStatusCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TransactionStatus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionStatusAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TransactionStatusAggregateArgs>(args: Subset<T, TransactionStatusAggregateArgs>): Prisma.PrismaPromise<GetTransactionStatusAggregateType<T>>

    /**
     * Group by TransactionStatus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionStatusGroupByArgs} args - Group by arguments.
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
      T extends TransactionStatusGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionStatusGroupByArgs['orderBy'] }
        : { orderBy?: TransactionStatusGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TransactionStatusGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionStatusGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TransactionStatus model
   */
  readonly fields: TransactionStatusFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TransactionStatus.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionStatusClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    transactions<T extends TransactionStatus$transactionsArgs<ExtArgs> = {}>(args?: Subset<T, TransactionStatus$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the TransactionStatus model
   */
  interface TransactionStatusFieldRefs {
    readonly id: FieldRef<"TransactionStatus", 'Int'>
    readonly name: FieldRef<"TransactionStatus", 'String'>
  }
    

  // Custom InputTypes
  /**
   * TransactionStatus findUnique
   */
  export type TransactionStatusFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionStatus
     */
    select?: TransactionStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionStatus
     */
    omit?: TransactionStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionStatusInclude<ExtArgs> | null
    /**
     * Filter, which TransactionStatus to fetch.
     */
    where: TransactionStatusWhereUniqueInput
  }

  /**
   * TransactionStatus findUniqueOrThrow
   */
  export type TransactionStatusFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionStatus
     */
    select?: TransactionStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionStatus
     */
    omit?: TransactionStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionStatusInclude<ExtArgs> | null
    /**
     * Filter, which TransactionStatus to fetch.
     */
    where: TransactionStatusWhereUniqueInput
  }

  /**
   * TransactionStatus findFirst
   */
  export type TransactionStatusFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionStatus
     */
    select?: TransactionStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionStatus
     */
    omit?: TransactionStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionStatusInclude<ExtArgs> | null
    /**
     * Filter, which TransactionStatus to fetch.
     */
    where?: TransactionStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TransactionStatuses to fetch.
     */
    orderBy?: TransactionStatusOrderByWithRelationInput | TransactionStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TransactionStatuses.
     */
    cursor?: TransactionStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TransactionStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TransactionStatuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TransactionStatuses.
     */
    distinct?: TransactionStatusScalarFieldEnum | TransactionStatusScalarFieldEnum[]
  }

  /**
   * TransactionStatus findFirstOrThrow
   */
  export type TransactionStatusFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionStatus
     */
    select?: TransactionStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionStatus
     */
    omit?: TransactionStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionStatusInclude<ExtArgs> | null
    /**
     * Filter, which TransactionStatus to fetch.
     */
    where?: TransactionStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TransactionStatuses to fetch.
     */
    orderBy?: TransactionStatusOrderByWithRelationInput | TransactionStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TransactionStatuses.
     */
    cursor?: TransactionStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TransactionStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TransactionStatuses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TransactionStatuses.
     */
    distinct?: TransactionStatusScalarFieldEnum | TransactionStatusScalarFieldEnum[]
  }

  /**
   * TransactionStatus findMany
   */
  export type TransactionStatusFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionStatus
     */
    select?: TransactionStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionStatus
     */
    omit?: TransactionStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionStatusInclude<ExtArgs> | null
    /**
     * Filter, which TransactionStatuses to fetch.
     */
    where?: TransactionStatusWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TransactionStatuses to fetch.
     */
    orderBy?: TransactionStatusOrderByWithRelationInput | TransactionStatusOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TransactionStatuses.
     */
    cursor?: TransactionStatusWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TransactionStatuses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TransactionStatuses.
     */
    skip?: number
    distinct?: TransactionStatusScalarFieldEnum | TransactionStatusScalarFieldEnum[]
  }

  /**
   * TransactionStatus create
   */
  export type TransactionStatusCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionStatus
     */
    select?: TransactionStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionStatus
     */
    omit?: TransactionStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionStatusInclude<ExtArgs> | null
    /**
     * The data needed to create a TransactionStatus.
     */
    data: XOR<TransactionStatusCreateInput, TransactionStatusUncheckedCreateInput>
  }

  /**
   * TransactionStatus createMany
   */
  export type TransactionStatusCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TransactionStatuses.
     */
    data: TransactionStatusCreateManyInput | TransactionStatusCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TransactionStatus createManyAndReturn
   */
  export type TransactionStatusCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionStatus
     */
    select?: TransactionStatusSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionStatus
     */
    omit?: TransactionStatusOmit<ExtArgs> | null
    /**
     * The data used to create many TransactionStatuses.
     */
    data: TransactionStatusCreateManyInput | TransactionStatusCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TransactionStatus update
   */
  export type TransactionStatusUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionStatus
     */
    select?: TransactionStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionStatus
     */
    omit?: TransactionStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionStatusInclude<ExtArgs> | null
    /**
     * The data needed to update a TransactionStatus.
     */
    data: XOR<TransactionStatusUpdateInput, TransactionStatusUncheckedUpdateInput>
    /**
     * Choose, which TransactionStatus to update.
     */
    where: TransactionStatusWhereUniqueInput
  }

  /**
   * TransactionStatus updateMany
   */
  export type TransactionStatusUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TransactionStatuses.
     */
    data: XOR<TransactionStatusUpdateManyMutationInput, TransactionStatusUncheckedUpdateManyInput>
    /**
     * Filter which TransactionStatuses to update
     */
    where?: TransactionStatusWhereInput
    /**
     * Limit how many TransactionStatuses to update.
     */
    limit?: number
  }

  /**
   * TransactionStatus updateManyAndReturn
   */
  export type TransactionStatusUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionStatus
     */
    select?: TransactionStatusSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionStatus
     */
    omit?: TransactionStatusOmit<ExtArgs> | null
    /**
     * The data used to update TransactionStatuses.
     */
    data: XOR<TransactionStatusUpdateManyMutationInput, TransactionStatusUncheckedUpdateManyInput>
    /**
     * Filter which TransactionStatuses to update
     */
    where?: TransactionStatusWhereInput
    /**
     * Limit how many TransactionStatuses to update.
     */
    limit?: number
  }

  /**
   * TransactionStatus upsert
   */
  export type TransactionStatusUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionStatus
     */
    select?: TransactionStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionStatus
     */
    omit?: TransactionStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionStatusInclude<ExtArgs> | null
    /**
     * The filter to search for the TransactionStatus to update in case it exists.
     */
    where: TransactionStatusWhereUniqueInput
    /**
     * In case the TransactionStatus found by the `where` argument doesn't exist, create a new TransactionStatus with this data.
     */
    create: XOR<TransactionStatusCreateInput, TransactionStatusUncheckedCreateInput>
    /**
     * In case the TransactionStatus was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionStatusUpdateInput, TransactionStatusUncheckedUpdateInput>
  }

  /**
   * TransactionStatus delete
   */
  export type TransactionStatusDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionStatus
     */
    select?: TransactionStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionStatus
     */
    omit?: TransactionStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionStatusInclude<ExtArgs> | null
    /**
     * Filter which TransactionStatus to delete.
     */
    where: TransactionStatusWhereUniqueInput
  }

  /**
   * TransactionStatus deleteMany
   */
  export type TransactionStatusDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TransactionStatuses to delete
     */
    where?: TransactionStatusWhereInput
    /**
     * Limit how many TransactionStatuses to delete.
     */
    limit?: number
  }

  /**
   * TransactionStatus.transactions
   */
  export type TransactionStatus$transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * TransactionStatus without action
   */
  export type TransactionStatusDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransactionStatus
     */
    select?: TransactionStatusSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TransactionStatus
     */
    omit?: TransactionStatusOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionStatusInclude<ExtArgs> | null
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


  export const TransactionScalarFieldEnum: {
    id: 'id',
    accountDebit: 'accountDebit',
    accountCredit: 'accountCredit',
    transferTypeId: 'transferTypeId',
    statusId: 'statusId',
    value: 'value',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TransactionScalarFieldEnum = (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum]


  export const TransactionTypeScalarFieldEnum: {
    id: 'id',
    name: 'name'
  };

  export type TransactionTypeScalarFieldEnum = (typeof TransactionTypeScalarFieldEnum)[keyof typeof TransactionTypeScalarFieldEnum]


  export const TransactionStatusScalarFieldEnum: {
    id: 'id',
    name: 'name'
  };

  export type TransactionStatusScalarFieldEnum = (typeof TransactionStatusScalarFieldEnum)[keyof typeof TransactionStatusScalarFieldEnum]


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
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    
  /**
   * Deep Input Types
   */


  export type TransactionWhereInput = {
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    id?: StringFilter<"Transaction"> | string
    accountDebit?: StringFilter<"Transaction"> | string
    accountCredit?: StringFilter<"Transaction"> | string
    transferTypeId?: IntFilter<"Transaction"> | number
    statusId?: IntFilter<"Transaction"> | number
    value?: FloatFilter<"Transaction"> | number
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"Transaction"> | Date | string
    transferType?: XOR<TransactionTypeScalarRelationFilter, TransactionTypeWhereInput>
    status?: XOR<TransactionStatusScalarRelationFilter, TransactionStatusWhereInput>
  }

  export type TransactionOrderByWithRelationInput = {
    id?: SortOrder
    accountDebit?: SortOrder
    accountCredit?: SortOrder
    transferTypeId?: SortOrder
    statusId?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    transferType?: TransactionTypeOrderByWithRelationInput
    status?: TransactionStatusOrderByWithRelationInput
  }

  export type TransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    accountDebit?: StringFilter<"Transaction"> | string
    accountCredit?: StringFilter<"Transaction"> | string
    transferTypeId?: IntFilter<"Transaction"> | number
    statusId?: IntFilter<"Transaction"> | number
    value?: FloatFilter<"Transaction"> | number
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"Transaction"> | Date | string
    transferType?: XOR<TransactionTypeScalarRelationFilter, TransactionTypeWhereInput>
    status?: XOR<TransactionStatusScalarRelationFilter, TransactionStatusWhereInput>
  }, "id">

  export type TransactionOrderByWithAggregationInput = {
    id?: SortOrder
    accountDebit?: SortOrder
    accountCredit?: SortOrder
    transferTypeId?: SortOrder
    statusId?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TransactionCountOrderByAggregateInput
    _avg?: TransactionAvgOrderByAggregateInput
    _max?: TransactionMaxOrderByAggregateInput
    _min?: TransactionMinOrderByAggregateInput
    _sum?: TransactionSumOrderByAggregateInput
  }

  export type TransactionScalarWhereWithAggregatesInput = {
    AND?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    OR?: TransactionScalarWhereWithAggregatesInput[]
    NOT?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Transaction"> | string
    accountDebit?: StringWithAggregatesFilter<"Transaction"> | string
    accountCredit?: StringWithAggregatesFilter<"Transaction"> | string
    transferTypeId?: IntWithAggregatesFilter<"Transaction"> | number
    statusId?: IntWithAggregatesFilter<"Transaction"> | number
    value?: FloatWithAggregatesFilter<"Transaction"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
  }

  export type TransactionTypeWhereInput = {
    AND?: TransactionTypeWhereInput | TransactionTypeWhereInput[]
    OR?: TransactionTypeWhereInput[]
    NOT?: TransactionTypeWhereInput | TransactionTypeWhereInput[]
    id?: IntFilter<"TransactionType"> | number
    name?: StringFilter<"TransactionType"> | string
    transactions?: TransactionListRelationFilter
  }

  export type TransactionTypeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    transactions?: TransactionOrderByRelationAggregateInput
  }

  export type TransactionTypeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: TransactionTypeWhereInput | TransactionTypeWhereInput[]
    OR?: TransactionTypeWhereInput[]
    NOT?: TransactionTypeWhereInput | TransactionTypeWhereInput[]
    name?: StringFilter<"TransactionType"> | string
    transactions?: TransactionListRelationFilter
  }, "id">

  export type TransactionTypeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    _count?: TransactionTypeCountOrderByAggregateInput
    _avg?: TransactionTypeAvgOrderByAggregateInput
    _max?: TransactionTypeMaxOrderByAggregateInput
    _min?: TransactionTypeMinOrderByAggregateInput
    _sum?: TransactionTypeSumOrderByAggregateInput
  }

  export type TransactionTypeScalarWhereWithAggregatesInput = {
    AND?: TransactionTypeScalarWhereWithAggregatesInput | TransactionTypeScalarWhereWithAggregatesInput[]
    OR?: TransactionTypeScalarWhereWithAggregatesInput[]
    NOT?: TransactionTypeScalarWhereWithAggregatesInput | TransactionTypeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"TransactionType"> | number
    name?: StringWithAggregatesFilter<"TransactionType"> | string
  }

  export type TransactionStatusWhereInput = {
    AND?: TransactionStatusWhereInput | TransactionStatusWhereInput[]
    OR?: TransactionStatusWhereInput[]
    NOT?: TransactionStatusWhereInput | TransactionStatusWhereInput[]
    id?: IntFilter<"TransactionStatus"> | number
    name?: StringFilter<"TransactionStatus"> | string
    transactions?: TransactionListRelationFilter
  }

  export type TransactionStatusOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    transactions?: TransactionOrderByRelationAggregateInput
  }

  export type TransactionStatusWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: TransactionStatusWhereInput | TransactionStatusWhereInput[]
    OR?: TransactionStatusWhereInput[]
    NOT?: TransactionStatusWhereInput | TransactionStatusWhereInput[]
    name?: StringFilter<"TransactionStatus"> | string
    transactions?: TransactionListRelationFilter
  }, "id">

  export type TransactionStatusOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    _count?: TransactionStatusCountOrderByAggregateInput
    _avg?: TransactionStatusAvgOrderByAggregateInput
    _max?: TransactionStatusMaxOrderByAggregateInput
    _min?: TransactionStatusMinOrderByAggregateInput
    _sum?: TransactionStatusSumOrderByAggregateInput
  }

  export type TransactionStatusScalarWhereWithAggregatesInput = {
    AND?: TransactionStatusScalarWhereWithAggregatesInput | TransactionStatusScalarWhereWithAggregatesInput[]
    OR?: TransactionStatusScalarWhereWithAggregatesInput[]
    NOT?: TransactionStatusScalarWhereWithAggregatesInput | TransactionStatusScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"TransactionStatus"> | number
    name?: StringWithAggregatesFilter<"TransactionStatus"> | string
  }

  export type TransactionCreateInput = {
    id?: string
    accountDebit: string
    accountCredit: string
    value: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transferType: TransactionTypeCreateNestedOneWithoutTransactionsInput
    status: TransactionStatusCreateNestedOneWithoutTransactionsInput
  }

  export type TransactionUncheckedCreateInput = {
    id?: string
    accountDebit: string
    accountCredit: string
    transferTypeId: number
    statusId: number
    value: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountDebit?: StringFieldUpdateOperationsInput | string
    accountCredit?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transferType?: TransactionTypeUpdateOneRequiredWithoutTransactionsNestedInput
    status?: TransactionStatusUpdateOneRequiredWithoutTransactionsNestedInput
  }

  export type TransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountDebit?: StringFieldUpdateOperationsInput | string
    accountCredit?: StringFieldUpdateOperationsInput | string
    transferTypeId?: IntFieldUpdateOperationsInput | number
    statusId?: IntFieldUpdateOperationsInput | number
    value?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateManyInput = {
    id?: string
    accountDebit: string
    accountCredit: string
    transferTypeId: number
    statusId: number
    value: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountDebit?: StringFieldUpdateOperationsInput | string
    accountCredit?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountDebit?: StringFieldUpdateOperationsInput | string
    accountCredit?: StringFieldUpdateOperationsInput | string
    transferTypeId?: IntFieldUpdateOperationsInput | number
    statusId?: IntFieldUpdateOperationsInput | number
    value?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionTypeCreateInput = {
    name: string
    transactions?: TransactionCreateNestedManyWithoutTransferTypeInput
  }

  export type TransactionTypeUncheckedCreateInput = {
    id?: number
    name: string
    transactions?: TransactionUncheckedCreateNestedManyWithoutTransferTypeInput
  }

  export type TransactionTypeUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    transactions?: TransactionUpdateManyWithoutTransferTypeNestedInput
  }

  export type TransactionTypeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    transactions?: TransactionUncheckedUpdateManyWithoutTransferTypeNestedInput
  }

  export type TransactionTypeCreateManyInput = {
    id?: number
    name: string
  }

  export type TransactionTypeUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
  }

  export type TransactionTypeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type TransactionStatusCreateInput = {
    name: string
    transactions?: TransactionCreateNestedManyWithoutStatusInput
  }

  export type TransactionStatusUncheckedCreateInput = {
    id?: number
    name: string
    transactions?: TransactionUncheckedCreateNestedManyWithoutStatusInput
  }

  export type TransactionStatusUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    transactions?: TransactionUpdateManyWithoutStatusNestedInput
  }

  export type TransactionStatusUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    transactions?: TransactionUncheckedUpdateManyWithoutStatusNestedInput
  }

  export type TransactionStatusCreateManyInput = {
    id?: number
    name: string
  }

  export type TransactionStatusUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
  }

  export type TransactionStatusUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
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

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
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

  export type TransactionTypeScalarRelationFilter = {
    is?: TransactionTypeWhereInput
    isNot?: TransactionTypeWhereInput
  }

  export type TransactionStatusScalarRelationFilter = {
    is?: TransactionStatusWhereInput
    isNot?: TransactionStatusWhereInput
  }

  export type TransactionCountOrderByAggregateInput = {
    id?: SortOrder
    accountDebit?: SortOrder
    accountCredit?: SortOrder
    transferTypeId?: SortOrder
    statusId?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionAvgOrderByAggregateInput = {
    transferTypeId?: SortOrder
    statusId?: SortOrder
    value?: SortOrder
  }

  export type TransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    accountDebit?: SortOrder
    accountCredit?: SortOrder
    transferTypeId?: SortOrder
    statusId?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionMinOrderByAggregateInput = {
    id?: SortOrder
    accountDebit?: SortOrder
    accountCredit?: SortOrder
    transferTypeId?: SortOrder
    statusId?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionSumOrderByAggregateInput = {
    transferTypeId?: SortOrder
    statusId?: SortOrder
    value?: SortOrder
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

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
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

  export type TransactionListRelationFilter = {
    every?: TransactionWhereInput
    some?: TransactionWhereInput
    none?: TransactionWhereInput
  }

  export type TransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TransactionTypeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type TransactionTypeAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type TransactionTypeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type TransactionTypeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type TransactionTypeSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type TransactionStatusCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type TransactionStatusAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type TransactionStatusMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type TransactionStatusMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type TransactionStatusSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type TransactionTypeCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<TransactionTypeCreateWithoutTransactionsInput, TransactionTypeUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: TransactionTypeCreateOrConnectWithoutTransactionsInput
    connect?: TransactionTypeWhereUniqueInput
  }

  export type TransactionStatusCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<TransactionStatusCreateWithoutTransactionsInput, TransactionStatusUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: TransactionStatusCreateOrConnectWithoutTransactionsInput
    connect?: TransactionStatusWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TransactionTypeUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: XOR<TransactionTypeCreateWithoutTransactionsInput, TransactionTypeUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: TransactionTypeCreateOrConnectWithoutTransactionsInput
    upsert?: TransactionTypeUpsertWithoutTransactionsInput
    connect?: TransactionTypeWhereUniqueInput
    update?: XOR<XOR<TransactionTypeUpdateToOneWithWhereWithoutTransactionsInput, TransactionTypeUpdateWithoutTransactionsInput>, TransactionTypeUncheckedUpdateWithoutTransactionsInput>
  }

  export type TransactionStatusUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: XOR<TransactionStatusCreateWithoutTransactionsInput, TransactionStatusUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: TransactionStatusCreateOrConnectWithoutTransactionsInput
    upsert?: TransactionStatusUpsertWithoutTransactionsInput
    connect?: TransactionStatusWhereUniqueInput
    update?: XOR<XOR<TransactionStatusUpdateToOneWithWhereWithoutTransactionsInput, TransactionStatusUpdateWithoutTransactionsInput>, TransactionStatusUncheckedUpdateWithoutTransactionsInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TransactionCreateNestedManyWithoutTransferTypeInput = {
    create?: XOR<TransactionCreateWithoutTransferTypeInput, TransactionUncheckedCreateWithoutTransferTypeInput> | TransactionCreateWithoutTransferTypeInput[] | TransactionUncheckedCreateWithoutTransferTypeInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutTransferTypeInput | TransactionCreateOrConnectWithoutTransferTypeInput[]
    createMany?: TransactionCreateManyTransferTypeInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutTransferTypeInput = {
    create?: XOR<TransactionCreateWithoutTransferTypeInput, TransactionUncheckedCreateWithoutTransferTypeInput> | TransactionCreateWithoutTransferTypeInput[] | TransactionUncheckedCreateWithoutTransferTypeInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutTransferTypeInput | TransactionCreateOrConnectWithoutTransferTypeInput[]
    createMany?: TransactionCreateManyTransferTypeInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TransactionUpdateManyWithoutTransferTypeNestedInput = {
    create?: XOR<TransactionCreateWithoutTransferTypeInput, TransactionUncheckedCreateWithoutTransferTypeInput> | TransactionCreateWithoutTransferTypeInput[] | TransactionUncheckedCreateWithoutTransferTypeInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutTransferTypeInput | TransactionCreateOrConnectWithoutTransferTypeInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutTransferTypeInput | TransactionUpsertWithWhereUniqueWithoutTransferTypeInput[]
    createMany?: TransactionCreateManyTransferTypeInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutTransferTypeInput | TransactionUpdateWithWhereUniqueWithoutTransferTypeInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutTransferTypeInput | TransactionUpdateManyWithWhereWithoutTransferTypeInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutTransferTypeNestedInput = {
    create?: XOR<TransactionCreateWithoutTransferTypeInput, TransactionUncheckedCreateWithoutTransferTypeInput> | TransactionCreateWithoutTransferTypeInput[] | TransactionUncheckedCreateWithoutTransferTypeInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutTransferTypeInput | TransactionCreateOrConnectWithoutTransferTypeInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutTransferTypeInput | TransactionUpsertWithWhereUniqueWithoutTransferTypeInput[]
    createMany?: TransactionCreateManyTransferTypeInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutTransferTypeInput | TransactionUpdateWithWhereUniqueWithoutTransferTypeInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutTransferTypeInput | TransactionUpdateManyWithWhereWithoutTransferTypeInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TransactionCreateNestedManyWithoutStatusInput = {
    create?: XOR<TransactionCreateWithoutStatusInput, TransactionUncheckedCreateWithoutStatusInput> | TransactionCreateWithoutStatusInput[] | TransactionUncheckedCreateWithoutStatusInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutStatusInput | TransactionCreateOrConnectWithoutStatusInput[]
    createMany?: TransactionCreateManyStatusInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutStatusInput = {
    create?: XOR<TransactionCreateWithoutStatusInput, TransactionUncheckedCreateWithoutStatusInput> | TransactionCreateWithoutStatusInput[] | TransactionUncheckedCreateWithoutStatusInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutStatusInput | TransactionCreateOrConnectWithoutStatusInput[]
    createMany?: TransactionCreateManyStatusInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TransactionUpdateManyWithoutStatusNestedInput = {
    create?: XOR<TransactionCreateWithoutStatusInput, TransactionUncheckedCreateWithoutStatusInput> | TransactionCreateWithoutStatusInput[] | TransactionUncheckedCreateWithoutStatusInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutStatusInput | TransactionCreateOrConnectWithoutStatusInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutStatusInput | TransactionUpsertWithWhereUniqueWithoutStatusInput[]
    createMany?: TransactionCreateManyStatusInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutStatusInput | TransactionUpdateWithWhereUniqueWithoutStatusInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutStatusInput | TransactionUpdateManyWithWhereWithoutStatusInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutStatusNestedInput = {
    create?: XOR<TransactionCreateWithoutStatusInput, TransactionUncheckedCreateWithoutStatusInput> | TransactionCreateWithoutStatusInput[] | TransactionUncheckedCreateWithoutStatusInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutStatusInput | TransactionCreateOrConnectWithoutStatusInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutStatusInput | TransactionUpsertWithWhereUniqueWithoutStatusInput[]
    createMany?: TransactionCreateManyStatusInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutStatusInput | TransactionUpdateWithWhereUniqueWithoutStatusInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutStatusInput | TransactionUpdateManyWithWhereWithoutStatusInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
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

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
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

  export type TransactionTypeCreateWithoutTransactionsInput = {
    name: string
  }

  export type TransactionTypeUncheckedCreateWithoutTransactionsInput = {
    id?: number
    name: string
  }

  export type TransactionTypeCreateOrConnectWithoutTransactionsInput = {
    where: TransactionTypeWhereUniqueInput
    create: XOR<TransactionTypeCreateWithoutTransactionsInput, TransactionTypeUncheckedCreateWithoutTransactionsInput>
  }

  export type TransactionStatusCreateWithoutTransactionsInput = {
    name: string
  }

  export type TransactionStatusUncheckedCreateWithoutTransactionsInput = {
    id?: number
    name: string
  }

  export type TransactionStatusCreateOrConnectWithoutTransactionsInput = {
    where: TransactionStatusWhereUniqueInput
    create: XOR<TransactionStatusCreateWithoutTransactionsInput, TransactionStatusUncheckedCreateWithoutTransactionsInput>
  }

  export type TransactionTypeUpsertWithoutTransactionsInput = {
    update: XOR<TransactionTypeUpdateWithoutTransactionsInput, TransactionTypeUncheckedUpdateWithoutTransactionsInput>
    create: XOR<TransactionTypeCreateWithoutTransactionsInput, TransactionTypeUncheckedCreateWithoutTransactionsInput>
    where?: TransactionTypeWhereInput
  }

  export type TransactionTypeUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: TransactionTypeWhereInput
    data: XOR<TransactionTypeUpdateWithoutTransactionsInput, TransactionTypeUncheckedUpdateWithoutTransactionsInput>
  }

  export type TransactionTypeUpdateWithoutTransactionsInput = {
    name?: StringFieldUpdateOperationsInput | string
  }

  export type TransactionTypeUncheckedUpdateWithoutTransactionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type TransactionStatusUpsertWithoutTransactionsInput = {
    update: XOR<TransactionStatusUpdateWithoutTransactionsInput, TransactionStatusUncheckedUpdateWithoutTransactionsInput>
    create: XOR<TransactionStatusCreateWithoutTransactionsInput, TransactionStatusUncheckedCreateWithoutTransactionsInput>
    where?: TransactionStatusWhereInput
  }

  export type TransactionStatusUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: TransactionStatusWhereInput
    data: XOR<TransactionStatusUpdateWithoutTransactionsInput, TransactionStatusUncheckedUpdateWithoutTransactionsInput>
  }

  export type TransactionStatusUpdateWithoutTransactionsInput = {
    name?: StringFieldUpdateOperationsInput | string
  }

  export type TransactionStatusUncheckedUpdateWithoutTransactionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type TransactionCreateWithoutTransferTypeInput = {
    id?: string
    accountDebit: string
    accountCredit: string
    value: number
    createdAt?: Date | string
    updatedAt?: Date | string
    status: TransactionStatusCreateNestedOneWithoutTransactionsInput
  }

  export type TransactionUncheckedCreateWithoutTransferTypeInput = {
    id?: string
    accountDebit: string
    accountCredit: string
    statusId: number
    value: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionCreateOrConnectWithoutTransferTypeInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutTransferTypeInput, TransactionUncheckedCreateWithoutTransferTypeInput>
  }

  export type TransactionCreateManyTransferTypeInputEnvelope = {
    data: TransactionCreateManyTransferTypeInput | TransactionCreateManyTransferTypeInput[]
    skipDuplicates?: boolean
  }

  export type TransactionUpsertWithWhereUniqueWithoutTransferTypeInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutTransferTypeInput, TransactionUncheckedUpdateWithoutTransferTypeInput>
    create: XOR<TransactionCreateWithoutTransferTypeInput, TransactionUncheckedCreateWithoutTransferTypeInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutTransferTypeInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutTransferTypeInput, TransactionUncheckedUpdateWithoutTransferTypeInput>
  }

  export type TransactionUpdateManyWithWhereWithoutTransferTypeInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutTransferTypeInput>
  }

  export type TransactionScalarWhereInput = {
    AND?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    OR?: TransactionScalarWhereInput[]
    NOT?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    id?: StringFilter<"Transaction"> | string
    accountDebit?: StringFilter<"Transaction"> | string
    accountCredit?: StringFilter<"Transaction"> | string
    transferTypeId?: IntFilter<"Transaction"> | number
    statusId?: IntFilter<"Transaction"> | number
    value?: FloatFilter<"Transaction"> | number
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"Transaction"> | Date | string
  }

  export type TransactionCreateWithoutStatusInput = {
    id?: string
    accountDebit: string
    accountCredit: string
    value: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transferType: TransactionTypeCreateNestedOneWithoutTransactionsInput
  }

  export type TransactionUncheckedCreateWithoutStatusInput = {
    id?: string
    accountDebit: string
    accountCredit: string
    transferTypeId: number
    value: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionCreateOrConnectWithoutStatusInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutStatusInput, TransactionUncheckedCreateWithoutStatusInput>
  }

  export type TransactionCreateManyStatusInputEnvelope = {
    data: TransactionCreateManyStatusInput | TransactionCreateManyStatusInput[]
    skipDuplicates?: boolean
  }

  export type TransactionUpsertWithWhereUniqueWithoutStatusInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutStatusInput, TransactionUncheckedUpdateWithoutStatusInput>
    create: XOR<TransactionCreateWithoutStatusInput, TransactionUncheckedCreateWithoutStatusInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutStatusInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutStatusInput, TransactionUncheckedUpdateWithoutStatusInput>
  }

  export type TransactionUpdateManyWithWhereWithoutStatusInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutStatusInput>
  }

  export type TransactionCreateManyTransferTypeInput = {
    id?: string
    accountDebit: string
    accountCredit: string
    statusId: number
    value: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionUpdateWithoutTransferTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountDebit?: StringFieldUpdateOperationsInput | string
    accountCredit?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: TransactionStatusUpdateOneRequiredWithoutTransactionsNestedInput
  }

  export type TransactionUncheckedUpdateWithoutTransferTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountDebit?: StringFieldUpdateOperationsInput | string
    accountCredit?: StringFieldUpdateOperationsInput | string
    statusId?: IntFieldUpdateOperationsInput | number
    value?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyWithoutTransferTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountDebit?: StringFieldUpdateOperationsInput | string
    accountCredit?: StringFieldUpdateOperationsInput | string
    statusId?: IntFieldUpdateOperationsInput | number
    value?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateManyStatusInput = {
    id?: string
    accountDebit: string
    accountCredit: string
    transferTypeId: number
    value: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionUpdateWithoutStatusInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountDebit?: StringFieldUpdateOperationsInput | string
    accountCredit?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transferType?: TransactionTypeUpdateOneRequiredWithoutTransactionsNestedInput
  }

  export type TransactionUncheckedUpdateWithoutStatusInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountDebit?: StringFieldUpdateOperationsInput | string
    accountCredit?: StringFieldUpdateOperationsInput | string
    transferTypeId?: IntFieldUpdateOperationsInput | number
    value?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyWithoutStatusInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountDebit?: StringFieldUpdateOperationsInput | string
    accountCredit?: StringFieldUpdateOperationsInput | string
    transferTypeId?: IntFieldUpdateOperationsInput | number
    value?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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