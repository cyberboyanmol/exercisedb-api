import { IExerciseModel } from '#infra/mongodb/models/exercises/exercise.entity.js'
import { CreateExerciseArgs, CreateExerciseUseCase } from '../use-cases/create-exercise'
import { GetExerciseArgs, GetExercisesUseCase } from '../use-cases/get-exercises/get-exercise.usecase'

export class ExerciseService {
  private readonly createExerciseUseCase: CreateExerciseUseCase
  private readonly getExercisesUseCase: GetExercisesUseCase
  constructor(private readonly exerciseModel: IExerciseModel) {
    this.createExerciseUseCase = new CreateExerciseUseCase(exerciseModel)
    this.getExercisesUseCase = new GetExercisesUseCase(exerciseModel)
  }

  createExercise = (params: CreateExerciseArgs) => {
    return this.createExerciseUseCase.execute(params)
  }
  getExercise = (params: GetExerciseArgs) => {
    return this.getExercisesUseCase.execute(params)
  }
}
