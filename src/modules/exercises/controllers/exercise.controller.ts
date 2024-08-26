import { Routes } from '#common/types/route.type.js'
import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { ExerciseService } from '../services/exercise.service'
import Exercise from '#infra/mongodb/models/exercises/exercise.schema.js'
import { ExerciseModel } from '../models/exercise.model'

export class ExerciseController implements Routes {
  public controller: OpenAPIHono
  private readonly exerciseService: ExerciseService
  constructor() {
    this.controller = new OpenAPIHono()
    this.exerciseService = new ExerciseService(Exercise)
  }

  public initRoutes() {
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/exercises',
        tags: ['Exercises'],
        summary: 'Add a new exercises to the database',
        description: 'This route is used to add a new exercises to database.',
        operationId: 'createExercise',
        request: {
          body: {
            content: {
              'application/json': {
                schema: z.object({
                  exerciseId: z.string().openapi({
                    title: 'Exercise ID',
                    description: 'Unique identifier for the exercise.',
                    type: 'string',
                    example: 'KCBKjma'
                  }),
                  name: z.string().openapi({
                    title: 'Exercise Name',
                    description: 'The name of the exercise.',
                    type: 'string',
                    example: 'Band Jack Knife Sit-up'
                  }),
                  gifUrl: z.string().openapi({
                    title: 'Exercise GIF URL',
                    description: 'URL of the GIF demonstrating the exercise.',
                    type: 'string',
                    example: 'https://ucarecdn.com/05fcc879-04d4-4222-8896-e3772a8a3060/KCBKjma.gif'
                  }),
                  targetMuscles: z.array(z.string()).openapi({
                    title: 'Target Muscles',
                    description: 'Primary muscles targeted by the exercise.',
                    type: 'array',
                    items: {
                      type: 'string'
                    },
                    example: ['abs']
                  }),
                  bodyParts: z.array(z.string()).openapi({
                    title: 'Body Parts',
                    description: 'Body parts involved in the exercise.',
                    type: 'array',
                    items: {
                      type: 'string'
                    },
                    example: ['waist', 'back']
                  }),
                  equipments: z.array(z.string()).openapi({
                    title: 'Equipments',
                    description: 'Equipment required to perform the exercise.',
                    type: 'array',
                    items: {
                      type: 'string'
                    },
                    example: ['band']
                  }),
                  secondaryMuscles: z.array(z.string()).openapi({
                    title: 'Secondary Muscles',
                    description: 'Secondary muscles that are worked during the exercise.',
                    type: 'array',
                    items: {
                      type: 'string'
                    },
                    example: ['abs', 'lats']
                  }),
                  instructions: z.array(z.string()).openapi({
                    title: 'Exercise Instructions',
                    description: 'Step-by-step instructions to perform the exercise.',
                    type: 'array',
                    items: {
                      type: 'string'
                    },
                    example: [
                      'Step 1: Start with...',
                      'Step 2: Move into...',
                      'Step 3: Move into...',
                      'Step 4: Move into...',
                      'Step 5: Move into...'
                    ]
                  })
                })
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Exercise successfully added to the database.',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates whether the exercise was successfully added to the database.',
                    type: 'boolean',
                    example: true
                  }),
                  data: z.array(ExerciseModel).openapi({
                    title: 'Added Exercise Data',
                    description: 'Details of the newly added exercise, including relevant information.'
                  })
                })
              }
            }
          },
          400: {
            description: 'Bad Request - The input data for the exercise is invalid or incomplete.',
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
            description: 'Conflict - An exercise with the same name already exists in the database.'
          },
          500: {
            description: 'Internal Server Error - An unexpected error occurred on the server.'
          }
        }
      }),
      async (ctx) => {
        const body = await ctx.req.json()
        const response = await this.exerciseService.createExercise(body)
        return ctx.json({ success: true, data: [response] })
      }
    )
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/exercises',
        tags: ['Exercises'],
        summary: 'Retrive all exercises.',
        description: 'Retrive list of all the exercises.',
        operationId: 'getExercises',
        request: {
          query: z.object({
            search: z.string().optional().openapi({
              title: 'Search Query',
              description:
                'A string to filter exercises based on a search term. This can be used to find specific exercises by name or description.',
              type: 'string',
              example: 'cardio',
              default: ''
            }),
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
        const { offset, limit = 10, search } = ctx.req.valid('query')
        const { origin, pathname } = new URL(ctx.req.url)
        const response = await this.exerciseService.getExercise({ offset, limit, search })
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
    // autocomplete endpoint
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/exercises/autocomplete',
        tags: ['Exercises'],
        summary: 'Autocomplete Exercise Search',
        description:
          'Retrieves a list of exercise names that match the search term using fuzzy search. This endpoint provides autocomplete suggestions based on the MongoDB autocomplete feature, helping users find exercises quickly as they type.',
        operationId: 'autocompleteExercises',
        request: {
          query: z.object({
            search: z.string().optional().openapi({
              title: 'Search Term',
              description:
                'A string used to filter exercises based on a search term. Supports fuzzy matching to suggest relevant exercise names as the user types.',
              type: 'string',
              example: 'cardio',
              default: ''
            })
          })
        },
        responses: {
          200: {
            description: 'Successful response with a list of exercise name suggestions.',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean().openapi({
                    description: 'Indicates whether the request was successful.',
                    type: 'boolean',
                    example: true
                  }),
                  data: z.array(z.string()).openapi({
                    description: 'Array of suggested exercise names based on the search term.'
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
        const { search } = ctx.req.valid('query')
        const response = await this.exerciseService.getAutoCompleteSuggestions({ search })
        return ctx.json({
          success: true,
          data: response
        })
      }
    )
  }
}
