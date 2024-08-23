import { Document, Model } from 'mongoose'

export interface IMuscle {
  name: string
}
export interface IMuscleDoc extends IMuscle, Document {}
export type IMuscleModel = Model<IMuscleDoc>
