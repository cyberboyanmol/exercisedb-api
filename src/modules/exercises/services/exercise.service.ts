import { IExerciseModel } from '#infra/mongodb/models/exercises/exercise.entity.js'
import { CreateExerciseArgs, CreateExerciseUseCase } from '../use-cases/create-exercise'
import {
  GetAutoCompleteSuggestionsArgs,
  GetAutoCompleteSuggestionsUseCase
} from '../use-cases/get-autocomplete-suggestions'
import { GetExerciseArgs, GetExercisesUseCase } from '../use-cases/get-exercises/get-exercise.usecase'

export class ExerciseService {
  private readonly createExerciseUseCase: CreateExerciseUseCase
  private readonly getExercisesUseCase: GetExercisesUseCase
  private readonly getAutoCompleteSuggestionsUseCase: GetAutoCompleteSuggestionsUseCase
  constructor(private readonly exerciseModel: IExerciseModel) {
    this.createExerciseUseCase = new CreateExerciseUseCase(exerciseModel)
    this.getExercisesUseCase = new GetExercisesUseCase(exerciseModel)
    this.getAutoCompleteSuggestionsUseCase = new GetAutoCompleteSuggestionsUseCase(exerciseModel)
  }

  createExercise = (params: CreateExerciseArgs) => {
    return this.createExerciseUseCase.execute(params)
  }
  getExercise = (params: GetExerciseArgs) => {
    return this.getExercisesUseCase.execute(params)
  }
  getAutoCompleteSuggestions = (params: GetAutoCompleteSuggestionsArgs) => {
    return this.getAutoCompleteSuggestionsUseCase.execute(params)
  }
}
