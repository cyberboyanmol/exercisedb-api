import { IUseCase } from '#common/types/use-case.type.js'
import { IEquipmentDoc, IEquipmentModel } from '#infra/mongodb/models/equipments/equipment.entity.js'

export class GetEquipmentsUseCase implements IUseCase<void, IEquipmentDoc[]> {
  constructor(private readonly equipmentModel: IEquipmentModel) {}

  async execute(): Promise<IEquipmentDoc[]> {
    return this.equipmentModel.find({})
  }
}
