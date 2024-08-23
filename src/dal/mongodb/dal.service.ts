import { Connection, ConnectOptions } from 'mongoose'
import * as mongoose from 'mongoose'

export class DalService {
  private connection: Connection | undefined

  constructor() {}

  async connect(url: string, config: ConnectOptions = {}): Promise<Connection> {
    if (this.connection && this.isConnected()) {
      return this.connection
    }

    const baseConfig: ConnectOptions = {
      maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE) || 500,
      minPoolSize: Number(process.env.MONGO_MIN_POOL_SIZE) || 10,
      maxIdleTimeMS: 1000 * 60 * 10, // default 10 minutes
      autoIndex: process.env.AUTO_CREATE_INDEXES === 'true'
    }

    try {
      const instance = await mongoose.connect(url, {
        ...baseConfig,
        ...config
      })
      console.log('Database connected successfully')
      this.connection = instance.connection
      return this.connection
    } catch (error) {
      console.error('Error connecting to the database:', error)
      throw error
    }
  }

  isConnected(): boolean {
    return this.connection?.readyState === 1
  }

  async disconnect() {
    try {
      await mongoose.disconnect()
      console.log('Database disconnected successfully')
    } catch (error) {
      console.error('Error disconnecting from the database:', error)
      throw error
    }
  }

  /**
   * The `destroy` function drops the database only in a test environment.
   */
  async destroy() {
    if (process.env.NODE_ENV !== 'test') throw new Error('Allowed only in test environment')

    try {
      await mongoose.connection.dropDatabase()
      console.log('Database dropped successfully')
    } catch (error) {
      console.error('Error dropping the database:', error)
      throw error
    }
  }
}
