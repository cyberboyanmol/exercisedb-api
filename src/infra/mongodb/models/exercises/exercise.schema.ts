import mongoose, { Schema } from 'mongoose'
import { IExerciseDoc, IExerciseModel } from './exercise.entity'
import toJSON from '../../plugins/toJSON/toJSON'
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
        type: String,
        ref: 'Muscle',
        required: true,
        unique: true,
        index: true
      }
    ],
    bodyParts: [
      {
        type: String,
        ref: 'BodyPart',
        required: true,
        unique: true,
        index: true
      }
    ],
    equipments: [
      {
        type: String,
        ref: 'Equipment',
        required: true,
        unique: true,
        index: true
      }
    ],
    secondaryMuscles: [
      {
        type: String,
        ref: 'Muscle',
        required: true,
        unique: true,
        index: true
      }
    ]
  },
  {
    timestamps: true
  }
)

exerciseSchema.plugin(toJSON)

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
