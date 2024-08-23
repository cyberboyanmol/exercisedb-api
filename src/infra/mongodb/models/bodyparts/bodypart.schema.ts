import mongoose from 'mongoose'
import toJSON from '../../plugins/toJSON/toJSON'
import { IBodyPartDoc, IBodyPartModel } from './bodypart.entity'
const bodyPartSchema = new mongoose.Schema<IBodyPartDoc, IBodyPartModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true
    }
  },
  {
    timestamps: true
  }
)

bodyPartSchema.plugin(toJSON)
const BodyPart = mongoose.model<IBodyPartDoc, IBodyPartModel>('BodyPart', bodyPartSchema)

export default BodyPart
