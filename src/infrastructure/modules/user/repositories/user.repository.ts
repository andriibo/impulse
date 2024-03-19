import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'domain/repositories/user.repository';
import { UserEntity } from 'domain/entities';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserModel} from "infrastructure/modules/user/models/user.model";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
      @InjectRepository(UserModel)
      private readonly repository: Repository<UserModel>,
  ) {}

  async findById(id: string): Promise<UserEntity> {
    return await this.repository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return await this.repository.findOneBy({ email });
  }

  async save(entity: UserModel): Promise<UserEntity> {
    return await this.repository.save(entity);
  }
}
