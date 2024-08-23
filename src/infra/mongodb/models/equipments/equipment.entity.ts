import mongoose, { Document, Model } from 'mongoose'

export interface IEquipment {
  name: string
}
export interface IEquipmentDoc extends IEquipment, Document {}
export interface IEquipmentModel extends Model<IEquipmentDoc> {
  isEquipmentExist(name: string, excludeEquipmentId?: mongoose.ObjectId): Promise<boolean>
}
