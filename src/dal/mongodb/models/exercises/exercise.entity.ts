import { Document, Model } from 'mongoose'

export interface IExercise {
  exerciseId: string
  name: string
  gifUrl: string
  instructions: string[]
  targetMuscles: { targetMuscleId: string }[]
  bodyParts: { bodyPartId: string }[]
  equipments: { equipmentId: string }[]
  secondaryMuscles: { secondaryMuscleId: string }[]
}
export type UpdateExerciseBody = Partial<IExercise>
export interface IExerciseDoc extends IExercise, Document {}
export type IExerciseModel = Model<IExerciseDoc>
