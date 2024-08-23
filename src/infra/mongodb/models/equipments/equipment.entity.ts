import { Document, Model } from 'mongoose'

export interface IEquipment {
  name: string
}
export interface IEquipmentDoc extends IEquipment, Document {}
export type IEquipmentModel = Model<IEquipmentDoc>
