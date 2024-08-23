import { Document, Model } from 'mongoose'

export interface IBodyPart {
  name: string
}
export interface IBodyPartDoc extends IBodyPart, Document {}
export type IBodyPartModel = Model<IBodyPartDoc>
