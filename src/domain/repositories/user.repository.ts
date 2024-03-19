import { UserEntity } from 'domain/entities';

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity>;
}

export const IUserRepository = Symbol('IUserRepository');
