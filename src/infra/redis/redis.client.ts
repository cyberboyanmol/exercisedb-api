import { RedisClient } from './dal.redis'

const redisStorageCache = RedisClient.getInstance(process.env.EXERCISEDB_STORAGE_CACHE!, 'EXERCISEDB_STORAGE_CACHE')

export { redisStorageCache }
