import { Routes } from '#common/types/route.type.js'
import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { EquipmentModel } from '../models/equipment.model'
import { EquipmentService } from '../services'
import Equipment from '#infra/mongodb/models/equipments/equipment.schema.js'

export class EquipmentController implements Routes {
  public controller: OpenAPIHono
  private readonly equipmentService: EquipmentService
  constructor() {
    this.controller = new OpenAPIHono()
    this.equipmentService = new EquipmentService(Equipment)
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
        const body = await ctx.req.json()
        const response = await this.equipmentService.createEquipment(body)
        return ctx.json({ success: true, data: [response] })
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
  }
}
