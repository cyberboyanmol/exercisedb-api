import mongoose from 'mongoose'
import { IMuscleDoc, IMuscleModel } from './muscle.entity'
import toJSONWithoutId from '#infra/mongodb/plugins/toJSONWithoutId/toJSONWithoutId.js'

const muscleSchema = new mongoose.Schema<IMuscleDoc, IMuscleModel>(
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
muscleSchema.plugin(toJSONWithoutId)

/**
 * check if the similar muscle name already exists
 * @param {string} name
 *@returns {Promise<boolean>}
 */

muscleSchema.static(
  'isMuscleExist',
  async function (name: string, excludeMuscleId: mongoose.ObjectId): Promise<boolean> {
    const muscle = await this.findOne({
      name,
      _id: { $ne: excludeMuscleId }
    })
    return !!muscle
  }
)

const Muscle = mongoose.model<IMuscleDoc, IMuscleModel>('Muscle', muscleSchema)

export default Muscle
