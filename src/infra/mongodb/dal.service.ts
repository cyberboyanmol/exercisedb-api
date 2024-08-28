import mongoose, { Connection } from 'mongoose'

let cachedConnection: Connection | null = null
let connectionPromise: Promise<Connection> | null = null

export class DalService {
  private static instance: DalService

  private constructor() {}

  static getInstance(): DalService {
    if (!DalService.instance) {
      DalService.instance = new DalService()
    }
    return DalService.instance
  }

  async connectDB(): Promise<Connection> {
    if (cachedConnection && this.isConnected()) {
      return cachedConnection
    }

    if (!process.env.EXERCISEDB_DATABASE) {
      throw new Error('EXERCISEDB_DATABASE environment variable is not set')
    }

    if (!connectionPromise) {
      connectionPromise = mongoose
        .connect(process.env.EXERCISEDB_DATABASE, {
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          maxPoolSize: 1,
          minPoolSize: 0,
          maxIdleTimeMS: 10000
        })
        .then((conn) => {
          console.log('Database connected successfully')
          return conn.connection
        })
        .catch((error) => {
          console.error('Error connecting to the database:', error)
          connectionPromise = null
          throw error
        })
    }

    try {
      cachedConnection = await connectionPromise
      return cachedConnection
    } catch (error) {
      throw new Error('Error connecting to the database')
    }
  }

  isConnected(): boolean {
    return cachedConnection?.readyState === 1
  }

  async disconnect(): Promise<void> {
    if (cachedConnection) {
      try {
        await mongoose.disconnect()
        cachedConnection = null
        connectionPromise = null
        console.log('Database disconnected successfully')
      } catch (error) {
        console.error('Error disconnecting from the database:', error)
        throw error
      }
    }
  }

  async destroy(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('Allowed only in test environment')
    }

    try {
      if (cachedConnection) {
        await cachedConnection.dropDatabase()
        console.log('Database dropped successfully')
      }
    } catch (error) {
      console.error('Error dropping the database:', error)
      throw error
    } finally {
      await this.disconnect()
    }
  }
  async closeConnection(): Promise<void> {
    if (cachedConnection) {
      await cachedConnection.close()
      cachedConnection = null
      connectionPromise = null
      console.log('Database connection closed')
    }
  }

  async cleanup(): Promise<void> {
    await this.closeConnection()
  }
}
