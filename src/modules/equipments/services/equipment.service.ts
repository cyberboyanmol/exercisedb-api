import { IEquipmentModel } from '#infra/mongodb/models/equipments/equipment.entity.js'
import { CreateEquipmentArgs, CreateEquipmentUseCase } from '../use-cases/create-equipment'
import { GetEquipmentsUseCase } from '../use-cases/get-equipments'

export class EquipmentService {
  private readonly createEquipmentUseCase: CreateEquipmentUseCase
  private readonly getEquipmentUseCase: GetEquipmentsUseCase

  constructor(private readonly equipmentModel: IEquipmentModel) {
    this.createEquipmentUseCase = new CreateEquipmentUseCase(equipmentModel)
    this.getEquipmentUseCase = new GetEquipmentsUseCase(equipmentModel)
  }

  createEquipment = (args: CreateEquipmentArgs) => {
    return this.createEquipmentUseCase.execute(args)
  }

  getEquipments = () => {
    return this.getEquipmentUseCase.execute()
  }
}
