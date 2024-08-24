import { IUseCase } from '#common/types/use-case.type.js'
import { IExerciseDoc, IExerciseModel } from '#infra/mongodb/models/exercises/exercise.entity.js'
import { HTTPException } from 'hono/http-exception'

export interface CreateExerciseArgs {
  exerciseId: string
  name: string
  gifUrl: string
  instructions: string[]
  targetMuscles: string[]
  bodyParts: string[]
  equipments: string[]
  secondaryMuscles: string[]
}

export class CreateExerciseUseCase implements IUseCase<CreateExerciseArgs, IExerciseDoc> {
  constructor(private readonly exerciseModel: IExerciseModel) {}

  async execute(params: CreateExerciseArgs): Promise<IExerciseDoc> {
    await this.checkIfExerciseExists(params.exerciseId)
    return this.createExercise(params)
  }

  private async checkIfExerciseExists(exerciseId: string): Promise<void> {
    console.log(await this.exerciseModel.isExerciseExist(exerciseId))
    if (await this.exerciseModel.isExerciseExist(exerciseId)) {
      throw new HTTPException(409, { message: 'Exercise with exerciseId already exists' })
    }
  }

  private async createExercise(params: CreateExerciseArgs): Promise<IExerciseDoc> {
    return this.exerciseModel.create({
      exerciseId: params.exerciseId,
      name: params.name,
      gifUrl: params.gifUrl,
      bodyParts: params.bodyParts,
      targetMuscles: params.targetMuscles,
      secondaryMuscles: params.secondaryMuscles,
      equipments: params.equipments,
      instructions: params.instructions
    })
  }
}
