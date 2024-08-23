import { Connection } from 'mongoose'
import * as mongoose from 'mongoose'

export class DalService {
  private connection: Connection | undefined

  constructor() {}

  async connectDB(): Promise<Connection | undefined> {
    if (this.connection && this.isConnected()) {
      return this.connection
    }

    try {
      if (process.env.EXERCISEDB_DATABASE !== undefined) {
        const instance = await mongoose.connect(process.env.EXERCISEDB_DATABASE)
        console.log('Database connected successfully')
        this.connection = instance.connection
        return this.connection
      }
    } catch (error) {
      console.error('Error connecting to the database:', error)
      process.exit(1)
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