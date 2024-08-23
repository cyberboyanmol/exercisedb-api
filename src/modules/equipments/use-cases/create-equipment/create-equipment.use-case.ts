import { IUseCase } from '#common/types/use-case.type.js'
import { IEquipmentDoc, IEquipmentModel } from '#infra/mongodb/models/equipments/equipment.entity.js'
import { HTTPException } from 'hono/http-exception'

export interface CreateEquipmentArgs {
  name: string
}

export class CreateEquipmentUseCase implements IUseCase<CreateEquipmentArgs, IEquipmentDoc> {
  constructor(private readonly euipmentModel: IEquipmentModel) {}

  async execute({ name }: CreateEquipmentArgs): Promise<IEquipmentDoc> {
    await this.checkIfEquipmentExists(name)
    return this.createEquipment(name)
  }

  private async checkIfEquipmentExists(name: string): Promise<void> {
    if (await this.euipmentModel.isEquipmentExist(name)) {
      throw new HTTPException(409, { message: 'Equipment name already exists' })
    }
  }

  private async createEquipment(name: string): Promise<IEquipmentDoc> {
    return this.euipmentModel.create({ name })
  }
}
