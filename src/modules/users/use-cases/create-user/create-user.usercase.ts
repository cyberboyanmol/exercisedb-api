import { CryptoService } from '#common/helpers/crypto.service.js'
import { IUseCase } from '#common/types/use-case.type.js'
import { IUserDoc, IUserModel } from '#infra/mongodb/models/users/user.entity.js'
import { HTTPException } from 'hono/http-exception'
import { authenticator } from 'otplib'

export interface CreateUserArgs {
  email: string
}

export class CreateUserUseCase implements IUseCase<CreateUserArgs, IUserDoc> {
  private readonly cryptoService: CryptoService
  constructor(private readonly userModel: IUserModel) {
    this.cryptoService = new CryptoService()
  }

  async execute({ email }: CreateUserArgs): Promise<IUserDoc> {
    await this.checkIfUserExists(email)
    const otpSecret = this.cryptoService.generateOtpSecret()
    return this.createUser(email, otpSecret)
  }

  public async checkIfUserExists(email: string): Promise<void> {
    if (await this.userModel.isEmailExist(email)) {
      throw new HTTPException(409, { message: 'Email already exists' })
    }
  }

  private async createUser(email: string, otpSecret: string): Promise<IUserDoc> {
    return this.userModel.create({ email, otpSecret })
  }
}
