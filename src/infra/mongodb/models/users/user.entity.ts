import mongoose, { Document, Model } from 'mongoose'
export interface IUser {
  email: string
  role: string
  isActivated: boolean
  otpSecret: string
}
export interface IUserDoc extends IUser, Document {}
export interface IUserModel extends Model<IUserDoc> {
  isEmailExist(email: string, excludeMuscleId?: mongoose.ObjectId): Promise<boolean>
}
