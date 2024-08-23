import Redis from 'ioredis'

export class RedisClient {
  private static instances: Map<string, Redis> = new Map()

  private constructor() {}

  public static getInstance(url: string, instanceName: string): Redis {
    if (!RedisClient.instances.has(url)) {
      const client = new Redis(url, {
        reconnectOnError: (err) => {
          console.error(`Redis ${instanceName} client reconnectOnError: ${err.message}`)
          return true
        },
        retryStrategy: (times) => {
          console.info(`Redis ${instanceName} client retryStrategy called ${times} times`)
          if (times >= 20) {
            console.error(`Redis ${instanceName} client: Maximum retry attempts reached`)
            return undefined // Stop retrying after 20 attempts
          }
          return Math.min(times * 100, 2000) // Delay between retries
        }
      })

      client.on('connect', () => {
        console.info(`Redis ${instanceName} client connected`)
      })

      client.on('ready', () => {
        console.info(`Redis ${instanceName} client ready to use`)
      })

      client.on('error', (err) => {
        console.error(`Redis ${instanceName} client error: ${err.message}`)
      })

      client.on('end', () => {
        console.info(`Redis ${instanceName} client disconnected`)
      })

      RedisClient.instances.set(url, client)
    }

    return RedisClient.instances.get(url) as Redis
  }

  public static quitAll(): void {
    RedisClient.instances.forEach((client, url) => {
      client.quit()
      console.info(`Redis client for ${url} quit`)
    })
  }
}

process.on('SIGINT', () => {
  RedisClient.quitAll()
})
