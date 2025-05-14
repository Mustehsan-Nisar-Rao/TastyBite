import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://f223281:Emperor%403281@web.qolhn26.mongodb.net/tastybites?retryWrites=true&w=majority"

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

interface MongooseConnection {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: MongooseConnection
}

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null }
}

async function connectToDatabase(): Promise<typeof mongoose> {
  try {
    if (global.mongoose.conn) {
      console.log("Using cached database connection")
      return global.mongoose.conn
    }

    if (!global.mongoose.promise) {
      const opts = {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
      }

      console.log("Connecting to MongoDB...")
      global.mongoose.promise = mongoose
        .connect(MONGODB_URI, opts)
        .then((mongoose) => {
          console.log("Successfully connected to MongoDB")
          mongoose.set('debug', process.env.NODE_ENV === 'development')
          return mongoose
        })
        .catch((error) => {
          console.error("MongoDB connection error:", error)
          global.mongoose = { conn: null, promise: null }
          throw error
        })
    }

    global.mongoose.conn = await global.mongoose.promise
    return global.mongoose.conn
  } catch (error) {
    console.error("Fatal MongoDB connection error:", error)
    process.exit(1)
  }
}

export default connectToDatabase
