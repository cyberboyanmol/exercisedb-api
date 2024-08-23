import mongoose from 'mongoose'
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
      trim: true
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
        trim: true,
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
        trim: true,
        required: true,
        unique: true,
        index: true
      }
    ],
    equipments: [
      {
        type: String,
        ref: 'Equipment',
        trim: true,
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
const Exercise = mongoose.model<IExerciseDoc, IExerciseModel>('Exercise', exerciseSchema)

export default Exercise
