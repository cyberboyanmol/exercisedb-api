import mongoose from 'mongoose'
import toJSON from '../../plugins/toJSON/toJSON'
import { IMuscleDoc, IMuscleModel } from './muscle.entity'

const muscleSchema = new mongoose.Schema<IMuscleDoc, IMuscleModel>(
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

muscleSchema.plugin(toJSON)
const Muscle = mongoose.model<IMuscleDoc, IMuscleModel>('Muscle', muscleSchema)

export default Muscle
