import { RedisClient } from './dal.redis'

// Creating Redis clients for different URLs
const redisdb = RedisClient.getInstance(process.env.EXERCISEDB_DATABASE!, 'REDIS_DB')

export { redisdb }
