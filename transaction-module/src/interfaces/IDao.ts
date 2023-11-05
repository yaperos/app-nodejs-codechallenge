import { type Transaction, type where, type literal, type Op } from 'sequelize/types'

export interface IDaoConditionsObject {
  [index: string]: IDaoConditionsItem | IDaoConditionsItem[]
  [Op.in]?: IDaoConditionsItem | IDaoConditionsItem[]
  [Op.lte]?: IDaoConditionsItem | IDaoConditionsItem[]
  [Op.notIn]?: IDaoConditionsItem | IDaoConditionsItem[]
  [Op.and]?: IDaoConditionsItem | IDaoConditionsItem[]
  [Op.or]?: IDaoConditionsItem | IDaoConditionsItem[]
  [Op.is]?: IDaoConditionsItem | IDaoConditionsItem[]
  [Op.not]?: IDaoConditionsItem | IDaoConditionsItem[]
  [Op.substring]?: IDaoConditionsItem | IDaoConditionsItem[]
  [Op.like]?: IDaoConditionsItem | IDaoConditionsItem[]
  [Op.between]?: IDaoConditionsItem | IDaoConditionsItem[]
  [Op.gt]?: IDaoConditionsItem | IDaoConditionsItem[]
  [Op.gte]?: IDaoConditionsItem | IDaoConditionsItem[]
  [Op.lt]?: IDaoConditionsItem | IDaoConditionsItem[]
  [Op.startsWith]?: IDaoConditionsItem | IDaoConditionsItem[]
}

export type IDaoConditionsItem =
  | number
  | string
  | boolean
  | number[]
  | string[]
  | null
  | undefined
  | Date
  | IDaoConditionsObject
  | IDaoConditionsObject[]
  | ReturnType<typeof where>
  | Array<ReturnType<typeof where>>
  | ReturnType<typeof literal>
  | Array<ReturnType<typeof literal>>
  | Array<Array<string | ReturnType<typeof literal>>>
  | Date

export declare type DaoFn<T, U = any> = (conditions: T, options?: DaoOptions) => Promise<U>

export interface DaoOptions {
  transaction?: Transaction
  exclude?: string[]
  attributes?: string[]
  plainObject?: boolean
  group?: string[]
}
