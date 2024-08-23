import { RedisRepositoryInterface } from '#common/types/redis.interface.js'
import { Redis } from 'ioredis'

export class RedisService implements RedisRepositoryInterface {
  constructor(private readonly redisClient: Redis) {}

  async get<T>(prefix: string, key: string): Promise<T | null> {
    const value = await this.redisClient.get(`${prefix}:${key}`)
    return value ? JSON.parse(value) : null
  }

  async set(prefix: string, key: string, value: any): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, JSON.stringify(value))
  }

  async delete(prefix: string, key: string): Promise<void> {
    await this.redisClient.del(`${prefix}:${key}`)
  }

  async setWithExpiry(prefix: string, key: string, value: any, expiry: number): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, JSON.stringify(value), 'EX', expiry)
  }
}
