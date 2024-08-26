import { IUseCase } from '#common/types/use-case.type.js'
import { IExerciseDoc, IExerciseModel } from '#infra/mongodb/models/exercises/exercise.entity.js'

export interface GetExercisesArgs {
  offset?: number
  limit?: number
  query?: Record<string, any>
  sort?: Record<string, 1 | -1>
}

export interface GetExercisesReturnArgs {
  exercises: IExerciseDoc[]
  totalPages: number
  totalExercises: number
  currentPage: number
}

export class GetExercisesUseCase implements IUseCase<GetExercisesArgs, GetExercisesReturnArgs> {
  constructor(private readonly exerciseModel: IExerciseModel) {}

  async execute({ offset, limit, query = {}, sort = {} }: GetExercisesArgs): Promise<GetExercisesReturnArgs> {
    try {
      const safeOffset = Math.max(0, Number(offset) || 0)
      const safeLimit = Math.max(1, Math.min(100, Number(limit) || 10))

      const totalCount = await this.exerciseModel.countDocuments(query)
      const totalPages = Math.ceil(totalCount / safeLimit)
      const currentPage = Math.floor(safeOffset / safeLimit) + 1

      const result = await this.exerciseModel.find(query).sort(sort).skip(safeOffset).limit(safeLimit).exec()

      return {
        totalPages,
        totalExercises: totalCount,
        currentPage,
        exercises: result
      }
    } catch (error) {
      throw new Error('Failed to fetch exercises')
    }
  }
}
