import mongoose from 'mongoose'
import { randomUUID } from 'node:crypto'

interface ILog {
  _id: string
  toJSON: any
  action: string
}

const logSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: function genUuid() {
        return randomUUID()
      },
    },
    toJSON: {
      type: JSON,
      require: true,
    },
    action: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
)

const Log = mongoose.model('Log', logSchema)

logSchema.statics.build = (attr: ILog) => {
  return new Log(attr)
}

export { Log }
