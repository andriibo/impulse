import { UserEntity } from 'domain/entities';

export interface IUserRepository {
  findById(id: string): Promise<UserEntity>;

  findByEmail(email: string): Promise<UserEntity>;

  save(entity: UserEntity): Promise<UserEntity>;
}

export const IUserRepository = Symbol('IUserRepository');
