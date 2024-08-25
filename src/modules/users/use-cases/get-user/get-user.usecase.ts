import { IUseCase } from '#common/types/use-case.type.js'
import { IUserDoc, IUserModel } from '#infra/mongodb/models/users/user.entity.js'
import { HTTPException } from 'hono/http-exception'
import { authenticator } from 'otplib'
import { CreateUserUseCase } from '../create-user'

export interface GetUserArgs {
  email: string
}

export class GetUserUseCase implements IUseCase<GetUserArgs, IUserDoc | null> {
  constructor(private readonly userModel: IUserModel) {}

  async execute({ email }: GetUserArgs): Promise<IUserDoc | null> {
    return this.userModel.findOne({ email })
  }
}
