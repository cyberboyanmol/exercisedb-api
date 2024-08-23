import { IBodyPartModel } from '#infra/mongodb/models/bodyparts/bodypart.entity.js'
import { CreateBodyPartArgs, CreateBodyPartUseCase } from '../use-cases/create-bodypart'
import { GetBodyPartsUseCase } from '../use-cases/get-bodyparts'

export class BodyPartService {
  private readonly createBodyPartUseCase: CreateBodyPartUseCase
  private readonly getBodyPartsUseCase: GetBodyPartsUseCase

  constructor(private readonly bodyPartModel: IBodyPartModel) {
    this.createBodyPartUseCase = new CreateBodyPartUseCase(bodyPartModel)
    this.getBodyPartsUseCase = new GetBodyPartsUseCase(bodyPartModel)
  }

  createBodyPart = (args: CreateBodyPartArgs) => {
    return this.createBodyPartUseCase.execute(args)
  }

  getBodyParts = () => {
    return this.getBodyPartsUseCase.execute()
  }
}
