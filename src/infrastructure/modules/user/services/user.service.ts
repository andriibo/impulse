import {Inject, Injectable} from '@nestjs/common';
import {IUserRepository} from "domain/repositories";
import {UserEntity} from "domain/entities";
import * as bcrypt from 'bcryptjs';
import {IUserService} from "application/modules/user/services";
import {UserModel} from "infrastructure/modules/user/models";
import {UserBadRequestError} from "application/modules/user/errors";

@Injectable()
export class UserService implements IUserService {
  constructor(
      @Inject(IUserRepository)
      protected readonly userRepository: IUserRepository,
  ) {}

  async create(email: string, password: string): Promise<UserEntity> {
    const userExists = await this.userRepository.findByEmail(email);
    if (userExists) {
      throw new UserBadRequestError('User already exists.');
    }

    return await this.createUser(email, password);
  }

  private async createUser(email: string, password: string): Promise<UserEntity> {
    const user = new UserModel();
    user.email = email;
    user.password = await bcrypt.hash(password, 10);

    return await this.userRepository.save(user);
  }
}
