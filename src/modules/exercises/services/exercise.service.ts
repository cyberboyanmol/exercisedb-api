import { IExerciseModel } from '#infra/mongodb/models/exercises/exercise.entity.js'
import { CreateExerciseArgs, CreateExerciseUseCase } from '../use-cases/create-exercise'

export class ExerciseService {
  private readonly createExerciseUseCase: CreateExerciseUseCase
  constructor(private readonly exerciseModel: IExerciseModel) {
    this.createExerciseUseCase = new CreateExerciseUseCase(exerciseModel)
  }

  createExercise = (params: CreateExerciseArgs) => {
    return this.createExerciseUseCase.execute(params)
  }
}
