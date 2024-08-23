import { IUseCase } from '#common/types/use-case.type.js'
import { IBodyPartDoc, IBodyPartModel } from '#infra/mongodb/models/bodyparts/bodypart.entity.js'
import { HTTPException } from 'hono/http-exception'

export interface CreateBodyPartArgs {
  name: string
}

export class CreateBodyPartUseCase implements IUseCase<CreateBodyPartArgs, IBodyPartDoc> {
  constructor(private readonly bodyPartModel: IBodyPartModel) {}

  async execute({ name }: CreateBodyPartArgs): Promise<IBodyPartDoc> {
    await this.checkIfBodyPartExists(name)
    return this.createBodyPart(name)
  }

  private async checkIfBodyPartExists(name: string): Promise<void> {
    if (await this.bodyPartModel.isBodyPartExist(name)) {
      throw new HTTPException(409, { message: 'BodyPart name already exists' })
    }
  }

  private async createBodyPart(name: string): Promise<IBodyPartDoc> {
    return this.bodyPartModel.create({ name })
  }
}
