
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
 * Model AntiFraud
 * 
 */
export type AntiFraud = $Result.DefaultSelection<Prisma.$AntiFraudPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const AntiFraudStatus: {
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export type AntiFraudStatus = (typeof AntiFraudStatus)[keyof typeof AntiFraudStatus]

}

export type AntiFraudStatus = $Enums.AntiFraudStatus

export const AntiFraudStatus: typeof $Enums.AntiFraudStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more AntiFrauds
 * const antiFrauds = await prisma.antiFraud.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
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
   * // Fetch zero or more AntiFrauds
   * const antiFrauds = await prisma.antiFraud.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

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


  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.antiFraud`: Exposes CRUD operations for the **AntiFraud** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AntiFrauds
    * const antiFrauds = await prisma.antiFraud.findMany()
    * ```
    */
  get antiFraud(): Prisma.AntiFraudDelegate<ExtArgs>;
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
  export import NotFoundError = runtime.NotFoundError

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
   * Prisma Client JS version: 5.11.0
   * Query Engine version: efd2449663b3d73d637ea1fd226bafbcf45b3102
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray | { toJSON(): unknown }

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
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
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
    AntiFraud: 'AntiFraud'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }


  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs}, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meta: {
      modelProps: 'antiFraud'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    },
    model: {
      AntiFraud: {
        payload: Prisma.$AntiFraudPayload<ExtArgs>
        fields: Prisma.AntiFraudFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AntiFraudFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AntiFraudPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AntiFraudFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AntiFraudPayload>
          }
          findFirst: {
            args: Prisma.AntiFraudFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AntiFraudPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AntiFraudFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AntiFraudPayload>
          }
          findMany: {
            args: Prisma.AntiFraudFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AntiFraudPayload>[]
          }
          create: {
            args: Prisma.AntiFraudCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AntiFraudPayload>
          }
          createMany: {
            args: Prisma.AntiFraudCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.AntiFraudDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AntiFraudPayload>
          }
          update: {
            args: Prisma.AntiFraudUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AntiFraudPayload>
          }
          deleteMany: {
            args: Prisma.AntiFraudDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.AntiFraudUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.AntiFraudUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$AntiFraudPayload>
          }
          aggregate: {
            args: Prisma.AntiFraudAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateAntiFraud>
          }
          groupBy: {
            args: Prisma.AntiFraudGroupByArgs<ExtArgs>,
            result: $Utils.Optional<AntiFraudGroupByOutputType>[]
          }
          count: {
            args: Prisma.AntiFraudCountArgs<ExtArgs>,
            result: $Utils.Optional<AntiFraudCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
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
    | 'update'
    | 'updateMany'
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
   * Models
   */

  /**
   * Model AntiFraud
   */

  export type AggregateAntiFraud = {
    _count: AntiFraudCountAggregateOutputType | null
    _min: AntiFraudMinAggregateOutputType | null
    _max: AntiFraudMaxAggregateOutputType | null
  }

  export type AntiFraudMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    transaction_id: string | null
    status: $Enums.AntiFraudStatus | null
  }

  export type AntiFraudMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    transaction_id: string | null
    status: $Enums.AntiFraudStatus | null
  }

  export type AntiFraudCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    transaction_id: number
    status: number
    _all: number
  }


  export type AntiFraudMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    transaction_id?: true
    status?: true
  }

  export type AntiFraudMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    transaction_id?: true
    status?: true
  }

  export type AntiFraudCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    transaction_id?: true
    status?: true
    _all?: true
  }

  export type AntiFraudAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AntiFraud to aggregate.
     */
    where?: AntiFraudWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AntiFrauds to fetch.
     */
    orderBy?: AntiFraudOrderByWithRelationInput | AntiFraudOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AntiFraudWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AntiFrauds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AntiFrauds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AntiFrauds
    **/
    _count?: true | AntiFraudCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AntiFraudMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AntiFraudMaxAggregateInputType
  }

  export type GetAntiFraudAggregateType<T extends AntiFraudAggregateArgs> = {
        [P in keyof T & keyof AggregateAntiFraud]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAntiFraud[P]>
      : GetScalarType<T[P], AggregateAntiFraud[P]>
  }




  export type AntiFraudGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AntiFraudWhereInput
    orderBy?: AntiFraudOrderByWithAggregationInput | AntiFraudOrderByWithAggregationInput[]
    by: AntiFraudScalarFieldEnum[] | AntiFraudScalarFieldEnum
    having?: AntiFraudScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AntiFraudCountAggregateInputType | true
    _min?: AntiFraudMinAggregateInputType
    _max?: AntiFraudMaxAggregateInputType
  }

  export type AntiFraudGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    transaction_id: string
    status: $Enums.AntiFraudStatus
    _count: AntiFraudCountAggregateOutputType | null
    _min: AntiFraudMinAggregateOutputType | null
    _max: AntiFraudMaxAggregateOutputType | null
  }

  type GetAntiFraudGroupByPayload<T extends AntiFraudGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AntiFraudGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AntiFraudGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AntiFraudGroupByOutputType[P]>
            : GetScalarType<T[P], AntiFraudGroupByOutputType[P]>
        }
      >
    >


  export type AntiFraudSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    transaction_id?: boolean
    status?: boolean
  }, ExtArgs["result"]["antiFraud"]>

  export type AntiFraudSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    transaction_id?: boolean
    status?: boolean
  }


  export type $AntiFraudPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AntiFraud"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      transaction_id: string
      status: $Enums.AntiFraudStatus
    }, ExtArgs["result"]["antiFraud"]>
    composites: {}
  }


  type AntiFraudGetPayload<S extends boolean | null | undefined | AntiFraudDefaultArgs> = $Result.GetResult<Prisma.$AntiFraudPayload, S>

  type AntiFraudCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AntiFraudFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AntiFraudCountAggregateInputType | true
    }

  export interface AntiFraudDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AntiFraud'], meta: { name: 'AntiFraud' } }
    /**
     * Find zero or one AntiFraud that matches the filter.
     * @param {AntiFraudFindUniqueArgs} args - Arguments to find a AntiFraud
     * @example
     * // Get one AntiFraud
     * const antiFraud = await prisma.antiFraud.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends AntiFraudFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, AntiFraudFindUniqueArgs<ExtArgs>>
    ): Prisma__AntiFraudClient<$Result.GetResult<Prisma.$AntiFraudPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one AntiFraud that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {AntiFraudFindUniqueOrThrowArgs} args - Arguments to find a AntiFraud
     * @example
     * // Get one AntiFraud
     * const antiFraud = await prisma.antiFraud.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends AntiFraudFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AntiFraudFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__AntiFraudClient<$Result.GetResult<Prisma.$AntiFraudPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first AntiFraud that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AntiFraudFindFirstArgs} args - Arguments to find a AntiFraud
     * @example
     * // Get one AntiFraud
     * const antiFraud = await prisma.antiFraud.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends AntiFraudFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, AntiFraudFindFirstArgs<ExtArgs>>
    ): Prisma__AntiFraudClient<$Result.GetResult<Prisma.$AntiFraudPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first AntiFraud that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AntiFraudFindFirstOrThrowArgs} args - Arguments to find a AntiFraud
     * @example
     * // Get one AntiFraud
     * const antiFraud = await prisma.antiFraud.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends AntiFraudFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AntiFraudFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__AntiFraudClient<$Result.GetResult<Prisma.$AntiFraudPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more AntiFrauds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AntiFraudFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AntiFrauds
     * const antiFrauds = await prisma.antiFraud.findMany()
     * 
     * // Get first 10 AntiFrauds
     * const antiFrauds = await prisma.antiFraud.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const antiFraudWithIdOnly = await prisma.antiFraud.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends AntiFraudFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AntiFraudFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AntiFraudPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a AntiFraud.
     * @param {AntiFraudCreateArgs} args - Arguments to create a AntiFraud.
     * @example
     * // Create one AntiFraud
     * const AntiFraud = await prisma.antiFraud.create({
     *   data: {
     *     // ... data to create a AntiFraud
     *   }
     * })
     * 
    **/
    create<T extends AntiFraudCreateArgs<ExtArgs>>(
      args: SelectSubset<T, AntiFraudCreateArgs<ExtArgs>>
    ): Prisma__AntiFraudClient<$Result.GetResult<Prisma.$AntiFraudPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many AntiFrauds.
     *     @param {AntiFraudCreateManyArgs} args - Arguments to create many AntiFrauds.
     *     @example
     *     // Create many AntiFrauds
     *     const antiFraud = await prisma.antiFraud.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends AntiFraudCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AntiFraudCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AntiFraud.
     * @param {AntiFraudDeleteArgs} args - Arguments to delete one AntiFraud.
     * @example
     * // Delete one AntiFraud
     * const AntiFraud = await prisma.antiFraud.delete({
     *   where: {
     *     // ... filter to delete one AntiFraud
     *   }
     * })
     * 
    **/
    delete<T extends AntiFraudDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, AntiFraudDeleteArgs<ExtArgs>>
    ): Prisma__AntiFraudClient<$Result.GetResult<Prisma.$AntiFraudPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one AntiFraud.
     * @param {AntiFraudUpdateArgs} args - Arguments to update one AntiFraud.
     * @example
     * // Update one AntiFraud
     * const antiFraud = await prisma.antiFraud.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends AntiFraudUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, AntiFraudUpdateArgs<ExtArgs>>
    ): Prisma__AntiFraudClient<$Result.GetResult<Prisma.$AntiFraudPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more AntiFrauds.
     * @param {AntiFraudDeleteManyArgs} args - Arguments to filter AntiFrauds to delete.
     * @example
     * // Delete a few AntiFrauds
     * const { count } = await prisma.antiFraud.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends AntiFraudDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AntiFraudDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AntiFrauds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AntiFraudUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AntiFrauds
     * const antiFraud = await prisma.antiFraud.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends AntiFraudUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, AntiFraudUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AntiFraud.
     * @param {AntiFraudUpsertArgs} args - Arguments to update or create a AntiFraud.
     * @example
     * // Update or create a AntiFraud
     * const antiFraud = await prisma.antiFraud.upsert({
     *   create: {
     *     // ... data to create a AntiFraud
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AntiFraud we want to update
     *   }
     * })
    **/
    upsert<T extends AntiFraudUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, AntiFraudUpsertArgs<ExtArgs>>
    ): Prisma__AntiFraudClient<$Result.GetResult<Prisma.$AntiFraudPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of AntiFrauds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AntiFraudCountArgs} args - Arguments to filter AntiFrauds to count.
     * @example
     * // Count the number of AntiFrauds
     * const count = await prisma.antiFraud.count({
     *   where: {
     *     // ... the filter for the AntiFrauds we want to count
     *   }
     * })
    **/
    count<T extends AntiFraudCountArgs>(
      args?: Subset<T, AntiFraudCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AntiFraudCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AntiFraud.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AntiFraudAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AntiFraudAggregateArgs>(args: Subset<T, AntiFraudAggregateArgs>): Prisma.PrismaPromise<GetAntiFraudAggregateType<T>>

    /**
     * Group by AntiFraud.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AntiFraudGroupByArgs} args - Group by arguments.
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
      T extends AntiFraudGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AntiFraudGroupByArgs['orderBy'] }
        : { orderBy?: AntiFraudGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AntiFraudGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAntiFraudGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AntiFraud model
   */
  readonly fields: AntiFraudFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AntiFraud.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AntiFraudClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';


    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the AntiFraud model
   */ 
  interface AntiFraudFieldRefs {
    readonly id: FieldRef<"AntiFraud", 'String'>
    readonly createdAt: FieldRef<"AntiFraud", 'DateTime'>
    readonly updatedAt: FieldRef<"AntiFraud", 'DateTime'>
    readonly transaction_id: FieldRef<"AntiFraud", 'String'>
    readonly status: FieldRef<"AntiFraud", 'AntiFraudStatus'>
  }
    

  // Custom InputTypes

  /**
   * AntiFraud findUnique
   */
  export type AntiFraudFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AntiFraud
     */
    select?: AntiFraudSelect<ExtArgs> | null
    /**
     * Filter, which AntiFraud to fetch.
     */
    where: AntiFraudWhereUniqueInput
  }


  /**
   * AntiFraud findUniqueOrThrow
   */
  export type AntiFraudFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AntiFraud
     */
    select?: AntiFraudSelect<ExtArgs> | null
    /**
     * Filter, which AntiFraud to fetch.
     */
    where: AntiFraudWhereUniqueInput
  }


  /**
   * AntiFraud findFirst
   */
  export type AntiFraudFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AntiFraud
     */
    select?: AntiFraudSelect<ExtArgs> | null
    /**
     * Filter, which AntiFraud to fetch.
     */
    where?: AntiFraudWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AntiFrauds to fetch.
     */
    orderBy?: AntiFraudOrderByWithRelationInput | AntiFraudOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AntiFrauds.
     */
    cursor?: AntiFraudWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AntiFrauds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AntiFrauds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AntiFrauds.
     */
    distinct?: AntiFraudScalarFieldEnum | AntiFraudScalarFieldEnum[]
  }


  /**
   * AntiFraud findFirstOrThrow
   */
  export type AntiFraudFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AntiFraud
     */
    select?: AntiFraudSelect<ExtArgs> | null
    /**
     * Filter, which AntiFraud to fetch.
     */
    where?: AntiFraudWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AntiFrauds to fetch.
     */
    orderBy?: AntiFraudOrderByWithRelationInput | AntiFraudOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AntiFrauds.
     */
    cursor?: AntiFraudWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AntiFrauds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AntiFrauds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AntiFrauds.
     */
    distinct?: AntiFraudScalarFieldEnum | AntiFraudScalarFieldEnum[]
  }


  /**
   * AntiFraud findMany
   */
  export type AntiFraudFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AntiFraud
     */
    select?: AntiFraudSelect<ExtArgs> | null
    /**
     * Filter, which AntiFrauds to fetch.
     */
    where?: AntiFraudWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AntiFrauds to fetch.
     */
    orderBy?: AntiFraudOrderByWithRelationInput | AntiFraudOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AntiFrauds.
     */
    cursor?: AntiFraudWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AntiFrauds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AntiFrauds.
     */
    skip?: number
    distinct?: AntiFraudScalarFieldEnum | AntiFraudScalarFieldEnum[]
  }


  /**
   * AntiFraud create
   */
  export type AntiFraudCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AntiFraud
     */
    select?: AntiFraudSelect<ExtArgs> | null
    /**
     * The data needed to create a AntiFraud.
     */
    data: XOR<AntiFraudCreateInput, AntiFraudUncheckedCreateInput>
  }


  /**
   * AntiFraud createMany
   */
  export type AntiFraudCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AntiFrauds.
     */
    data: AntiFraudCreateManyInput | AntiFraudCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * AntiFraud update
   */
  export type AntiFraudUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AntiFraud
     */
    select?: AntiFraudSelect<ExtArgs> | null
    /**
     * The data needed to update a AntiFraud.
     */
    data: XOR<AntiFraudUpdateInput, AntiFraudUncheckedUpdateInput>
    /**
     * Choose, which AntiFraud to update.
     */
    where: AntiFraudWhereUniqueInput
  }


  /**
   * AntiFraud updateMany
   */
  export type AntiFraudUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AntiFrauds.
     */
    data: XOR<AntiFraudUpdateManyMutationInput, AntiFraudUncheckedUpdateManyInput>
    /**
     * Filter which AntiFrauds to update
     */
    where?: AntiFraudWhereInput
  }


  /**
   * AntiFraud upsert
   */
  export type AntiFraudUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AntiFraud
     */
    select?: AntiFraudSelect<ExtArgs> | null
    /**
     * The filter to search for the AntiFraud to update in case it exists.
     */
    where: AntiFraudWhereUniqueInput
    /**
     * In case the AntiFraud found by the `where` argument doesn't exist, create a new AntiFraud with this data.
     */
    create: XOR<AntiFraudCreateInput, AntiFraudUncheckedCreateInput>
    /**
     * In case the AntiFraud was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AntiFraudUpdateInput, AntiFraudUncheckedUpdateInput>
  }


  /**
   * AntiFraud delete
   */
  export type AntiFraudDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AntiFraud
     */
    select?: AntiFraudSelect<ExtArgs> | null
    /**
     * Filter which AntiFraud to delete.
     */
    where: AntiFraudWhereUniqueInput
  }


  /**
   * AntiFraud deleteMany
   */
  export type AntiFraudDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AntiFrauds to delete
     */
    where?: AntiFraudWhereInput
  }


  /**
   * AntiFraud without action
   */
  export type AntiFraudDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AntiFraud
     */
    select?: AntiFraudSelect<ExtArgs> | null
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


  export const AntiFraudScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    transaction_id: 'transaction_id',
    status: 'status'
  };

  export type AntiFraudScalarFieldEnum = (typeof AntiFraudScalarFieldEnum)[keyof typeof AntiFraudScalarFieldEnum]


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
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'AntiFraudStatus'
   */
  export type EnumAntiFraudStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AntiFraudStatus'>
    


  /**
   * Reference to a field of type 'AntiFraudStatus[]'
   */
  export type ListEnumAntiFraudStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AntiFraudStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type AntiFraudWhereInput = {
    AND?: AntiFraudWhereInput | AntiFraudWhereInput[]
    OR?: AntiFraudWhereInput[]
    NOT?: AntiFraudWhereInput | AntiFraudWhereInput[]
    id?: StringFilter<"AntiFraud"> | string
    createdAt?: DateTimeFilter<"AntiFraud"> | Date | string
    updatedAt?: DateTimeFilter<"AntiFraud"> | Date | string
    transaction_id?: StringFilter<"AntiFraud"> | string
    status?: EnumAntiFraudStatusFilter<"AntiFraud"> | $Enums.AntiFraudStatus
  }

  export type AntiFraudOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    transaction_id?: SortOrder
    status?: SortOrder
  }

  export type AntiFraudWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AntiFraudWhereInput | AntiFraudWhereInput[]
    OR?: AntiFraudWhereInput[]
    NOT?: AntiFraudWhereInput | AntiFraudWhereInput[]
    createdAt?: DateTimeFilter<"AntiFraud"> | Date | string
    updatedAt?: DateTimeFilter<"AntiFraud"> | Date | string
    transaction_id?: StringFilter<"AntiFraud"> | string
    status?: EnumAntiFraudStatusFilter<"AntiFraud"> | $Enums.AntiFraudStatus
  }, "id">

  export type AntiFraudOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    transaction_id?: SortOrder
    status?: SortOrder
    _count?: AntiFraudCountOrderByAggregateInput
    _max?: AntiFraudMaxOrderByAggregateInput
    _min?: AntiFraudMinOrderByAggregateInput
  }

  export type AntiFraudScalarWhereWithAggregatesInput = {
    AND?: AntiFraudScalarWhereWithAggregatesInput | AntiFraudScalarWhereWithAggregatesInput[]
    OR?: AntiFraudScalarWhereWithAggregatesInput[]
    NOT?: AntiFraudScalarWhereWithAggregatesInput | AntiFraudScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AntiFraud"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AntiFraud"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AntiFraud"> | Date | string
    transaction_id?: StringWithAggregatesFilter<"AntiFraud"> | string
    status?: EnumAntiFraudStatusWithAggregatesFilter<"AntiFraud"> | $Enums.AntiFraudStatus
  }

  export type AntiFraudCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    transaction_id: string
    status: $Enums.AntiFraudStatus
  }

  export type AntiFraudUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    transaction_id: string
    status: $Enums.AntiFraudStatus
  }

  export type AntiFraudUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transaction_id?: StringFieldUpdateOperationsInput | string
    status?: EnumAntiFraudStatusFieldUpdateOperationsInput | $Enums.AntiFraudStatus
  }

  export type AntiFraudUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transaction_id?: StringFieldUpdateOperationsInput | string
    status?: EnumAntiFraudStatusFieldUpdateOperationsInput | $Enums.AntiFraudStatus
  }

  export type AntiFraudCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    transaction_id: string
    status: $Enums.AntiFraudStatus
  }

  export type AntiFraudUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transaction_id?: StringFieldUpdateOperationsInput | string
    status?: EnumAntiFraudStatusFieldUpdateOperationsInput | $Enums.AntiFraudStatus
  }

  export type AntiFraudUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transaction_id?: StringFieldUpdateOperationsInput | string
    status?: EnumAntiFraudStatusFieldUpdateOperationsInput | $Enums.AntiFraudStatus
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

  export type EnumAntiFraudStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AntiFraudStatus | EnumAntiFraudStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AntiFraudStatus[] | ListEnumAntiFraudStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AntiFraudStatus[] | ListEnumAntiFraudStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAntiFraudStatusFilter<$PrismaModel> | $Enums.AntiFraudStatus
  }

  export type AntiFraudCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    transaction_id?: SortOrder
    status?: SortOrder
  }

  export type AntiFraudMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    transaction_id?: SortOrder
    status?: SortOrder
  }

  export type AntiFraudMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    transaction_id?: SortOrder
    status?: SortOrder
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

  export type EnumAntiFraudStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AntiFraudStatus | EnumAntiFraudStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AntiFraudStatus[] | ListEnumAntiFraudStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AntiFraudStatus[] | ListEnumAntiFraudStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAntiFraudStatusWithAggregatesFilter<$PrismaModel> | $Enums.AntiFraudStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAntiFraudStatusFilter<$PrismaModel>
    _max?: NestedEnumAntiFraudStatusFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EnumAntiFraudStatusFieldUpdateOperationsInput = {
    set?: $Enums.AntiFraudStatus
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

  export type NestedEnumAntiFraudStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AntiFraudStatus | EnumAntiFraudStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AntiFraudStatus[] | ListEnumAntiFraudStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AntiFraudStatus[] | ListEnumAntiFraudStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAntiFraudStatusFilter<$PrismaModel> | $Enums.AntiFraudStatus
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

  export type NestedEnumAntiFraudStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AntiFraudStatus | EnumAntiFraudStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AntiFraudStatus[] | ListEnumAntiFraudStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AntiFraudStatus[] | ListEnumAntiFraudStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAntiFraudStatusWithAggregatesFilter<$PrismaModel> | $Enums.AntiFraudStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAntiFraudStatusFilter<$PrismaModel>
    _max?: NestedEnumAntiFraudStatusFilter<$PrismaModel>
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use AntiFraudDefaultArgs instead
     */
    export type AntiFraudArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AntiFraudDefaultArgs<ExtArgs>

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