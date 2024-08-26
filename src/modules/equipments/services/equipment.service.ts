import { IEquipmentModel } from '#infra/mongodb/models/equipments/equipment.entity.js'
import { IExerciseModel } from '#infra/mongodb/models/exercises/exercise.entity.js'
import { GetExerciseSerivceArgs } from '#modules/exercises/services/exercise.service.js'
import {
  GetExercisesArgs,
  GetExercisesUseCase
} from '#modules/exercises/use-cases/get-exercises/get-exercise.usecase.js'
import { CreateEquipmentArgs, CreateEquipmentUseCase } from '../use-cases/create-equipment'
import { GetEquipmentsUseCase } from '../use-cases/get-equipments'

export class EquipmentService {
  private readonly createEquipmentUseCase: CreateEquipmentUseCase
  private readonly getEquipmentUseCase: GetEquipmentsUseCase
  private readonly getExercisesUseCase: GetExercisesUseCase

  constructor(
    private readonly equipmentModel: IEquipmentModel,
    private readonly exerciseModel: IExerciseModel
  ) {
    this.createEquipmentUseCase = new CreateEquipmentUseCase(equipmentModel)
    this.getEquipmentUseCase = new GetEquipmentsUseCase(equipmentModel)
    this.getExercisesUseCase = new GetExercisesUseCase(exerciseModel)
  }

  createEquipment = (args: CreateEquipmentArgs) => {
    return this.createEquipmentUseCase.execute(args)
  }

  getEquipments = () => {
    return this.getEquipmentUseCase.execute()
  }
  getExercisesByEquipment = (params: GetExerciseSerivceArgs) => {
    const query: GetExercisesArgs = {
      offset: params.offset,
      limit: params.limit,
      query: {
        equipments: {
          $all: [params.search]
        }
      }
    }

    return this.getExercisesUseCase.execute(query)
  }
}
