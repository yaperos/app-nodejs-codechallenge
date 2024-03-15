import mongoose from 'mongoose'

const mongodbUri = process.env.MONGODB_URI

const connect = async () => {
  await mongoose.connect(`${mongodbUri}`)
}

export { connect }
