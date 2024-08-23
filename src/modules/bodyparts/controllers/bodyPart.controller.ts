import { Routes } from '#common/types/route.type.js'
import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { BodyPartService } from '../services'
import BodyPart from '#infra/mongodb/models/bodyparts/bodypart.schema.js'
import { BodyPartModel } from '../models/bodyPart.model'

export class BodyPartController implements Routes {
  public controller: OpenAPIHono
  private readonly bodyPartService: BodyPartService
  constructor() {
    this.controller = new OpenAPIHono()
    this.bodyPartService = new BodyPartService(BodyPart)
  }

  public initRoutes() {
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/bodyparts',
        tags: ['BodyParts'],
        summary: 'Add a new bodyPart to the database',
        description: 'This route is used to add a new bodyPart name to the database.',
        operationId: 'createbodyPart',
        request: {
          body: {
            content: {
              'application/json': {
                schema: z.object({
                  name: z.string().openapi({
                    title: 'BodyPart Name',
                    description: 'The name of the bodyPart to be added',
                    type: 'string',
                    example: 'waist'
                  })
                })
              }
            }
          }
        },
        responses: {
          201: {
            description: 'bodyPart successfully added to the database',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates whether the request was successful',
                    type: 'boolean',
                    example: true
                  }),
                  data: z.array(BodyPartModel).openapi({
                    title: 'Added bodyPart',
                    description: 'The newly added bodyPart data'
                  })
                })
              }
            }
          },
          400: {
            description: 'Bad request - Invalid input data',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  error: z.string()
                })
              }
            }
          },
          409: {
            description: 'Conflict - bodyPart name already exists'
          },
          500: {
            description: 'Internal server error'
          }
        }
      }),
      async (ctx) => {
        const body = await ctx.req.json()
        const response = await this.bodyPartService.createBodyPart(body)
        return ctx.json({ success: true, data: [response] })
      }
    )
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/bodyparts',
        tags: ['BodyParts'],
        summary: 'Retrive all bodyParts.',
        description: 'Retrive list of all bodyparts.',
        operationId: 'getBodyParts',
        responses: {
          200: {
            description: 'Successful response with list of all bodyparts.',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates whether the request was successful',
                    type: 'boolean',
                    example: true
                  }),
                  data: z.array(BodyPartModel).openapi({
                    description: 'Array of bodyparts.'
                  })
                })
              }
            }
          },
          500: {
            description: 'Internal server error'
          }
        }
      }),
      async (ctx) => {
        const response = await this.bodyPartService.getBodyParts()
        return ctx.json({ success: true, data: response })
      }
    )
  }
}
