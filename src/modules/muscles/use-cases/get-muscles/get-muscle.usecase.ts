import { IUseCase } from '#common/types/use-case.type.js'
import { IMuscleDoc, IMuscleModel } from '#infra/mongodb/models/muscles/muscle.entity.js'

export class GetMusclesUseCase implements IUseCase<void, IMuscleDoc[]> {
  constructor(private readonly muscleModel: IMuscleModel) {}

  async execute(): Promise<IMuscleDoc[]> {
    return this.muscleModel.find({})
  }
}
