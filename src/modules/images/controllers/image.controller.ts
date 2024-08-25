import { Routes } from '#common/types/route.type.js'
import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { ImageService } from '../services'
import { toBuffer } from 'bun:ffi'
import { stream } from 'hono/streaming'
import axios from 'axios'
import { HTTPException } from 'hono/http-exception'

export class ImagesController implements Routes {
  public controller: OpenAPIHono
  private readonly imageService: ImageService
  constructor() {
    this.controller = new OpenAPIHono()
    this.imageService = new ImageService()
  }

  public initRoutes() {
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/images/upload',
        tags: ['Images'],
        summary: 'Upload a GIF image',
        description: 'This route allows users to upload a GIF image file.',
        operationId: 'uploadGifImage',
        request: {
          body: {
            content: {
              'multipart/form-data': {
                schema: z.object({
                  file: z.any().openapi({
                    title: 'GIF File',
                    description: 'The GIF image file to be uploaded',
                    type: 'string',
                    format: 'binary'
                  })
                })
              }
            }
          }
        },
        responses: {
          201: {
            description: 'GIF image successfully uploaded',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates whether the upload was successful',
                    type: 'boolean',
                    example: true
                  }),
                  data: z
                    .object({
                      publicUrl: z.string().openapi({
                        title: 'Image URL',
                        description: 'The URL where the uploaded GIF image can be accessed',
                        example: 'https://exercisedb.vercel.app/Images/3omWx6P.gif'
                      })
                    })
                    .openapi({
                      title: 'Uploaded Image Data',
                      description: 'Details of the uploaded GIF image'
                    })
                })
              }
            }
          },
          400: {
            description: 'Bad request - Invalid file format or missing file',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  error: z.string()
                })
              }
            }
          },
          415: {
            description: 'Unsupported Media Type - Only GIF files are allowed'
          },
          500: {
            description: 'Internal server error'
          }
        }
      }),
      async (ctx) => {
        const body = await ctx.req.parseBody()
        const file = body['file'] as File
        if (!file || file.type !== 'image/gif') {
          return ctx.json({ success: false, error: 'Invalid file type. Only GIF files are allowed.' }, 400)
        }

        const uploadResult = await this.imageService.uploadImage(file)
        return ctx.json({ success: true, data: uploadResult })
      }
    )
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/images/{imageName}',
        tags: ['Images'],
        summary: 'View a GIF image',
        description: 'This route allows users to view a GIF image by its name.',
        operationId: 'viewGifImage',
        request: {
          params: z.object({
            imageName: z.string().openapi({
              description: 'imageName of image to view',
              type: 'string',
              example: '3omWx6P.gif or 3omWx6P',
              default: '3omWx6P.gif'
            })
          })
        },
        responses: {
          200: {
            description: 'GIF image successfully retrieved',
            content: {
              'image/gif': {
                schema: {}
              }
            }
          },
          404: {
            description: 'Image not found or URL expired'
          },
          500: {
            description: 'Internal server error'
          }
        }
      }),

      async (ctx) => {
        try {
          const imageName = ctx.req.param('imageName')
          const res = await this.imageService.viewImage(imageName)
          return ctx.body(res, {
            headers: {
              'Content-Type': 'image/gif',
              'Content-Length': res.byteLength
            }
          })
        } catch (err) {
          if (err instanceof HTTPException) {
            return ctx.json({ success: false, error: err.message }, err.status)
          }
          return ctx.json({ success: false, error: 'Internal Server Error' }, 500)
        }
      }
    )
  }
}
