import { IUseCase } from '#common/types/use-case.type.js'
import { IExerciseDoc, IExerciseModel } from '#infra/mongodb/models/exercises/exercise.entity.js'

export interface GetExerciseArgs {
  offset?: number
  limit?: number
  search?: string
}

export interface GetExerciseReturnArgs {
  exercises: IExerciseDoc[]
  totalPages: number
  totalExercises: number
  currentPage: number
}
export class GetExercisesUseCase implements IUseCase<GetExerciseArgs, GetExerciseReturnArgs> {
  constructor(private readonly exerciseModel: IExerciseModel) {}

  async execute({ offset, limit, search }: GetExerciseArgs): Promise<GetExerciseReturnArgs> {
    try {
      const safeOffset = Math.max(0, Number(offset) || 0)
      const safeLimit = Math.max(1, Math.min(100, Number(limit) || 10))
      const searchQuery = search ? { $text: { $search: search } } : {}

      const totalCounts = await this.exerciseModel.countDocuments()
      const totalPages = Math.ceil(totalCounts / safeLimit)
      const currentPage = Math.floor(safeOffset / safeLimit) + 1
      const result = await this.exerciseModel.find(searchQuery).skip(safeOffset).limit(safeLimit).exec()

      return {
        totalPages,
        totalExercises: totalCounts,
        currentPage,
        exercises: result
      }
    } catch (error) {
      console.error('Error fetching exercises:', error)
      throw new Error('Failed to fetch exercises')
    }
  }
}
