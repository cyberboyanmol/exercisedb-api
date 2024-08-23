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
        _id: false,
        targetMuscleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Muscle',
          required: true,
          unique: true,
          index: true
        }
      }
    ],
    bodyParts: [
      {
        _id: false,
        bodyPartId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'BodyPart',
          required: true,
          unique: true,
          index: true
        }
      }
    ],
    equipments: [
      {
        _id: false,
        equipmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Equipment',
          required: true,
          unique: true,
          index: true
        }
      }
    ],
    secondaryMuscles: [
      {
        _id: false,
        secondaryMuscleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Muscle',
          required: true,
          unique: true,
          index: true
        }
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
