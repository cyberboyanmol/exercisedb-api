import { IMuscleModel } from '#infra/mongodb/models/muscles/muscle.entity.js'
import { CreateMuscleArgs, CreateMuscleUseCase } from '../use-cases/create-muscle'
import { GetMusclesUseCase } from '../use-cases/get-muscles'

export class MuscleService {
  private readonly createMuscleUseCase: CreateMuscleUseCase
  private readonly getMuscleUseCase: GetMusclesUseCase

  constructor(private readonly muscleModel: IMuscleModel) {
    this.createMuscleUseCase = new CreateMuscleUseCase(muscleModel)
    this.getMuscleUseCase = new GetMusclesUseCase(muscleModel)
  }

  createMuscle = (args: CreateMuscleArgs) => {
    return this.createMuscleUseCase.execute(args)
  }

  getMuscles = () => {
    return this.getMuscleUseCase.execute()
  }
}
