import {UserEntity} from "domain/entities";

export interface IUserService {
    create(email: string, password: string): Promise<UserEntity>;
}

export const IUserService = Symbol('IUserService');
