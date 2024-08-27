import { IUseCase } from '#common/types/use-case.type.js'
import { IExerciseDoc, IExerciseModel } from '#infra/mongodb/models/exercises/exercise.entity.js'

export class GetExerciseByIdUseCase implements IUseCase<string, IExerciseDoc | null> {
  constructor(private readonly exerciseModel: IExerciseModel) {}

  async execute(exerciseId: string): Promise<IExerciseDoc | null> {
    return this.exerciseModel.findOne({
      exerciseId
    })
  }
}
