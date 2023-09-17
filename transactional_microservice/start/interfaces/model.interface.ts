import { Schema } from 'mongoose'

export interface ModelInterface {
  name: string
  schema: Schema
  collection?: string
}
