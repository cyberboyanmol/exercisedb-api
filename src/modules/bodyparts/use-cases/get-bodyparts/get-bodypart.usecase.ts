import { IUseCase } from '#common/types/use-case.type.js'
import { IBodyPartDoc, IBodyPartModel } from '#infra/mongodb/models/bodyparts/bodypart.entity.js'

export class GetBodyPartsUseCase implements IUseCase<void, IBodyPartDoc[]> {
  constructor(private readonly bodyPartModel: IBodyPartModel) {}

  async execute(): Promise<IBodyPartDoc[]> {
    return this.bodyPartModel.find({})
  }
}
