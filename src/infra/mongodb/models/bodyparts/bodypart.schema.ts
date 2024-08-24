import mongoose from 'mongoose'
import { IBodyPartDoc, IBodyPartModel } from './bodypart.entity'
import toJSONWithoutId from '#infra/mongodb/plugins/toJSONWithoutId/toJSONWithoutId.js'
const bodyPartSchema = new mongoose.Schema<IBodyPartDoc, IBodyPartModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      lowercase: true
    }
  },
  {
    timestamps: true
  }
)

// add plugin that converts mongoose to json
bodyPartSchema.plugin(toJSONWithoutId)

/**
 * check if the similar bodyPart name already exists
 * @param {string} name
 *@returns {Promise<boolean>}
 */

bodyPartSchema.static(
  'isBodyPartExist',
  async function (name: string, excludeBodyPartId: mongoose.ObjectId): Promise<boolean> {
    const bodyPart = await this.findOne({
      name,
      _id: { $ne: excludeBodyPartId }
    })
    return !!bodyPart
  }
)
const BodyPart = mongoose.model<IBodyPartDoc, IBodyPartModel>('BodyPart', bodyPartSchema)

export default BodyPart
