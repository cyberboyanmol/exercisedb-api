import { IUseCase } from '#common/types/use-case.type.js'
import axios, { AxiosResponse } from 'axios'
import { HTTPException } from 'hono/http-exception'

export class ViewImageUseCase implements IUseCase<string, any> {
  constructor() {}

  async execute(fileName: string): Promise<any> {
    const sourceUrl = fileName.endsWith('.gif')
      ? `${process.env.SUPABASE_BUCKET_URL}/${process.env.SUPABASE_BUCKET_NAME}/${fileName}`
      : `${process.env.SUPABASE_BUCKET_URL}/${process.env.SUPABASE_BUCKET_NAME}/${fileName}.gif`

    try {
      const response = await axios.get(sourceUrl, {
        responseType: 'arraybuffer'
      })

      if (response.status === 404 || response.status === 400) {
        throw new HTTPException(404, { message: 'Image not found or URL expired' })
      }

      if (response.status !== 200) {
        throw new HTTPException(400, { message: 'Image not found or URL expired' })
      }

      return response.data
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
