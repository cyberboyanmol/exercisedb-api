import { IBodyPartModel } from '#infra/mongodb/models/bodyparts/bodypart.entity.js'
import { IExerciseModel } from '#infra/mongodb/models/exercises/exercise.entity.js'
import { GetExerciseSerivceArgs } from '#modules/exercises/services/exercise.service.js'
import {
  GetExercisesArgs,
  GetExercisesUseCase
} from '#modules/exercises/use-cases/get-exercises/get-exercise.usecase.js'
import { CreateBodyPartArgs, CreateBodyPartUseCase } from '../use-cases/create-bodypart'
import { GetBodyPartsUseCase } from '../use-cases/get-bodyparts'

export class BodyPartService {
  private readonly createBodyPartUseCase: CreateBodyPartUseCase
  private readonly getBodyPartsUseCase: GetBodyPartsUseCase
  private readonly getExercisesUseCase: GetExercisesUseCase

  constructor(
    private readonly bodyPartModel: IBodyPartModel,
    private readonly exerciseModel: IExerciseModel
  ) {
    this.createBodyPartUseCase = new CreateBodyPartUseCase(bodyPartModel)
    this.getBodyPartsUseCase = new GetBodyPartsUseCase(bodyPartModel)
    this.getExercisesUseCase = new GetExercisesUseCase(exerciseModel)
  }

  createBodyPart = (args: CreateBodyPartArgs) => {
    return this.createBodyPartUseCase.execute(args)
  }

  getBodyParts = () => {
    return this.getBodyPartsUseCase.execute()
  }

  getExercisesByBodyPart = (params: GetExerciseSerivceArgs) => {
    const query: GetExercisesArgs = {
      offset: params.offset,
      limit: params.limit,
      query: {
        bodyParts: {
          $all: [params.search]
        }
      }
    }

    return this.getExercisesUseCase.execute(query)
  }
}
