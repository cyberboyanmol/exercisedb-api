import { IUseCase } from '#common/types/use-case.type.js'
import { IUserDoc, IUserModel } from '#infra/mongodb/models/users/user.entity.js'
import { HTTPException } from 'hono/http-exception'
import { authenticator } from 'otplib'
import { GetUserUseCase } from '../get-user'
import { CryptoService } from '#common/helpers/crypto.service.js'

export interface AuthenticateUserArgs {
  email: string
  code: string
}

export class AuthenticateUserUseCase implements IUseCase<AuthenticateUserArgs, IUserDoc> {
  private readonly getUserUseCase: GetUserUseCase
  private readonly cryptoService: CryptoService
  constructor(private readonly userModel: IUserModel) {
    this.getUserUseCase = new GetUserUseCase(userModel)
    this.cryptoService = new CryptoService()
  }

  async execute({ email, code }: AuthenticateUserArgs): Promise<IUserDoc> {
    const user = await this.getUserUseCase.execute({ email })
    if (!user) {
      throw new HTTPException(404, { message: 'user not found' })
    }

    const isValid = this.cryptoService.verifyCode(user.otpSecret, code)
    if (!isValid) throw new HTTPException(400, { message: 'invalid code' })

    if (!user.isActivated) {
      await this.activateUser(user)
    }
    return user
  }

  private async activateUser(user: IUserDoc): Promise<IUserDoc | null> {
    return this.userModel.findByIdAndUpdate(user.id, { isActivated: true })
  }
}
