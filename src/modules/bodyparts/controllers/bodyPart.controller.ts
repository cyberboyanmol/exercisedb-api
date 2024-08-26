import { Routes } from '#common/types/route.type.js'
import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { BodyPartService } from '../services'
import BodyPart from '#infra/mongodb/models/bodyparts/bodypart.schema.js'
import { BodyPartModel } from '../models/bodyPart.model'
import { HTTPException } from 'hono/http-exception'
import { ExerciseModel } from '#modules/exercises/models/exercise.model.js'
import Exercise from '#infra/mongodb/models/exercises/exercise.schema.js'

export class BodyPartController implements Routes {
  public controller: OpenAPIHono
  private readonly bodyPartService: BodyPartService
  constructor() {
    this.controller = new OpenAPIHono()
    this.bodyPartService = new BodyPartService(BodyPart, Exercise)
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
        try {
          const body = await ctx.req.json()
          const response = await this.bodyPartService.createBodyPart(body)
          return ctx.json({ success: true, data: [response] })
        } catch (error) {
          console.error('Error in adding bodypart:', error)
          if (error instanceof HTTPException) {
            return ctx.json({ success: false, error: error.message }, error.status)
          }
          return ctx.json({ success: false, error: 'Internal Server Error' }, 500)
        }
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
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/bodyparts/{bodyPartName}/exercises',
        tags: ['BodyParts'],
        summary: 'Retrive all exercises by bodyPart',
        description: 'Retrive list of all bodyparts.',
        operationId: 'getExercisesByBodyPart',
        request: {
          params: z.object({
            bodyPartName: z.string().openapi({
              description: 'bodyparts name',
              type: 'string',
              example: 'waist',
              default: 'waist'
            })
          }),
          query: z.object({
            offset: z.coerce.number().nonnegative().optional().openapi({
              title: 'Offset',
              description:
                'The number of exercises to skip from the start of the list. Useful for pagination to fetch subsequent pages of results.',
              type: 'number',
              example: 10,
              default: 0
            }),
            limit: z.coerce.number().positive().max(100).optional().openapi({
              title: 'Limit',
              description:
                'The maximum number of exercises to return in the response. Limits the number of results for pagination purposes.',
              maximum: 100,
              minimum: 1,
              type: 'number',
              example: 10,
              default: 10
            })
          })
        },
        responses: {
          200: {
            description: 'Successful response with list of all exercises.',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates whether the request was successful',
                    type: 'boolean',
                    example: true
                  }),
                  data: z.array(ExerciseModel).openapi({
                    description: 'Array of Exercises.'
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
        const { offset, limit = 10 } = ctx.req.valid('query')
        const search = ctx.req.param('bodyPartName')
        const { origin, pathname } = new URL(ctx.req.url)
        const response = await this.bodyPartService.getExercisesByBodyPart({ offset, limit, search })
        return ctx.json({
          success: true,
          data: {
            previousPage:
              response.currentPage > 1
                ? `${origin}${pathname}?offset=${(response.currentPage - 1) * limit}&limit=${limit}`
                : null,
            nextPage:
              response.currentPage < response.totalPages
                ? `${origin}${pathname}?offset=${response.currentPage * limit}&limit=${limit}`
                : null,
            ...response
          }
        })
      }
    )
  }
}
