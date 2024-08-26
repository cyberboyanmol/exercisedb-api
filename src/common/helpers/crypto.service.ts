import { IUserDoc } from '#infra/mongodb/models/users/user.entity.js'
import jwt from 'jsonwebtoken'
import { authenticator } from 'otplib'
export type JwtPayloadInterface = Pick<IUserDoc, 'id' | 'role' | 'isActivated'>

export class CryptoService {
  public generateOtpSecret() {
    const otpSecret = authenticator.generateSecret()
    return otpSecret
  }
  public verifyCode(otpSecret: string, code: string) {
    return authenticator.verify({
      secret: otpSecret,
      token: code
    })
  }
  public generateAccessToken(user: JwtPayloadInterface) {
    const options: jwt.SignOptions = {
      algorithm: 'HS256',
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
      issuer: 'ExerciseDB',
      audience: `user_${user.id}`,
      subject: 'accessToken'
    }
    const payload: JwtPayloadInterface = {
      id: user.id,
      role: user.role,
      isActivated: user.isActivated
    }
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET!, options)
    return accessToken
  }

  public verifyAccessToken(token: string) {
    const options: jwt.SignOptions = {
      algorithm: 'HS256',
      issuer: 'ExerciseDB'
    }
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!, options) as JwtPayloadInterface
    return decoded
  }
}
