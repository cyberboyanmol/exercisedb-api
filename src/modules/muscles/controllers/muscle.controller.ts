import { Routes } from '#common/types/route.type.js'
import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { MuscleModel } from '../models/muscle.model'
import { MuscleService } from '../services'
import Muscle from '#infra/mongodb/models/muscles/muscle.schema.js'

export class MuscleController implements Routes {
  public controller: OpenAPIHono
  private readonly muscleService: MuscleService
  constructor() {
    this.controller = new OpenAPIHono()
    this.muscleService = new MuscleService(Muscle)
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
                    example: 'Biceps Brachii'
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
        const body = await ctx.req.json()
        const response = await this.muscleService.createMuscle(body)
        return ctx.json({ success: true, data: [response] })
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
  }
}
