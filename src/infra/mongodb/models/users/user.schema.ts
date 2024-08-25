import mongoose from 'mongoose'
import { IUserDoc, IUserModel } from './user.entity'
import toJSON from '#infra/mongodb/plugins/toJSON/toJSON.js'

const userSchema = new mongoose.Schema<IUserDoc, IUserModel>(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        const EmailRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
        if (!EmailRegex.test(value)) {
          throw new Error('Invalid email.')
        }
      }
    },
    role: {
      type: String,
      enum: ['member', 'admin'],
      required: true,
      default: 'member'
    },
    isActivated: {
      type: Boolean,
      required: true,
      default: false
    },
    otpSecret: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
)
// add plugin that converts mongoose to json
userSchema.plugin(toJSON)

/**
 * check if the similar muscle name already exists
 * @param {string} name
 *@returns {Promise<boolean>}
 */

userSchema.static('isEmailExist', async function (email: string, excludeUserId: mongoose.ObjectId): Promise<boolean> {
  const user = await this.findOne({
    email,
    _id: { $ne: excludeUserId }
  })
  return !!user
})

const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema)

export default User
