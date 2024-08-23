import mongoose, { Document, Model } from 'mongoose'

export interface IBodyPart {
  name: string
}
export interface IBodyPartDoc extends IBodyPart, Document {}
export interface IBodyPartModel extends Model<IBodyPartDoc> {
  isBodyPartExist(name: string, excludeBodyPartId?: mongoose.ObjectId): Promise<boolean>
}
