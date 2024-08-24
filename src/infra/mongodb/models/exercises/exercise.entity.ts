import mongoose, { Document, Model } from 'mongoose'

export interface IExercise {
  exerciseId: string
  name: string
  gifUrl: string
  instructions: string[]
  targetMuscles: string[]
  bodyParts: string[]
  equipments: string[]
  secondaryMuscles: string[]
}
export type UpdateExerciseBody = Partial<IExercise>
export interface IExerciseDoc extends IExercise, Document {}
export interface IExerciseModel extends Model<IExerciseDoc> {
  isExerciseExist(exerciseId: string, excludeExerciseId?: mongoose.ObjectId): Promise<boolean>
}
