import mongoose, { Schema } from 'mongoose'
import { IExerciseDoc, IExerciseModel } from './exercise.entity'
import toJSONWithoutId from '#infra/mongodb/plugins/toJSONWithoutId/toJSONWithoutId.js'
const exerciseSchema = new mongoose.Schema<IExerciseDoc, IExerciseModel>(
  {
    exerciseId: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    gifUrl: {
      type: String,
      required: true,
      trim: true
    },
    instructions: [
      {
        _id: false,
        type: String,
        trim: true
      }
    ],
    targetMuscles: [
      {
        type: String
      }
    ],
    bodyParts: [
      {
        type: String
      }
    ],
    equipments: [
      {
        type: String
      }
    ],
    secondaryMuscles: [
      {
        type: String
      }
    ]
  },
  {
    timestamps: true
  }
)

exerciseSchema.plugin(toJSONWithoutId)
exerciseSchema.index({
  name: 'text',
  targetMuscles: 'text',
  bodyParts: 'text',
  equipments: 'text',
  secondaryMuscles: 'text'
})
/**
 * check if the similar equipment name already exists
 * @param {string} name
 *@returns {Promise<boolean>}
 */

exerciseSchema.static(
  'isExerciseExist',
  async function (exerciseId: string, excludeExerciseId: mongoose.ObjectId): Promise<boolean> {
    const exercise = await this.findOne({
      exerciseId,
      _id: { $ne: excludeExerciseId }
    })
    return !!exercise
  }
)
const Exercise = mongoose.model<IExerciseDoc, IExerciseModel>('Exercise', exerciseSchema)

export default Exercise
