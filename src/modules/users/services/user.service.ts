import { CryptoService } from '#common/helpers/crypto.service.js'
import { IUserModel } from '#infra/mongodb/models/users/user.entity.js'
import { AuthenticateUserArgs, AuthenticateUserUseCase } from '../use-cases/authenticate'
import { CreateUserArgs, CreateUserUseCase } from '../use-cases/create-user'
import * as jwt from 'jsonwebtoken'
export class UserService {
  private readonly authenticateUserUseCase: AuthenticateUserUseCase
  private readonly createUserUseCase: CreateUserUseCase
  private readonly cryptoService: CryptoService

  constructor(private readonly userModel: IUserModel) {
    this.authenticateUserUseCase = new AuthenticateUserUseCase(userModel)
    this.createUserUseCase = new CreateUserUseCase(userModel)
    this.cryptoService = new CryptoService()
  }

  createUser = (args: CreateUserArgs) => {
    const newUser = this.createUserUseCase.execute(args)
    return newUser
  }

  authenticate = async (args: AuthenticateUserArgs) => {
    const user = await this.authenticateUserUseCase.execute(args)
    const token = await this.cryptoService.generateAccessToken(user)
    return {
      token
    }
  }
}
