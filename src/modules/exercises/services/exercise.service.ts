import { IExerciseModel } from '#infra/mongodb/models/exercises/exercise.entity.js'
import { CreateExerciseArgs, CreateExerciseUseCase } from '../use-cases/create-exercise'
import {
  GetAutoCompleteSuggestionsArgs,
  GetAutoCompleteSuggestionsUseCase
} from '../use-cases/get-autocomplete-suggestions'
import { GetExerciseByIdUseCase } from '../use-cases/get-exercises-by-id'
import { GetExercisesArgs, GetExercisesUseCase } from '../use-cases/get-exercises/get-exercise.usecase'

export interface GetExerciseSerivceArgs {
  offset?: number
  limit?: number
  search?: string
}
export class ExerciseService {
  private readonly createExerciseUseCase: CreateExerciseUseCase
  private readonly getExercisesUseCase: GetExercisesUseCase
  private readonly getAutoCompleteSuggestionsUseCase: GetAutoCompleteSuggestionsUseCase
  private readonly getExerciseByIdUseCase: GetExerciseByIdUseCase
  constructor(private readonly exerciseModel: IExerciseModel) {
    this.createExerciseUseCase = new CreateExerciseUseCase(exerciseModel)
    this.getExercisesUseCase = new GetExercisesUseCase(exerciseModel)
    this.getAutoCompleteSuggestionsUseCase = new GetAutoCompleteSuggestionsUseCase(exerciseModel)
    this.getExerciseByIdUseCase = new GetExerciseByIdUseCase(exerciseModel)
  }

  createExercise = (params: CreateExerciseArgs) => {
    return this.createExerciseUseCase.execute(params)
  }
  getExercise = (params: GetExerciseSerivceArgs) => {
    const query: GetExercisesArgs = {
      query: { ...(params.search && { $text: { $search: params.search } }) },
      offset: params.offset,
      limit: params.limit
    }
    return this.getExercisesUseCase.execute(query)
  }
  getAutoCompleteSuggestions = (params: GetAutoCompleteSuggestionsArgs) => {
    return this.getAutoCompleteSuggestionsUseCase.execute(params)
  }

  getExerciseById = (exerciseId: string) => {
    return this.getExerciseByIdUseCase.execute(exerciseId)
  }
}
