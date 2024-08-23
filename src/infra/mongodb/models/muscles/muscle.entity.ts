import mongoose, { Document, Model } from 'mongoose'
export interface IMuscle {
  name: string
}
export interface IMuscleDoc extends IMuscle, Document {}
export interface IMuscleModel extends Model<IMuscleDoc> {
  isMuscleExist(name: string, excludeMuscleId?: mongoose.ObjectId): Promise<boolean>
}
