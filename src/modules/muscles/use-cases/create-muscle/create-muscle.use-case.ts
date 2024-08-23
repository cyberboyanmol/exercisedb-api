import { IUseCase } from '#common/types/use-case.type.js'
import { IMuscleDoc, IMuscleModel } from '#infra/mongodb/models/muscles/muscle.entity.js'
import { HTTPException } from 'hono/http-exception'

export interface CreateMuscleArgs {
  name: string
}

export class CreateMuscleUseCase implements IUseCase<CreateMuscleArgs, IMuscleDoc> {
  constructor(private readonly muscleModel: IMuscleModel) {}

  async execute({ name }: CreateMuscleArgs): Promise<IMuscleDoc> {
    await this.checkIfMuscleExists(name)
    return this.createMuscle(name)
  }

  private async checkIfMuscleExists(name: string): Promise<void> {
    if (await this.muscleModel.isMuscleExist(name)) {
      throw new HTTPException(409, { message: 'Muscle name already exists' })
    }
  }

  private async createMuscle(name: string): Promise<IMuscleDoc> {
    return this.muscleModel.create({ name })
  }
}
