import mongoose from 'mongoose'
import toJSON from '../../plugins/toJSON/toJSON'
import { IEquipmentDoc, IEquipmentModel } from './equipment.entity'

const equipmentSchema = new mongoose.Schema<IEquipmentDoc, IEquipmentModel>(
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

equipmentSchema.plugin(toJSON)
const Equipment = mongoose.model<IEquipmentDoc, IEquipmentModel>('Equipment', equipmentSchema)

export default Equipment
