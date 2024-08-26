import { IExerciseModel } from '#infra/mongodb/models/exercises/exercise.entity.js'
import { IMuscleModel } from '#infra/mongodb/models/muscles/muscle.entity.js'
import { GetExerciseSerivceArgs } from '#modules/exercises/services/exercise.service.js'
import {
  GetExercisesArgs,
  GetExercisesUseCase
} from '#modules/exercises/use-cases/get-exercises/get-exercise.usecase.js'
import { CreateMuscleArgs, CreateMuscleUseCase } from '../use-cases/create-muscle'
import { GetMusclesUseCase } from '../use-cases/get-muscles'

export class MuscleService {
  private readonly createMuscleUseCase: CreateMuscleUseCase
  private readonly getMuscleUseCase: GetMusclesUseCase
  private readonly getExercisesUseCase: GetExercisesUseCase

  constructor(
    private readonly muscleModel: IMuscleModel,
    private readonly exerciseModel: IExerciseModel
  ) {
    this.createMuscleUseCase = new CreateMuscleUseCase(muscleModel)
    this.getMuscleUseCase = new GetMusclesUseCase(muscleModel)
    this.getExercisesUseCase = new GetExercisesUseCase(exerciseModel)
  }

  createMuscle = (args: CreateMuscleArgs) => {
    return this.createMuscleUseCase.execute(args)
  }

  getMuscles = () => {
    return this.getMuscleUseCase.execute()
  }
  getExercisesByMuscles = (params: GetExerciseSerivceArgs) => {
    const query: GetExercisesArgs = {
      offset: params.offset,
      limit: params.limit,
      query: {
        targetMuscles: {
          $all: [params.search]
        }
      }
    }

    return this.getExercisesUseCase.execute(query)
  }
}
