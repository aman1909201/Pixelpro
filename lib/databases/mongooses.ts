import mongoose, { Mongoose } from 'mongoose'

const mongodb_url = process.env.MONGODB_URL

interface MongooseConnection {
    conn: Mongoose | null
    promise: Promise<Mongoose> | null
}

let cached: MongooseConnection = (global as any).mongoose

if (!cached) {
    cached = (global as any).mongoose = {
        conn: null, promise: null
    }
}

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if (!mongodb_url) throw new Error('missing mongodb_url')
    cached.promise = cached.promise || mongoose.connect(mongodb_url, { dbName: 'Pixelpro', bufferCommands: false })
    cached.conn = await cached.promise
    return cached.conn
}

