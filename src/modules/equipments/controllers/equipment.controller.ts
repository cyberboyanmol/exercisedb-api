import { Routes } from '#common/types/route.type.js'
import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { EquipmentModel } from '../models/equipment.model'
import { EquipmentService } from '../services'
import Equipment from '#infra/mongodb/models/equipments/equipment.schema.js'
import { HTTPException } from 'hono/http-exception'
import { ExerciseModel } from '#modules/exercises/models/exercise.model.js'
import Exercise from '#infra/mongodb/models/exercises/exercise.schema.js'

export class EquipmentController implements Routes {
  public controller: OpenAPIHono
  private readonly equipmentService: EquipmentService
  constructor() {
    this.controller = new OpenAPIHono()
    this.equipmentService = new EquipmentService(Equipment, Exercise)
  }

  public initRoutes() {
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/equipments',
        tags: ['Equipments'],
        summary: 'Add a new equipment to the database',
        description: 'This route is used to add a new equipment name to the database.',
        operationId: 'createEquipment',
        request: {
          body: {
            content: {
              'application/json': {
                schema: z.object({
                  name: z.string().openapi({
                    title: 'Equipment Name',
                    description: 'The name of the equipment to be added',
                    type: 'string',
                    example: 'band'
                  })
                })
              }
            }
          }
        },
        responses: {
          201: {
            description: 'equipment successfully added to the database',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates whether the request was successful',
                    type: 'boolean',
                    example: true
                  }),
                  data: z.array(EquipmentModel).openapi({
                    title: 'Added Equipment',
                    description: 'The newly added equipment data'
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
            description: 'Conflict - equipment name already exists'
          },
          500: {
            description: 'Internal server error'
          }
        }
      }),
      async (ctx) => {
        try {
          const body = await ctx.req.json()
          const response = await this.equipmentService.createEquipment(body)
          return ctx.json({ success: true, data: [response] })
        } catch (error) {
          console.error('Error in adding equipment:', error)
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
        path: '/equipments',
        tags: ['Equipments'],
        summary: 'Retrive all equipments.',
        description: 'Retrive list of all equipments.',
        operationId: 'getMuscles',
        responses: {
          200: {
            description: 'Successful response with list of all equipments.',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates whether the request was successful',
                    type: 'boolean',
                    example: true
                  }),
                  data: z.array(EquipmentModel).openapi({
                    description: 'Array of equipments.'
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
        const response = await this.equipmentService.getEquipments()
        return ctx.json({ success: true, data: response })
      }
    )
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/equipments/{equipmentName}/exercises',
        tags: ['Equipments'],
        summary: 'Retrive exercises by equipments',
        description: 'Retrive list of all equipments.',
        operationId: 'getExercisesByEquipment',
        request: {
          params: z.object({
            equipmentName: z.string().openapi({
              description: 'equipments name',
              type: 'string',
              example: 'body weight',
              default: 'body weight'
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
        const search = ctx.req.param('equipmentName')
        const { origin, pathname } = new URL(ctx.req.url)
        const response = await this.equipmentService.getExercisesByEquipment({ offset, limit, search })
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
