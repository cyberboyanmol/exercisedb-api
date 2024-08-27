import { IUseCase } from '#common/types/use-case.type.js'
import { redisStorageCache } from '#infra/redis/redis.client.js'
import { RedisService } from '#infra/redis/redis.service.js'
import axios, { AxiosResponse } from 'axios'
import { HTTPException } from 'hono/http-exception'

export class ViewImageUseCase implements IUseCase<string, Buffer> {
  private readonly redisService: RedisService
  constructor() {
    this.redisService = new RedisService(redisStorageCache)
  }

  async execute(fileName: string): Promise<Buffer> {
    const cacheKey = fileName.endsWith('.gif') ? fileName : `${fileName}.gif`
    const sourceUrl = fileName.endsWith('.gif')
      ? `${process.env.SUPABASE_BUCKET_URL}/${process.env.SUPABASE_BUCKET_NAME}/${fileName}`
      : `${process.env.SUPABASE_BUCKET_URL}/${process.env.SUPABASE_BUCKET_NAME}/${fileName}.gif`

    try {
      const cachedImage = await this.redisService.getBuffer('image', cacheKey)

      if (cachedImage) {
        return cachedImage
      }
      const response = await axios.get(sourceUrl, {
        responseType: 'arraybuffer'
      })

      if (response.status === 404 || response.status === 400 || response.status !== 200) {
        throw new HTTPException(404, { message: 'Image not found or URL expired' })
      }

      const imageBuffer = response.data
      await this.redisService.setBuffer('image', cacheKey, imageBuffer)

      return imageBuffer
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status

        switch (statusCode) {
          case 400:
          case 404:
            throw new HTTPException(statusCode, { message: `Image not found or URL expired.` })
          default:
            throw new HTTPException(500, { message: 'Internal server error' })
        }
      } else {
        throw new HTTPException(500, { message: 'Internal server error' })
      }
    }
  }
}
