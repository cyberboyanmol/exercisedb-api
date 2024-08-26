import { Routes } from '#common/types/route.type.js'
import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { MuscleModel } from '../models/muscle.model'
import { MuscleService } from '../services'
import Muscle from '#infra/mongodb/models/muscles/muscle.schema.js'
import { HTTPException } from 'hono/http-exception'
import Exercise from '#infra/mongodb/models/exercises/exercise.schema.js'
import { ExerciseModel } from '#modules/exercises/models/exercise.model.js'

export class MuscleController implements Routes {
  public controller: OpenAPIHono
  private readonly muscleService: MuscleService
  constructor() {
    this.controller = new OpenAPIHono()
    this.muscleService = new MuscleService(Muscle, Exercise)
  }

  public initRoutes() {
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/muscles',
        tags: ['Muscles'],
        summary: 'Add a new muscle to the database',
        description: 'This route is used to add a new muscle name to the database.',
        operationId: 'createMuscle',
        request: {
          body: {
            content: {
              'application/json': {
                schema: z.object({
                  name: z.string().openapi({
                    title: 'Muscle Name',
                    description: 'The name of the muscle to be added',
                    type: 'string',
                    example: 'biceps'
                  })
                })
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Muscle successfully added to the database',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates whether the request was successful',
                    type: 'boolean',
                    example: true
                  }),
                  data: z.array(MuscleModel).openapi({
                    title: 'Added Muscle',
                    description: 'The newly added muscle data'
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
            description: 'Conflict - Muscle name already exists'
          },
          500: {
            description: 'Internal server error'
          }
        }
      }),
      async (ctx) => {
        try {
          const body = await ctx.req.json()

          const response = await this.muscleService.createMuscle(body)

          return ctx.json({ success: true, data: [response] }, 201)
        } catch (error) {
          console.error('Error in createMuscle:', error)
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
        path: '/muscles',
        tags: ['Muscles'],
        summary: 'Retrive all muscles.',
        description: 'Retrive list of all the muscles.',
        operationId: 'getMuscles',
        responses: {
          200: {
            description: 'Successful response with list of all muscles.',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates whether the request was successful',
                    type: 'boolean',
                    example: true
                  }),
                  data: z.array(MuscleModel).openapi({
                    description: 'Array of Muslces.'
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
        const response = await this.muscleService.getMuscles()
        return ctx.json({ success: true, data: response })
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/muscles/{muscleName}/exercises',
        tags: ['Muscles'],
        summary: 'Retrive exercises by muscles',
        description: 'Retrive list of exercises by targetMuscles or secondaryMuscles.',
        operationId: 'getExercisesByEquipment',
        request: {
          params: z.object({
            muscleName: z.string().openapi({
              description: 'muscles name',
              type: 'string',
              example: 'upper back',
              default: 'upper back'
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
        const search = ctx.req.param('muscleName')
        const { origin, pathname } = new URL(ctx.req.url)
        const response = await this.muscleService.getExercisesByMuscles({ offset, limit, search })
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
